package main

import (
	"flag"
	"kanban-board/config"
	"kanban-board/db"
	"kanban-board/seeds/seed"
	"log"
)

func main() {
	appConfig := config.Init()

	reseedCmd := flag.Bool("reseed", false, "Drop tables and re-seeds the db")
	flag.Parse()

	dbHandler, err := db.NewConnection(appConfig)
	if err != nil {
		log.Fatalln(err)
	}

	if *reseedCmd {
		err := seed.Reseed(dbHandler)
		if err != nil {
			log.Fatalln(err)
		}
	}

	seed.Seed(dbHandler)
}
