package repository

import (
	"fmt"
	"time"

	"flcn_lms_backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// LicenseRepository handles license configuration database operations
type LicenseRepository struct {
	db *gorm.DB
}

// NewLicenseRepository creates a new license repository instance
// Parameters:
//   - db: GORM database instance
//
// Returns:
//   - *LicenseRepository: New license repository
func NewLicenseRepository(db *gorm.DB) *LicenseRepository {
	return &LicenseRepository{db: db}
}

// Create saves a new license configuration to the database
// Parameters:
//   - config: License configuration to save
//
// Returns:
//   - error: Error if creation fails
func (lr *LicenseRepository) Create(config *models.LicenseConfig) error {
	if config.ID == uuid.Nil {
		config.ID = uuid.New()
	}

	if err := lr.db.Create(config).Error; err != nil {
		return fmt.Errorf("failed to create license config: %w", err)
	}
	return nil
}

// GetByLicenseKey retrieves license configuration by license key
// Parameters:
//   - licenseKey: The license key to search for
//
// Returns:
//   - *models.LicenseConfig: License configuration if found
//   - error: Error if query fails or license not found
func (lr *LicenseRepository) GetByLicenseKey(licenseKey string) (*models.LicenseConfig, error) {
	var config models.LicenseConfig

	if err := lr.db.Where("license_key = ?", licenseKey).First(&config).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("license config not found")
		}
		return nil, fmt.Errorf("failed to fetch license config: %w", err)
	}

	return &config, nil
}

// GetLatestConfig retrieves the most recently cached license configuration
// Returns:
//   - *models.LicenseConfig: Most recent license configuration
//   - error: Error if query fails or no records exist
func (lr *LicenseRepository) GetLatestConfig() (*models.LicenseConfig, error) {
	var config models.LicenseConfig

	if err := lr.db.Order("cached_at DESC").First(&config).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("no license config found")
		}
		return nil, fmt.Errorf("failed to fetch license config: %w", err)
	}

	return &config, nil
}

// Update updates an existing license configuration
// Parameters:
//   - config: Updated license configuration
//
// Returns:
//   - error: Error if update fails
func (lr *LicenseRepository) Update(config *models.LicenseConfig) error {
	if err := lr.db.Save(config).Error; err != nil {
		return fmt.Errorf("failed to update license config: %w", err)
	}
	return nil
}

// CreateOrUpdate creates or updates a license configuration
// Uses the license_key as the identifier
//
// Parameters:
//   - config: License configuration to save
//
// Returns:
//   - error: Error if operation fails
func (lr *LicenseRepository) CreateOrUpdate(config *models.LicenseConfig) error {
	if config.ID == uuid.Nil {
		config.ID = uuid.New()
	}

	// Try to find existing by license key
	existing, err := lr.GetByLicenseKey(config.LicenseKey)
	if err == nil {
		// Update existing
		config.ID = existing.ID
		return lr.Update(config)
	}

	// Create new
	return lr.Create(config)
}

// Delete removes a license configuration
// Parameters:
//   - id: License configuration UUID
//
// Returns:
//   - error: Error if deletion fails
func (lr *LicenseRepository) Delete(id uuid.UUID) error {
	if err := lr.db.Delete(&models.LicenseConfig{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("failed to delete license config: %w", err)
	}
	return nil
}

// DeleteByLicenseKey removes a license configuration by license key
// Parameters:
//   - licenseKey: The license key to delete
//
// Returns:
//   - error: Error if deletion fails
func (lr *LicenseRepository) DeleteByLicenseKey(licenseKey string) error {
	if err := lr.db.Delete(&models.LicenseConfig{}, "license_key = ?", licenseKey).Error; err != nil {
		return fmt.Errorf("failed to delete license config: %w", err)
	}
	return nil
}

// GetAll retrieves all license configurations
// Returns:
//   - []models.LicenseConfig: List of all license configurations
//   - error: Error if query fails
func (lr *LicenseRepository) GetAll() ([]models.LicenseConfig, error) {
	var configs []models.LicenseConfig

	if err := lr.db.Order("cached_at DESC").Find(&configs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch license configs: %w", err)
	}

	return configs, nil
}

// IsLicenseValid checks if a license is currently valid
// Considers both the is_valid flag and expiry date
//
// Parameters:
//   - licenseKey: The license key to check
//
// Returns:
//   - bool: True if license is valid and not expired
//   - error: Error if query fails
func (lr *LicenseRepository) IsLicenseValid(licenseKey string) (bool, error) {
	var config models.LicenseConfig

	if err := lr.db.Where("license_key = ?", licenseKey).First(&config).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, fmt.Errorf("failed to check license: %w", err)
	}

	// Check validity flag
	if !config.IsValid {
		return false, nil
	}

	// Check expiry date if set (not nil)
	if config.ExpiryDate != nil {
		if config.ExpiryDate.Before(time.Now()) {
			return false, nil
		}
	}

	return true, nil
}

// UpdateCacheTimestamp updates the cached_at timestamp for a license
// Useful for tracking when license was last verified
//
// Parameters:
//   - licenseKey: The license key to update
//
// Returns:
//   - error: Error if update fails
func (lr *LicenseRepository) UpdateCacheTimestamp(licenseKey string) error {
	if err := lr.db.Model(&models.LicenseConfig{}).
		Where("license_key = ?", licenseKey).
		Update("cached_at", time.Now()).Error; err != nil {
		return fmt.Errorf("failed to update cache timestamp: %w", err)
	}
	return nil
}

// GetExpiringSoon retrieves licenses expiring within specified days
// Useful for alerts and notifications
//
// Parameters:
//   - days: Number of days to look ahead
//
// Returns:
//   - []models.LicenseConfig: Licenses expiring soon
//   - error: Error if query fails
func (lr *LicenseRepository) GetExpiringSoon(days int) ([]models.LicenseConfig, error) {
	var configs []models.LicenseConfig

	expiryThreshold := time.Now().AddDate(0, 0, days)

	query := lr.db.Where("is_valid = ? AND expiry_date IS NOT NULL", true).
		Where("expiry_date <= ? AND expiry_date > ?", expiryThreshold, time.Now()).
		Order("expiry_date ASC")

	if err := query.Find(&configs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch expiring licenses: %w", err)
	}

	return configs, nil
}

// GetExpired retrieves all expired license configurations
// Returns:
//   - []models.LicenseConfig: Expired licenses
//   - error: Error if query fails
func (lr *LicenseRepository) GetExpired() ([]models.LicenseConfig, error) {
	var configs []models.LicenseConfig

	if err := lr.db.Where("expiry_date IS NOT NULL AND expiry_date < ?", time.Now()).
		Order("expiry_date DESC").
		Find(&configs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch expired licenses: %w", err)
	}

	return configs, nil
}

// Count returns the total number of license configurations
// Returns:
//   - int64: Total count
//   - error: Error if query fails
func (lr *LicenseRepository) Count() (int64, error) {
	var count int64

	if err := lr.db.Model(&models.LicenseConfig{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count license configs: %w", err)
	}

	return count, nil
}

// CountValid returns the number of valid (not expired) licenses
// Returns:
//   - int64: Count of valid licenses
//   - error: Error if query fails
func (lr *LicenseRepository) CountValid() (int64, error) {
	var count int64

	query := lr.db.Where("is_valid = ?", true).
		Where("expiry_date IS NULL OR expiry_date > ?", time.Now())

	if err := query.Model(&models.LicenseConfig{}).Count(&count).Error; err != nil {
		return 0, fmt.Errorf("failed to count valid licenses: %w", err)
	}

	return count, nil
}
