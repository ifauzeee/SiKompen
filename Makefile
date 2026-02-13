.PHONY: run-backend run-frontend dev build-backend docker-up docker-down

run-backend:
	go run cmd/api/main.go

run-frontend:
	npm run dev

dev:
	make -j 2 run-backend run-frontend

build-backend:
	go build -o bin/server cmd/api/main.go

docker-up:
	docker-compose --env-file .env up --build

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

tidy:
	go mod tidy
