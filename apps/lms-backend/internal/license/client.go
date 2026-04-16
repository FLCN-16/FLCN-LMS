package license

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Feature represents a licensed feature with its configuration
type Feature struct {
	Name    string `json:"name"`
	Enabled bool   `json:"enabled"`
	Limit   int64  `json:"limit,omitempty"`
}

// VerifyRequest is sent to the license API
type VerifyRequest struct {
	LicenseKey string `json:"license_key"`
	Timestamp  int64  `json:"timestamp"`
}

// VerifyResponse is received from the license API
type VerifyResponse struct {
	Valid            bool      `json:"valid"`
	Status           string    `json:"status"`
	OrganizationName string    `json:"organization_name,omitempty"`
	MaxUsers         int64     `json:"max_users,omitempty"`
	ExpiryDate       time.Time `json:"expiry_date"`
	Features         []Feature `json:"features"`
	CacheTTL         int64     `json:"cache_ttl"` // in seconds
	Message          string    `json:"message,omitempty"`
}

// Client handles license verification with the NestJS backend
type Client struct {
	apiURL     string
	httpClient *http.Client
	timeout    time.Duration
}

// NewClient creates a new license verification client
// Parameters:
//   - apiURL: Base URL of the license verification API (e.g., "https://api.example.com")
//   - timeout: HTTP request timeout duration
//
// Returns:
//   - *Client: New license client instance
func NewClient(apiURL string, timeout time.Duration) *Client {
	if timeout == 0 {
		timeout = 30 * time.Second
	}

	return &Client{
		apiURL: apiURL,
		httpClient: &http.Client{
			Timeout: timeout,
		},
		timeout: timeout,
	}
}

// VerifyLicense verifies a license key by making a request to the NestJS license server
// The response includes license validity, expiry date, features, and recommended cache TTL
//
// Parameters:
//   - licenseKey: The license key to verify
//
// Returns:
//   - *VerifyResponse: License verification result with features and cache duration
//   - error: Network or validation error if verification fails
func (c *Client) VerifyLicense(licenseKey string) (*VerifyResponse, error) {
	if licenseKey == "" {
		return nil, fmt.Errorf("license key cannot be empty")
	}

	// Prepare request payload
	req := &VerifyRequest{
		LicenseKey: licenseKey,
		Timestamp:  time.Now().Unix(),
	}

	// Marshal to JSON
	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP POST request
	httpReq, err := http.NewRequest("POST", c.getLicenseVerifyURL(), bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Accept", "application/json")
	httpReq.Header.Set("User-Agent", "lms-backend/1.0")

	// Execute request
	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Check HTTP status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("license server returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var verifyResp VerifyResponse
	if err := json.Unmarshal(body, &verifyResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	// Validate response
	if err := validateResponse(&verifyResp); err != nil {
		return nil, fmt.Errorf("invalid response: %w", err)
	}

	return &verifyResp, nil
}

// VerifyLicenseWithRetry attempts license verification with exponential backoff retry
// Useful for handling temporary network issues without manual intervention
//
// Parameters:
//   - licenseKey: The license key to verify
//   - maxRetries: Maximum number of retry attempts (uses 3 if <= 0)
//
// Returns:
//   - *VerifyResponse: License verification response
//   - error: Error if all retries fail or validation error occurs
func (c *Client) VerifyLicenseWithRetry(licenseKey string, maxRetries int) (*VerifyResponse, error) {
	if maxRetries < 0 {
		maxRetries = 3
	}

	var lastErr error

	for attempt := 0; attempt <= maxRetries; attempt++ {
		resp, err := c.VerifyLicense(licenseKey)
		if err == nil {
			return resp, nil
		}

		lastErr = err

		// Don't retry on validation errors
		if isValidationError(err) {
			return nil, err
		}

		// Exponential backoff: 1s, 2s, 4s, 8s...
		if attempt < maxRetries {
			backoffTime := time.Duration(1<<uint(attempt)) * time.Second
			time.Sleep(backoffTime)
		}
	}

	return nil, fmt.Errorf("license verification failed after %d attempts: %w", maxRetries+1, lastErr)
}

// IsLicenseValid checks if a license is valid and not expired
// Parameters:
//   - resp: License verification response
//
// Returns:
//   - bool: True if license is valid and has not expired
func (c *Client) IsLicenseValid(resp *VerifyResponse) bool {
	if resp == nil {
		return false
	}

	if !resp.Valid {
		return false
	}

	// Check expiration
	if !resp.ExpiryDate.IsZero() && time.Now().After(resp.ExpiryDate) {
		return false
	}

	return true
}

// HasFeature checks if a specific feature is enabled in the license
// Parameters:
//   - resp: License verification response
//   - featureName: Name of the feature to check
//
// Returns:
//   - bool: True if feature is enabled
func (c *Client) HasFeature(resp *VerifyResponse, featureName string) bool {
	if resp == nil || resp.Features == nil {
		return false
	}

	for _, feature := range resp.Features {
		if feature.Name == featureName && feature.Enabled {
			return true
		}
	}

	return false
}

// GetFeatureLimit retrieves the usage limit for a specific feature
// Parameters:
//   - resp: License verification response
//   - featureName: Name of the feature
//
// Returns:
//   - int64: Feature limit (0 if feature not found or has no limit)
func (c *Client) GetFeatureLimit(resp *VerifyResponse, featureName string) int64 {
	if resp == nil || resp.Features == nil {
		return 0
	}

	for _, feature := range resp.Features {
		if feature.Name == featureName && feature.Enabled {
			return feature.Limit
		}
	}

	return 0
}

// GetCacheDuration returns the recommended cache duration from the license response
// Uses the CacheTTL from response, or defaults to 24 hours if not specified
//
// Parameters:
//   - resp: License verification response
//
// Returns:
//   - time.Duration: Recommended cache duration
func (c *Client) GetCacheDuration(resp *VerifyResponse) time.Duration {
	if resp == nil || resp.CacheTTL <= 0 {
		return 24 * time.Hour
	}

	return time.Duration(resp.CacheTTL) * time.Second
}

// Helper functions

// getLicenseVerifyURL constructs the full URL for the license verification endpoint
func (c *Client) getLicenseVerifyURL() string {
	return fmt.Sprintf("%s/api/v1/licenses/verify", c.apiURL)
}

// validateResponse validates the license verification response structure
func validateResponse(resp *VerifyResponse) error {
	if resp == nil {
		return fmt.Errorf("response is nil")
	}

	// Validate status is one of the known values
	validStatuses := map[string]bool{
		"valid":   true,
		"invalid": true,
		"expired": true,
		"error":   true,
	}

	if !validStatuses[resp.Status] {
		return fmt.Errorf("unknown license status: %s", resp.Status)
	}

	// Set default cache TTL if not provided
	if resp.CacheTTL <= 0 {
		resp.CacheTTL = 86400 // 24 hours in seconds
	}

	return nil
}

// isValidationError determines if an error is a validation error (not retryable)
func isValidationError(err error) bool {
	if err == nil {
		return false
	}

	errMsg := err.Error()
	nonRetryableErrors := []string{
		"license key cannot be empty",
		"invalid response",
		"unknown license status",
		"failed to parse response",
	}

	for _, errPattern := range nonRetryableErrors {
		if bytes.Contains([]byte(errMsg), []byte(errPattern)) {
			return true
		}
	}

	return false
}
