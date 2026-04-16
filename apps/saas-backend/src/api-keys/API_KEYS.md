# API Key Authentication Documentation

## Overview

The API Key Authentication system provides secure authentication for external services (like the Go Gin backend) to communicate with the NestJS SaaS backend. API keys are associated with specific institutes and can be scoped to limit permissions.

## Key Features

✅ **Secure Key Generation** - Generate cryptographically secure API keys with UUID-based format
✅ **Scope-Based Access Control** - Define fine-grained permissions per key
✅ **Rate Limiting** - Enforce request limits to prevent abuse
✅ **Usage Tracking** - Monitor key usage and last-used timestamps
✅ **Key Expiration** - Automatically expire keys on specified dates
✅ **Key Rotation** - Revoke and regenerate keys as needed
✅ **Audit Trail** - Track all API key operations

## API Key Format

API keys follow this format:

```
FLCN_<32-character-hex-string>
```

Example:
```
FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Important:** API keys are only shown once when created. Store them securely - they cannot be retrieved later.

## Available Scopes

Scopes define what actions an API key can perform:

| Scope | Description | Use Case |
|-------|-------------|----------|
| `read:licenses` | Read license information | Verify licenses, check features |
| `write:licenses` | Create and modify licenses | Issue, suspend, revoke licenses |
| `read:analytics` | Read analytics data | Query usage statistics |
| `write:analytics` | Submit analytics events | Log usage metrics |
| `read:features` | Read feature flags | Check available features |
| `write:features` | Manage feature flags | Enable/disable features |
| `read:customers` | Read customer data | Query customer info |
| `write:customers` | Modify customer data | Update customer profiles |

## API Endpoints

### Create API Key

**Endpoint:** `POST /api/v1/api-keys`

Creates a new API key for an institute.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/api-keys?instituteId=<institute-id> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Gin Backend",
    "scopes": ["read:licenses", "read:features"],
    "rateLimit": 5000,
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "instituteId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Production Gin Backend",
  "scopes": ["read:licenses", "read:features"],
  "rateLimit": 5000,
  "key": "FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "expiresAt": "2025-12-31T23:59:59Z",
  "createdAt": "2024-04-14T10:30:00Z",
  "warning": "Save this key securely. You will not be able to see it again!"
}
```

**Query Parameters:**
- `instituteId` (required) - UUID of the institute

**Request Body:**
- `name` (optional) - Display name for the key
- `scopes` (optional) - Array of scopes (defaults to `["read:licenses", "read:features"]`)
- `rateLimit` (optional) - Requests per hour (min: 10, max: 100000, default: 1000)
- `expiresAt` (optional) - ISO 8601 expiration date

### List API Keys

**Endpoint:** `GET /api/v1/api-keys`

List all API keys for an institute.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/api-keys?instituteId=<institute-id>&page=1&limit=10"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "instituteId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Production Gin Backend",
      "scopes": ["read:licenses", "read:features"],
      "rateLimit": 5000,
      "keyPreview": "a1b2c3d4...",
      "lastUsedAt": "2024-04-14T12:15:30Z",
      "totalRequests": 2450,
      "isActive": true,
      "expiresAt": "2025-12-31T23:59:59Z",
      "createdAt": "2024-04-14T10:30:00Z",
      "updatedAt": "2024-04-14T10:30:00Z"
    }
  ],
  "total": 1
}
```

**Query Parameters:**
- `instituteId` (required) - UUID of the institute
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10, max: 100)

### Get Specific API Key

**Endpoint:** `GET /api/v1/api-keys/:keyId`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000?instituteId=<institute-id>"
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "instituteId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Production Gin Backend",
  "scopes": ["read:licenses", "read:features"],
  "rateLimit": 5000,
  "keyPreview": "a1b2c3d4...",
  "lastUsedAt": "2024-04-14T12:15:30Z",
  "totalRequests": 2450,
  "isActive": true,
  "expiresAt": "2025-12-31T23:59:59Z",
  "createdAt": "2024-04-14T10:30:00Z",
  "updatedAt": "2024-04-14T10:30:00Z"
}
```

### Update API Key

**Endpoint:** `PUT /api/v1/api-keys/:keyId`

Update key properties (but not the key itself).

**Request:**
```bash
curl -X PUT "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000?instituteId=<institute-id>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Production Key",
    "scopes": ["read:licenses"],
    "rateLimit": 2000,
    "expiresAt": "2025-06-30T23:59:59Z"
  }'
```

**Response (200 OK):** Updated ApiKeyDetailDto

### Disable API Key

**Endpoint:** `PATCH /api/v1/api-keys/:keyId/disable`

Temporarily disable a key without deleting it.

**Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000/disable?instituteId=<institute-id>"
```

**Response (200 OK):** ApiKeyDetailDto with `isActive: false`

### Enable API Key

**Endpoint:** `PATCH /api/v1/api-keys/:keyId/enable`

Re-enable a previously disabled key.

**Request:**
```bash
curl -X PATCH "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000/enable?instituteId=<institute-id>"
```

**Response (200 OK):** ApiKeyDetailDto with `isActive: true`

### Delete API Key

**Endpoint:** `DELETE /api/v1/api-keys/:keyId`

Permanently delete a key.

**Request:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000?instituteId=<institute-id>"
```

