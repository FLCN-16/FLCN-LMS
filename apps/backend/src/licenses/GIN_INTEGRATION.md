# Gin Backend Integration Guide

This document provides step-by-step instructions for integrating the License API with the Gin backend.

## Overview

The Gin backend needs to:
1. Call `/api/v1/licenses/verify` endpoint on startup and periodically
2. Call `/api/v1/licenses/check-feature` before allowing feature access
3. Cache verification results locally
4. Handle verification failures gracefully

## Step 1: Update Environment Configuration

Add these environment variables to `apps/lms-gin/.env`:

```env
# License API Configuration
LICENSE_API_URL=http://localhost:3000
LICENSE_KEY=TEST-PERPETUAL-001
LICENSE_VERIFY_INTERVAL=24h
```

## Step 2: Update License Client

The Gin backend already has `internal/license/client.go`. Ensure it's using the correct endpoint:

```go
func (c *Client) getLicenseVerifyURL() string {
    return fmt.Sprintf("%s/api/v1/licenses/verify", c.apiURL)
}

func (c *Client) getCheckFeatureURL() string {
    return fmt.Sprintf("%s/api/v1/licenses/check-feature", c.apiURL)
}
```

## Step 3: Update License Service

In `internal/service/license_service.go`, ensure caching is working:

```go
// On startup
if err := licenseService.LoadCacheFromDatabase(); err != nil {
    log.Printf("Warning: Failed to load cached license: %v", err)
}

// Verify with NestJS backend
resp, err := licenseClient.VerifyLicense(cfg.LicenseKey)
if err != nil {
    log.Printf("Error verifying license: %v", err)
}
```

## Step 4: Feature Checking in Handlers

Before allowing feature access in any handler, check the license:

```go
// Example: Before allowing live sessions
enableLiveSessions, err := licenseService.HasFeature("live_sessions")
if err != nil || !enableLiveSessions {
    c.JSON(403, gin.H{
        "success": false,
        "error": "Feature not available in your license",
    })
    return
}

// Proceed with live session logic
```

## Step 5: Background Verification

The license verification cron job in `internal/cron/license_verifier.go` should:
1. Run periodically (every 24 hours by default)
2. Call verify endpoint
3. Update cache with new data
4. Log any failures but not crash

```go
// In main.go
licenseVerifier := cron.NewLicenseVerifier(licenseService, cfg.LicenseVerifyInterval)
if err := licenseVerifier.Start(); err != nil {
    log.Fatalf("Failed to start license verifier: %v", err)
}

// Handle graceful shutdown
handleGracefulShutdown(licenseVerifier)
```

## Step 6: Testing

### Create Test License in NestJS

```bash
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "organizationName": "Gin Backend Test",
    "licenseKey": "GIN-TEST-001",
    "expiryDate": "2025-12-31T23:59:59Z",
    "features": [
      {"name": "live_sessions", "enabled": true, "limit": 1000},
      {"name": "advanced_analytics", "enabled": true}
    ],
    "maxUsers": 10000
  }'
```

### Update Gin Environment

```env
LICENSE_API_URL=http://localhost:3000
LICENSE_KEY=GIN-TEST-001
```

### Start Gin Backend

```bash
cd apps/lms-gin
make dev
```

### Check Logs

Look for:
```
[Main] License verification cron job started
[License Service] ✓ Loaded valid license from database cache
[License Service] License verified: GIN-TEST-001
```

### Test Feature Availability

```bash
# This should work if license has feature enabled
curl http://localhost:8080/api/v1/live-sessions

# Logs should show feature check passed
```

## Step 7: Handling Network Failures

The Gin backend should gracefully handle NestJS backend unavailability:

```go
// Verify with retry
resp, err := licenseClient.VerifyLicenseWithRetry(cfg.LicenseKey, 3)
if err != nil {
    log.Printf("Warning: License verification failed: %v", err)
    
    // Use cached license
    if cachedLicense := licenseService.GetCachedLicense(); cachedLicense != nil {
        log.Printf("Using cached license from %s", cachedLicense.CachedAt)
    } else {
        log.Fatalf("No cache available, cannot start without license")
    }
}
```

## Step 8: Monitoring

