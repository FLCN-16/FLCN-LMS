package handlers

import (
	"net/http"

	"flcn_lms_backend/internal/api/response"
	"flcn_lms_backend/internal/service"

	"github.com/gin-gonic/gin"
)

// LicenseHandler handles license verification and status requests
type LicenseHandler struct {
	licenseService *service.LicenseService
}

// NewLicenseHandler creates a new license handler instance
// Parameters:
//   - licenseService: License service for verification operations
//
// Returns:
//   - *LicenseHandler: New license handler instance
func NewLicenseHandler(licenseService *service.LicenseService) *LicenseHandler {
	return &LicenseHandler{
		licenseService: licenseService,
	}
}

// VerifyLicense verifies the current license
// @Summary Verify license
// @Description Verify the current license with the license server
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "License verified"
// @Failure 400 {object} response.Response "License invalid"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/verify [post]
func (h *LicenseHandler) VerifyLicense(c *gin.Context) {
	// Perform verification
	result, err := h.licenseService.VerifyLicense()
	if err != nil {
		response.BadRequest(c, "License verification failed: "+err.Error())
		return
	}

	if result == nil {
		response.BadRequest(c, "License verification returned empty result")
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"valid":       result.IsValid,
		"expiry_date": result.ExpiryDate,
		"max_users":   result.MaxUsers,
		"cached_at":   result.CachedAt,
	})
}

// GetLicenseStatus returns the current license status
// @Summary Get license status
// @Description Get current license status, expiry, and enabled features
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "License status retrieved"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/status [get]
func (h *LicenseHandler) GetLicenseStatus(c *gin.Context) {
	// Check if license is valid
	isValid, err := h.licenseService.IsLicenseValid()
	if err != nil {
		response.InternalServerError(c, "Failed to check license validity: "+err.Error())
		return
	}

	// Get status string
	status, err := h.licenseService.GetLicenseStatus()
	if err != nil {
		response.InternalServerError(c, "Failed to get license status: "+err.Error())
		return
	}

	// Get expiry date
	expiryDate, err := h.licenseService.GetExpiryDate()
	if err != nil {
		response.InternalServerError(c, "Failed to get expiry date: "+err.Error())
		return
	}

	// Get max users
	maxUsers, err := h.licenseService.GetMaxUsers()
	if err != nil {
		response.InternalServerError(c, "Failed to get max users: "+err.Error())
		return
	}

	// Get enabled features
	features, err := h.licenseService.GetFeatures()
	if err != nil {
		response.InternalServerError(c, "Failed to get features: "+err.Error())
		return
	}

	// Extract feature names
	featureNames := make([]string, 0)
	if features != nil {
		for _, feature := range features {
			if name, ok := feature["name"].(string); ok {
				featureNames = append(featureNames, name)
			}
		}
	}

	response.Success(c, http.StatusOK, gin.H{
		"valid":       isValid,
		"status":      status,
		"expiry_date": expiryDate,
		"max_users":   maxUsers,
		"features":    featureNames,
	})
}

// CheckFeature checks if a specific feature is enabled
// @Summary Check feature availability
// @Description Check if a specific feature is enabled in the current license
// @Tags License
// @Produce json
// @Param feature query string true "Feature name to check"
// @Success 200 {object} response.Response "Feature status retrieved"
// @Failure 400 {object} response.Response "Invalid request"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/feature [get]
func (h *LicenseHandler) CheckFeature(c *gin.Context) {
	featureName := c.Query("feature")
	if featureName == "" {
		response.BadRequest(c, "feature query parameter is required")
		return
	}

	// Check if feature is available
	hasFeature, err := h.licenseService.HasFeature(featureName)
	if err != nil {
		response.InternalServerError(c, "Failed to check feature: "+err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"feature": featureName,
		"enabled": hasFeature,
	})
}

// GetFeatures returns all enabled features
// @Summary Get enabled features
// @Description Get all features enabled in the current license
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "Features retrieved"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/features [get]
func (h *LicenseHandler) GetFeatures(c *gin.Context) {
	// Get features
	features, err := h.licenseService.GetFeatures()
	if err != nil {
		response.InternalServerError(c, "Failed to get features: "+err.Error())
		return
	}

	// Extract feature names for simple response
	featureNames := make([]string, 0)
	if features != nil {
		for _, feature := range features {
			if name, ok := feature["name"].(string); ok {
				featureNames = append(featureNames, name)
			}
		}
	}

	response.Success(c, http.StatusOK, gin.H{
		"features": featureNames,
		"count":    len(featureNames),
	})
}

// RefreshLicenseCache forces a refresh of the cached license
// @Summary Refresh license cache
// @Description Force an immediate refresh of the license verification cache
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "Cache refreshed successfully"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/refresh [post]
func (h *LicenseHandler) RefreshLicenseCache(c *gin.Context) {
	// Force verification (bypass cache)
	result, err := h.licenseService.VerifyLicenseWithForce()
	if err != nil {
		response.InternalServerError(c, "Failed to refresh license: "+err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"valid":       result.IsValid,
		"expiry_date": result.ExpiryDate,
		"cached_at":   result.CachedAt,
		"message":     "License cache refreshed successfully",
	})
}

// GetMaxUsers returns the maximum number of users allowed
// @Summary Get user limit
// @Description Get the maximum number of users allowed by the license
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "Max users retrieved"
// @Failure 500 {object} response.Response "Server error"
// @Router /license/max-users [get]
func (h *LicenseHandler) GetMaxUsers(c *gin.Context) {
	maxUsers, err := h.licenseService.GetMaxUsers()
	if err != nil {
		response.InternalServerError(c, "Failed to get max users: "+err.Error())
		return
	}

	response.Success(c, http.StatusOK, gin.H{
		"max_users": maxUsers,
		"unlimited": maxUsers == 0,
	})
}

// HealthCheck checks the license system health
// @Summary License system health check
// @Description Check if the license system is functioning correctly
// @Tags License
// @Produce json
// @Success 200 {object} response.Response "License system is healthy"
// @Failure 500 {object} response.Response "License system is unhealthy"
// @Router /license/health [get]
func (h *LicenseHandler) HealthCheck(c *gin.Context) {
	// Check if license is valid
	isValid, err := h.licenseService.IsLicenseValid()

	healthStatus := "unhealthy"
	httpCode := http.StatusInternalServerError

	if err == nil && isValid {
		healthStatus = "healthy"
		httpCode = http.StatusOK
	}

	response.Success(c, httpCode, gin.H{
		"status": healthStatus,
		"valid":  isValid,
		"error":  nil,
	})

	if err != nil {
		response.InternalServerError(c, "License health check failed: "+err.Error())
	}
}
