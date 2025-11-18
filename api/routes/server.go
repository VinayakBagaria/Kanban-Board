package routes

import (
	"kanban-board/api/resthandlers"
	"net/http"
)

func NewServerRoutes(handler resthandlers.ServerHandler) []*Route {
	return []*Route{{
		Path: "/healthcheck", Method: http.MethodGet, Handler: handler.HealthCheck,
	}}
}
