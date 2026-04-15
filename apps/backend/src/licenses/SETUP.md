# License API Setup and Integration Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Integration Steps](#integration-steps)
6. [Testing](#testing)
7. [Gin Backend Integration](#gin-backend-integration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Backend Requirements
- Node.js >= 18.x
- NestJS 11.x
- TypeORM 0.3.x
- PostgreSQL 12.x or higher
- pnpm package manager

### Database Requirements
- Master database connection configured
- PostgreSQL with UUID extension enabled
- Database user with CREATE TABLE privileges

### Other Requirements
- Git for version control
- Postman or cURL for API testing
- Access to environment configuration

---

## Installation

### Step 1: Verify Module Files

The following files have been created:

```
FLCN-LMS/apps/backend/src/
├── licenses/
│   ├── dto/
│   │   └── verify-license.dto.ts
│   ├── licenses.controller.ts
│   ├── licenses.module.ts
│   ├── licenses.service.ts
│   ├── LICENSE_API.md (API Documentation)
│   └── SETUP.md (This file)
└── master-entities/
    └── license.entity.ts
```

### Step 2: Install Dependencies

All required dependencies are already in `package.json`. Verify they are installed:

```bash
cd FLCN-LMS
pnpm install
```

### Step 3: Verify Imports

The app.module.ts has been updated with:
- License entity import
- LicensesModule import
- License route registration

---

## Database Setup

### Step 1: Create License Table

The `License` entity will be automatically created by TypeORM synchronization. However, for production databases, use migrations:

```bash
cd apps/backend
pnpm run build
```

### Step 2: Enable UUID Extension

Ensure UUID extension is enabled in PostgreSQL:

```sql
-- Connect to master database
\c your_master_database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extension
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
```

### Step 3: Verify Table Creation

After running the application, verify the license table exists:

```sql
-- Connect to master database
\c your_master_database

-- List tables
\dt licenses;

-- Describe table
\d licenses;
```

Expected table structure:

```sql
Table "public.licenses"
Column             |            Type             | Collation | Nullable | Default
-------------------+-----------------------------+-----------+----------+---------
id                 | uuid                        |           | not null | uuid_generate_v4()
licenseKey         | character varying(255)      |           | not null |
organizationName   | character varying(255)      |           | not null |
status             | license_status_enum         |           | not null | 'pending'
isValid            | boolean                     |           | not null | false
expiryDate         | timestamp without time zone |           |          |
features           | jsonb                       |           | not null | '[]'::jsonb
maxUsers           | bigint                      |           | not null | 0
planId             | uuid                        |           |          |
instituteId        | uuid                        |           |          |
issuedById         | uuid                        |           |          |
notes              | text                        |           |          |
lastVerifiedAt     | timestamp without time zone |           |          |
verificationCount  | bigint                      |           | not null | 0
createdAt          | timestamp without time zone |           | not null | now()
updatedAt          | timestamp without time zone |           | not null | now()
```

### Step 4: Create Indexes (Optional but Recommended)

```sql
-- Unique constraint on license key
CREATE UNIQUE INDEX idx_licenses_license_key ON licenses(licenseKey);

-- Performance indexes
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_institute_id ON licenses(instituteId);
CREATE INDEX idx_licenses_plan_id ON licenses(planId);
CREATE INDEX idx_licenses_is_valid ON licenses(isValid);
CREATE INDEX idx_licenses_expiry_date ON licenses(expiryDate);
```

---

## Environment Configuration

### Step 1: Update `.env` File

Add or verify the following environment variables:

```env
# Master Database (already configured)
MASTER_DATABASE_URL=postgresql://user:password@localhost:5432/master_db

# Or use individual parts:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=master_db

# JWT Configuration (for license API authentication)
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600

# Application Environment
NODE_ENV=development
APP_NAME=FLCN-LMS-Backend
```

### Step 2: Verify Database Connection

Test the database connection:

```bash
cd apps/backend
npx typeorm query "SELECT version();"
```

Expected output: PostgreSQL version information

### Step 3: Check Master Database Sync

When starting the application in development:

```bash
npm run dev
```

Check logs for:
```
[TypeORM] Master database synchronized
[TypeORM] License entity created
```

---

## Integration Steps

### Step 1: Verify Module Registration

The LicensesModule has already been imported in `app.module.ts`:

```typescript
// In app.module.ts
import { LicensesModule } from './licenses/licenses.module';

@Module({
  imports: [
    // ... other modules
    LicensesModule,
  ],
})
export class AppModule implements NestModule {
  // ...
}
```

### Step 2: Verify Route Registration

The license routes have been added to the routing configuration:

```typescript
// In app.module.ts routing
RouterModule.register([
  {
    path: '',
    children: [
      { path: 'auth', module: AuthModule },
      { path: 'super-admins', module: SuperAdminsModule },
      { path: 'billing', module: BillingModule },
      { path: 'plans', module: PlansModule },
      { path: 'licenses', module: LicensesModule },  // <-- Added
      { path: 'institutes', module: InstitutesAdminModule },
    ],
  },
])
```

### Step 3: Start the Backend

```bash
cd apps/backend
pnpm dev
```

Expected output:
```
[Nest] ... Starting Nest application...
[TypeORM] Master database connection established
[Licenses] Module initialized
Server running on http://localhost:3000
```

### Step 4: Verify Endpoints

Check that endpoints are available:

```bash
# Test health check
curl http://localhost:3000/health

# Test public endpoint (verify license)
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-KEY"}'
```

---

## Testing

### Quick Start Test

#### 1. Test Public Endpoints (No Authentication)

**Verify License:**

```bash
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-LICENSE-001",
    "timestamp": 1703088000
  }'
```

Expected response:
```json
{
  "valid": false,
  "status": "invalid",
  "message": "License key not found"
}
```

**Check Feature:**

```bash
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-LICENSE-001",
    "featureName": "live_sessions"
  }'
```

Expected response:
```json
{
  "enabled": false,
  "message": "License not found"
}
```

#### 2. Create Test License (Admin)

First, get an admin JWT token. Then:

```bash
# Replace YOUR_ADMIN_TOKEN with actual token
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "organizationName": "Test University",
    "licenseKey": "TEST-LICENSE-001",
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
    "maxUsers": 500
  }'
```

Expected response (201 Created):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "licenseKey": "TEST-LICENSE-001",
  "organizationName": "Test University",
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
  "maxUsers": 500,
  "verificationCount": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 3. Verify Created License

```bash
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-LICENSE-001"}'
```

Expected response (now valid):
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
      "enabled": true
    }
  ],
  "cacheTTL": 86400
}
```

#### 4. Check Feature Availability

```bash
curl -X POST http://localhost:3000/api/v1/licenses/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "TEST-LICENSE-001",
    "featureName": "live_sessions"
  }'