**Response (204 No Content)**

### Get API Key Statistics

**Endpoint:** `GET /api/v1/api-keys/:keyId/stats`

Get usage statistics for a key.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/api-keys/550e8400-e29b-41d4-a716-446655440000/stats?instituteId=<institute-id>"
```

**Response (200 OK):**
```json
{
  "totalRequests": 2450,
  "lastUsedAt": "2024-04-14T12:15:30Z",
  "requestsThisHour": 450
}
```

### Validate API Key

**Endpoint:** `POST /api/v1/api-keys/validate`

**PUBLIC ENDPOINT** - Validate an API key without authentication.

Used by external services (e.g., Gin backend) to verify a key.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/api-keys/validate \
  -H "Content-Type: application/json" \
  -d '{
    "key": "FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  }'
```

**Response (200 OK):**
```json
{
  "isValid": true,
  "keyId": "550e8400-e29b-41d4-a716-446655440000",
  "instituteId": "550e8400-e29b-41d4-a716-446655440001",
  "scopes": ["read:licenses", "read:features"],
  "rateLimit": 5000,
  "remainingRequests": 4550,
  "expiresAt": "2025-12-31T23:59:59Z",
  "message": "API key is valid"
}
```

**Invalid Key Response (200 OK):**
```json
{
  "isValid": false,
  "message": "Invalid API key"
}
```

## Using API Keys to Authenticate Requests

### Header Format

Include your API key in the `Authorization` header:

**Option 1: Bearer token format**
```
Authorization: Bearer FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Option 2: Direct key**
```
Authorization: FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Example Request

Verify a license using an API key:

```bash
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -d '{
    "licenseKey": "TEST-PERPETUAL-001"
  }'
```

### Endpoint Protection

Endpoints are protected with `@UseGuards(ApiKeyGuard)` decorator. The guard:

1. Extracts the API key from the `Authorization` header
2. Validates the key exists and is active
3. Checks if the key has expired
4. Updates usage statistics
5. Verifies required scopes (if specified with `@RequiredScopes()`)
6. Attaches key details to the request for downstream use

## Integration with Go Gin Backend

The Go Gin backend can authenticate with the NestJS backend using API keys.

### Setup Steps

1. **Create an API key for Gin backend:**

```bash
curl -X POST http://localhost:3000/api/v1/api-keys?instituteId=<your-institute-id> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gin Backend Production",
    "scopes": ["read:licenses", "read:features"],
    "rateLimit": 10000,
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

Save the returned `key` value.

2. **Configure Gin backend environment:**

```bash
# In your Gin backend .env file
LICENSE_API_URL=http://localhost:3000
LICENSE_API_KEY=FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

3. **Make authenticated requests from Gin:**

```go
package main

import (
  "fmt"
  "io"
  "net/http"
  "os"
)

func verifyLicense(licenseKey string) {
  apiURL := os.Getenv("LICENSE_API_URL")
  apiKey := os.Getenv("LICENSE_API_KEY")

  client := &http.Client{}
  req, _ := http.NewRequest("POST", 
    fmt.Sprintf("%s/api/v1/licenses/verify", apiURL),
    nil,
  )
  req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", apiKey))
  req.Header.Add("Content-Type", "application/json")
  req.Body = io.NopCloser(strings.NewReader(`{"licenseKey":"` + licenseKey + `"}`))

  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)
  fmt.Println(string(body))
}
```

## Security Best Practices

### 1. Never Share Keys

- API keys are credentials - treat them like passwords
- Don't commit keys to version control
- Don't expose keys in logs or error messages

### 2. Use Environment Variables

```bash
# ✅ Good
API_KEY=${LICENSE_API_KEY}

# ❌ Bad
API_KEY="FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### 3. Scope Keys Appropriately

Create separate keys with minimal required scopes:

```bash
# ❌ Bad - too permissive
scopes: ["read:*", "write:*"]

# ✅ Good - minimal required
scopes: ["read:licenses", "read:features"]
```

### 4. Rotate Keys Regularly

1. Create a new key with same scopes
2. Update client configuration with new key
3. Verify new key is working
4. Disable old key
5. After stabilization period, delete old key

### 5. Monitor Key Usage

Check usage statistics regularly:

```bash
curl -X GET "http://localhost:3000/api/v1/api-keys/<key-id>/stats?instituteId=<institute-id>"
```

Look for:
- Unexpected spikes in request count
- Keys that haven't been used recently
- Keys nearing their rate limit

### 6. Set Expiration Dates

Always set expiration dates for temporary access:

```bash
curl -X POST http://localhost:3000/api/v1/api-keys \
  -d '{
    "name": "Temporary Integration",
    "expiresAt": "2024-05-01T23:59:59Z"
  }'
```

### 7. Disable Before Deleting

For critical integrations, disable keys first to monitor impact:

```bash
# Disable
curl -X PATCH http://localhost:3000/api/v1/api-keys/<id>/disable

