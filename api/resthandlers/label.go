package resthandlers

import (
	"kanban-board/api/restutil"
	"kanban-board/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LabelHandler interface {
	GetLabels(*gin.Context)
}

type labelHandler struct {
	svc services.LabelService
}

func NewLabelHandler(svc services.LabelService) LabelHandler {
	return &labelHandler{svc}
}

func (h *labelHandler) GetLabels(c *gin.Context) {
	labels := h.svc.GetAll()
	restutil.WriteAsJson(c, http.StatusOK, labels)
}
