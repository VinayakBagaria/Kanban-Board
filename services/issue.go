package services

import (
	"kanban-board/db/repository"
	"kanban-board/dto"
)

type IssueService interface {
	GetAll(req dto.GetIssueListRequest) (*dto.IssueListResponse, error)
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
