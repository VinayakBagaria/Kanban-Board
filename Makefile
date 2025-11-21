run:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run api/main.go

seed:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run seeds/main.go

reseed:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run seeds/main.go --reseed