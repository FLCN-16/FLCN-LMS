# Rate Limiting - Quick Start Guide

## Installation & Setup

Already included in `RateLimitingModule` (global in app.module.ts).

## Basic Usage

### 1. Apply to Endpoint

```typescript
import { RateLimitPublicApi } from './rate-limiting/decorators/rate-limit.decorator';
import { RateLimitGuard } from './rate-limiting/guards/rate-limit.guard';

@Post('/licenses/verify')
@UseGuards(RateLimitGuard)
@RateLimitPublicApi()
async verifyLicense(@Body() dto: VerifyLicenseDto) {
  // 100 requests per minute per IP
}
```

### 2. Test It

```bash
# First request - should succeed
curl -X POST http://localhost:3000/api/v1/licenses/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "TEST-001"}'

# Response headers:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-RateLimit-Reset: 2024-04-14T10:01:00Z

# After 100 requests in 1 minute - should fail with 429
# X-RateLimit-Remaining: 0
# Retry-After: 45
```

## Available Decorators

| Decorator | Limit | Window | Mode | Use Case |
|-----------|-------|--------|------|----------|
| `@RateLimitPublic()` | 30 | 1 min | IP | General public |
| `@RateLimitPublicApi()` | 100 | 1 min | IP | Public API |
| `@RateLimitAuth()` | 5 | 15 min | IP | Login/auth |
| `@RateLimitAuthenticated()` | 500 | 1 min | User | User endpoints |
| `@RateLimitApiKey()` | 1000 | 1 min | API Key | Service API |
| `@RateLimitAdmin()` | 300 | 1 min | User | Admin ops |
| `@RateLimitSensitive()` | 10 | 1 min | IP | Key deletion |

## Common Patterns

### Public Endpoint (License Verification)

```typescript
@Post('/licenses/verify')
@UseGuards(RateLimitGuard)
@RateLimitPublicApi()
async verifyLicense(@Body() dto: VerifyLicenseDto) { }
```

### Protected Endpoint (Admin Operation)

```typescript
@Post('/licenses/issue')
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()
async issueLicense(@Body() dto: IssueLicenseDto) { }
```

### Login Endpoint (Brute Force Protection)

```typescript
@Post('/auth/login')
@UseGuards(RateLimitGuard)
@RateLimitAuth()
async login(@Body() dto: LoginDto) { }
```

### Authenticated User Endpoint

```typescript
@Get('/dashboard')
@UseGuards(JwtAuthGuard, RateLimitGuard)
@RateLimitAuthenticated()
async getDashboard(@CurrentUser() user: User) { }
```

## Custom Rate Limits

### Option 1: Using @RateLimit Decorator

```typescript
@Post('/custom-endpoint')
@UseGuards(RateLimitGuard)
@RateLimit({
  limit: 50,
  windowMs: 60 * 1000,
  mode: 'ip',
  message: 'Custom limit exceeded'
})
async customEndpoint() { }
```

### Option 2: Using @RateLimitCustom Shorthand

```typescript
@Post('/another-endpoint')
@UseGuards(RateLimitGuard)
@RateLimitCustom(50, 1, 'ip', 'Custom limit exceeded')
async anotherEndpoint() { }
```

## Rate Limit Modes

### IP-Based (Public)
```typescript
@RateLimit({ limit: 100, windowMs: 60000, mode: 'ip' })
```
Limits by client IP address. Use for public endpoints.

### User-Based (Authenticated)
```typescript
@RateLimit({ limit: 500, windowMs: 60000, mode: 'user' })
```
Limits by user ID (from JWT). Use for authenticated endpoints.

### API Key-Based (Services)
```typescript
@RateLimit({ limit: 1000, windowMs: 60000, mode: 'api-key' })
```
Limits by API key ID. Use for service integrations.

### Institute-Based (Organization)
```typescript
@RateLimit({ limit: 5000, windowMs: 60000, mode: 'institute' })
```
Limits by organization/institute ID.

## Response Headers

All responses include rate limit info:

```
X-RateLimit-Limit: 100          # Max requests allowed
X-RateLimit-Remaining: 42       # Requests left in window
X-RateLimit-Reset: 2024-04-14T10:01:00Z  # When limit resets
```

On 429 Too Many Requests:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 45                 # Seconds to wait
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-04-14T10:01:00Z

