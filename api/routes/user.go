package routes

import (
	"kanban-board/api/resthandlers"
	"net/http"
)

func NewUserRoutes(handler resthandlers.UserHandler) []*Route {
	return []*Route{
		{Path: "/users", Method: http.MethodGet, Handler: handler.GetUsers},
	}
}
