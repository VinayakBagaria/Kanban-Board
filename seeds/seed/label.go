package seed

import (
	"kanban-board/db"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedLabels(gormDb *gorm.DB) error {
	var count int64
	gormDb.Model(&db.Label{}).Count(&count)

	if count == 0 {
		labels := []*db.Label{
			{ID: uuid.New(), Name: "Backend", Color: "#ef4444"},
			{ID: uuid.New(), Name: "Frontend", Color: "#3b82f6"},
			{ID: uuid.New(), Name: "Bug", Color: "#10b981"},
			{ID: uuid.New(), Name: "API", Color: "#f59e0b"},
			{ID: uuid.New(), Name: "Devops", Color: "#dc2626"},
		}
		gormDb.Create(labels)
	}

	return nil
}
