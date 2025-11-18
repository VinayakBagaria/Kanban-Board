package routes

import (
	"kanban-board/api/resthandlers"
	"net/http"
)

func NewIssueRoutes(handler resthandlers.IssueHandler) []*Route {
	return []*Route{
		{Path: "/issues", Method: http.MethodGet, Handler: handler.GetIssues},
	}
}
