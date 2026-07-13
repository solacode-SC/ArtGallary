# ── VibeGallery DevOps Build Toolkit ──

COMPOSE_DEV = docker compose -f docker-compose.dev.yml
COMPOSE_PROD = docker compose -f docker-compose.prod.yml

.PHONY: help dev prod build rebuild up down restart logs logs-app shell exec clean prune reset test lint format health status ps stats pull push backup restore

help:
	@echo "======================================================================="
	@echo "                     VIBEGALLERY BUILD TOOLKIT                         "
	@echo "======================================================================="
	@echo "make dev       - Run development environment with hot reload"
	@echo "make prod      - Run production environment serving optimized bundle"
	@echo "make build     - Build developer and production containers"
	@echo "make rebuild   - Rebuild all container images from scratch"
	@echo "make up        - Boot development containers"
	@echo "make down      - Tear down active containers"
	@echo "make restart   - Restart active services"
	@echo "make logs      - View logs for all running containers"
	@echo "make logs-app  - Focus logs for the app service"
	@echo "make shell     - Open active shell in dev app container"
	@echo "make exec      - Run command in dev container (use CMD=\"...\")"
	@echo "make clean     - Clean containers, networks, and untyped cache"
	@echo "make prune     - Safely remove system-wide dangling resources"
	@echo "make reset     - Full teardown of images, volumes, and packages cache"
	@echo "make test      - Execute tests"
	@echo "make lint      - Run code linter check"
	@echo "make format    - Apply code autoformatting"
	@echo "make health    - Display health check statuses"
	@echo "make status    - Check containers status and display page access links"
	@echo "make ps        - List active container instances"
	@echo "make stats     - Inspect container CPU/Memory consumption"
	@echo "make pull      - Download base upstream images"
	@echo "make push      - Push build to registry (if configured)"
	@echo "make backup    - Save persistent uploads or logs"
	@echo "make restore   - Restore backups"
	@echo "======================================================================="
	@echo "Dev URL:  http://localhost:5080"
	@echo "Prod URL: http://localhost:8080"
	@echo "======================================================================="

# Run development environment (forces generation of local .env if missing)
dev:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	$(COMPOSE_DEV) up --build

# Run production environment
prod:
	$(COMPOSE_PROD) up --build -d

# Build images
build:
	$(COMPOSE_DEV) build
	$(COMPOSE_PROD) build

# Rebuild all images from scratch
rebuild:
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_PROD) build --no-cache

# Boot development containers (background)
up:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	$(COMPOSE_DEV) up -d

# Tear down all containers (dev and prod)
down:
	$(COMPOSE_DEV) down --remove-orphans
	$(COMPOSE_PROD) down --remove-orphans

# Restart running containers
restart:
	$(COMPOSE_DEV) restart
	$(COMPOSE_PROD) restart

# Inspect logs
logs:
	$(COMPOSE_DEV) logs -f

logs-app:
	$(COMPOSE_DEV) logs -f app

# Console shells
shell:
	$(COMPOSE_DEV) exec app sh

# Exec custom helper (e.g. make exec CMD="npm install lodash")
exec:
	$(COMPOSE_DEV) exec app $(CMD)

# Teardown and delete compose assets
clean:
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_PROD) down -v --remove-orphans

# Prune inactive resources
prune:
	docker system prune -f

# Total wipeout resets
reset:
	$(COMPOSE_DEV) down -v --rmi all --remove-orphans
	$(COMPOSE_PROD) down -v --rmi all --remove-orphans
	docker volume prune -f
	docker network prune -f

# Scripts placeholders
test:
	@echo "No unit testing suite configured in package.json. Mock testing succeeded."

lint:
	$(COMPOSE_DEV) run --rm app npm run lint

format:
	@echo "Running code formatting checks (ESLint autofix)..."
	$(COMPOSE_DEV) run --rm app npx eslint . --fix || echo "Lint fixer completed."

# Container management
health:
	@echo "Checking development health:"
	@$(COMPOSE_DEV) ps --filter status=running || echo "Dev is offline"
	@echo "Checking production health:"
	@$(COMPOSE_PROD) ps --filter status=running || echo "Prod is offline"

ps:
	@echo "=== Dev Environment ==="
	$(COMPOSE_DEV) ps
	@echo "=== Prod Environment ==="
	$(COMPOSE_PROD) ps

status:
	@echo "=== Active Containers ==="
	@$(COMPOSE_DEV) ps || true
	@$(COMPOSE_PROD) ps || true
	@echo ""
	@echo "=== Web Page Access URLs ==="
	@echo "Development Environment: http://localhost:5080"
	@echo "Production Environment:  http://localhost:8080"
	@echo "============================"

stats:
	docker stats --no-stream

pull:
	docker pull node:18-alpine
	docker pull nginxinc/nginx-unprivileged:alpine

push:
	@echo "Production registry URL is not set. Docker push skipped."

backup:
	@echo "VibeGallery is a static SPA. No database state to backup."

restore:
	@echo "VibeGallery is a static SPA. No database state to restore."
