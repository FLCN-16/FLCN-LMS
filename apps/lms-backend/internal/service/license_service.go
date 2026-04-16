package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"sync"
	"time"

	"flcn_lms_backend/internal/license"
	"flcn_lms_backend/internal/models"

	"gorm.io/gorm"
)

// LicenseService manages license verification and caching
type LicenseService struct {
	db            *gorm.DB
	licenseClient *license.Client
	licenseKey    string
	cacheMutex    sync.RWMutex
	cachedLicense *models.LicenseConfig
	cacheExpiry   time.Time
}

// NewLicenseService creates a new license service instance
// Parameters:
//   - db: GORM database instance
//   - licenseClient: License verification client
//   - licenseKey: License key for this instance
//
// Returns:
//   - *LicenseService: New license service instance
func NewLicenseService(db *gorm.DB, licenseClient *license.Client, licenseKey string) *LicenseService {
	return &LicenseService{
		db:            db,
		licenseClient: licenseClient,
		licenseKey:    licenseKey,
		cacheMutex:    sync.RWMutex{},
		cachedLicense: nil,
		cacheExpiry:   time.Time{},
	}
}

// VerifyLicense verifies the license with the license server
// Returns cached result if valid cache exists, otherwise fetches new verification
//
// Returns:
//   - *models.LicenseConfig: Cached or newly verified license configuration
//   - error: Error if verification fails or license is invalid
func (ls *LicenseService) VerifyLicense() (*models.LicenseConfig, error) {
	// Check if we have valid cache
	if ls.isCacheValid() {
		log.Println("[License Service] Using cached license verification")
		return ls.cachedLicense, nil
	}

	// Fetch fresh verification from license server
	log.Println("[License Service] Fetching fresh license verification")
	resp, err := ls.licenseClient.VerifyLicenseWithRetry(ls.licenseKey, 3)
	if err != nil {
		log.Printf("[License Service] Verification failed: %v", err)
		return nil, fmt.Errorf("license verification failed: %w", err)
	}

	// Convert response to model
	licenseConfig := ls.responseToModel(resp)

	// Save to database
	if err := ls.saveLicenseConfig(licenseConfig); err != nil {
		log.Printf("[License Service] Failed to save license config: %v", err)
		// Don't fail the verification if saving fails, but log it
	}

	// Update cache
	ls.updateCache(licenseConfig, resp.CacheTTL)

	return licenseConfig, nil
}

// VerifyLicenseWithForce forces a fresh verification regardless of cache
// Bypasses cache and always fetches from license server
//
// Returns:
//   - *models.LicenseConfig: Newly verified license configuration
//   - error: Error if verification fails
func (ls *LicenseService) VerifyLicenseWithForce() (*models.LicenseConfig, error) {
	log.Println("[License Service] Force verification (ignoring cache)")

	// Fetch from server
	resp, err := ls.licenseClient.VerifyLicenseWithRetry(ls.licenseKey, 3)
	if err != nil {
		return nil, fmt.Errorf("license verification failed: %w", err)
	}

	// Convert and save
	licenseConfig := ls.responseToModel(resp)

	if err := ls.saveLicenseConfig(licenseConfig); err != nil {
		log.Printf("[License Service] Failed to save license config: %v", err)
	}

	// Update cache
	ls.updateCache(licenseConfig, resp.CacheTTL)

	return licenseConfig, nil
}

// IsLicenseValid checks if the current license is valid and not expired
//
// Returns:
//   - bool: True if license is valid and active
//   - error: Error if verification fails
func (ls *LicenseService) IsLicenseValid() (bool, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return false, err
	}

	// Check validity flag
	if !config.IsValid {
		return false, nil
	}

	// Check expiry
	if config.ExpiryDate != nil && time.Now().After(*config.ExpiryDate) {
		return false, nil
	}

	return true, nil
}

// HasFeature checks if a specific feature is enabled in the license
// Parameters:
//   - featureName: Name of the feature to check (e.g., "live_sessions", "advanced_analytics")
//
// Returns:
//   - bool: True if feature is enabled
//   - error: Error if license verification fails
func (ls *LicenseService) HasFeature(featureName string) (bool, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return false, err
	}

	if !config.IsValid {
		return false, errors.New("license is not valid")
	}

	// Parse features from JSON
	var features []map[string]interface{}
	if err := json.Unmarshal(config.Features, &features); err != nil {
		return false, fmt.Errorf("failed to parse features: %w", err)
	}

	// Check if feature exists and is enabled
	for _, feature := range features {
		if name, ok := feature["name"].(string); ok && name == featureName {
			if enabled, ok := feature["enabled"].(bool); ok && enabled {
				return true, nil
			}
		}
	}

	return false, nil
}

// GetFeatures returns all enabled features for the current license
//
// Returns:
//   - []map[string]interface{}: List of enabled features with their configuration
//   - error: Error if license verification fails
func (ls *LicenseService) GetFeatures() ([]map[string]interface{}, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return nil, err
	}

	if !config.IsValid {
		return nil, errors.New("license is not valid")
	}

	// Parse features from JSON
	var features []map[string]interface{}
	if err := json.Unmarshal(config.Features, &features); err != nil {
		return nil, fmt.Errorf("failed to parse features: %w", err)
	}

	// Filter only enabled features
	var enabledFeatures []map[string]interface{}
	for _, feature := range features {
		if enabled, ok := feature["enabled"].(bool); ok && enabled {
			enabledFeatures = append(enabledFeatures, feature)
		}
	}

	return enabledFeatures, nil
}

