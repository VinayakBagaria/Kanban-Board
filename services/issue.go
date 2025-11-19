package services

import (
	"kanban-board/db"
	"kanban-board/db/repository"
	"kanban-board/dto"
)

type IssueService interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
	CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error)
}

type issueService struct {
	repository repository.IssueRepository
}

func NewIssueService(repository repository.IssueRepository) IssueService {
	return &issueService{repository}
}

func (s *issueService) GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error) {
	return s.repository.GetAll(req)
}

func (s *issueService) CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error) {
	if req.Status == "" {
		req.Status = db.StatusBacklog
	}
	if req.Priority == "" {
		req.Priority = db.PriorityMedium
	}
	return s.repository.CreateIssue(req)
}

func (s *issueService) MoveIssue(issueId string, req dto.MoveIssueRequest) {
	err := s.repository.MoveIssueStatus(issueId, req)
}
