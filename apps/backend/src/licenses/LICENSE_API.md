# License Management API Documentation

## Overview

The License Management API provides comprehensive endpoints for license verification, issuance, and management in the FLCN-LMS system. This API is designed to support both the NestJS backend administration interface and integration with the Gin backend for runtime license verification.

**Base URL:** `/api/v1`

**Environment:** Supports multiple deployment scenarios:
- **Public verification** (for Gin backend): License verification endpoints are public
- **Admin management** (for dashboard): License issuance and management require authentication

---

## Architecture

### License Flow

```
Gin Backend (Go)
    ↓
License Verification Request
    ↓
NestJS Backend License API (/api/v1/licenses/verify)
    ↓
License Service (TypeORM + PostgreSQL)
    ↓
License Response (with Features & Cache TTL)
    ↓
Gin Backend Cache
```

### Database Schema

**Table:** `licenses` (Master Database)

```sql
- id (UUID, Primary Key)
- license_key (VARCHAR, Unique)
- organization_name (VARCHAR)
- status (ENUM: active, expired, invalid, suspended, pending)
- is_valid (BOOLEAN)
- expiry_date (TIMESTAMP, nullable)
- features (JSONB: Array of {name, enabled, limit?})
- max_users (BIGINT)
- plan_id (UUID, Foreign Key to plans, nullable)
- institute_id (UUID, Foreign Key to institutes, nullable)
- issued_by_id (UUID, Foreign Key to super_admins, nullable)
- notes (TEXT, nullable)
- last_verified_at (TIMESTAMP, nullable)
- verification_count (BIGINT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## Authentication

### Public Endpoints (No Auth Required)
- `POST /licenses/verify` - License verification
- `POST /licenses/check-feature` - Feature availability check

### Protected Endpoints (Admin/Super Admin Only)
- All other endpoints require Bearer token authentication
- Token should be included in `Authorization` header: `Bearer <JWT_TOKEN>`

**Example:**
```bash
curl -X GET http://localhost:3000/api/v1/licenses \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## API Endpoints

### 1. Verify License

**Endpoint:** `POST /licenses/verify`

**Authentication:** Public (No token required)

**Purpose:** Verify a license key and retrieve its validity status, expiry date, and features. Used by Gin backend for runtime verification.

**Request Body:**
```json
{
  "licenseKey": "LIC-2024-ABC123XYZ",
  "timestamp": 1703088000
}
```

**Parameters:**
- `licenseKey` (string, required): The license key to verify
- `timestamp` (number, optional): Unix timestamp for verification request

**Response (200 OK - Valid License):**
```json
{
  "valid": true,
  "status": "valid",
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 100
    },
    {
      "name": "advanced_analytics",
      "enabled": true,
      "limit": null
    },
    {
      "name": "api_access",
      "enabled": false
    }
  ],
  "cacheTTL": 86400,
  "message": "License verified successfully"
}
```

**Response (200 OK - Invalid/Expired License):**
```json
{
  "valid": false,
  "status": "expired",
  "expiryDate": "2024-01-15T23:59:59Z",
  "message": "License has expired"
}
```

**Response (200 OK - License Not Found):**
```json
{
  "valid": false,
  "status": "invalid",
  "message": "License key not found"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid license key format
- `500 Internal Server Error`: Database connection error

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "LIC-2024-ABC123XYZ",
    "timestamp": 1703088000
  }'
```

---

### 2. Check Feature

**Endpoint:** `POST /licenses/check-feature`

**Authentication:** Public (No token required)

**Purpose:** Check if a specific feature is enabled for a given license. Used by Gin backend to control feature availability at runtime.

**Request Body:**
```json
{
  "licenseKey": "LIC-2024-ABC123XYZ",
  "featureName": "live_sessions"
}
```

**Parameters:**
- `licenseKey` (string, required): The license key to check
- `featureName` (string, required): Name of the feature (e.g., "live_sessions", "advanced_analytics")

**Response (200 OK - Feature Enabled):**
```json
{
  "enabled": true,
  "limit": 100,
  "message": "Feature 'live_sessions' is enabled"
}
```

**Response (200 OK - Feature Disabled):**
```json
{
  "enabled": false,
  "message": "Feature 'live_sessions' is disabled"
}
```

**Response (200 OK - Feature Not Found):**
```json
{
  "enabled": false,
  "message": "Feature 'api_access' not found in license"
}
```

