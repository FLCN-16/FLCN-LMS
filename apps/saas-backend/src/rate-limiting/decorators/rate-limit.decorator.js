"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitDisabled = exports.RateLimitCustom = exports.RateLimitApiKeyManagement = exports.RateLimitApiKeyValidation = exports.RateLimitFeatureCheck = exports.RateLimitLicenseVerify = exports.RateLimitSensitive = exports.RateLimitAdmin = exports.RateLimitApiKey = exports.RateLimitAuthenticated = exports.RateLimitAuth = exports.RateLimitPublicApi = exports.RateLimitPublic = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
/**
 * Metadata key for rate limit decorator
 */
exports.RATE_LIMIT_KEY = 'rate_limit';
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
const RateLimit = (options) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, options);
exports.RateLimit = RateLimit;
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
const RateLimitPublic = () => (0, exports.RateLimit)({
    limit: 30,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Too many requests, please try again later.',
});
exports.RateLimitPublic = RateLimitPublic;
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
const RateLimitPublicApi = () => (0, exports.RateLimit)({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API rate limit exceeded. Please try again in a moment.',
});
exports.RateLimitPublicApi = RateLimitPublicApi;
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
const RateLimitAuth = () => (0, exports.RateLimit)({
    limit: 5,
    windowMs: 15 * 60 * 1000,
    mode: 'ip',
    message: 'Too many login attempts. Please try again after 15 minutes.',
});
exports.RateLimitAuth = RateLimitAuth;
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
const RateLimitAuthenticated = () => (0, exports.RateLimit)({
    limit: 500,
    windowMs: 60 * 1000,
    mode: 'user',
    message: 'User rate limit exceeded.',
});
exports.RateLimitAuthenticated = RateLimitAuthenticated;
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
const RateLimitApiKey = () => (0, exports.RateLimit)({
    limit: 1000,
    windowMs: 60 * 1000,
    mode: 'api-key',
    message: 'API key rate limit exceeded.',
});
exports.RateLimitApiKey = RateLimitApiKey;
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
const RateLimitAdmin = () => (0, exports.RateLimit)({
    limit: 300,
    windowMs: 60 * 1000,
    mode: 'user',
    message: 'Admin endpoint rate limit exceeded.',
});
exports.RateLimitAdmin = RateLimitAdmin;
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
const RateLimitSensitive = () => (0, exports.RateLimit)({
    limit: 10,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Too many requests to this sensitive endpoint. Please try again later.',
});
exports.RateLimitSensitive = RateLimitSensitive;
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
const RateLimitLicenseVerify = () => (0, exports.RateLimit)({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'License verification rate limit exceeded.',
});
exports.RateLimitLicenseVerify = RateLimitLicenseVerify;
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
const RateLimitFeatureCheck = () => (0, exports.RateLimit)({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'Feature check rate limit exceeded.',
});
exports.RateLimitFeatureCheck = RateLimitFeatureCheck;
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
const RateLimitApiKeyValidation = () => (0, exports.RateLimit)({
    limit: 100,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API key validation rate limit exceeded.',
});
exports.RateLimitApiKeyValidation = RateLimitApiKeyValidation;
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
const RateLimitApiKeyManagement = () => (0, exports.RateLimit)({
    limit: 10,
    windowMs: 60 * 1000,
    mode: 'ip',
    message: 'API key management rate limit exceeded.',
});
exports.RateLimitApiKeyManagement = RateLimitApiKeyManagement;
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
const RateLimitCustom = (limit, windowMinutes = 1, mode = 'ip', message) => (0, exports.RateLimit)({
    limit,
    windowMs: windowMinutes * 60 * 1000,
    mode,
    message: message ||
        `Rate limit of ${limit} requests per ${windowMinutes} minute(s) exceeded.`,
});
exports.RateLimitCustom = RateLimitCustom;
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
const RateLimitDisabled = () => (0, exports.RateLimit)({
    limit: Number.MAX_SAFE_INTEGER,
    windowMs: 1000,
    skip: true,
});
exports.RateLimitDisabled = RateLimitDisabled;
