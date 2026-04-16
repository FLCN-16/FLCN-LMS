# Rate Limiting Documentation

## Overview

The Rate Limiting module provides flexible, scalable rate limiting for the FLCN-LMS backend. It protects endpoints from abuse, prevents brute-force attacks, and ensures fair usage across different client types (public users, authenticated users, API keys, etc.).

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Priority**: P1 (High)  
**Implementation Date**: 2024-04-14

## Key Features

✅ **Multiple Limiting Modes**
- IP-based limiting for public endpoints
- User-based limiting for authenticated endpoints
- API key-based limiting for service integrations
- Institute-based limiting for organization-level control

✅ **Pre-configured Presets**
- Public endpoints: 30 req/min
- Public API: 100 req/min
- Authentication: 5 attempts/15min
- Authenticated users: 500 req/min
- API keys: 1000 req/min per key
- Admin endpoints: 300 req/min
- Sensitive operations: 10 req/min

✅ **Easy Integration**
- Decorator-based configuration
- Guard-based enforcement
- Per-endpoint customization
- Global and local rate limits

✅ **Flexible Algorithms**
- Sliding window counter (default)
- Token bucket (burst support)
- Easy to extend

✅ **Production-Ready**
- In-memory storage (development)
- Redis-ready architecture (production)
- Automatic cleanup of expired records
- Response headers (X-RateLimit-*)
- Retry-After header on 429

✅ **Developer-Friendly**
- 13 pre-built decorators
- Custom rate limit support
- Skip conditions
- Detailed error messages

## How It Works

### Rate Limit Flow

```
1. REQUEST ARRIVES
   └─ Guard checks for @RateLimit decorator

2. RATE LIMIT CHECK
   └─ Generates key (based on mode: IP, user, API key, etc.)
   └─ Looks up current count in store
   └─ Increments counter

3. DECISION
   ├─ If count <= limit
   │  └─ ALLOWED ✅
   │  └─ Add X-RateLimit-* headers
   │  └─ Continue request
   └─ If count > limit
      └─ DENIED ❌
      └─ Return 429 Too Many Requests
      └─ Add Retry-After header

4. CLEANUP
   └─ Every 5 minutes, remove expired records
   └─ Prevents memory leaks
```

### Rate Limit Key Generation

Keys are generated based on the limiting mode:

```
IP mode:       "ip:<client-ip>:<endpoint>"
User mode:     "user:<user-id>:<endpoint>"
API Key mode:  "key:<key-id>:<endpoint>"
Institute mode: "institute:<institute-id>:<endpoint>"
```

Example:
```
ip:192.168.1.100:POST /licenses/verify
user:550e8400-e29b-41d4-a716-446655440000:POST /admin/users
key:abcd1234efgh5678:POST /licenses/issue
```

### Storage & Cleanup

**Current (Development)**:
- In-memory JavaScript Map
- Automatic cleanup every 5 minutes
- Tracks: count, resetTime, tokens (for bucket algorithm)

**Future (Production)**:
- Redis backend
- Distributed rate limiting across multiple instances
- Persistent metrics for analytics

## Configuration

### Rate Limit Presets

Located in `rate-limiting.config.ts`:

```typescript
RATE_LIMIT_PRESETS = {
  PUBLIC: { windowMs: 60*1000, max: 30 },
  PUBLIC_API: { windowMs: 60*1000, max: 100 },
  AUTH: { windowMs: 15*60*1000, max: 5 },
  AUTHENTICATED: { windowMs: 60*1000, max: 500 },
  API_KEY: { windowMs: 60*1000, max: 1000 },
  ADMIN: { windowMs: 60*1000, max: 300 },
  SENSITIVE: { windowMs: 60*1000, max: 10 },
}
```

### Endpoint-Specific Limits

Configure specific limits for endpoints:

```typescript
ENDPOINT_RATE_LIMITS = {
  'POST /auth/login': RATE_LIMIT_PRESETS.AUTH,
  'POST /licenses/verify': RATE_LIMIT_PRESETS.PUBLIC_API,
  'GET /licenses': RATE_LIMIT_PRESETS.API_KEY,
}
```

### Time Windows

```typescript
RATE_LIMIT_WINDOWS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
}
```

## Available Decorators

### Basic Decorators

#### @RateLimitPublic()
General public endpoints
- 30 requests per minute by IP
- Use for: health checks, public pages

```typescript
@Get('/health')
@UseGuards(RateLimitGuard)
@RateLimitPublic()
health() { }
```

#### @RateLimitPublicApi()
Public API endpoints
- 100 requests per minute by IP
- Use for: license verification, feature checking

```typescript
@Post('/licenses/verify')
@UseGuards(RateLimitGuard)
@RateLimitPublicApi()
verifyLicense(@Body() dto: VerifyLicenseDto) { }
```

