package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewConnection(cfg Configuration) (*gorm.DB, error) {
	dialector := postgres.New(postgres.Config{
		DSN:                  cfg.Dsn(),
		PreferSimpleProtocol: true,
	})
	db, err := gorm.Open(dialector, &gorm.Config{})

	if err != nil {
		return nil, err
	}

	log.Println("Successfully connected to db")
	db.Logger = logger.Default.LogMode(logger.Info)
	db.AutoMigrate(&Issue{}, &User{}, &Label{}, &IssueLabel{})

	return db, nil
}
