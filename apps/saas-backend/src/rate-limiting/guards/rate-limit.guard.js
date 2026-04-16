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
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
const rate_limiting_config_1 = require("../rate-limiting.config");
/**
 * Rate Limiting Guard
 *
 * Enforces rate limiting on protected endpoints based on:
 * - IP address (IP-based rate limiting)
 * - User ID (authenticated users)
 * - API key (API key-based rate limiting)
 * - Institute ID (organization-level limiting)
 *
 * Rate limit configuration is specified via @RateLimit() decorator
 *
 * Usage:
 * @UseGuards(RateLimitGuard)
 * @RateLimit({ limit: 100, windowMs: 60000, mode: 'ip' })
 * @Post('/endpoint')
 * async endpoint() { }
 */
let RateLimitGuard = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RateLimitGuard = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RateLimitGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        rateLimitingService;
        reflector;
        constructor(rateLimitingService, reflector) {
            this.rateLimitingService = rateLimitingService;
            this.reflector = reflector;
        }
        async canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            // Get rate limit metadata from decorator
            const rateLimitOptions = this.reflector.get(rate_limit_decorator_1.RATE_LIMIT_KEY, context.getHandler());
            // If no rate limit is configured, allow the request
            if (!rateLimitOptions) {
                return true;
            }
            // If rate limiting is explicitly skipped
            if (rateLimitOptions.skip) {
                return true;
            }
            // Get endpoint identifier for logging
            const endpoint = `${request.method} ${request.path}`;
            try {
                // Determine the rate limit key based on mode
                let limitKey;
                let identifier;
                switch (rateLimitOptions.mode || 'ip') {
                    case 'user':
                        identifier = this.extractUserId(request);
                        limitKey = `${identifier}:${endpoint}`;
                        break;
                    case 'api-key':
                        identifier = this.extractApiKeyId(request);
                        limitKey = `${identifier}:${endpoint}`;
                        break;
                    case 'institute':
                        identifier = this.extractInstituteId(request);
                        limitKey = `${identifier}:${endpoint}`;
                        break;
                    case 'ip':
                    default:
                        identifier = (0, rate_limiting_config_1.getClientIp)(request);
                        limitKey = `${identifier}:${endpoint}`;
                        break;
                }
                // Check rate limit
                const result = await this.rateLimitingService.checkRateLimit(limitKey, rateLimitOptions.limit, rateLimitOptions.windowMs);
                // Add rate limit headers to response
                response.setHeader(rate_limiting_config_1.RATE_LIMIT_HEADERS.LIMIT, rateLimitOptions.limit);
                response.setHeader(rate_limiting_config_1.RATE_LIMIT_HEADERS.REMAINING, Math.max(0, result.remaining));
                response.setHeader(rate_limiting_config_1.RATE_LIMIT_HEADERS.RESET, new Date(result.resetTime).toISOString());
                // If rate limited, throw exception
                if (!result.allowed) {
                    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
                    response.setHeader(rate_limiting_config_1.RATE_LIMIT_HEADERS.RETRY_AFTER, retryAfter);
                    throw new common_1.HttpException({
                        statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                        message: rateLimitOptions.message ||
                            'Too many requests, please try again later.',
                        retryAfter,
                        resetAt: new Date(result.resetTime).toISOString(),
                        limit: rateLimitOptions.limit,
                        remaining: 0,
                    }, common_1.HttpStatus.TOO_MANY_REQUESTS);
                }
                return true;
            }
            catch (error) {
                // Re-throw if it's already an HttpException
                if (error instanceof common_1.HttpException) {
                    throw error;
                }
                // Log unexpected errors but allow the request to proceed
                console.error('[RateLimitGuard] Unexpected error:', error);
                return true;
            }
        }
        /**
         * Extract user ID from request
         * Looks for JWT token or user object attached by auth guard
         */
        extractUserId(request) {
            // Try to get from request.user (set by auth guards)
            if (request.user?.id) {
                return `user:${request.user.id}`;
            }
            // Try to get from JWT token
            if (request.headers.authorization) {
                const token = request.headers.authorization.replace('Bearer ', '');
                // In production, you'd decode the JWT here
                return `token:${token.substring(0, 20)}`;
            }
            // Fallback to IP
            return `ip:${(0, rate_limiting_config_1.getClientIp)(request)}`;
        }
        /**
         * Extract API key ID from request
         * API key guard should have attached this to request.apiKey
         */
        extractApiKeyId(request) {
            if (request.apiKey?.keyId) {
                return `key:${request.apiKey.keyId}`;
            }
            // Try to extract from header
            const apiKey = (0, rate_limiting_config_1.extractApiKeyFromHeader)(request);
            if (apiKey) {
                return `key:${apiKey.substring(0, 20)}`;
            }
            // Fallback to IP
            return `ip:${(0, rate_limiting_config_1.getClientIp)(request)}`;
        }
        /**
         * Extract institute ID from request
         * Can be passed via query param, body, or from API key/user context
         */
        extractInstituteId(request) {
            // Try query parameter
            if (request.query?.instituteId) {
                return `institute:${request.query.instituteId}`;
            }
            // Try body
            if (request.body?.instituteId) {
                return `institute:${request.body.instituteId}`;
            }
            // Try from API key context
            if (request.apiKey?.instituteId) {
                return `institute:${request.apiKey.instituteId}`;
            }
            // Try from user context
            if (request.user?.instituteId) {
                return `institute:${request.user.instituteId}`;
            }
            // Fallback to IP
            return `ip:${(0, rate_limiting_config_1.getClientIp)(request)}`;
        }
    };
    return RateLimitGuard = _classThis;
})();
exports.RateLimitGuard = RateLimitGuard;
