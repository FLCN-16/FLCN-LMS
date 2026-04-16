package cron

import (
	"fmt"
	"log"
	"sync"
	"time"

	"flcn_lms_backend/internal/service"
)

// LicenseVerifier handles periodic background license verification
type LicenseVerifier struct {
	licenseService *service.LicenseService
	ticker         *time.Ticker
	stopChan       chan bool
	isRunning      bool
	interval       time.Duration
	mu             sync.RWMutex
	lastRun        time.Time
	lastError      error
}

// NewLicenseVerifier creates a new license verifier cron job
// Parameters:
//   - licenseService: License service for verification operations
//   - interval: Time between verifications (default 24 hours if <= 0)
//
// Returns:
//   - *LicenseVerifier: New license verifier instance
func NewLicenseVerifier(licenseService *service.LicenseService, interval time.Duration) *LicenseVerifier {
	if interval <= 0 {
		interval = 24 * time.Hour
	}

	return &LicenseVerifier{
		licenseService: licenseService,
		interval:       interval,
		stopChan:       make(chan bool),
		isRunning:      false,
		mu:             sync.RWMutex{},
	}
}

// Start begins the periodic license verification background job
// Performs initial verification immediately, then repeats on interval
//
// Returns:
//   - error: Error if already running or if start fails
func (lv *LicenseVerifier) Start() error {
	lv.mu.Lock()
	if lv.isRunning {
		lv.mu.Unlock()
		return fmt.Errorf("license verifier is already running")
	}

	lv.isRunning = true
	lv.mu.Unlock()

	lv.ticker = time.NewTicker(lv.interval)

	go lv.run()

	log.Printf("[License Verifier] Started with interval: %v", lv.interval)
	return nil
}

// Stop gracefully stops the license verification background job
// Returns:
//   - error: Error if not running
func (lv *LicenseVerifier) Stop() error {
	lv.mu.Lock()
	if !lv.isRunning {
		lv.mu.Unlock()
		return fmt.Errorf("license verifier is not running")
	}

	lv.isRunning = false
	lv.mu.Unlock()

	if lv.ticker != nil {
		lv.ticker.Stop()
	}

	lv.stopChan <- true
	log.Println("[License Verifier] Stopped")

	return nil
}

// IsRunning checks if the verifier is currently active
// Returns:
//   - bool: True if running
func (lv *LicenseVerifier) IsRunning() bool {
	lv.mu.RLock()
	defer lv.mu.RUnlock()
	return lv.isRunning
}

// SetInterval changes the verification interval
// Takes effect on the next tick
// Parameters:
//   - interval: New interval duration
func (lv *LicenseVerifier) SetInterval(interval time.Duration) {
	if interval <= 0 {
		return
	}

	lv.mu.Lock()
	lv.interval = interval
	lv.mu.Unlock()

	if lv.ticker != nil {
		lv.ticker.Reset(interval)
	}

	log.Printf("[License Verifier] Interval updated to: %v", interval)
}

// GetInterval returns the current verification interval
// Returns:
//   - time.Duration: Current interval
func (lv *LicenseVerifier) GetInterval() time.Duration {
	lv.mu.RLock()
	defer lv.mu.RUnlock()
	return lv.interval
}

// GetLastRun returns the time of the last verification attempt
// Returns:
//   - time.Time: Last run time
func (lv *LicenseVerifier) GetLastRun() time.Time {
	lv.mu.RLock()
	defer lv.mu.RUnlock()
	return lv.lastRun
}

// GetLastError returns the last error that occurred during verification
// Returns:
//   - error: Last error or nil if no error
func (lv *LicenseVerifier) GetLastError() error {
	lv.mu.RLock()
	defer lv.mu.RUnlock()
	return lv.lastError
}

// GetStatus returns the current status of the verifier
// Returns a map with status information
func (lv *LicenseVerifier) GetStatus() map[string]interface{} {
	lv.mu.RLock()
	defer lv.mu.RUnlock()

	status := map[string]interface{}{
		"running":    lv.isRunning,
		"interval":   lv.interval.String(),
		"last_run":   lv.lastRun,
		"last_error": nil,
	}

	if lv.lastError != nil {
		status["last_error"] = lv.lastError.Error()
	}

	return status
}

// Private methods

// run is the main loop for the background job
func (lv *LicenseVerifier) run() {
	// Perform initial verification immediately
	lv.performVerification()

	// Then verify on each tick
	for {
		select {
		case <-lv.ticker.C:
			lv.performVerification()

		case <-lv.stopChan:
			return
		}
	}
}

// performVerification executes the license verification
func (lv *LicenseVerifier) performVerification() {
	now := time.Now()
	log.Printf("[License Verifier] Starting verification at %v", now.Format(time.RFC3339))

	// Execute verification with timeout
	done := make(chan error, 1)
	go func() {
		_, err := lv.licenseService.VerifyLicenseWithForce()
		done <- err
	}()

	// Wait with timeout
	var err error
	select {
	case verifyErr := <-done:
		err = verifyErr
	case <-time.After(30 * time.Second):
		err = fmt.Errorf("verification timeout after 30 seconds")
	}

	// Update status
	lv.mu.Lock()
	lv.lastRun = now
	lv.lastError = err
	lv.mu.Unlock()

	// Log result
	if err != nil {
		log.Printf("[License Verifier] ❌ Verification failed: %v", err)
		return
	}

	log.Printf("[License Verifier] ✅ Verification successful")
}
