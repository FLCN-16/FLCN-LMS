/**
 * Rate Limiting Module
 *
 * Provides rate limiting functionality for the application with:
 * - IP-based rate limiting
 * - User-based rate limiting
 * - API key-based rate limiting
 * - Institute-based rate limiting
 * - Multiple algorithms (sliding window, token bucket)
 *
 * Current: In-memory storage (development)
 * Future: Redis backend (production)
 *
 * Exports:
 * - RateLimitingService: Core rate limiting logic
 * - RateLimitGuard: Guard for enforcing rate limits
 *
 * Usage:
 * 1. Import RateLimitingModule in your module (or it's global, so automatically available)
 * 2. Use decorators from './decorators/rate-limit.decorator'
 * 3. Apply RateLimitGuard to routes
 * 4. Inject RateLimitingService if needed for custom logic
 *
 * @example - Basic usage with decorator
 * ```typescript
 * import { RateLimitPublicApi } from './rate-limiting/decorators/rate-limit.decorator';
 * import { RateLimitGuard } from './rate-limiting/guards/rate-limit.guard';
 *
 * @Controller('licenses')
 * export class LicensesController {
 *   @Post('verify')
 *   @UseGuards(RateLimitGuard)
 *   @RateLimitPublicApi()
 *   async verifyLicense(@Body() dto: VerifyLicenseDto) {
 *     // 100 requests per minute per IP
 *   }
 * }
 * ```
 *
 * @example - Custom rate limit
 * ```typescript
 * import { RateLimit } from './rate-limiting/decorators/rate-limit.decorator';
 * import { RateLimitGuard } from './rate-limiting/guards/rate-limit.guard';
 *
 * @Controller('admin')
 * export class AdminController {
 *   @Post('users')
 *   @UseGuards(RateLimitGuard)
 *   @RateLimit({
 *     limit: 10,
 *     windowMs: 60000,
 *     mode: 'user',
 *     message: 'Admin operation rate limit exceeded'
 *   })
 *   async createUser(@Body() dto: CreateUserDto) {
 *     // 10 requests per minute per user
 *   }
 * }
 * ```
 *
 * @example - Inject service for custom logic
 * ```typescript
 * import { RateLimitingService } from './rate-limiting/rate-limiting.service';
 * import { getClientIp } from './rate-limiting/rate-limiting.config';
 *
 * @Injectable()
 * export class MyService {
 *   constructor(private rateLimitingService: RateLimitingService) {}
 *
 *   async myMethod(req: Request) {
 *     const ip = getClientIp(req);
 *     const result = await this.rateLimitingService.checkRateLimitByIp(
 *       ip,
 *       'custom-endpoint',
 *       100,
 *       60000
 *     );
 *
 *     if (!result.allowed) {
 *       throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
 *     }
 *   }
 * }
 * ```
 *
 * Available Decorators:
 * - @RateLimitPublic() - 30 req/min by IP (general public endpoints)
 * - @RateLimitPublicApi() - 100 req/min by IP (API verification endpoints)
 * - @RateLimitAuth() - 5 attempts/15min by IP (login, prevents brute force)
 * - @RateLimitAuthenticated() - 500 req/min per user (authenticated endpoints)
 * - @RateLimitApiKey() - 1000 req/min per API key (API endpoints)
 * - @RateLimitAdmin() - 300 req/min per admin user
 * - @RateLimitSensitive() - 10 req/min by IP (key deletion, etc.)
 * - @RateLimitLicenseVerify() - 100 req/min by IP
 * - @RateLimitFeatureCheck() - 100 req/min by IP
 * - @RateLimitApiKeyValidation() - 100 req/min by IP
 * - @RateLimitApiKeyManagement() - 10 req/min by IP
 * - @RateLimitCustom(limit, minutes, mode, message) - Custom configuration
 * - @RateLimitDisabled() - Disable rate limiting for endpoint
 *
 * Rate Limit Modes:
 * - 'ip' - By client IP address
 * - 'user' - By authenticated user ID (from JWT)
 * - 'api-key' - By API key ID (from request.apiKey)
 * - 'institute' - By institute ID (from query param, body, or context)
 *
 * Response Headers:
 * - X-RateLimit-Limit - Maximum requests allowed
 * - X-RateLimit-Remaining - Requests remaining in current window
 * - X-RateLimit-Reset - ISO timestamp when limit resets
 * - Retry-After - Seconds to wait before retrying (only on 429)
 *
 * Configuration:
 * See rate-limiting.config.ts for:
 * - RATE_LIMIT_PRESETS - Pre-configured limit presets
 * - ENDPOINT_RATE_LIMITS - Endpoint-specific limits
 * - RATE_LIMIT_WINDOWS - Time window constants
 * - RATE_LIMIT_SKIP_CONDITIONS - Skip conditions for rate limiting
 *
 * Database: None (in-memory storage)
 * Cache: Not used (rates tracked in memory, cleaned every 5 minutes)
 * Storage: In-memory map (development only)
 *
 * Migration to Redis (Future):
 * 1. Create redis.module.ts with Redis client provider
 * 2. Inject RedisClient into RateLimitingService
 * 3. Update service methods to use Redis commands instead of memory
 * 4. Add Redis connection configuration
 */
export declare class RateLimitingModule {
}
//# sourceMappingURL=rate-limiting.module.d.ts.map