**Response (200 OK - License Issues):**
```json
{
  "enabled": false,
  "message": "License is not valid"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "LIC-2024-ABC123XYZ",
    "featureName": "live_sessions"
  }'
```

---

### 3. Issue License

**Endpoint:** `POST /licenses/issue`

**Authentication:** Required (Super Admin)

**Purpose:** Create a new license for an organization or institute.

**Request Body:**
```json
{
  "organizationName": "Acme University",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "instituteId": "660e8400-e29b-41d4-a716-446655440000",
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 100
    },
    {
      "name": "advanced_analytics",
      "enabled": true
    }
  ],
  "maxUsers": 1000,
  "notes": "License for pilot program"
}
```

**Parameters:**
- `organizationName` (string, required): Name of the organization
- `licenseKey` (string, required): Unique license key
- `planId` (UUID, optional): Associated plan UUID
- `instituteId` (UUID, optional): Associated institute UUID
- `expiryDate` (ISO 8601 datetime, optional): License expiration date
- `features` (array, optional): Array of feature configurations
  - `name` (string): Feature name
  - `enabled` (boolean): Feature status
  - `limit` (number, optional): Usage limit for the feature
- `maxUsers` (number, optional): Maximum number of users allowed
- `notes` (string, optional): Internal notes

**Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "organizationName": "Acme University",
  "status": "active",
  "isValid": true,
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 100
    },
    {
      "name": "advanced_analytics",
      "enabled": true
    }
  ],
  "maxUsers": 1000,
  "lastVerifiedAt": "2024-01-15T10:30:00Z",
  "verificationCount": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: License key already exists
- `404 Not Found`: Plan or institute not found
- `401 Unauthorized`: Invalid authentication token

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "organizationName": "Acme University",
    "licenseKey": "LIC-2024-ABC123XYZ",
    "maxUsers": 1000
  }'
```

---

### 4. Get License by Key

**Endpoint:** `GET /licenses/key/:key`

**Authentication:** Required (Admin)

**Purpose:** Retrieve complete license information by license key.

**Path Parameters:**
- `key` (string, required): The license key

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "organizationName": "Acme University",
  "status": "active",
  "isValid": true,
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 100
    }
  ],
  "maxUsers": 1000,
  "lastVerifiedAt": "2024-01-15T10:30:00Z",
  "verificationCount": 127,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `404 Not Found`: License key not found

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/licenses/key/LIC-2024-ABC123XYZ \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 5. Get License by ID

**Endpoint:** `GET /licenses/:id`

**Authentication:** Required (Admin)

**Purpose:** Retrieve complete license information by license UUID.

**Path Parameters:**
- `id` (UUID, required): The license UUID

**Response:** Same as Get License by Key

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/licenses/770e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 6. Get License Features

**Endpoint:** `GET /licenses/:key/features`

**Authentication:** Required (Admin)

**Purpose:** Get all enabled features for a specific license.

**Path Parameters:**
- `key` (string, required): The license key

**Response (200 OK):**
```json
[
  {
    "name": "live_sessions",
    "enabled": true,
    "limit": 100
  },
  {
    "name": "advanced_analytics",
    "enabled": true
  }
]
```

**Error Responses:**
- `404 Not Found`: License not found
- `400 Bad Request`: License is not valid

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/licenses/LIC-2024-ABC123XYZ/features \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 7. Update License

**Endpoint:** `PUT /licenses/:id`

**Authentication:** Required (Admin)

**Purpose:** Update license properties (partial update supported).

**Path Parameters:**
- `id` (UUID, required): The license UUID

**Request Body (all fields optional):**
```json
{
  "organizationName": "Acme University Updated",
  "status": "suspended",
  "expiryDate": "2026-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 150
    }
  ],
  "maxUsers": 2000,
  "notes": "Updated license configuration"
}
```

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "organizationName": "Acme University Updated",
  "status": "suspended",
  "isValid": false,
  "expiryDate": "2026-12-31T23:59:59Z",
  "features": [
    {
      "name": "live_sessions",
      "enabled": true,
      "limit": 150
    }
  ],
  "maxUsers": 2000,
  "lastVerifiedAt": "2024-01-15T10:30:00Z",
  "verificationCount": 127,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

**Error Responses:**
- `404 Not Found`: License not found

**Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/v1/licenses/770e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "status": "suspended"
  }'
```

---

### 8. Suspend License

**Endpoint:** `PATCH /licenses/:id/suspend`

