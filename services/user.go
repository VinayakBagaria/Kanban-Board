package services

import (
	"kanban-board/db"
	"kanban-board/db/repository"
)

type UserService interface {
	GetAll() []*db.User
}

type userService struct {
	repository repository.UserRepository
}

func NewUserService(repository repository.UserRepository) UserService {
	return &userService{repository}
}

func (s *userService) GetAll() []*db.User {
	return s.repository.GetAll()
}
