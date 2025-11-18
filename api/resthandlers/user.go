package resthandlers

import (
	"kanban-board/api/restutil"
	"kanban-board/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler interface {
	GetUser(*gin.Context)
}

type userHandler struct {
	svc services.UserService
}

func NewUserHandler(svc services.UserService) UserHandler {
	return &userHandler{svc}
}

func (h *userHandler) GetUser(c *gin.Context) {
	users := h.svc.GetAll()
	restutil.WriteAsJson(c, http.StatusOK, users)
}