Monitor these aspects:
1. **Verification Success Rate**: Should be > 99%
2. **Cache Hit Rate**: Should be > 90% (rest are background refreshes)
3. **Feature Check Latency**: Should be < 10ms (from cache)
4. **License Expiry Date**: Alert 30 days before expiration

## Common Issues

### Issue: License verification fails on startup

**Symptoms:**
- Backend starts but shows license verification errors
- License service shows "Connection refused"

**Solution:**
1. Verify NestJS backend is running:
   ```bash
   curl http://localhost:3000/health
   ```
2. Check LICENSE_API_URL environment variable
3. Verify network connectivity between containers
4. Check database has test licenses

### Issue: Feature check always returns disabled

**Symptoms:**
- Even valid licenses show features as disabled
- `HasFeature()` always returns false

**Solution:**
1. Verify license was created with features enabled
2. Check features JSON structure in database
3. Verify feature name matches exactly (case-sensitive)
4. Clear cache and restart:
   ```go
   licenseService.ClearCache()
   ```

### Issue: Cached license never expires

**Symptoms:**
- Licenses still valid after expiry date
- Suspension/revocation not reflected in Gin backend

**Solution:**
1. Verify cache TTL from response
2. Check last update timestamp
3. Manually restart Gin backend to refresh
4. Implement cache invalidation on NestJS backend

## Integration Examples

### Example 1: Verify License on Startup

```go
// In main.go
func init() {
    licenseService := service.NewLicenseService(db.DB, licenseClient, cfg.LicenseKey)
    
    // Try to load from cache
    if err := licenseService.LoadCacheFromDatabase(); err != nil {
        log.Println("No cached license found")
    }
    
    // Verify with server
    valid, err := licenseService.IsLicenseValid()
    if !valid {
        log.Fatalf("License is not valid: %v", err)
    }
    
    log.Println("✓ License verified successfully")
}
```

### Example 2: Check Feature Before Allowing Access

```go
// In handlers/live_session.go
func (h *LiveSessionHandler) StartLiveSession(c *gin.Context) {
    // Check license
    enabled, err := licenseService.HasFeature("live_sessions")
    if err != nil {
        log.Printf("Error checking license: %v", err)
        c.JSON(503, gin.H{
            "success": false,
            "error": "License verification service unavailable",
        })
        return
    }
    
    if !enabled {
        c.JSON(403, gin.H{
            "success": false,
            "error": "Live sessions not available in your license",
        })
        return
    }
    
    // Proceed with creating live session
    // ...
}
```

### Example 3: Handling License Expiry

```go
// In handlers/dashboard.go
func (h *DashboardHandler) GetStatus(c *gin.Context) {
    status, err := licenseService.GetLicenseStatus()
    if err != nil {
        log.Printf("Error getting status: %v", err)
    }
    
    c.JSON(200, gin.H{
        "success": true,
        "license_status": status,
        "features": getEnabledFeatures(),
    })
}

func getEnabledFeatures() map[string]bool {
    features := make(map[string]bool)
    
    featureNames := []string{"live_sessions", "advanced_analytics", "api_access"}
    for _, name := range featureNames {
        enabled, _ := licenseService.HasFeature(name)
        features[name] = enabled
    }
    
    return features
}
```

## Environment Variables Checklist

- [ ] LICENSE_API_URL points to NestJS backend
- [ ] LICENSE_KEY matches created test license
- [ ] LICENSE_VERIFY_INTERVAL is set (e.g., 24h)
- [ ] DATABASE_URL for caching (same as before)
- [ ] JWT_SECRET matches if needed for API calls

## Testing Checklist

- [ ] NestJS backend started and healthy
- [ ] Test license created with `TEST-PERPETUAL-001` or custom key
- [ ] Gin backend environment variables updated
- [ ] Gin backend starts without errors
- [ ] License verification completes on startup
- [ ] Feature check endpoint responds correctly
- [ ] Cache is persisted to database
- [ ] Cron job runs periodically without errors

## Support

For issues:
1. Check logs in both NestJS and Gin backends
2. Verify network connectivity between services
3. Check database for license data
4. See [SETUP.md](./SETUP.md) for troubleshooting

