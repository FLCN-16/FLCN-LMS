import { SetMetadata } from '@nestjs/common';

/**
 * Rate Limit Decorator Options
 */
export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Custom error message
   */
  message?: string;

  /**
   * Rate limiting mode
   * 'ip' - by IP address
   * 'user' - by user ID (from JWT)
   * 'api-key' - by API key ID
   * 'institute' - by institute ID
   */
  mode?: 'ip' | 'user' | 'api-key' | 'institute';

  /**
   * Skip rate limiting for certain conditions
   */
  skip?: boolean;

  /**
   * Custom key generator function
   */
  keyGenerator?: (req: any) => string;

  /**
   * Store strategy for rate limit data
   * 'memory' - in-memory (default, dev only)
   * 'redis' - Redis backend (production)
   */
  storage?: 'memory' | 'redis';
}

/**
 * Metadata key for rate limit decorator
 */
export const RATE_LIMIT_KEY = 'rate_limit';

/**
 * Rate Limit Decorator
 *
 * Apply rate limiting to controller endpoints with customizable options
 *
 * @param options - Rate limit configuration
 *
 * @example
 * ```typescript
 * @RateLimit({ limit: 100, windowMs: 60000, mode: 'ip' })
 * @Post('/licenses/verify')
 * async verifyLicense() { }
 * ```
 *
 * @example
 * ```typescript
 * @RateLimit({
 *   limit: 5000,
 *   windowMs: 60000,
 *   mode: 'api-key',
 *   message: 'API key rate limit exceeded'
 * })
 * @Post('/licenses/issue')
 * async issueLicense() { }
 * ```
 */
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

/**
 * Public endpoint rate limiting (strict)
 * 30 requests per minute by IP
 *
 * @example
 * ```typescript
 * @RateLimitPublic()
 * @Get('/health')
 * health() { }
 * ```
 */
export const RateLimitPublic = () =>
  RateLimit({
    limit: 30,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Too many requests, please try again later.',
  });

/**
 * Public API endpoint rate limiting
 * 100 requests per minute by IP
 * Used for license verification, feature checking, etc.
 *
 * @example
 * ```typescript
 * @RateLimitPublicApi()
 * @Post('/licenses/verify')
 * async verifyLicense() { }
 * ```
 */
export const RateLimitPublicApi = () =>
  RateLimit({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API rate limit exceeded. Please try again in a moment.',
  });

/**
 * Authentication endpoint rate limiting (very strict)
 * 5 attempts per 15 minutes by IP
 * Prevents brute force attacks on login endpoints
 *
 * @example
 * ```typescript
 * @RateLimitAuth()
 * @Post('/auth/login')
 * async login() { }
 * ```
 */
export const RateLimitAuth = () =>
  RateLimit({
    limit: 5,
    windowMs: 15 * 60 * 1000,
    mode: 'ip',
    message: 'Too many login attempts. Please try again after 15 minutes.',
  });

/**
 * Authenticated user endpoint rate limiting
 * 500 requests per minute per user
 * For authenticated endpoints using JWT
 *
 * @example
 * ```typescript
 * @RateLimitAuthenticated()
 * @UseGuards(JwtAuthGuard)
 * @Get('/profile')
 * async getProfile() { }
 * ```
 */
export const RateLimitAuthenticated = () =>
  RateLimit({
    limit: 500,
    windowMs: 60 * 1000,
    mode: 'user',
    message: 'User rate limit exceeded.',
  });

/**
 * API key authenticated endpoint rate limiting
 * 1000 requests per minute per API key
 * For endpoints protected with API keys
 *
 * @example
 * ```typescript
 * @RateLimitApiKey()
 * @UseGuards(ApiKeyGuard)
 * @Post('/licenses/issue')
 * async issueLicense() { }
 * ```
 */
export const RateLimitApiKey = () =>
  RateLimit({
    limit: 1000,
    windowMs: 60 * 1000,
    mode: 'api-key',
    message: 'API key rate limit exceeded.',
  });

