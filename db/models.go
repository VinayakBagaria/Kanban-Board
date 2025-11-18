package db

import (
	"github.com/google/uuid"
)

type IssueStatus string

const (
	StatusBacklog    IssueStatus = "backlog"
	StatusTodo       IssueStatus = "todo"
	StatusInProgress IssueStatus = "in_progress"
	StatusDone       IssueStatus = "done"
	StatusCancelled  IssueStatus = "cancelled"
)

type Priority string

const (
	PriorityLow      Priority = "low"
	PriorityMedium   Priority = "medium"
	PriorityHigh     Priority = "high"
	PriorityCritical Priority = "critical"
)

type Issue struct {
	ID        uuid.UUID `json:"id" gorm:"primary_key"`
	CreatedOn int64     `json:"created_on" gorm:"autoCreateTime:milli"`
	UpdatedOn int64     `json:"update_on" gorm:"autoUpateTime:milli"`

	Status     IssueStatus `json:"status"`
	OrderIndex int         `json:"order_index"`
	Priority   Priority    `json:"priority"`
	Assignee   *User       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

type User struct {
	ID     uuid.UUID `json:"id" gorm:"primary_key"`
	Name   string    `json:"name"`
	Avatar *string   `json:"string"`
}

type Label struct {
	ID    uuid.UUID `json:"id" gorm:"primary_key"`
	Name  string    `json:"name"`
	Color string    `json:"color"`
}

type IssueLabel struct {
	Issue Issue `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Label Label `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
