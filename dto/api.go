package dto

import (
	"kanban-board/db"

	"github.com/google/uuid"
)

type GeneralErrorResponse struct {
	Error string         `json:"error"`
	Meta  map[string]any `json:"meta,omitempty"`
}

type GetIssueListRequest struct {
	Statuses   []string
	Assignee   string
	Labels     []string
	Priorities []string
	Page       int
	PageSize   int
}

type CreateIssueRequest struct {
	Title       *string        `json:"title" binding:"required"`
	Description *string        `json:"description"`
	Status      db.IssueStatus `json:"status"`
	Priority    db.Priority    `json:"priority"`
	AssigneeID  *uuid.UUID     `json:"assignee_id"`
	Labels      []uuid.UUID    `json:"labels"`
}

type UpdateIssueRequest struct {
	Title       *string         `json:"title" binding:"required"`
	Description *string         `json:"description"`
	Status      *db.IssueStatus `json:"status"`
	Priority    *db.Priority    `json:"priority"`
	AssigneeID  *uuid.UUID      `json:"assignee_id"`
	Labels      []uuid.UUID     `json:"labels"`
}

type IssueListResponse struct {
	Data  []*db.Issue `json:"data"`
	Total int64       `json:"total"`
}

type MoveIssueRequest struct {
	Status     db.IssueStatus `json:"status" binding:"required"`
	OrderIndex int            `json:"order_index" binding:"gte=0"`
}
