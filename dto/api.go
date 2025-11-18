package dto

import (
	"kanban-board/db"

	"github.com/google/uuid"
)

type GetIssueListRequest struct {
	Statuses   []string
	Assignee   string
	Labels     []string
	Priorities []string
	Page       int
	PageSize   int
}

type CreateIssueRequest struct {
	Title       string         `json:"title" binding:"required"`
	Description string         `json:"description"`
	Status      db.IssueStatus `json:"status"`
	Priority    db.Priority    `json:"priority"`
	AssigneeID  *uuid.UUID     `json:"assignee_id"`
	Labels      []uuid.UUID    `json:"labels"`
}

type IssueWithRelations struct {
	Issue    db.Issue
	Assignee db.User    `json:"assignee,omitempty"`
	Labels   []db.Label `json:"labels,omitempty"`
}

type IssueListResponse struct {
	Data  []*IssueWithRelations
	Total int64
}

type GeneralErrorResponse struct {
	Error string         `json:"error"`
	Meta  map[string]any `json:"meta,omitempty"`
}
