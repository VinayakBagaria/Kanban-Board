package repository

import (
	"kanban-board/db"
	"kanban-board/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type IssueRepository interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
	CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error)
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

func (r *issueRepository) CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error) {
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
		return nil, err
	}

	// --- Reload the issue with nested assignee + labels ---
	var out *dto.IssueWithRelations
	err := r.db.Model(&dto.IssueWithRelations{}).
		Preload("Assignee").
		Preload("Labels").
		Where("id = ?", issue.ID).
		First(&out).Error
	return out, err
}
