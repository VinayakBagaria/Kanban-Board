package resthandlers

import (
	"kanban-board/api/restutil"
	"kanban-board/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler interface {
	GetUsers(*gin.Context)
}

type userHandler struct {
	svc services.UserService
}

func NewUserHandler(svc services.UserService) UserHandler {
	return &userHandler{svc}
}

func (h *userHandler) GetUsers(c *gin.Context) {
	users := h.svc.GetAll()
	restutil.WriteAsJson(c, http.StatusOK, users)
}