**Authentication:** Required (Admin)

**Purpose:** Temporarily disable a license (mark as suspended).

**Path Parameters:**
- `id` (UUID, required): The license UUID

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "organizationName": "Acme University",
  "status": "suspended",
  "isValid": false,
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [...],
  "maxUsers": 1000,
  "lastVerifiedAt": "2024-01-15T10:30:00Z",
  "verificationCount": 127,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:50:00Z"
}
```

**Example cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/licenses/770e8400-e29b-41d4-a716-446655440000/suspend \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 9. Reactivate License

**Endpoint:** `PATCH /licenses/:id/reactivate`

**Authentication:** Required (Admin)

**Purpose:** Restore a suspended license (if not expired).

**Path Parameters:**
- `id` (UUID, required): The license UUID

**Response (200 OK):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "organizationName": "Acme University",
  "status": "active",
  "isValid": true,
  "expiryDate": "2025-12-31T23:59:59Z",
  "features": [...],
  "maxUsers": 1000,
  "lastVerifiedAt": "2024-01-15T10:30:00Z",
  "verificationCount": 127,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:55:00Z"
}
```

**Example cURL:**
```bash
curl -X PATCH http://localhost:3000/api/v1/licenses/770e8400-e29b-41d4-a716-446655440000/reactivate \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 10. Revoke License

**Endpoint:** `DELETE /licenses/:id`

**Authentication:** Required (Admin)

**Purpose:** Permanently invalidate a license.

**Path Parameters:**
- `id` (UUID, required): The license UUID

**Response (200 OK):**
```json
{
  "message": "License revoked successfully",
  "licenseKey": "LIC-2024-ABC123XYZ",
  "revokedAt": "2024-01-15T12:00:00Z"
}
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:3000/api/v1/licenses/770e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 11. List Licenses

**Endpoint:** `GET /licenses`

**Authentication:** Required (Admin)

**Purpose:** Retrieve paginated list of licenses with optional filtering.

**Query Parameters:**
- `skip` (number, default: 0): Number of records to skip for pagination
- `take` (number, default: 10): Number of records to return
- `search` (string, optional): Search by organization name (partial match)
- `status` (string, optional): Filter by status (active, suspended, invalid, expired, pending)
- `isValid` (boolean, optional): Filter by validity
- `instituteId` (UUID, optional): Filter by associated institute
- `planId` (UUID, optional): Filter by associated plan

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "licenseKey": "LIC-2024-ABC123XYZ",
      "organizationName": "Acme University",
      "status": "active",
      "isValid": true,
      "expiryDate": "2025-12-31T23:59:59Z",
      "features": [...],
      "maxUsers": 1000,
      "lastVerifiedAt": "2024-01-15T10:30:00Z",
      "verificationCount": 127,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42,
  "skip": 0,
  "take": 10
}
```

**Example cURL:**
```bash
curl -X GET "http://localhost:3000/api/v1/licenses?skip=0&take=10&status=active&search=Acme" \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### 12. Get License Statistics

**Endpoint:** `GET /licenses/stats/summary`

**Authentication:** Required (Admin)

**Purpose:** Get aggregate statistics about all licenses in the system.

**Response (200 OK):**
```json
{
  "total": 42,
  "active": 35,
  "expired": 5,
  "suspended": 1,
  "invalid": 1
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/v1/licenses/stats/summary \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## License Status Lifecycle

```
PENDING → ACTIVE → EXPIRED
                ↓
              SUSPENDED → ACTIVE (reactivate if not expired)
                ↓
              INVALID (revoked/failed)
