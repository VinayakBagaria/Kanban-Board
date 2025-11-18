package repository

import "gorm.io/gorm"

type IssueRepository interface {
}

type issueRepository struct {
	db *gorm.DB
}

func NewIssueRepository(dbHandler *gorm.DB) IssueRepository {
	return &issueRepository{db: dbHandler}
}
