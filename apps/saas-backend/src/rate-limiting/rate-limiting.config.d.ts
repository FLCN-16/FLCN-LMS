/**
 * Rate Limiting Configuration
 *
 * Defines rate limiting strategies for different endpoint types and user roles
 * Supports per-minute, per-hour, and per-day limits
 */
/**
 * Rate Limiting Presets
 * Define default limits for different endpoint categories
 */
export declare const RATE_LIMIT_PRESETS: {
    PUBLIC: {
        windowMs: number;
        max: number;
        message: string;
    };
    PUBLIC_API: {
        windowMs: number;
        max: number;
        message: string;
    };
    AUTHENTICATED: {
        windowMs: number;
        max: number;
        message: string;
    };
    API_KEY: {
        windowMs: number;
        max: number;
        message: string;
    };
    ADMIN: {
        windowMs: number;
        max: number;
        message: string;
    };
    AUTH: {
        windowMs: number;
        max: number;
        message: string;
    };
    SENSITIVE: {
        windowMs: number;
        max: number;
        message: string;
    };
};
/**
 * Rate Limit Time Windows
 */
export declare const RATE_LIMIT_WINDOWS: {
    SECOND: number;
    MINUTE: number;
    FIVE_MINUTES: number;
    TEN_MINUTES: number;
    FIFTEEN_MINUTES: number;
    HOUR: number;
    DAY: number;
};
/**
 * Endpoint-Specific Rate Limits
 */
export declare const ENDPOINT_RATE_LIMITS: {
    'POST /auth/login': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /auth/register': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /auth/password-reset': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /licenses/verify': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /licenses/check-feature': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /api-keys/validate': {
        windowMs: number;
        max: number;
        message: string;
    };
    'GET /licenses': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /licenses/issue': {
        windowMs: number;
        max: number;
        message: string;
    };
    'PUT /licenses/:id': {
        windowMs: number;
        max: number;
        message: string;
    };
    'DELETE /licenses/:id': {
        windowMs: number;
        max: number;
        message: string;
    };
    'POST /api-keys': {
        windowMs: number;
        max: number;
        message: string;
    };
    'DELETE /api-keys/:keyId': {
        windowMs: number;
        max: number;
        message: string;
    };
};
/**
 * Skip conditions for rate limiting
 * Return true to skip rate limiting for the request
 */
export declare const RATE_LIMIT_SKIP_CONDITIONS: {
    /**
     * Skip rate limiting for health checks
     */
    healthCheck: (req: any) => boolean;
    /**
     * Skip rate limiting for admin IPs (if configured)
     */
    adminIp: (req: any, adminIps?: string[]) => boolean;
    /**
     * Skip rate limiting for specific API keys (e.g., internal services)
     */
    whitelistApiKey: (req: any, whitelistKeys?: string[]) => boolean;
};
/**
 * Rate Limit Storage Keys
 * Used for Redis or in-memory storage
 */
export declare const RATE_LIMIT_KEYS: {
    /**
     * Generate a rate limit key for IP-based limiting
     */
    byIp: (ip: string, endpoint: string) => string;
    /**
     * Generate a rate limit key for user-based limiting
     */
    byUser: (userId: string, endpoint: string) => string;
    /**
     * Generate a rate limit key for API key-based limiting
     */
    byApiKey: (keyId: string, endpoint: string) => string;
    /**
     * Generate a rate limit key for institute-based limiting
     */
    byInstitute: (instituteId: string, endpoint: string) => string;
};
/**
 * Rate Limit Response Headers
 */
export declare const RATE_LIMIT_HEADERS: {
    LIMIT: string;
    REMAINING: string;
    RESET: string;
    RETRY_AFTER: string;
};
/**
 * Rate Limit Error Codes
 */
export declare const RATE_LIMIT_ERROR_CODES: {
    RATE_LIMIT_EXCEEDED: string;
    TOO_MANY_REQUESTS: string;
    QUOTA_EXCEEDED: string;
};
/**
 * Rate Limit Strategies
 */
export declare enum RateLimitStrategy {
    /**
     * Sliding window counter
     * Counts requests in a rolling window
     */
    SLIDING_WINDOW = "sliding_window",
    /**
     * Fixed window counter
     * Resets at fixed time boundaries
     */
    FIXED_WINDOW = "fixed_window",
    /**
     * Token bucket
     * Allows burst traffic within limits
     */
    TOKEN_BUCKET = "token_bucket",
    /**
     * Leaky bucket
     * Smooths out request rates
     */
    LEAKY_BUCKET = "leaky_bucket"
}
/**
 * Utility Functions
 */
/**
 * Extract client IP address from request
 */
export declare function getClientIp(req: any): string;
/**
 * Extract API key from Authorization header
 */
export declare function extractApiKeyFromHeader(req: any): string | null;
/**
 * Calculate retry-after value in seconds
 */
export declare function calculateRetryAfter(resetTime: number, currentTime: number): number;
/**
 * Format rate limit response
 */
export declare function formatRateLimitResponse(limit: number, remaining: number, resetTime: number): {
    limit: number;
    remaining: number;
    resetAt: string;
    resetIn: number;
};
/**
 * Determine rate limit preset based on user role
 */
export declare function getRateLimitPresetByRole(role: 'public' | 'authenticated' | 'api_key' | 'admin' | 'service'): typeof RATE_LIMIT_PRESETS.PUBLIC;
/**
 * Convert rate limit window to seconds
 */
export declare function windowMsToSeconds(windowMs: number): number;
/**
 * Check if rate limit applies to endpoint
 */
export declare function isRateLimitedEndpoint(method: string, path: string): boolean;
/**
 * Get rate limit config for endpoint
 */
export declare function getRateLimitForEndpoint(method: string, path: string): typeof RATE_LIMIT_PRESETS.PUBLIC | null;
//# sourceMappingURL=rate-limiting.config.d.ts.map