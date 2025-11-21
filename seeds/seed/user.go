package seed

import (
	"kanban-board/db"

	"github.com/go-faker/faker/v4"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SeedUsers(gormDb *gorm.DB) error {
	var count int64
	gormDb.Model(&db.User{}).Count(&count)

	if count == 0 {
		desiredUserCount := 5
		var users []*db.User
		for i := 0; i < desiredUserCount; i++ {
			firstName := faker.FirstName()
			lastName := faker.LastName()
			users = append(users, &db.User{
				ID:   uuid.New(),
				Name: firstName + " " + lastName,
			})
		}
		gormDb.Create(users)
	}

	return nil
}
