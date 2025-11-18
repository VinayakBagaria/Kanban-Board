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
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	CreatedOn int64     `json:"created_on" gorm:"autoCreateTime:milli"`
	UpdatedOn int64     `json:"update_on" gorm:"autoUpdateTime:milli"`

	Status     IssueStatus `json:"status"`
	OrderIndex int         `json:"order_index"`
	Priority   Priority    `json:"priority"`

	AssigneeId *uuid.UUID `json:"assignee_id"`
	Assignee   *User      `json:"assignee" gorm:"foreignKey:AssigneeId;references:ID"`

	Labels []Label `json:"labels" gorm:"many2many:issue_labels"`
}

type User struct {
	ID     uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Name   string    `json:"name"`
	Avatar *string   `json:"string"`
}

type Label struct {
	ID    uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Name  string    `json:"name"`
	Color string    `json:"color"`
}

type IssueLabel struct {
	IssueId uuid.UUID
	LabelId uuid.UUID
	Issue   Issue `gorm:"foreignKey:IssueId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Label   Label `gorm:"foreignKey:LabelId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
