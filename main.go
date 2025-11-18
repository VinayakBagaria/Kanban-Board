package main

import (
	"kanban-board/config"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	err := config.Init("config", "./")
	if err != nil {
		log.Fatalln("Unable to read config file: %w", err)
	}

	router := gin.Default()
	// Logger middleware will write the logs to gin.DefaultWriter = os.Stdout
	router.Use(gin.Logger())
	// Recovery middleware recovers from any panics and writes a 500 if there was one.
	router.Use(gin.Recovery())

}
