package services

import (
	"kanban-board/db"
	"kanban-board/db/repository"
	"kanban-board/dto"
)

type IssueService interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
	GetIssue(issueId string) (*dto.IssueWithRelations, error)
	CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error)
	UpdateIssue(issueId string, req dto.UpdateIssueRequest) (*dto.IssueWithRelations, error)
	DeleteIssue(issueId string) error
	MoveIssueStatus(issueId string, req dto.MoveIssueRequest) error
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

func (s *issueService) GetIssue(issueId string) (*dto.IssueWithRelations, error) {
	return s.repository.GetIssue(issueId)
}

func (s *issueService) CreateIssue(req dto.CreateIssueRequest) (*dto.IssueWithRelations, error) {
	if req.Status == "" {
		req.Status = db.StatusBacklog
	}
	if req.Priority == "" {
		req.Priority = db.PriorityMedium
	}
	issueId, err := s.repository.CreateIssue(req)
	if err != nil {
		return nil, err
	}

	return s.repository.GetIssue(issueId)
}

func (s *issueService) UpdateIssue(issueId string, req dto.UpdateIssueRequest) (*dto.IssueWithRelations, error) {
	if err := s.repository.UpdateIssue(issueId, req); err != nil {
		return nil, err
	}

	return s.repository.GetIssue(issueId)
}

func (s *issueService) DeleteIssue(issueId string) error {
	return s.repository.DeleteIssue(issueId)
}

func (s *issueService) MoveIssueStatus(issueId string, req dto.MoveIssueRequest) error {
	return s.repository.MoveIssueStatus(issueId, req)
}