# After verification period
curl -X DELETE http://localhost:3000/api/v1/api-keys/<id>
```

## Error Handling

### Invalid API Key

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid API key",
  "error": "Unauthorized"
}
```

### Expired API Key

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "API key has expired",
  "error": "Unauthorized"
}
```

### Missing Required Scope

**Response (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "API key missing required scopes: write:licenses",
  "error": "Forbidden"
}
```

### Rate Limit Exceeded

**Response (429 Too Many Requests):**
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests"
}
```

## Testing

### Test Key Creation

```bash
#!/bin/bash

INSTITUTE_ID="550e8400-e29b-41d4-a716-446655440001"

# Create test key
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/api-keys?instituteId=$INSTITUTE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Key",
    "scopes": ["read:licenses", "read:features"],
    "rateLimit": 100,
    "expiresAt": "2025-12-31T23:59:59Z"
  }')

echo "Create Response:"
echo $RESPONSE | jq .

# Extract key
TEST_KEY=$(echo $RESPONSE | jq -r '.key')
echo "Test Key: $TEST_KEY"
```

### Test Key Validation

```bash
#!/bin/bash

TEST_KEY="FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# Validate key
curl -X POST http://localhost:3000/api/v1/api-keys/validate \
  -H "Content-Type: application/json" \
  -d "{\"key\": \"$TEST_KEY\"}" | jq .
```

### Test Protected Endpoint

```bash
#!/bin/bash

TEST_KEY="FLCN_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

# List licenses with API key
curl -X GET "http://localhost:3000/api/v1/licenses" \
  -H "Authorization: Bearer $TEST_KEY" | jq .
```

## Rate Limiting

Each API key has a `rateLimit` property (requests per hour).

**Current Implementation:**
- Rate limit is tracked in the database
- `totalRequests` counter increments with each request
- `requestsThisHour` = `totalRequests % rateLimit`

**Future Enhancement:**
- Integrate with Redis for strict hourly windows
- Implement token bucket algorithm
- Add `X-RateLimit-*` headers to responses

## Monitoring & Alerting

### Metrics to Track

- **Total API key requests** - Aggregate usage
- **Key creation rate** - Monitor for suspicious activity
- **Expired keys** - Alert on expiring soon
- **Failed validations** - Detect invalid/revoked keys
- **Rate limit breaches** - Identify abuse

### Recommended Alerts

1. Key nearing expiration (7 days before)
2. Unexpected spike in failed validations
3. Key approaching rate limit (80%+ usage)
4. Multiple failed validations from same IP
5. API key created outside business hours

## Troubleshooting

### "Invalid API key" error

**Causes:**
- Key is misspelled
- Key has been deleted
- Key is from a different environment

**Solution:**
1. Verify key format starts with `FLCN_`
2. Check key hasn't expired
3. Verify in correct environment
4. Re-generate key if uncertain

### "API key has expired" error

**Causes:**
- Key's `expiresAt` date has passed
- Key was explicitly disabled

**Solution:**
1. Check `expiresAt` timestamp
2. Create new key with future expiration
3. Re-enable if disabled: `PATCH /api-keys/:id/enable`

### "Missing required scopes" error

**Causes:**
- Endpoint requires scopes not granted to key
- Scopes list doesn't include required permission

**Solution:**
1. Update key scopes: `PUT /api-keys/:id`
2. Add missing scopes to array
3. Test with updated key

### Rate limit exceeded

**Causes:**
- Too many requests in current hour
- Rate limit too low for use case

**Solution:**
1. Wait for hour window to reset
2. Increase `rateLimit` via `PUT /api-keys/:id`
3. Optimize client to batch requests

## API Key Database Schema

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  instituteId UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  keyHash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  scopes TEXT[] DEFAULT '{}',
  rateLimit INTEGER DEFAULT 1000,
  lastUsedAt TIMESTAMP,
  totalRequests INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  expiresAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_institute ON api_keys(instituteId);
CREATE INDEX idx_api_keys_hash ON api_keys(keyHash);
CREATE INDEX idx_api_keys_active ON api_keys(isActive);
```

## API Key Lifecycle Diagram

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  CREATE KEY                                        │
│  ├─ Generate FLCN_xxx format                       │
│  ├─ Hash with SHA-256                              │
│  ├─ Store in database                              │
│  └─ Return raw key (shown once)                    │
│       ↓                                              │
│  ACTIVE STATE                                      │
│  ├─ Accept requests with this key                 │
│  ├─ Track usage (totalRequests++)                 │
│  ├─ Update lastUsedAt timestamp                   │
│  └─ Check against rateLimit                        │
│       ↓                                              │
│  ┌─────────────────────────────────────┐           │
│  │  EXPIRED or DISABLED                 │           │
│  │  (if expiresAt < NOW or !isActive)   │           │
│  │  └─ Reject all requests              │           │
│  └─────────────────────────────────────┘           │
│       ↓                                              │
│  DELETE KEY                                        │
│  └─ Permanently remove from database               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-04-14 | Initial API key authentication system |

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review integration examples
3. Check logs in `/var/log/nestjs/`
4. Contact backend team

---

**Last Updated:** 2024-04-14
**Status:** Production Ready
**Author:** Backend Team