```

Expected response:
```json
{
  "enabled": true,
  "limit": 100,
  "message": "Feature 'live_sessions' is enabled"
}
```

#### 5. List Licenses

```bash
curl -X GET "http://localhost:3000/api/v1/licenses?status=active&skip=0&take=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### 6. Get License Statistics

```bash
curl -X GET http://localhost:3000/api/v1/licenses/stats/summary \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Automated Testing

Create a test file `src/licenses/licenses.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { LicensesService } from './licenses.service';

describe('LicensesService', () => {
  let service: LicensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicensesService],
    }).compile();

    service = module.get<LicensesService>(LicensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests as needed
});
```

Run tests:

```bash
pnpm test
```

---

## Gin Backend Integration

### Step 1: Update Gin Configuration

In `FLCN-LMS/apps/lms-gin/internal/config/config.go`, add:

```go
// LicenseAPIURL is the URL of the NestJS license API
LicenseAPIURL string

// Update LoadConfig() to read from environment
cfg.LicenseAPIURL = os.Getenv("LICENSE_API_URL")
if cfg.LicenseAPIURL == "" {
  cfg.LicenseAPIURL = "http://localhost:3000" // default for development
}
```

### Step 2: Update `.env` in Gin Backend

```env
# License API Configuration
LICENSE_API_URL=http://localhost:3000
LICENSE_KEY=LIC-2024-ABC123XYZ
LICENSE_VERIFY_INTERVAL=24h
```

### Step 3: Update License Client

The Gin backend already has a license client. Update the verify URL if needed:

```go
// In internal/license/client.go
func (c *Client) getLicenseVerifyURL() string {
  return fmt.Sprintf("%s/api/v1/licenses/verify", c.apiURL)
}
```

### Step 4: Update Feature Check

Ensure feature checking is used in handlers:

```go
// In handlers, before allowing feature access:
enabled, err := licenseService.HasFeature("live_sessions")
if err != nil {
  // Handle error - use fallback or deny
  c.JSON(403, gin.H{
    "success": false,
    "error": "License verification failed",
  })
  return
}

if !enabled {
  c.JSON(403, gin.H{
    "success": false,
    "error": "Feature not available in your license",
  })
  return
}

// Proceed with feature logic
```

### Step 5: Test Integration

1. Start NestJS backend:
```bash
cd apps/backend
pnpm dev
```

2. Create a test license via API:
```bash
curl -X POST http://localhost:3000/api/v1/licenses/issue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "organizationName": "Test Org",
    "licenseKey": "GIN-TEST-001",
    "features": [{"name": "live_sessions", "enabled": true}],
    "expiryDate": "2025-12-31T23:59:59Z"
  }'
