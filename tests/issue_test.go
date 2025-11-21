package tests

import (
	"kanban-board/db"
	"kanban-board/dto"
	"kanban-board/services"
	"math/rand"
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func getRandomKeyFromMap(issuesMap map[string]*db.Issue) string {
	allKeys := make([]string, 0, len(issuesMap))
	for k := range issuesMap {
		allKeys = append(allKeys, k)
	}
	return allKeys[rand.Intn(len(issuesMap))]
}

func TestIssueService(t *testing.T) {
	repo := NewFakeIssueRepository()
	svc := services.NewIssueService(repo)

	t.Run("create entry", func(t *testing.T) {
		req := dto.CreateIssueRequest{
			Title:       faker.Paragraph(),
			Description: faker.Sentence(),
			Status:      db.StatusBacklog,
			Priority:    db.PriorityLow,
		}

		newIssue, err := svc.CreateIssue(req)
		assert.Nil(t, err)

		assert.Equal(t, newIssue.Title, req.Title)
		_, exists := repo.data[newIssue.ID.String()]
		assert.Equal(t, exists, true)
	})

	t.Run("update entry", func(t *testing.T) {
		randomKey := getRandomKeyFromMap(repo.data)
		updateId := repo.data[randomKey].ID.String()

		req := dto.UpdateIssueRequest{
			Title: faker.ChineseFirstNameTag,
		}
		updatedIssue, err := svc.UpdateIssue(updateId, req)
		assert.Nil(t, err)
		assert.Equal(t, updatedIssue.Title, req.Title)
		issueFromDb, err := svc.GetIssue(updateId)
		assert.Nil(t, err)
		assert.Equal(t, updatedIssue.Title, issueFromDb.Title)
	})

	t.Run("invalid get entry", func(t *testing.T) {
		_, err := svc.GetIssue("-1")
		assert.NotNil(t, err)
	})

	t.Run("get entry", func(t *testing.T) {
		randomKey := getRandomKeyFromMap(repo.data)
		randomId := repo.data[randomKey].ID.String()
		response, err := svc.GetIssue(randomId)

		assert.Nil(t, err)
		assert.Equal(t, response, repo.data[randomId])
	})

	t.Run("delete entry", func(t *testing.T) {
		initialLength := len(repo.data)
		randomKey := getRandomKeyFromMap(repo.data)
		err := svc.DeleteIssue(randomKey)

		assert.Nil(t, err)
		assert.Equal(t, len(repo.data), initialLength-1)
	})
}