#### @RateLimitAuth()
Authentication endpoints (very strict)
- 5 attempts per 15 minutes by IP
- Prevents brute-force attacks
- Use for: login, password reset

```typescript
@Post('/auth/login')
@UseGuards(RateLimitGuard)
@RateLimitAuth()
login(@Body() dto: LoginDto) { }
```

#### @RateLimitAuthenticated()
Authenticated user endpoints
- 500 requests per minute per user
- Requires user identity
- Use for: user dashboard, profile endpoints

```typescript
@Get('/profile')
@UseGuards(JwtAuthGuard, RateLimitGuard)
@RateLimitAuthenticated()
getProfile(@CurrentUser() user: User) { }
```

#### @RateLimitApiKey()
API key authenticated endpoints
- 1000 requests per minute per API key
- Use for: license management, bulk operations

```typescript
@Post('/licenses/issue')
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()
issueLicense(@Body() dto: IssueLicenseDto) { }
```

#### @RateLimitAdmin()
Admin-only endpoints
- 300 requests per minute per admin
- Use for: admin operations

```typescript
@Post('/super-admins/create')
@UseGuards(JwtAuthGuard, RateLimitGuard)
@RateLimitAdmin()
createAdmin(@Body() dto: CreateAdminDto) { }
```

#### @RateLimitSensitive()
Sensitive operations (very strict)
- 10 requests per minute by IP
- Use for: key deletion, data erasure

```typescript
@Delete('/api-keys/:id')
@UseGuards(RateLimitGuard)
@RateLimitSensitive()
deleteApiKey(@Param('id') keyId: string) { }
```

### Specialized Decorators

#### @RateLimitLicenseVerify()
License verification endpoint
- 100 requests per minute by IP

#### @RateLimitFeatureCheck()
Feature checking endpoint
- 100 requests per minute by IP

#### @RateLimitApiKeyValidation()
API key validation endpoint
- 100 requests per minute by IP

#### @RateLimitApiKeyManagement()
API key management operations
- 10 requests per minute by IP

### Custom Rate Limiting

#### @RateLimit(options)
Fully customizable rate limiting

```typescript
@RateLimit({
  limit: 100,
  windowMs: 60 * 1000,
  mode: 'ip',
  message: 'Custom rate limit exceeded'
})
@Post('/custom-endpoint')
@UseGuards(RateLimitGuard)
async customEndpoint() { }
```

#### @RateLimitCustom(limit, minutes, mode, message)
Quick custom rate limiting

```typescript
@RateLimitCustom(50, 1, 'ip', 'Custom limit exceeded')
@Post('/another-endpoint')
@UseGuards(RateLimitGuard)
async anotherEndpoint() { }
```

#### @RateLimitDisabled()
Disable rate limiting for an endpoint

```typescript
@Get('/internal-metrics')
@UseGuards(RateLimitGuard)
@RateLimitDisabled()
getMetrics() { }
```

## Response Headers

Rate-limited responses include standard headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 2024-04-14T10:30:00Z
```

On 429 Too Many Requests:

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-04-14T10:30:00Z
Retry-After: 45

{
  "statusCode": 429,
  "message": "Too many requests, please try again later.",
  "retryAfter": 45,
  "resetAt": "2024-04-14T10:30:00Z",
  "limit": 100,
  "remaining": 0
}
```

## Integration Examples

### Basic Integration

```typescript
import { Module } from '@nestjs/common';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [RateLimitingModule],
})
export class AppModule {}
```

### Public Endpoint

```typescript
@Post('/licenses/verify')
@UseGuards(RateLimitGuard)
@RateLimitPublicApi()
async verifyLicense(@Body() dto: VerifyLicenseDto) {
  // 100 requests per minute per IP
  return this.licensesService.verify(dto);
}
```

### Authenticated Endpoint

```typescript
@Get('/dashboard')
@UseGuards(JwtAuthGuard, RateLimitGuard)
@RateLimitAuthenticated()
async getDashboard(@CurrentUser() user: User) {
  // 500 requests per minute per user
  return this.dashboardService.getForUser(user.id);
}
```

### API Key Endpoint

```typescript
@Post('/licenses/issue')
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()
async issueLicense(@Body() dto: IssueLicenseDto) {
  // 1000 requests per minute per API key
  return this.licensesService.issue(dto);
}
```

### Custom Service Usage

```typescript
import { Injectable } from '@nestjs/common';
import { RateLimitingService } from './rate-limiting.service';
import { getClientIp } from './rate-limiting.config';

@Injectable()
export class MyService {
  constructor(private rateLimitingService: RateLimitingService) {}

  async myMethod(req: Request) {
    const ip = getClientIp(req);
    const result = await this.rateLimitingService.checkRateLimitByIp(
      ip,
      'custom-endpoint',
      100,
      60000
    );

    if (!result.allowed) {
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Continue with logic
  }
}
```

