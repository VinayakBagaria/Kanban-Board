package resthandlers

import (
	"kanban-board/api/restutil"
	"kanban-board/dto"
	"kanban-board/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type IssueHandler interface {
	GetIssues(*gin.Context)
}

type issueHandler struct {
	svc services.IssueService
}

func NewIssueHandler(svc services.IssueService) IssueHandler {
	return &issueHandler{svc}
}

func (h *issueHandler) GetIssues(c *gin.Context) {
	statuses := c.QueryArray("status[]")
	assignee := c.Query("assignee")
	labels := c.QueryArray("labels[]")
	priorities := c.QueryArray("priority[]")

	page := 1
	pageSize := 50
	if pageStr := c.Query("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err != nil && p > 0 {
			page = p
		}
	}

	if pageSizeStr := c.Query("page_size"); pageSizeStr != "" {
		if ps, err := strconv.Atoi(pageSizeStr); err != nil && ps > 0 {
			pageSize = ps
		}
	}

	req := dto.GetIssueListRequest{Statuses: statuses,
		Assignee:   assignee,
		Labels:     labels,
		Priorities: priorities,
		Page:       page,
		PageSize:   pageSize,
	}
	resp, err := h.svc.GetAll(req)
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, resp)
}
