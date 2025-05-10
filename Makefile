up:
	docker-compose up -d --build

down:
	docker-compose down

bash:
	docker-compose exec express bash

migrate:
	docker compose exec express npm run migrate:dev

reset:
	docker compose exec express npm run migrate:reset
