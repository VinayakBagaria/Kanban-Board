package resthandlers

import (
	"kanban-board/api/restutil"
	"kanban-board/dto"
	"kanban-board/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type IssueHandler interface {
	GetIssues(*gin.Context)
	GetIssue(*gin.Context)
	CreateIssue(*gin.Context)
	UpdateIssue(*gin.Context)
	DeleteIssue(*gin.Context)
	MoveIssueStatus(*gin.Context)
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

func (h *issueHandler) GetIssue(c *gin.Context) {
	issueDetails, err := h.svc.GetIssue(c.Param("id"))
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, issueDetails)
}

func (h *issueHandler) CreateIssue(c *gin.Context) {
	var req dto.CreateIssueRequest

	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newIssue, err := h.svc.CreateIssue(req)
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, newIssue)
}

func (h *issueHandler) UpdateIssue(c *gin.Context) {
	var req dto.UpdateIssueRequest

	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedIssue, err := h.svc.UpdateIssue(c.Param("id"), req)
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, updatedIssue)
}

func (h *issueHandler) DeleteIssue(c *gin.Context) {
	err := h.svc.DeleteIssue(c.Param("id"))
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, nil)
}

func (h *issueHandler) MoveIssueStatus(c *gin.Context) {
	var req dto.MoveIssueRequest

	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.svc.MoveIssueStatus(c.Param("id"), req)
	if err != nil {
		restutil.WriteError(c, http.StatusInternalServerError, err, nil)
		return
	}

	restutil.WriteAsJson(c, http.StatusOK, nil)
}
