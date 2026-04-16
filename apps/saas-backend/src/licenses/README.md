# License Management API - Quick Reference

## Overview

The License Management API provides endpoints for managing software licenses in the FLCN-LMS system. It's designed to work with the Gin backend for runtime license verification and with the NestJS dashboard for license administration.

**Base URL:** `/api/v1/licenses`

---

## Quick Start

### 1. Verify a License

```bash
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "LIC-2024-ABC123XYZ"}'
```

### 2. Check if Feature is Enabled

```bash
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "LIC-2024-ABC123XYZ",
    "featureName": "live_sessions"
  }'
```

### 3. Issue a New License (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "organizationName": "Acme University",
    "licenseKey": "LIC-2024-ABC123XYZ",
    "expiryDate": "2025-12-31T23:59:59Z",
    "features": [
      {"name": "live_sessions", "enabled": true, "limit": 100},
      {"name": "advanced_analytics", "enabled": true}
    ],
    "maxUsers": 1000
  }'
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/verify` | No | Verify license key validity |
| POST | `/check-feature` | No | Check if feature is enabled |
| GET | `/stats/summary` | Yes | Get license statistics |
| POST | `/issue` | Yes | Create new license |
| GET | `/key/:key` | Yes | Get license by key |
| GET | `/:id` | Yes | Get license by ID |
| GET | `/:key/features` | Yes | Get license features |
| PUT | `/:id` | Yes | Update license |
| PATCH | `/:id/suspend` | Yes | Suspend license |
| PATCH | `/:id/reactivate` | Yes | Reactivate license |
| DELETE | `/:id` | Yes | Revoke license |
| GET | `` (no suffix) | Yes | List licenses with filters |

---

## Common Use Cases

### Use Case 1: Gin Backend - Verify License on Startup

```go
// In main.go
licenseService := service.NewLicenseService(db.DB, licenseClient, cfg.LicenseKey)

// Load cached license from database
if err := licenseService.LoadCacheFromDatabase(); err != nil {
  log.Printf("Warning: Failed to load cached license: %v", err)
}

// Verify with NestJS backend
resp, err := licenseClient.VerifyLicense(cfg.LicenseKey)
if err != nil {
  log.Printf("Error verifying license: %v", err)
}
```

### Use Case 2: Gin Backend - Check Feature Before Allowing Access

```go
// In handler
enabled, err := licenseService.HasFeature("live_sessions")
if err != nil || !enabled {
  c.JSON(403, gin.H{
    "success": false,
    "error": "Feature not available in your license",
  })
  return
}

// Proceed with feature logic
```

### Use Case 3: Dashboard - List All Active Licenses

```bash
curl -X GET "http://localhost:3000/api/v1/licenses?status=active&skip=0&take=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Use Case 4: Dashboard - Suspend a License

```bash
curl -X PATCH http://localhost:3000/api/v1/licenses/LICENSE_ID/suspend \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Key Concepts

### License Status

- **active**: License is valid and usable
- **expired**: License has passed expiry date
- **suspended**: License temporarily disabled by admin
- **invalid**: License has been revoked
- **pending**: License awaiting verification

### Features

Each license contains an array of features:

```json
{
  "name": "live_sessions",
  "enabled": true,
  "limit": 100
}
```

**Common Features:**
- `live_sessions` - Enable live class sessions
- `advanced_analytics` - Access advanced reporting
- `api_access` - Allow external API integration
- `custom_branding` - Enable white-label customization
- `sso_integration` - Allow single sign-on

### Cache TTL

The verification response includes a `cacheTTL` field indicating how long the Gin backend should cache the result (default: 86400 seconds = 24 hours).

---

## Response Format

### Successful Verification (200 OK)

```json
{
  "valid": true,
  "status": "valid",
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [
    {"name": "live_sessions", "enabled": true, "limit": 100},
    {"name": "advanced_analytics", "enabled": true}
  ],
  "cacheTTL": 86400
}
```

### License Not Found (200 OK)

```json
{
  "valid": false,
  "status": "invalid",
  "message": "License key not found"
}
```

### License Expired (200 OK)

```json
{
  "valid": false,
  "status": "expired",
  "expiryDate": "2024-01-15T23:59:59Z",
  "message": "License has expired"
}
```

---

## Error Handling

| Status | Scenario | Example |
|--------|----------|---------|
| 200 | Any license check (valid or invalid) | Verification request, feature check |
| 201 | License created successfully | Issue endpoint |
| 400 | Invalid request, duplicate key | Duplicate license key |
| 401 | Unauthorized access | Missing/invalid JWT token |
| 404 | Resource not found | License/plan/institute not found |
| 500 | Server error | Database connection failure |

---

## Authentication

### Public Endpoints (No Token Required)
- `POST /verify`
- `POST /check-feature`

### Protected Endpoints (Bearer Token Required)
All other endpoints require authentication:

```bash
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Query Parameters for Filtering

