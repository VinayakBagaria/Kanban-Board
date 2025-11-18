package repository

import (
	"kanban-board/db"
	"kanban-board/dto"

	"gorm.io/gorm"
)

type IssueRepository interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
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
