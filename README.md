# Kanban Board

## Live Preview:

UI: [Here](https://kanban-board-mocha-three.vercel.app) <br />
Backend API: [Here](https://anban-oard-vinayakbagaria6316-v97n2ug0.apn.leapcell.dev)

## Functional requirements:

Kanban Board system supports creating, listing, updating and deleting issues.

## Installation:

To run this project, you require Docker and Docker-Compose to be pre-installed in your system.

`Makefile` contains all commands you require to run the server or run tests.

First, get your Docker application up:

```
make dockerize
```

To build & run the API server, use command:

```bash
make dev
```

The above command builds the API layer and the database, runs the application server on port 8000. You can open http://localhost:8000/healthcheck to check if your server is running and returns a 200 response code.

Seed your database with some fake & random values:

```
make seed
```

Other commands for frequent usage can found inside the Makefile. Use the following command to list all possible ones with their descriptions.

```bash
make help
```

## Packages:

This project is written in Golang. Packages used with it in backend are:

- [Gin](https://github.com/gin-gonic/gin) - HTTP framework layer
- [Gorm](https://github.com/go-gorm/gorm) - ORM library to connect to Postgres (database used)
- [Testify](https://github.com/stretchr/testify) - Toolkit for common test assertions and mocks

Packages used in frontend with React JS:

- [Next.JS](https://nextjs.org/) - Base UI framework
- [shadcn/ui](https://ui.shadcn.com/) - Pre-built components based on Tailwind CSS.
- [dnd kit](https://dndkit.com/) - Drag & Drop toolkit for React
- [TanStack Query](https://tanstack.com/query/latest) - Async state management and data fetching utilities

## Endpoints:

- GET [/healthcheck](http://localhost:8000/healthcheck) - Get server uptime metrics
- GET [/api/issues](http://localhost:8000/api/issues) - Get issues list, as per filters
- GET [/issues/<id>](http://localhost:8000/api/issues/issue1) - Get an issue details
- POST [/api/issues](http://localhost:8000/api/issues) - Upload a new issue
- PUT [/api/issues/<id>](http://localhost:8000/api/issues/issue1) - Updates an existing issue
- DELETE [/issue/<id>](http://localhost:8000/api/issue/issue1) - Deletes an issue
- PATCH [/issue/<id>/move](http://localhost:8000/api/issue/issue1/move) - Moves an issue from 1 status to another and/or changes its ordering in the new status
- GET [/api/users](http://localhost:8000/api/users) - Returns a list of users
- GET [/api/labels](http://localhost:8000/api/labels) - Returns a list of labels

## DB Architecture:

I have used [PostgresSQL](https://www.postgresql.org/) as my RDMS data store. This is running inside Docker Compose environment itself. Following is a description of its columns.

Tables:

- Issue - Holds each issue
- User - Pre-defined user
- Label - Pre-defined label
- IssueLabel - Many to many relationship table

We can find the above implementation in `db/models.go`.

## API architecture:

I have used the Service-Repository pattern to write the API handlers, configurations, services, data-access. These are all implemented using interfaces and concept of Dependency Inversion (from D in SOLID principles).

Usage of interfaces allows us to swap any struct in Go which implicitly implements the interface to simply be used at runtime. With this pattern, it would be simple to implement some of the following use-cases too:

- A command line application to upload and list issues, given the handlers use the existing `service.IssueService` defined in `service/issue.go`. The application would write their own handler to return an os.Stdout rather than JSON response.
- Swap the underlying database to MongoDB or ElasticSearch for which we would have to implement `db.IssuesRepository` defined in `repository/issues.go`. This interface defines the functions needed by the service.

We have also defined DTO (Data Transfer Objects) which are basic struct architecture containing data to be sent or received from one entity to another. These can be configuration or API request/response in `dto/api.go`.

## Testing:

To run the tests, use command:

```bash
make test
```

Tests defined implement fake repository. These implement the interface `db.IssueRepository`.

- Fake repository doesn’t make a db connection, instead stores the data temporarily in a map.

The project contains basic tests to validate the working of our service, as this is where the core part of the application lies. Service connects to the data layer and storage layer. Tests are written using random strings to ensure we have not hardcoded any use-case.

## Future work:

1. Authentication: Right now, all updates happen to global database for every user. We would ideally want an auth layer on top of the whole app. Otherwise, the website should be in read-only mode.

2. Optimistic updates: Although optimistic updates happen when a card is moved in-between statuses, some corner cases arise when handling delete operation from within the list itself.

3. More test cases: Right now, the test case for "moveIssue" functionality is not written. This is the core functionality of a Kanban Board, and we need to validate this scenario. Other services like user and label also don't have test-cases written.

4. Optimizing backend queries: Listing issues & Get an issue APIs does 3 queries - fetching issues, fetching related users data, fetching related labels. These can be optimized into 1 query with joins.

5. UI flows: Although pagination is supported by backend, frontend doesn't utilize it as a proper flow of paginated Kanban board is hard to visualize as a product flow. Better skeletons can be used to optimize load time.

6. Accessibility: Keyboard control (Command + K) is implemented. Other basic accessibility and tab navigation works as part of shadcn/ui's inbuilt-offering. But there is scope to further make it more easier to navigate via keyboard. Loading screens and route switches can also be smoothened.
