package database

import (
	"fmt"
	"log"

	"flcn_lms_backend/internal/config"
	"flcn_lms_backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database represents the database connection wrapper
type Database struct {
	DB *gorm.DB
}

// Init initializes the database connection and runs migrations
// Parameters:
//   - cfg: Configuration containing database connection details
//
// Returns:
//   - *Database: Database connection wrapper
//   - error: Error if connection or migration fails
func Init(cfg *config.Config) (*Database, error) {
	// Open database connection
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying SQL DB for connection pooling
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	log.Println("Database connected successfully")

	// Run migrations
	if err := runMigrations(db); err != nil {
		return nil, fmt.Errorf("migration failed: %w", err)
	}

	return &Database{DB: db}, nil
}

// runMigrations creates all necessary tables and indexes
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - error: Error if any migration fails
func runMigrations(db *gorm.DB) error {
	tables := []interface{}{
		&models.User{},
		&models.Institute{},
		&models.Category{},
		&models.Course{},
		&models.Module{},
		&models.Lesson{},
		&models.TestSeries{},
		&models.Question{},
		&models.QuestionOption{},
		&models.Attempt{},
		&models.AttemptAnswer{},
		&models.Enrollment{},
		&models.LessonProgress{},
		&models.Certificate{},
		&models.LiveSession{},
		&models.LiveSessionParticipant{},
		&models.Batch{},
		&models.BatchEnrollment{},
		&models.LicenseConfig{},
		&models.DailyPracticePaper{},
		&models.Announcement{},
		&models.CourseReview{},
		&models.Coupon{},
		&models.CouponUsage{},
		&models.Order{},
		&models.Notification{},
		&models.StudyMaterial{},
	}

	for _, table := range tables {
		// Skip AutoMigrate for LicenseConfig and handle it manually to avoid constraint conflicts
		if _, ok := table.(*models.LicenseConfig); ok {
			// For LicenseConfig, just ensure the table exists without managing constraints
			if !db.Migrator().HasTable(table) {
				if err := db.Migrator().CreateTable(table); err != nil {
					return fmt.Errorf("failed to create table for %T: %w", table, err)
				}
			}
		} else {
			if err := db.AutoMigrate(table); err != nil {
				return fmt.Errorf("failed to migrate %T: %w", table, err)
			}
		}
	}

	log.Println("Migrations completed successfully")
	return nil
}

// Close closes the database connection
// Should be called during graceful shutdown
func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// Health checks if the database connection is alive
// Returns:
//   - error: Error if health check fails
func (d *Database) Health() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}
