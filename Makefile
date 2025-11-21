# source: https://btree.dev/golang-makefile

.DEFAULT_GOAL := help

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

## Build Commands
dev: ## runs the backend service for local env
	docker-compose down
	docker-compose up -d db
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run api/main.go

build-run: ## builds and runs the go app binary
	go build -o kanban-app api/main.go
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run api/main.go

seed:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run seeds/main.go

reseed:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go run seeds/main.go --reseed

test:
	DB_URL=postgresql://postgres:example@localhost:5432/kanbanboard APP_PORT=8000 go test ./...

## Help Commands
.PHONY: help
help: ## shows this help
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-30s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)