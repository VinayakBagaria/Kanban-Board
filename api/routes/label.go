package routes

import (
	"kanban-board/api/resthandlers"
	"net/http"
)

func NewLabelRoutes(handler resthandlers.LabelHandler) []*Route {
	return []*Route{
		{Path: "/labels", Method: http.MethodGet, Handler: handler.GetLabels},
	}
}
