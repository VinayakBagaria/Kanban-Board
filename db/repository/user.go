package repository

import (
	"kanban-board/db"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetAll() []*db.User
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(dbHandler *gorm.DB) UserRepository {
	return &userRepository{db: dbHandler}
}

func (r *userRepository) GetAll() []*db.User {
	var users []*db.User
	r.db.Find(&users)
	return users
}
