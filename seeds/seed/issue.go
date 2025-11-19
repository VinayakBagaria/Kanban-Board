package seed

import (
	"kanban-board/db"
	"math/rand"

	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedIssues(gormDb *gorm.DB) error {
	priorities := []db.Priority{db.PriorityLow, db.PriorityMedium, db.PriorityHigh, db.PriorityCritical}
	statuses := []db.IssueStatus{db.StatusBacklog, db.StatusTodo, db.StatusInProgress, db.StatusDone, db.StatusCancelled}

	var users []*db.User
	gormDb.Find(&users)

	var labels []*db.Label
	gormDb.Find(&labels)

	for i := 1; i <= 20; i++ {
		var assignee *uuid.UUID
		// 80% issues have assignee
		if rand.Intn(100) < 80 {
			user := users[rand.Intn(len(users))]
			assignee = &user.ID
		}

		issue := db.Issue{
			ID:          uuid.New(),
			Title:       "Issue " + uuid.NewString()[0:4],
			Description: faker.Paragraph(),
			Status:      statuses[rand.Intn(len(statuses))],
			OrderIndex:  i,
			Priority:    priorities[rand.Intn(len(priorities))],
			AssigneeId:  assignee,
		}

		// 0-2 labels
		labelCount := rand.Intn(3)
		used := map[int]bool{}
		labelIds := []uuid.UUID{}

		for j := 0; j < labelCount; j++ {
			idx := rand.Intn(len(labels))
			if used[idx] {
				continue
			}

			used[idx] = true
			labelIds = append(labelIds, labels[idx].ID)
		}

		for _, lid := range labelIds {
			issue.Labels = append(issue.Labels, db.Label{ID: lid})
		}

		gormDb.Create(&issue)
	}

	return nil
}
