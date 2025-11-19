package seed

import (
	"fmt"
	"kanban-board/db"

	"gorm.io/gorm"
)

func Reseed(gormDb *gorm.DB) error {
	fmt.Println("Dropping tables")
	tables := []interface{}{&db.Issue{}, &db.User{}, &db.Label{}}
	if err := gormDb.Migrator().DropTable(tables...); err != nil {
		return err
	}

	fmt.Println("Recreating tables")
	if err := gormDb.AutoMigrate(tables...); err != nil {
		return err
	}

	return nil
}