/**
 * Admin endpoint rate limiting
 * 300 requests per minute per admin user
 * For admin-only endpoints
 *
 * @example
 * ```typescript
 * @RateLimitAdmin()
 * @UseGuards(JwtAuthGuard, AdminGuard)
 * @Post('/super-admins/create')
 * async createAdmin() { }
 * ```
 */
export const RateLimitAdmin = () =>
  RateLimit({
    limit: 300,
    windowMs: 60 * 1000,
    mode: 'user',
    message: 'Admin endpoint rate limit exceeded.',
  });

/**
 * Sensitive operation rate limiting (very strict)
 * 10 requests per minute by IP
 * For sensitive operations like key deletion
 *
 * @example
 * ```typescript
 * @RateLimitSensitive()
 * @Delete('/api-keys/:id')
 * async deleteApiKey() { }
 * ```
 */
export const RateLimitSensitive = () =>
  RateLimit({
    limit: 10,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Too many requests to this sensitive endpoint. Please try again later.',
  });

/**
 * License verification rate limiting
 * 100 requests per minute per IP
 * For public license verification endpoint
 *
 * @example
 * ```typescript
 * @RateLimitLicenseVerify()
 * @Post('/licenses/verify')
 * async verifyLicense() { }
 * ```
 */
export const RateLimitLicenseVerify = () =>
  RateLimit({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'License verification rate limit exceeded.',
  });

/**
 * Feature check rate limiting
 * 100 requests per minute per IP
 * For public feature checking endpoint
 *
 * @example
 * ```typescript
 * @RateLimitFeatureCheck()
 * @Post('/licenses/check-feature')
 * async checkFeature() { }
 * ```
 */
export const RateLimitFeatureCheck = () =>
  RateLimit({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Feature check rate limit exceeded.',
  });

/**
 * API key validation rate limiting
 * 100 requests per minute by IP
 * For public API key validation endpoint
 *
 * @example
 * ```typescript
 * @RateLimitApiKeyValidation()
 * @Post('/api-keys/validate')
 * async validateApiKey() { }
 * ```
 */
export const RateLimitApiKeyValidation = () =>
  RateLimit({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API key validation rate limit exceeded.',
  });

/**
 * API key management rate limiting (strict)
 * 10 requests per minute by IP (prevent key enumeration)
 * For API key CRUD operations
 *
 * @example
 * ```typescript
 * @RateLimitApiKeyManagement()
 * @Post('/api-keys')
 * async createApiKey() { }
 * ```
 */
export const RateLimitApiKeyManagement = () =>
  RateLimit({
    limit: 10,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API key management rate limit exceeded.',
  });

/**
 * Custom rate limit with manual configuration
 *
 * @param limit - Maximum requests
 * @param windowMinutes - Time window in minutes
 * @param mode - Limiting mode
 * @param message - Error message
 *
 * @example
 * ```typescript
 * @RateLimitCustom(50, 1, 'ip', 'Custom limit exceeded')
 * @Get('/custom-endpoint')
 * async customEndpoint() { }
 * ```
 */
export const RateLimitCustom = (
  limit: number,
  windowMinutes: number = 1,
  mode: 'ip' | 'user' | 'api-key' | 'institute' = 'ip',
  message?: string,
) =>
  RateLimit({
    limit,
    windowMs: windowMinutes * 60 * 1000,
    mode,
    message: message || `Rate limit of ${limit} requests per ${windowMinutes} minute(s) exceeded.`,
  });

/**
 * No rate limiting
 * Explicitly disable rate limiting for an endpoint
 *
 * @example
 * ```typescript
 * @RateLimitDisabled()
 * @Get('/internal-metrics')
 * async getMetrics() { }
 * ```
 */
export const RateLimitDisabled = () =>
  RateLimit({
    limit: Number.MAX_SAFE_INTEGER,
    windowMs: 1000,
    skip: true,
  });
