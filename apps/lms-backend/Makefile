.PHONY: help db-create db-migrate db-rollback db-seed db-verify db-reset db-full-setup clean build build-seeder run dev test test-verbose lint fmt vet quick-start setup .env

SEEDER_BIN := ./bin/seeder
MAIN_BIN := ./bin/backend

help:
	@echo "LMS Backend - Makefile"
	@echo ""
	@echo "Database Commands:"
	@echo "  make db-create      Create PostgreSQL database"
	@echo "  make db-migrate     Run database migrations"
	@echo "  make db-seed        Seed database with sample data"
	@echo "  make db-rollback    Rollback all migrations"
	@echo "  make db-reset       Full reset: rollback + migrate + seed"
	@echo "  make db-verify      Verify database setup"
	@echo "  make db-full-setup  Complete database setup in one command"
	@echo ""
	@echo "Build & Run Commands:"
	@echo "  make build          Build backend binary"
	@echo "  make build-seeder   Build seeder CLI tool"
	@echo "  make run            Run backend server"
	@echo "  make clean          Remove built binaries"
	@echo ""
	@echo "Test Commands:"
	@echo "  make test           Run all tests"
	@echo "  make test-verbose   Run tests with verbose output"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev            Run in development mode with hot reload"
	@echo "  make lint           Run linter"
	@echo "  make fmt            Format code"
	@echo "  make vet            Run go vet"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make quick-start    One-command quick start"
	@echo "  make setup          Initialize development environment"
	@echo ""

# Database Commands

db-create:
	@echo "Creating PostgreSQL database 'lms_development'..."
	createdb lms_development 2>/dev/null || echo "Database may already exist"
	@echo "✓ Database created (or already exists)"

db-migrate: build-seeder
	@echo "Running database migrations..."
	$(SEEDER_BIN) -migrate
	@echo "✓ Migrations completed"

db-seed: build-seeder
	@echo "Seeding database with sample data..."
	$(SEEDER_BIN) -seed
	@echo "✓ Database seeded"

db-rollback: build-seeder
	@echo "Rolling back all migrations..."
	$(SEEDER_BIN) -rollback
	@echo "✓ Migrations rolled back"

db-reset: build-seeder db-rollback db-migrate db-seed
	@echo "✓ Database reset complete"

db-verify:
	@echo "Verifying database setup..."
	@bash ./verify-database.sh

db-full-setup: db-create db-migrate db-seed db-verify
	@echo "✓ Full database setup complete"

# Build Commands

build:
	@echo "Building backend..."
	mkdir -p bin
	go build -o $(MAIN_BIN) main.go
	@echo "✓ Backend built: $(MAIN_BIN)"

build-seeder:
	@echo "Building seeder CLI..."
	mkdir -p bin
	go build -o $(SEEDER_BIN) ./cmd/seeder
	@echo "✓ Seeder built: $(SEEDER_BIN)"

# Run Commands

run: build db-verify
	@echo "Starting backend server..."
	$(MAIN_BIN)

dev:
	@echo "Starting backend in development mode..."
	@which air > /dev/null || (echo "Installing air (hot reload)..." && go install github.com/air-verse/air@latest)
	air

# Test Commands

test:
	@echo "Running tests..."
	go test ./...

test-verbose:
	@echo "Running tests (verbose)..."
	go test -v ./...

# Code Quality

lint:
	@echo "Running linter..."
	@which golangci-lint > /dev/null || (echo "Installing golangci-lint..." && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest)
	golangci-lint run ./...

fmt:
	@echo "Formatting code..."
	go fmt ./...

vet:
	@echo "Running go vet..."
	go vet ./...

# Cleanup

clean:
	@echo "Cleaning up..."
	rm -f $(MAIN_BIN) $(SEEDER_BIN)
	rm -rf bin/
	@echo "✓ Cleanup complete"

# Development Workflow

setup: db-create .env
	@echo "✓ Setup complete! Run 'make run' to start the backend"

.env:
	@echo "Creating .env file..."
	cp .env.example .env
	@echo "✓ Created .env (edit with your configuration)"
	@echo "  Make sure to update database credentials if needed"

# Quick start
quick-start: db-create .env db-migrate db-seed
	@echo ""
	@echo "✓ Quick start complete!"
	@echo ""
	@echo "To start the backend, run:"
	@echo "  make run"
	@echo ""
	@echo "Test Credentials:"
	@echo "  Student:    student1@lms.local / password123"
	@echo "  Instructor: instructor@lms.local / password123"
	@echo "  Admin:      admin@lms.local / password123"
	@echo ""
