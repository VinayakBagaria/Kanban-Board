package db

import (
	"kanban-board/config"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewConnection(appConfig *config.Configuration) (*gorm.DB, error) {
	dialector := postgres.New(postgres.Config{
		DSN:                  appConfig.DbUrl,
		PreferSimpleProtocol: true,
	})
	db, err := gorm.Open(dialector, &gorm.Config{})

	if err != nil {
		return nil, err
	}

	log.Println("Successfully connected to db")
	db.Logger = logger.Default.LogMode(logger.Info)
	db.AutoMigrate(&Issue{}, &User{}, &Label{})

	return db, nil
}
