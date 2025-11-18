package main

import (
	"fmt"
	"kanban-board/api/resthandlers"
	"kanban-board/api/routes"
	"kanban-board/config"
	"kanban-board/db"
	"kanban-board/db/repository"
	"kanban-board/services"
	"log"
	"net/http"
	"strconv"

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

	// Initialize db
	dbConfig := db.NewConfiguration()
	dbHandler, err := db.NewConnection(dbConfig)
	if err != nil {
		log.Panicln(err)
	}

	userRepository := repository.NewUserRepository(dbHandler)
	userService := services.NewUserService(userRepository)
	userHandler := resthandlers.NewUserHandler(userService)
	userRoutes := routes.NewUserRoutes(userHandler)

	labelRepository := repository.NewLabelRepository(dbHandler)
	labelService := services.NewLabelService(labelRepository)
	labelHandler := resthandlers.NewLabelHandler(labelService)
	labelRoutes := routes.NewLabelRoutes(labelHandler)

	issueRepository := repository.NewIssueRepository(dbHandler)
	issueService := services.NewIssueService(issueRepository)
	issueHandler := resthandlers.NewIssueHandler(issueService)
	issueRoutes := routes.NewIssueRoutes(issueHandler)

	serverHandler := resthandlers.NewServerHandler()
	serverRoutes := routes.NewServerRoutes(serverHandler)

	routes.Install(router, userRoutes)
	routes.Install(router, labelRoutes)
	routes.Install(router, issueRoutes)
	routes.Install(router, serverRoutes)

	apiPort, err := strconv.Atoi(config.GetConfigValue("server.port"))
	if err != nil {
		log.Fatalln("Unable to parse api port")
	}

	log.Printf("API service running on port: %d", apiPort)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", apiPort), router))
}
