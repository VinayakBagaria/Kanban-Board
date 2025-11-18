package repository

import (
	"kanban-board/db"

	"gorm.io/gorm"
)

type LabelRepository interface {
	GetAll() []*db.Label
}

type labelRepository struct {
	db *gorm.DB
}

func NewLabelRepository(dbHandler *gorm.DB) LabelRepository {
	return &labelRepository{db: dbHandler}
}

func (r *labelRepository) GetAll() []*db.Label {
	var labels []*db.Label
	r.db.Find(&labels)
	return labels
}
