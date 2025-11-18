package services

import (
	"kanban-board/db"
	"kanban-board/db/repository"
)

type LabelService interface {
	GetAll() []*db.Label
}

type labelService struct {
	repository repository.LabelRepository
}

func NewLabelService(repository repository.LabelRepository) LabelService {
	return &labelService{repository}
}

func (s *labelService) GetAll() []*db.Label {
	return s.repository.GetAll()
}