{
  "statusCode": 429,
  "message": "Too many requests, please try again later.",
  "retryAfter": 45,
  "resetAt": "2024-04-14T10:01:00Z"
}
```

## Handling Rate Limits in Clients

### JavaScript/Node.js

```typescript
async function callApi(url: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

### Go (Gin)

```go
import (
  "fmt"
  "net/http"
  "strconv"
  "time"
)

func callApiWithRetry(url string) (*http.Response, error) {
  for attempt := 0; attempt < 3; attempt++ {
    resp, err := http.Get(url)
    if err != nil {
      return nil, err
    }
    
    if resp.StatusCode == 429 {
      retryAfter := 60
      if header := resp.Header.Get("Retry-After"); header != "" {
        if seconds, err := strconv.Atoi(header); err == nil {
          retryAfter = seconds
        }
      }
      
      fmt.Printf("Rate limited. Waiting %d seconds...\n", retryAfter)
      time.Sleep(time.Duration(retryAfter) * time.Second)
      resp.Body.Close()
      continue
    }
    
    return resp, nil
  }
  return nil, fmt.Errorf("max retries exceeded")
}
```

## Disabling Rate Limiting (Development Only)

```typescript
@Get('/internal-metrics')
@UseGuards(RateLimitGuard)
@RateLimitDisabled()
getMetrics() { }
```

## Monitoring

### Get Statistics

```typescript
import { RateLimitingService } from './rate-limiting/rate-limiting.service';

@Injectable()
export class MonitoringService {
  constructor(private rateLimitingService: RateLimitingService) {}

  getStats() {
    return this.rateLimitingService.getStatistics();
    // {
    //   totalKeys: 1234,
    //   activeKeys: 500,
    //   expiredKeys: 734
    // }
  }
}
```

### Custom Rate Limit Check

```typescript
import { RateLimitingService } from './rate-limiting/rate-limiting.service';
import { getClientIp } from './rate-limiting/rate-limiting.config';

@Injectable()
export class MyService {
  constructor(private rateLimitingService: RateLimitingService) {}

  async checkLimit(req: Request) {
    const ip = getClientIp(req);
    const result = await this.rateLimitingService.checkRateLimitByIp(
      ip,
      'my-endpoint',
      100,
      60000
    );

    if (!result.allowed) {
      throw new HttpException(
        'Rate limited',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }
}
```

## Configuration

Edit `rate-limiting.config.ts` to adjust presets:

```typescript
export const RATE_LIMIT_PRESETS = {
  PUBLIC_API: {
    windowMs: 60 * 1000,
    max: 100,  // Change this
    message: 'API rate limit exceeded.',
  },
};
```

## Troubleshooting

### Getting 429 Too Many Requests?

1. Check `X-RateLimit-Remaining` header
2. Wait for `X-RateLimit-Reset` time
3. Or use `Retry-After` header value
4. Reduce request frequency
5. Use exponential backoff in client code

### Rate Limit Not Working?

1. Verify `@UseGuards(RateLimitGuard)` is applied
2. Verify decorator is applied (`@RateLimitPublicApi()` etc)
3. Check guard order: auth guards first, then rate limit
4. Check browser dev tools for response headers

### Wrong Limit Applied?

1. Verify correct decorator on endpoint
2. Check decorator wasn't overridden by `@RateLimit(...)`
3. Ensure guard is applied to correct HTTP method/path

## Time Windows Reference

```typescript
1 second:       1000
1 minute:       60 * 1000
5 minutes:      5 * 60 * 1000
15 minutes:     15 * 60 * 1000
1 hour:         60 * 60 * 1000
1 day:          24 * 60 * 60 * 1000
```

## Best Practices

✅ **DO:**
- Use `@RateLimitAuth()` on login endpoints
- Use `@RateLimitSensitive()` on delete/sensitive ops
- Layer with auth guards: `@UseGuards(AuthGuard, RateLimitGuard)`
- Check rate limit headers in client code
- Implement exponential backoff retry logic
- Document rate limits in API docs

❌ **DON'T:**
- Skip rate limiting on public endpoints
- Use too high limits on sensitive operations
- Ignore 429 responses (implement retry logic)
- Hardcode limit values (use decorators/config)
- Apply rate limiting without authentication guard

## Need More Info?

- Full documentation: `RATE_LIMITING.md`
- Configuration: `rate-limiting.config.ts`
- Service: `rate-limiting.service.ts`
- Guard: `rate-limiting/guards/rate-limit.guard.ts`
- Decorators: `rate-limiting/decorators/rate-limit.decorator.ts`

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2024-04-14