## Rate Limiting Modes

### IP-Based (Public Endpoints)

```typescript
@RateLimit({ limit: 100, windowMs: 60000, mode: 'ip' })
```

Limits by client IP address.

**Use for:**
- Public endpoints
- Login/registration
- Public API verification

**Extracted from:**
- X-Forwarded-For header (proxy)
- X-Real-IP header
- Socket remote address

### User-Based (Authenticated)

```typescript
@RateLimit({ limit: 500, windowMs: 60000, mode: 'user' })
```

Limits by authenticated user ID.

**Use for:**
- User dashboard
- Profile endpoints
- Authenticated operations

**Requires:**
- User attached to request.user
- JWT authentication guard

### API Key-Based (Services)

```typescript
@RateLimit({ limit: 1000, windowMs: 60000, mode: 'api-key' })
```

Limits by API key ID.

**Use for:**
- Service-to-service communication
- Integration endpoints
- License management

**Requires:**
- API key guard
- Key ID in request.apiKey

### Institute-Based (Organization)

```typescript
@RateLimit({ limit: 5000, windowMs: 60000, mode: 'institute' })
```

Limits by organization/institute ID.

**Use for:**
- Organization-level quotas
- Bulk operations
- Administrative endpoints

**Extracted from:**
- Query parameter: ?instituteId=xxx
- Request body: body.instituteId
- API key context: request.apiKey.instituteId
- User context: request.user.instituteId

## Security Best Practices

### 1. Choose Appropriate Limits

```typescript
// ✅ Good - conservative for public endpoints
@RateLimitPublicApi() // 100 req/min by IP

// ❌ Bad - too permissive
@RateLimit({ limit: 10000, windowMs: 60000 })
```

### 2. Use Strict Limits for Sensitive Operations

```typescript
// ✅ Good - very strict for key deletion
@RateLimitSensitive() // 10 req/min

// ❌ Bad - too lenient for sensitive operation
@RateLimitApiKey() // 1000 req/min
```

### 3. Layer Multiple Guards

```typescript
// ✅ Good - authentication + rate limiting
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()

// ❌ Bad - only rate limiting
@UseGuards(RateLimitGuard)
@RateLimitApiKey()
```

### 4. Protect Brute Force Vectors

```typescript
// ✅ Good - strict auth endpoint limiting
@RateLimitAuth() // 5 attempts/15min
@Post('/auth/login')

// ❌ Bad - no rate limiting on login
@Post('/auth/login')
```

### 5. Monitor Suspicious Patterns

```typescript
// Watch for:
- Multiple 429 responses from same IP
- Rapid key generation attempts
- Unusual spike in API key usage
- Login attempts from multiple IPs
```

### 6. Document Limits for Clients

```
Rate Limit: 100 requests per minute per IP
Retry-After: Check 'Retry-After' header
Reset Time: Use 'X-RateLimit-Reset' header
```

### 7. Implement Graduated Response

```
Stage 1: 80% of limit → warning
Stage 2: 95% of limit → prepare to block
Stage 3: 100% of limit → block with 429
```

## Monitoring & Alerting

### Get Rate Limit Statistics

```typescript
const stats = this.rateLimitingService.getStatistics();
// {
//   totalKeys: 1234,
//   activeKeys: 500,
//   expiredKeys: 734
// }
```

### Monitor Key Indicators

```
1. Active rate limit keys per endpoint
2. 429 response rate by endpoint
3. Most rate-limited IPs
4. Most rate-limited users
5. Cleanup cycle efficiency
```

### Alert on Anomalies

```
1. 429 rate > 5% on any endpoint
2. Single IP generating > 100 keys/hour
3. Memory usage growth beyond threshold
4. Cleanup removing < 10% of keys (memory leak)
```

### Metrics Collection

```typescript
// Add to monitoring system
monitoring.gauge('ratelimit.active_keys', stats.activeKeys);
monitoring.gauge('ratelimit.total_keys', stats.totalKeys);
monitoring.counter('ratelimit.429_responses', 1);
monitoring.histogram('ratelimit.cleanup_duration_ms', cleanupTime);
```

## Troubleshooting

### Issue: Getting 429 Too Many Requests

**Causes:**
- Exceeded rate limit for endpoint
- Running load tests without rate limit bypass
- Client making too many requests
- API key rate limit exceeded

**Solutions:**
1. Check `Retry-After` header for wait time
2. Reduce request frequency
3. Use exponential backoff
4. Create API key with higher rate limit
5. Contact support for limit increase

