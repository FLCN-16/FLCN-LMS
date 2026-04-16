"use strict";
/**
 * Rate Limiting Configuration
 *
 * Defines rate limiting strategies for different endpoint types and user roles
 * Supports per-minute, per-hour, and per-day limits
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitStrategy = exports.RATE_LIMIT_ERROR_CODES = exports.RATE_LIMIT_HEADERS = exports.RATE_LIMIT_KEYS = exports.RATE_LIMIT_SKIP_CONDITIONS = exports.ENDPOINT_RATE_LIMITS = exports.RATE_LIMIT_WINDOWS = exports.RATE_LIMIT_PRESETS = void 0;
exports.getClientIp = getClientIp;
exports.extractApiKeyFromHeader = extractApiKeyFromHeader;
exports.calculateRetryAfter = calculateRetryAfter;
exports.formatRateLimitResponse = formatRateLimitResponse;
exports.getRateLimitPresetByRole = getRateLimitPresetByRole;
exports.windowMsToSeconds = windowMsToSeconds;
exports.isRateLimitedEndpoint = isRateLimitedEndpoint;
exports.getRateLimitForEndpoint = getRateLimitForEndpoint;
/**
 * Rate Limiting Presets
 * Define default limits for different endpoint categories
 */
exports.RATE_LIMIT_PRESETS = {
    // Public endpoints (no authentication required)
    PUBLIC: {
        windowMs: 60 * 1000, // 1 minute
        max: 30, // 30 requests per minute
        message: 'Too many requests from this IP, please try again later.',
    },
    // Public API endpoints (validation, verification)
    PUBLIC_API: {
        windowMs: 60 * 1000, // 1 minute
        max: 100, // 100 requests per minute
        message: 'License verification rate limit exceeded. Please try again in a moment.',
    },
    // Authenticated endpoints (with JWT token)
    AUTHENTICATED: {
        windowMs: 60 * 1000, // 1 minute
        max: 500, // 500 requests per minute per user
        message: 'Too many requests, please try again later.',
    },
    // API Key authenticated endpoints
    API_KEY: {
        windowMs: 60 * 1000, // 1 minute
        max: 1000, // 1000 requests per minute per key (but can be customized per key)
        message: 'API key rate limit exceeded.',
    },
    // Admin endpoints
    ADMIN: {
        windowMs: 60 * 1000, // 1 minute
        max: 300, // 300 requests per minute for admins
        message: 'Admin endpoint rate limit exceeded.',
    },
    // Authentication endpoints (login, register, password reset)
    AUTH: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts per 15 minutes
        message: 'Too many login attempts, please try again after 15 minutes.',
    },
    // Strict limits for sensitive operations
    SENSITIVE: {
        windowMs: 60 * 1000, // 1 minute
        max: 10, // 10 requests per minute
        message: 'Too many requests to this sensitive endpoint, please try again later.',
    },
};
/**
 * Rate Limit Time Windows
 */
exports.RATE_LIMIT_WINDOWS = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
    TEN_MINUTES: 10 * 60 * 1000,
    FIFTEEN_MINUTES: 15 * 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
};
/**
 * Endpoint-Specific Rate Limits
 */
exports.ENDPOINT_RATE_LIMITS = {
    // Authentication endpoints
    'POST /auth/login': exports.RATE_LIMIT_PRESETS.AUTH,
    'POST /auth/register': exports.RATE_LIMIT_PRESETS.AUTH,
    'POST /auth/password-reset': exports.RATE_LIMIT_PRESETS.AUTH,
    // Public API endpoints
    'POST /licenses/verify': exports.RATE_LIMIT_PRESETS.PUBLIC_API,
    'POST /licenses/check-feature': exports.RATE_LIMIT_PRESETS.PUBLIC_API,
    'POST /api-keys/validate': exports.RATE_LIMIT_PRESETS.PUBLIC_API,
    // API Key authenticated endpoints
    'GET /licenses': exports.RATE_LIMIT_PRESETS.API_KEY,
    'POST /licenses/issue': exports.RATE_LIMIT_PRESETS.API_KEY,
    'PUT /licenses/:id': exports.RATE_LIMIT_PRESETS.API_KEY,
    'DELETE /licenses/:id': exports.RATE_LIMIT_PRESETS.API_KEY,
    // API Key management (sensitive)
    'POST /api-keys': exports.RATE_LIMIT_PRESETS.SENSITIVE,
    'DELETE /api-keys/:keyId': exports.RATE_LIMIT_PRESETS.SENSITIVE,
};
/**
 * Skip conditions for rate limiting
 * Return true to skip rate limiting for the request
 */
