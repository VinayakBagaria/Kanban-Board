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

func (u *userRepository) GetAll() []*db.User {
	var users []*db.User
	u.db.Find(&users)
	return users
}
