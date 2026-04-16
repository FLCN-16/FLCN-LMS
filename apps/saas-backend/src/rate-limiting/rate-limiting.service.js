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
exports.RateLimitingService = void 0;
const common_1 = require("@nestjs/common");
const rate_limiting_config_1 = require("./rate-limiting.config");
/**
 * Rate Limiting Service
 *
 * Provides rate limiting functionality with support for:
 * - IP-based limiting
 * - User-based limiting
 * - API key-based limiting
 * - Institute-based limiting
 * - Multiple algorithms (sliding window, token bucket)
 *
 * Current: In-memory storage (suitable for development)
 * Future: Redis backend for production and horizontal scaling
 */
let RateLimitingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RateLimitingService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RateLimitingService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        store = {};
        strategy = rate_limiting_config_1.RateLimitStrategy.SLIDING_WINDOW;
        cleanupInterval = null;
        constructor() {
            // Clean up expired records every 5 minutes
            this.startCleanupInterval();
        }
        /**
         * Check if a request is allowed based on IP and endpoint
         */
        async checkRateLimitByIp(ip, endpoint, limit, windowMs) {
            const key = rate_limiting_config_1.RATE_LIMIT_KEYS.byIp(ip, endpoint);
            return this.checkRateLimit(key, limit, windowMs);
        }
        /**
         * Check if a request is allowed based on user and endpoint
         */
        async checkRateLimitByUser(userId, endpoint, limit, windowMs) {
            const key = rate_limiting_config_1.RATE_LIMIT_KEYS.byUser(userId, endpoint);
            return this.checkRateLimit(key, limit, windowMs);
        }
        /**
         * Check if a request is allowed based on API key
         */
        async checkRateLimitByApiKey(keyId, endpoint, limit, windowMs) {
            const key = rate_limiting_config_1.RATE_LIMIT_KEYS.byApiKey(keyId, endpoint);
            return this.checkRateLimit(key, limit, windowMs);
        }
        /**
         * Check if a request is allowed based on institute
         */
        async checkRateLimitByInstitute(instituteId, endpoint, limit, windowMs) {
            const key = rate_limiting_config_1.RATE_LIMIT_KEYS.byInstitute(instituteId, endpoint);
            return this.checkRateLimit(key, limit, windowMs);
        }
        /**
         * Core rate limit check using sliding window counter
         */
        async checkRateLimit(key, limit, windowMs) {
            const now = Date.now();
            const record = this.store[key];
            if (!record) {
                // First request in this window
                this.store[key] = {
                    count: 1,
                    resetTime: now + windowMs,
                };
                return {
                    allowed: true,
                    remaining: limit - 1,
                    resetTime: now + windowMs,
                };
            }
            // Check if window has expired
            if (now >= record.resetTime) {
                // Reset window
                this.store[key] = {
                    count: 1,
                    resetTime: now + windowMs,
                };
                return {
                    allowed: true,
                    remaining: limit - 1,
                    resetTime: now + windowMs,
                };
            }
            // Within current window
            record.count++;
            const remaining = Math.max(0, limit - record.count);
            const allowed = record.count <= limit;
            return {
                allowed,
                remaining,
                resetTime: record.resetTime,
            };
        }
        /**
         * Token bucket rate limiting
         * Allows burst traffic within limits
         */
        async checkTokenBucket(key, capacity, refillRate, tokensNeeded = 1) {
            const now = Date.now();
            const record = this.store[key];
            if (!record) {
                this.store[key] = {
                    tokens: capacity,
                    lastRequestTime: now,
                    count: 0,
                    resetTime: now + rate_limiting_config_1.RATE_LIMIT_WINDOWS.HOUR,
                };
            }
            const timePassed = (now - (record.lastRequestTime || now)) / 1000; // in seconds
            const tokensToAdd = timePassed * refillRate;
            record.tokens = Math.min(capacity, (record.tokens || 0) + tokensToAdd);
            record.lastRequestTime = now;
            const allowed = record.tokens >= tokensNeeded;
            if (allowed) {
                record.tokens -= tokensNeeded;
            }
            return {
                allowed,
                tokensRemaining: Math.floor(record.tokens || 0),
            };
        }
        /**
         * Get current rate limit status for a key
         */
        async getStatus(key) {
            const record = this.store[key];
            if (!record) {
                return null;
            }
            const now = Date.now();
            const resetIn = Math.max(0, record.resetTime - now);
            return {
                count: record.count,
                resetTime: record.resetTime,
                resetIn,
            };
        }
        /**
         * Reset rate limit for a specific key
         */
        async reset(key) {
            delete this.store[key];
        }
        /**
         * Reset all rate limits for an endpoint
         */
        async resetByEndpoint(endpoint) {
            const keys = Object.keys(this.store).filter((k) => k.includes(endpoint));
            keys.forEach((key) => delete this.store[key]);
            return keys.length;
        }
        /**
         * Reset all rate limits
         */
        async resetAll() {
            this.store = {};
        }
        /**
         * Get statistics about current rate limits
         */
        getStatistics() {
            const now = Date.now();
            let activeKeys = 0;
            let expiredKeys = 0;
            Object.values(this.store).forEach((record) => {
                if (now < record.resetTime) {
                    activeKeys++;
                }
                else {
                    expiredKeys++;
                }
            });
            return {
                totalKeys: Object.keys(this.store).length,
                activeKeys,
                expiredKeys,
            };
        }
        /**
         * Get formatted rate limit response
         */
        formatResponse(limit, remaining, resetTime) {
            return (0, rate_limiting_config_1.formatRateLimitResponse)(limit, remaining, resetTime);
        }
        /**
         * Clean up expired records
         * Runs periodically to prevent memory leaks
         */
        startCleanupInterval() {
            this.cleanupInterval = setInterval(() => {
                this.cleanupExpiredRecords();
            }, 5 * 60 * 1000); // Every 5 minutes
        }
        /**
         * Clean up resources on application shutdown
         */
        onApplicationShutdown() {
            if (this.cleanupInterval) {
                clearInterval(this.cleanupInterval);
                this.cleanupInterval = null;
            }
        }
        /**
         * Remove expired rate limit records
         */
        cleanupExpiredRecords() {
            const now = Date.now();
            const keysToDelete = [];
            Object.entries(this.store).forEach(([key, record]) => {
                if (now >= record.resetTime) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach((key) => delete this.store[key]);
            if (keysToDelete.length > 0) {
                console.log(`[RateLimiting] Cleaned up ${keysToDelete.length} expired records`);
            }
        }
        /**
         * Create rate limit exception
         */
        createRateLimitException(remaining, resetTime, message) {
            const retryAfter = (0, rate_limiting_config_1.calculateRetryAfter)(resetTime, Date.now());
            const defaultMessage = message || 'Too many requests, please try again after some time.';
            const exception = new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: defaultMessage,
                retryAfter,
                resetAt: new Date(resetTime).toISOString(),
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            // Add headers
            exception.getResponse = function () {
                const response = {
                    statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    message: defaultMessage,
                    retryAfter,
                    resetAt: new Date(resetTime).toISOString(),
                };
                // Add rate limit headers to response
                setTimeout(() => {
                    // Headers will be added by interceptor
                }, 0);
                return response;
            };
            return exception;
        }
        /**
         * Increment counter for a key
         */
        async increment(key, amount = 1) {
            if (!this.store[key]) {
                this.store[key] = {
                    count: 0,
                    resetTime: Date.now() + rate_limiting_config_1.RATE_LIMIT_WINDOWS.HOUR,
                };
            }
            this.store[key].count += amount;
            return this.store[key].count;
        }
        /**
         * Decrement counter for a key
         */
        async decrement(key, amount = 1) {
            if (!this.store[key]) {
                return 0;
            }
            this.store[key].count = Math.max(0, this.store[key].count - amount);
            return this.store[key].count;
        }
        /**
         * Get counter value
         */
        async getCounter(key) {
            return this.store[key]?.count || 0;
        }
        /**
         * Set counter value
         */
        async setCounter(key, value, expiresIn) {
            this.store[key] = {
                count: value,
                resetTime: expiresIn
                    ? Date.now() + expiresIn
                    : Date.now() + rate_limiting_config_1.RATE_LIMIT_WINDOWS.HOUR,
            };
        }
        /**
         * Check if key is rate limited
         */
        async isRateLimited(key, limit) {
            const counter = await this.getCounter(key);
            return counter > limit;
        }
        /**
         * Get remaining requests for a key
         */
        async getRemaining(key, limit) {
            const counter = await this.getCounter(key);
            return Math.max(0, limit - counter);
        }
    };
    return RateLimitingService = _classThis;
})();
exports.RateLimitingService = RateLimitingService;
