package routes

import (
	"kanban-board/api/resthandlers"
	"net/http"
)

func NewIssueRoutes(handler resthandlers.IssueHandler) []*Route {
	return []*Route{
		{Path: "/issues", Method: http.MethodGet, Handler: handler.GetIssues},
		{Path: "/issues/:id", Method: http.MethodGet, Handler: handler.GetIssue},
		{Path: "/issues", Method: http.MethodPost, Handler: handler.CreateIssue},
		{Path: "/issues/:id", Method: http.MethodPut, Handler: handler.UpdateIssue},
		{Path: "/issues/:id", Method: http.MethodDelete, Handler: handler.DeleteIssue},
		{Path: "/issues/:id/move-status", Method: http.MethodPatch, Handler: handler.MoveIssueStatus},
	}
}
