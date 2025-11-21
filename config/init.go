package config

import (
	"os"
)

type Configuration struct {
	DbUrl   string
	AppPort string
}

func Init() *Configuration {
	return &Configuration{
		DbUrl:   os.Getenv("DB_URL"),
		AppPort: os.Getenv("APP_PORT"),
	}
}