**Example - Exponential Backoff:**
```typescript
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const retryAfter = parseInt(error.headers['retry-after']) || (2 ** i);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

### Issue: Rate Limit Not Working

**Causes:**
- Guard not applied to route
- Decorator not applied to route
- Guard order incorrect

**Solutions:**
```typescript
// ✅ Correct order
@UseGuards(ApiKeyGuard, RateLimitGuard) // Auth first, then rate limit
@RateLimitApiKey()
@Post('/endpoint')

// ❌ Wrong
@UseGuards(RateLimitGuard, ApiKeyGuard) // Wrong order
@RateLimitApiKey()
```

### Issue: Memory Usage Growing

**Causes:**
- Cleanup not running
- Too many active rate limits
- Memory leak in tracking

**Solutions:**
1. Check cleanup interval running every 5 minutes
2. Reduce window size for high-traffic endpoints
3. Monitor statistics with `getStatistics()`
4. Consider Redis for production

### Issue: Different Limits for Same User

**Causes:**
- Multiple rate limiting modes applied
- Proxy changing IP address
- User context not attached

**Solutions:**
1. Use only one mode per endpoint
2. Trust X-Forwarded-For header
3. Verify user context in request

## Performance Considerations

### Memory Usage

```
Per rate limit entry:
- Key (string): ~50-100 bytes
- Value object: ~80 bytes
Total per entry: ~150 bytes

Examples:
- 1000 active limits: ~150 KB
- 10000 active limits: ~1.5 MB
- 100000 active limits: ~15 MB

Cleanup: Runs every 5 minutes, removes expired records
```

### CPU Usage

```
Per request:
- Hash lookup: O(1)
- Increment: O(1)
- Header generation: O(1)
Total: < 1ms per request
```

### Scalability

```
In-memory (development):
- Scales to ~100k endpoints
- Single instance only
- Fine for dev/small deployments

Redis (production):
- Scales horizontally
- Shared across instances
- Recommended for multi-instance deployments
```

## Migration to Redis

When ready for production multi-instance deployment:

1. Install Redis and `@nestjs/redis`
2. Create `redis.service.ts`
3. Update `rate-limiting.service.ts` to use Redis
4. Update storage strategy from memory to Redis
5. No code changes needed for decorators

Example Redis implementation:
```typescript
// Future enhancement
async checkRateLimit(key: string, limit: number, windowMs: number) {
  const redisClient = this.redisService.getClient();
  const count = await redisClient.incr(key);
  
  if (count === 1) {
    await redisClient.expire(key, Math.ceil(windowMs / 1000));
  }
  
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime: Date.now() + windowMs
  };
}
```

## Future Enhancements

### Phase 2 (v1.1.0)

- [ ] Redis backend support
- [ ] Distributed rate limiting
- [ ] Redis cluster support
- [ ] Rate limit analytics dashboard
- [ ] Per-user quota management
- [ ] Burst allowance (grace period)

### Phase 3 (v1.2.0)

- [ ] Dynamic rate limit adjustment
- [ ] Machine learning-based anomaly detection
- [ ] WebSocket rate limiting
- [ ] GraphQL rate limiting
- [ ] Custom rate limit strategies
- [ ] Rate limit sharing between services

### Phase 4 (v2.0.0)

- [ ] Distributed rate limiting across regions
- [ ] Cost-based rate limiting
- [ ] Priority queues
- [ ] Adaptive rate limiting
- [ ] Rate limit tiers/plans

## API Reference

### RateLimitingService Methods

```typescript
// Check IP-based rate limit
checkRateLimitByIp(ip, endpoint, limit, windowMs)

// Check user-based rate limit
checkRateLimitByUser(userId, endpoint, limit, windowMs)

// Check API key-based rate limit
checkRateLimitByApiKey(keyId, endpoint, limit, windowMs)

// Check institute-based rate limit
checkRateLimitByInstitute(instituteId, endpoint, limit, windowMs)

// Token bucket algorithm
checkTokenBucket(key, capacity, refillRate, tokensNeeded)

// Get current status
getStatus(key)

// Reset specific key
reset(key)

// Reset all keys for endpoint
resetByEndpoint(endpoint)

// Reset all keys
resetAll()

// Get statistics
getStatistics()

// Format response
formatResponse(limit, remaining, resetTime)
```

### Configuration Functions

```typescript
// Get client IP
getClientIp(req)

// Extract API key from header
extractApiKeyFromHeader(req)

// Calculate retry-after
calculateRetryAfter(resetTime, currentTime)

// Get rate limit for endpoint
getRateLimitForEndpoint(method, path)

// Get preset by role
getRateLimitPresetByRole(role)
```

## Support

- **Issues**: GitHub Issues
- **Questions**: #backend-support Slack
- **Security**: security@flcn.io

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-04-14 | Initial implementation, in-memory storage |

---

**Last Updated**: 2024-04-14  
**Status**: Production Ready  
**Version**: 1.0.0