```

**Status Definitions:**
- **active**: License is valid and can be used
- **expired**: License has passed its expiry date
- **suspended**: License is temporarily disabled by admin
- **invalid**: License has been revoked or is otherwise unusable
- **pending**: License awaiting verification/activation

---

## Feature Configuration

Each license contains an array of features with the following structure:

```json
{
  "name": "feature_identifier",
  "enabled": true,
  "limit": 100
}
```

**Common Features:**
- `live_sessions`: Enable live class sessions
- `advanced_analytics`: Access advanced reporting and analytics
- `api_access`: Allow external API integration
- `custom_branding`: Enable white-label customization
- `sso_integration`: Allow single sign-on integration
- `bulk_operations`: Enable bulk import/export operations

---

## Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "License key already exists",
  "error": "Bad Request"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | License verified, feature found |
| 201 | Created | New license issued |
| 400 | Bad Request | Invalid license key format, duplicate key |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | License not found, plan not found |
| 500 | Server Error | Database connection error |

---

## Integration with Gin Backend

The Gin backend should:

1. **On Startup:**
   - Load cached license from database (already implemented)
   - Call `/licenses/verify` endpoint to validate

2. **Periodically (e.g., every 24 hours):**
   - Re-verify license using `/licenses/verify`
   - Update in-memory cache based on `cacheTTL` from response

3. **Before Feature Access:**
   - Call `/licenses/check-feature` endpoint
   - Check response `enabled` field before allowing access

4. **Graceful Degradation:**
   - If verification fails and cache exists: use cached data
   - If verification fails and no cache: deny access or use fallback mode

**Example Gin Integration:**

```go
// Check if feature is available
isEnabled, err := licenseClient.CheckFeature("live_sessions")
if err != nil {
  // Use cached value or deny
  return handleError(err)
}

if !isEnabled {
  return c.JSON(403, gin.H{
    "success": false,
    "error": "Feature not available in your license",
  })
}

// Proceed with feature logic
```

---

## Rate Limiting

Currently, no rate limiting is implemented on these endpoints. For production:

1. Implement rate limiting on `/licenses/verify` and `/licenses/check-feature`
2. Suggested limits: 100 requests per minute per license key
3. Implement request caching in Gin backend to reduce API calls

---

## Security Considerations

1. **Public vs. Protected Endpoints:**
   - `/verify` and `/check-feature` are public (required for Gin integration)
   - All other endpoints require authentication

2. **Data Exposure:**
   - License keys should not be logged in production
   - Features array contains no sensitive data
   - Expiry dates are public information

3. **Audit Trail:**
   - Track verification count for each license
   - Store last verification timestamp
   - Consider adding audit logging for state changes

4. **Validation:**
   - License key format validation (recommended: alphanumeric with hyphens)
   - Expiry date validation (cannot be in past for new licenses)
   - Feature name validation against known features

---

## Webhooks (Future Enhancement)

Consider implementing webhooks for:
- License expiry warnings (30 days before)
- License expiration events
- Verification failures
- Suspension/revocation events

---

## Caching Strategy

The API uses the following caching approach:

1. **Gin Backend Cache:**
   - In-memory cache of license verification responses
   - TTL from `cacheTTL` field (default: 86400 seconds = 24 hours)
   - Persists to database for recovery after restart

2. **NestJS Backend:**
   - No built-in caching (relies on Gin backend caching)
   - Could implement Redis caching for high-traffic scenarios

3. **Cache Invalidation:**
   - Automatic: Based on TTL expiry
   - Manual: Via update/suspend/revoke endpoints
   - Force refresh: Call verify endpoint with `timestamp` parameter

---

## Testing

### Manual Testing Commands

```bash
# Verify a license
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-LICENSE-KEY"}'

# Check a feature
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-LICENSE-KEY", "featureName": "live_sessions"}'

# Get stats
curl -X GET http://localhost:3000/api/v1/licenses/stats/summary \
  -H "Authorization: Bearer YOUR_TOKEN"

# List licenses
curl -X GET "http://localhost:3000/api/v1/licenses?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Migration Guide

### For Gin Backend

1. Update license client to use new endpoints:
   - Change verify endpoint URL if needed
   - Ensure feature check is implemented

2. Update configuration:
   - Add `LICENSE_API_URL` environment variable
   - Ensure JWT secret matches between backends

3. Update cron job:
   - Verify endpoint compatibility
   - Check cache persistence

### For NestJS Dashboard

1. Import `LicensesModule` (already done in app.module.ts)
2. Implement authentication guards
3. Build admin UI for license management

---

## Future Enhancements

1. **Multi-tenant Licensing:** Support different license levels per institute
2. **Usage Tracking:** Track actual feature usage against limits
3. **License Templates:** Pre-configured license packages
4. **Bulk Operations:** Batch issue/revoke licenses
5. **Advanced Reporting:** License expiry forecasts, usage analytics
6. **API Keys:** Alternative authentication for Gin backend
7. **License Transfer:** Move license between organizations
8. **Trial Licenses:** Auto-expiring trial periods

---

## Support

For issues or questions about the License API:
1. Check the API documentation above
2. Review error messages and status codes
3. Check logs for detailed error information
4. Contact backend team with license key and request details