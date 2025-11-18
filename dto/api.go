package dto

import (
	"kanban-board/db"
)

type GetIssueListRequest struct {
	Statuses   []string
	Assignee   string
	Labels     []string
	Priorities []string
	Page       int
	PageSize   int
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