// GetMaxUsers returns the maximum number of users allowed by the license
//
// Returns:
//   - int64: Maximum number of users (0 for unlimited)
//   - error: Error if license verification fails
func (ls *LicenseService) GetMaxUsers() (int64, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return 0, err
	}

	return config.MaxUsers, nil
}

// GetExpiryDate returns the license expiry date
//
// Returns:
//   - *time.Time: Expiry date (nil if perpetual license)
//   - error: Error if license verification fails
func (ls *LicenseService) GetExpiryDate() (*time.Time, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return nil, err
	}

	return config.ExpiryDate, nil
}

// GetLicenseStatus returns a human-readable license status
//
// Returns:
//   - string: License status description
//   - error: Error if license verification fails
func (ls *LicenseService) GetLicenseStatus() (string, error) {
	config, err := ls.VerifyLicense()
	if err != nil {
		return "", err
	}

	if !config.IsValid {
		return "Invalid", nil
	}

	if config.ExpiryDate != nil {
		if time.Now().After(*config.ExpiryDate) {
			return "Expired", nil
		}

		daysUntilExpiry := time.Until(*config.ExpiryDate).Hours() / 24
		return fmt.Sprintf("Active (expires in %.0f days)", daysUntilExpiry), nil
	}

	return "Active (perpetual)", nil
}

// ClearCache clears the in-memory license cache
// Useful for testing or forcing fresh verification on next request
func (ls *LicenseService) ClearCache() {
	ls.cacheMutex.Lock()
	defer ls.cacheMutex.Unlock()

	ls.cachedLicense = nil
	ls.cacheExpiry = time.Time{}
	log.Println("[License Service] Cache cleared")
}

// Helper Methods

// isCacheValid checks if current cache is valid and not expired
func (ls *LicenseService) isCacheValid() bool {
	ls.cacheMutex.RLock()
	defer ls.cacheMutex.RUnlock()

	if ls.cachedLicense == nil {
		return false
	}

	if time.Now().After(ls.cacheExpiry) {
		return false
	}

	return true
}

// updateCache updates the in-memory cache with new license config
// Parameters:
//   - config: License configuration to cache
//   - cacheTTLSeconds: Cache time-to-live in seconds
func (ls *LicenseService) updateCache(config *models.LicenseConfig, cacheTTLSeconds int64) {
	ls.cacheMutex.Lock()
	defer ls.cacheMutex.Unlock()

	ls.cachedLicense = config

	// Parse cache TTL, default to 24 hours if invalid
	ttl := 24 * time.Hour
	if cacheTTLSeconds > 0 {
		ttl = time.Duration(cacheTTLSeconds) * time.Second
	}

	ls.cacheExpiry = time.Now().Add(ttl)
	log.Printf("[License Service] Cache updated with TTL: %v", ttl)
}

// saveLicenseConfig saves license configuration to database
func (ls *LicenseService) saveLicenseConfig(config *models.LicenseConfig) error {
	// Try to update existing, or create if not exists
	result := ls.db.Save(config)
	return result.Error
}

// responseToModel converts license client response to database model
func (ls *LicenseService) responseToModel(resp *license.VerifyResponse) *models.LicenseConfig {
	// Marshal features to JSON
	featuresJSON, _ := json.Marshal(resp.Features)

	// Default to "Organization" if not provided by the API
	organizationName := resp.OrganizationName
	if organizationName == "" {
		organizationName = "Organization"
	}

	config := &models.LicenseConfig{
		LicenseKey:       ls.licenseKey,
		OrganizationName: organizationName,
		MaxUsers:         resp.MaxUsers,
		Features:         featuresJSON,
		ExpiryDate:       &resp.ExpiryDate,
		CachedAt:         time.Now(),
		IsValid:          resp.Valid,
	}

	return config
}

// GetCachedLicense returns the currently cached license without verification
// Useful for checking cache status without making API calls
//
// Returns:
//   - *models.LicenseConfig: Cached license or nil if cache expired/empty
func (ls *LicenseService) GetCachedLicense() *models.LicenseConfig {
	ls.cacheMutex.RLock()
	defer ls.cacheMutex.RUnlock()

	if ls.isCacheValid() {
		return ls.cachedLicense
	}

	return nil
}

// GetCacheExpiry returns when the current cache expires
//
// Returns:
//   - time.Time: Cache expiry time
func (ls *LicenseService) GetCacheExpiry() time.Time {
	ls.cacheMutex.RLock()
	defer ls.cacheMutex.RUnlock()

	return ls.cacheExpiry
}

// LoadCacheFromDatabase attempts to load cached license from database
// Useful on startup to restore cache from previous verification
//
// Returns:
//   - error: Error if loading fails
func (ls *LicenseService) LoadCacheFromDatabase() error {
	var config models.LicenseConfig

	result := ls.db.Where("license_key = ?", ls.licenseKey).Order("cached_at DESC").First(&config)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			log.Println("[License Service] No cached license found in database")
			return nil
		}
		return fmt.Errorf("failed to load license from database: %w", result.Error)
	}

	// Check if cached data is still valid
	cacheDuration := time.Duration(24) * time.Hour // Default 24h
	if config.CachedAt.Add(cacheDuration).After(time.Now()) {
		ls.updateCache(&config, 86400) // 24 hours in seconds
		log.Println("[License Service] Loaded valid license from database cache")
		return nil
	}

	log.Println("[License Service] Cached license in database has expired")
	return nil
}
