package repository

import (
	"fmt"
	"kanban-board/db"
	"kanban-board/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type IssueRepository interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
	GetIssue(issueId string) (*dto.IssueWithRelations, error)
	CreateIssue(req dto.CreateIssueRequest) (string, error)
	UpdateIssue(issueId string, req dto.UpdateIssueRequest) error
	DeleteIssue(issueId string) error
	MoveIssueStatus(issueId string, req dto.MoveIssueRequest) error
}

type issueRepository struct {
	db *gorm.DB
}

func NewIssueRepository(dbHandler *gorm.DB) IssueRepository {
	return &issueRepository{db: dbHandler}
}

func (r *issueRepository) GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error) {
	base := r.db.Model(&db.Issue{})

	if len(req.Assignee) > 0 {
		base = base.Where("assignee_id = ?", req.Assignee)
	}

	if req.Priorities != nil && len(req.Priorities) > 0 {
		base = base.Where("priority IN ?", req.Priorities)
	}

	if req.Labels != nil && len(req.Labels) > 0 {
		base = base.Joins("JOIN issue_labels il ON il.issue_id = issues.id").Where("il.label_id IN ?", req.Labels).Group("issues.id")
	}

	var count int64
	if err := base.Count(&count).Error; err != nil {
		return nil, err
	}

	var resp *dto.IssueListResponse
	var issues []*dto.IssueWithRelations
	err := base.
		Preload("Assignee").
		Preload("Labels").
		Limit(req.PageSize).
		Offset((req.Page - 1) * req.PageSize).
		Find(&issues).Error
	if err != nil {
		return nil, err
	}

	fmt.Println(len(issues))

	resp.Data = issues
	resp.Total = count
	return resp, nil
}

func (r *issueRepository) getMaxOrder(status db.IssueStatus) int {
	var maxIndex int
	r.db.Model(&db.Issue{}).
		Where("status = ?", status).
		Select("COALESCE(MAX(order_index), -1)").
		Scan(&maxIndex)
	return maxIndex
}

func (r *issueRepository) GetIssue(issueId string) (*dto.IssueWithRelations, error) {
	var out *dto.IssueWithRelations
	err := r.db.Model(&dto.IssueWithRelations{}).
		Preload("Assignee").
		Preload("Labels").
		Where("id = ?", issueId).
		First(&out).Error
	return out, err
}

func (r *issueRepository) CreateIssue(req dto.CreateIssueRequest) (string, error) {
	maxOrder := r.getMaxOrder(req.Status)

	issue := db.Issue{
		ID:         uuid.New(),
		Status:     req.Status,
		OrderIndex: maxOrder + 1,
		Priority:   req.Priority,
		AssigneeId: req.AssigneeID,
	}

	for _, id := range req.Labels {
		issue.Labels = append(issue.Labels, db.Label{ID: id})
	}

	if err := r.db.Create(&issue).Error; err != nil {
		return "", err
	}

	return issue.ID.String(), nil
}

func (r *issueRepository) UpdateIssue(issueId string, req dto.UpdateIssueRequest) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var issue db.Issue
		if err := tx.Where("id = ?", issueId).First(&issue).Error; err != nil {
			return err
		}

		updates := map[string]interface{}{
			"title":  req.Title,
			"status": req.Status,
		}
		if len(req.AssigneeID) > 0 {
			updates["assignee_id"] = req.AssigneeID
		}
		if req.Priority != nil && len(*req.Priority) > 0 {
			updates["priority"] = req.Priority
		}
		if err := tx.Model(&issue).Updates(updates).Error; err != nil {
			return err
		}

		if req.Labels != nil {
			// Replace labels
			var newLabels []db.Label
			for _, id := range req.Labels {
				newLabels = append(newLabels, db.Label{ID: id})
			}

			// Clear old and set new
			if err := tx.Model(&issue).Association("Labels").Replace(newLabels); err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *issueRepository) DeleteIssue(issueId string) error {
	return r.db.Model(&db.Issue{}).Where("id = ?", issueId).Delete(&db.Issue{}).Error
}

func (r *issueRepository) getCurrentStatus(issueId string) (db.IssueStatus, int, error) {
	type StatusOrder struct {
		status     db.IssueStatus
		orderIndex int
	}

	var so StatusOrder
	err := r.db.
		Model(&db.Issue{}).
		Select("status, order_index").
		Where("id = ?", issueId).
		First(&so).Error
	return so.status, so.orderIndex, err
}

func (r *issueRepository) MoveIssueStatus(issueId string, req dto.MoveIssueRequest) error {
	oldStatus, oldIndex, err := r.getCurrentStatus(issueId)
	if err != nil {
		return err
	}

	newStatus := req.Status
	newIndex := req.OrderIndex

	return r.db.Transaction(func(tx *gorm.DB) error {
		// status changed
		if oldStatus != newStatus {
			// Shift up issues in old status
			if err := tx.Model(&db.Issue{}).
				Where("status = ? AND order_index > ?", oldStatus, oldIndex).
				Update("order_index", gorm.Expr("order_index - 1")).Error; err != nil {
				return err
			}

			// Shift down issues in new status
			if err := tx.Model(&db.Issue{}).
				Where("status = ? AND order_index >= ?", newStatus, newIndex).
				Update("order_index", gorm.Expr("order_index + 1")).Error; err != nil {
				return err
			}
		} else if oldIndex != newIndex {
			// Same status, order index changed
			if newIndex > oldIndex {
				// Move in-between issue up
				if err := tx.Model(&db.Issue{}).
					Where("status = ? AND order_index > ? AND order_index <= ?", newStatus, oldIndex, newIndex).
					Update("order_index", gorm.Expr("order_index - 1")).Error; err != nil {
					return err
				}
			} else {
				// Move in-between issue down
				if err := tx.Model(&db.Issue{}).
					Where("status = ? AND order_index >= ? AND order_index < ?", newStatus, newIndex, oldIndex).
					Update("order_index", gorm.Expr("order_index + 1")).Error; err != nil {
					return err
				}
			}

			if err := tx.Model(&db.Issue{}).
				Where("id = ?", issueId).
				Updates(map[string]interface{}{
					"order_index": newIndex,
				}).Error; err != nil {
				return err
			}
		}

		if err := tx.Model(&db.Issue{}).
			Where("id = ?", issueId).
			Updates(map[string]interface{}{
				"status":      newStatus,
				"order_index": newIndex,
			}).Error; err != nil {
			return err
		}

		return nil
	})
}
