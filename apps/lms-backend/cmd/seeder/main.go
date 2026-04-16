package main

import (
	"flag"
	"log"

	"flcn_lms_backend/internal/config"
	"flcn_lms_backend/internal/database"
	"flcn_lms_backend/seeds"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Define CLI flags
	migrate := flag.Bool("migrate", false, "Run database migrations")
	rollback := flag.Bool("rollback", false, "Rollback database migrations")
	seed := flag.Bool("seed", false, "Seed database with sample data")
	all := flag.Bool("all", false, "Run migrations and seed data")

	flag.Parse()

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database connection
	db, err := database.Init(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Execute commands
	if *all {
		*migrate = true
		*seed = true
	}

	if !*migrate && !*rollback && !*seed {
		flag.PrintDefaults()
		return
	}

	if *rollback {
		if err := database.RollbackMigrations(db.DB); err != nil {
			log.Fatalf("Rollback failed: %v", err)
		}
	}

	if *migrate {
		if err := database.RunMigrations(db.DB); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
	}

	if *seed {
		if err := seeds.SeedDatabase(db.DB); err != nil {
			log.Fatalf("Seeding failed: %v", err)
		}
	}

	log.Println("✓ All operations completed successfully")
}