```

3. Start Gin backend:
```bash
cd apps/lms-gin
make dev
```

4. Test Gin backend with license verification:
```bash
# Gin backend should automatically verify license on startup
# Check logs for successful verification
```

---

## Troubleshooting

### Issue: License entity not recognized in TypeORM

**Solution:**
1. Verify `license.entity.ts` exists in `master-entities/`
2. Check imports in `app.module.ts`
3. Ensure License entity is in the TypeORM configuration entities array
4. Clear `dist/` folder and rebuild:
```bash
rm -rf dist/
pnpm build
```

### Issue: "Cannot find module" errors

**Solution:**
1. Verify all file paths are correct:
```bash
ls -la src/licenses/
ls -la src/master-entities/license.entity.ts
```
2. Check TypeScript paths in `tsconfig.json`
3. Rebuild project:
```bash
pnpm build
```

### Issue: Database connection error

**Solution:**
1. Verify environment variables:
```bash
echo $MASTER_DATABASE_URL
```
2. Test database connection:
```bash
psql $MASTER_DATABASE_URL -c "SELECT 1"
```
3. Check database exists:
```bash
psql -l | grep your_database
```
4. Verify PostgreSQL UUID extension:
```bash
psql $MASTER_DATABASE_URL -c "SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';"
```

### Issue: License verification always returns "not found"

**Solution:**
1. Check that license was created:
```bash
# Query database directly
psql $MASTER_DATABASE_URL -c "SELECT license_key, status FROM licenses LIMIT 10;"
```
2. Verify license key spelling (case-sensitive)
3. Check license status isn't 'invalid' or 'suspended'
4. Verify license hasn't expired

### Issue: Features not showing in verification response

**Solution:**
1. Check that features were provided when creating license
2. Verify features JSON structure:
```bash
psql $MASTER_DATABASE_URL -c "SELECT features FROM licenses WHERE license_key = 'YOUR-KEY';"
```
3. Ensure features array has correct format:
```json
[
  {"name": "feature_name", "enabled": true, "limit": null}
]
```

### Issue: Authentication fails on admin endpoints

**Solution:**
1. Verify JWT token is valid:
```bash
# Decode token at jwt.io or use:
node -e "console.log(require('jsonwebtoken').decode('TOKEN_HERE'))"
```
2. Check token isn't expired
3. Verify `Authorization` header format: `Bearer TOKEN`
4. Ensure user has super admin role

### Issue: Gin backend can't connect to NestJS backend

**Solution:**
1. Verify NestJS backend is running:
```bash
curl http://localhost:3000/health
```
2. Check `LICENSE_API_URL` environment variable in Gin backend
3. Verify network connectivity between containers/services
4. Check firewall rules if services are on different machines

### Issue: Performance - too many license verifications

**Solution:**
1. Ensure Gin backend caching is working:
   - Check `cacheTTL` in verification response
   - Verify cached license is saved to database
   - Check cache expiry logic

2. Consider implementing request caching:
```go
// Add caching middleware to Gin routes
cache := make(map[string]*CachedLicense)
// Implement cache invalidation logic
```

3. Add rate limiting to NestJS backend:
```typescript
import { RateLimitGuard } from '@nestjs/throttler';

@Post('verify')
@UseGuards(RateLimitGuard)
async verifyLicense(@Body() dto: VerifyLicenseDto) {
  // Implementation
}
```

### Debug Logging

Enable detailed logging in `app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
  name: 'master',
  useFactory: (config: ConfigService) => ({
    // ... other options
    logging: config.get('NODE_ENV') === 'development' ? true : ['error'],
    logger: 'advanced-console',
  }),
})
```

Then check logs for TypeORM queries:

```bash
pnpm dev 2>&1 | grep -i license
```

---

## Next Steps

1. ✅ Set up database and tables
2. ✅ Configure environment variables
3. ✅ Test license API endpoints
4. ✅ Integrate with Gin backend
5. ⭕ Implement authentication guards (TODO)
6. ⭕ Add role-based access control (TODO)
7. ⭕ Set up monitoring and logging (TODO)
8. ⭕ Create admin dashboard UI (TODO)
9. ⭕ Implement audit logging (TODO)
10. ⭕ Add license expiry notifications (TODO)

---

## Support Contacts

- Backend Team: backend@flcn-lms.dev
- Database Team: database@flcn-lms.dev
- DevOps Team: devops@flcn-lms.dev

---

## Additional Resources

- [License API Documentation](./LICENSE_API.md)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
