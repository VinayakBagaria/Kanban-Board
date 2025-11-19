package main

import (
	"flag"
	"kanban-board/config"
	"kanban-board/db"
	"kanban-board/seeds/seed"
	"log"
)

func main() {
	err := config.Init("config", "./")
	if err != nil {
		log.Fatalln(err)
	}

	reseedCmd := flag.Bool("reseed", false, "Drop tables and re-seeds the db")
	flag.Parse()

	dbConfig := db.NewConfiguration()
	dbHandler, err := db.NewConnection(dbConfig)
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