exports.RATE_LIMIT_SKIP_CONDITIONS = {
    /**
     * Skip rate limiting for health checks
     */
    healthCheck: (req) => {
        return (req.path === '/health' || req.path === '/healthz' || req.path === '/ping');
    },
    /**
     * Skip rate limiting for admin IPs (if configured)
     */
    adminIp: (req, adminIps = []) => {
        if (adminIps.length === 0)
            return false;
        const clientIp = getClientIp(req);
        return adminIps.includes(clientIp);
    },
    /**
     * Skip rate limiting for specific API keys (e.g., internal services)
     */
    whitelistApiKey: (req, whitelistKeys = []) => {
        if (whitelistKeys.length === 0)
            return false;
        const key = extractApiKeyFromHeader(req);
        return key ? whitelistKeys.includes(key) : false;
    },
};
/**
 * Rate Limit Storage Keys
 * Used for Redis or in-memory storage
 */
exports.RATE_LIMIT_KEYS = {
    /**
     * Generate a rate limit key for IP-based limiting
     */
    byIp: (ip, endpoint) => `rate-limit:ip:${ip}:${endpoint}`,
    /**
     * Generate a rate limit key for user-based limiting
     */
    byUser: (userId, endpoint) => `rate-limit:user:${userId}:${endpoint}`,
    /**
     * Generate a rate limit key for API key-based limiting
     */
    byApiKey: (keyId, endpoint) => `rate-limit:key:${keyId}:${endpoint}`,
    /**
     * Generate a rate limit key for institute-based limiting
     */
    byInstitute: (instituteId, endpoint) => `rate-limit:institute:${instituteId}:${endpoint}`,
};
/**
 * Rate Limit Response Headers
 */
exports.RATE_LIMIT_HEADERS = {
    LIMIT: 'X-RateLimit-Limit',
    REMAINING: 'X-RateLimit-Remaining',
    RESET: 'X-RateLimit-Reset',
    RETRY_AFTER: 'Retry-After',
};
/**
 * Rate Limit Error Codes
 */
exports.RATE_LIMIT_ERROR_CODES = {
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
};
/**
 * Rate Limit Strategies
 */
var RateLimitStrategy;
(function (RateLimitStrategy) {
    /**
     * Sliding window counter
     * Counts requests in a rolling window
     */
    RateLimitStrategy["SLIDING_WINDOW"] = "sliding_window";
    /**
     * Fixed window counter
     * Resets at fixed time boundaries
     */
    RateLimitStrategy["FIXED_WINDOW"] = "fixed_window";
    /**
     * Token bucket
     * Allows burst traffic within limits
     */
    RateLimitStrategy["TOKEN_BUCKET"] = "token_bucket";
    /**
     * Leaky bucket
     * Smooths out request rates
     */
    RateLimitStrategy["LEAKY_BUCKET"] = "leaky_bucket";
})(RateLimitStrategy || (exports.RateLimitStrategy = RateLimitStrategy = {}));
/**
 * Utility Functions
 */
/**
 * Extract client IP address from request
 */
function getClientIp(req) {
    return (req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        'unknown');
}
/**
 * Extract API key from Authorization header
 */
function extractApiKeyFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return null;
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return authHeader;
}
/**
 * Calculate retry-after value in seconds
 */
function calculateRetryAfter(resetTime, currentTime) {
    return Math.ceil((resetTime - currentTime) / 1000);
}
/**
 * Format rate limit response
 */
function formatRateLimitResponse(limit, remaining, resetTime) {
    const now = Date.now();
    return {
        limit,
        remaining: Math.max(0, remaining),
        resetAt: new Date(resetTime).toISOString(),
        resetIn: calculateRetryAfter(resetTime, now),
    };
}
/**
 * Determine rate limit preset based on user role
 */
function getRateLimitPresetByRole(role) {
    switch (role) {
        case 'admin':
            return exports.RATE_LIMIT_PRESETS.ADMIN;
        case 'authenticated':
            return exports.RATE_LIMIT_PRESETS.AUTHENTICATED;
        case 'api_key':
            return exports.RATE_LIMIT_PRESETS.API_KEY;
        case 'service':
            return { ...exports.RATE_LIMIT_PRESETS.API_KEY, max: 10000 };
        case 'public':
        default:
            return exports.RATE_LIMIT_PRESETS.PUBLIC;
    }
}
/**
 * Convert rate limit window to seconds
 */
function windowMsToSeconds(windowMs) {
    return Math.ceil(windowMs / 1000);
}
/**
 * Check if rate limit applies to endpoint
 */
function isRateLimitedEndpoint(method, path) {
    const endpoint = `${method} ${path}`;
    return endpoint in exports.ENDPOINT_RATE_LIMITS;
}
/**
 * Get rate limit config for endpoint
 */
function getRateLimitForEndpoint(method, path) {
    const endpoint = `${method} ${path}`;
    return (exports.ENDPOINT_RATE_LIMITS[endpoint] || null);
}