Available on `GET /licenses` endpoint:

```bash
# Pagination
?skip=0&take=10

# Search by organization name
?search=Acme

# Filter by status
?status=active

# Filter by validity
?isValid=true

# Filter by institute
?instituteId=UUID

# Filter by plan
?planId=UUID
```

Example:
```bash
curl "http://localhost:3000/api/v1/licenses?status=active&skip=0&take=20" \
  -H "Authorization: Bearer TOKEN"
```

---

## Database

**Table:** `licenses` (Master Database)

**Key Columns:**
- `id` (UUID, Primary Key)
- `licenseKey` (VARCHAR, Unique)
- `organizationName` (VARCHAR)
- `status` (ENUM: active, expired, invalid, suspended, pending)
- `isValid` (BOOLEAN)
- `expiryDate` (TIMESTAMP)
- `features` (JSONB Array)
- `maxUsers` (BIGINT)
- `lastVerifiedAt` (TIMESTAMP)
- `verificationCount` (BIGINT)

---

## Testing

### Create Test License

```bash
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "organizationName": "Test Org",
    "licenseKey": "TEST-2024-001",
    "features": [
      {"name": "live_sessions", "enabled": true},
      {"name": "advanced_analytics", "enabled": true}
    ],
    "expiryDate": "2025-12-31T23:59:59Z",
    "maxUsers": 500
  }'
```

### Test Feature Availability

```bash
# Should return enabled: true
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-2024-001",
    "featureName": "live_sessions"
  }'
```

### Test License Suspension

```bash
# Get license ID from issue response, then suspend it
curl -X PATCH http://localhost:3000/api/v1/licenses/LICENSE_ID/suspend \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Verify License After Suspension

```bash
# Should return valid: false and status: suspended (handled by backend)
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-2024-001"}'
```

---

## Integration Files

- **API Documentation:** See `LICENSE_API.md` for detailed endpoint documentation
- **Setup Guide:** See `SETUP.md` for installation and configuration steps
- **Service:** `licenses.service.ts` - Business logic
- **Controller:** `licenses.controller.ts` - HTTP endpoints
- **DTOs:** `dto/verify-license.dto.ts` - Request/response types
- **Entity:** `../master-entities/license.entity.ts` - Database model

---

## Common Issues

### License not found even after creation
- Check spelling of license key (case-sensitive)
- Verify license status isn't 'invalid' or 'suspended'
- Query database: `SELECT * FROM licenses WHERE license_key = 'YOUR_KEY';`

### Features not showing
- Verify features array was provided during license creation
- Check JSON format: `[{"name": "...", "enabled": true}]`
- Query database: `SELECT features FROM licenses WHERE license_key = 'YOUR_KEY';`

### Authentication fails
- Check JWT token is valid and not expired
- Verify Authorization header format: `Bearer TOKEN`
- Ensure user has super admin role

### Gin backend can't verify
- Verify NestJS backend is running: `curl http://localhost:3000/health`
- Check LICENSE_API_URL environment variable
- Verify network connectivity between services

---

## Further Reading

- [Full API Documentation](./LICENSE_API.md)
- [Setup & Installation](./SETUP.md)
- [Database Schema](#database)
- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)

---

## Support

For issues or questions:
1. Check the troubleshooting section in [SETUP.md](./SETUP.md)
2. Review error responses and status codes
3. Check application logs for detailed error messages
4. Contact the backend team with license key and request details
