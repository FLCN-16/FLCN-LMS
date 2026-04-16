"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitingModule = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_guard_1 = require("./guards/rate-limit.guard");
const rate_limiting_service_1 = require("./rate-limiting.service");
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
let RateLimitingModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [rate_limiting_service_1.RateLimitingService, rate_limit_guard_1.RateLimitGuard],
            exports: [rate_limiting_service_1.RateLimitingService, rate_limit_guard_1.RateLimitGuard],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RateLimitingModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RateLimitingModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return RateLimitingModule = _classThis;
})();
exports.RateLimitingModule = RateLimitingModule;
