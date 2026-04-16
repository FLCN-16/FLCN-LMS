import { HttpException, OnApplicationShutdown } from '@nestjs/common';
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
export declare class RateLimitingService implements OnApplicationShutdown {
    private store;
    private readonly strategy;
    private cleanupInterval;
    constructor();
    /**
     * Check if a request is allowed based on IP and endpoint
     */
    checkRateLimitByIp(ip: string, endpoint: string, limit: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }>;
    /**
     * Check if a request is allowed based on user and endpoint
     */
    checkRateLimitByUser(userId: string, endpoint: string, limit: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }>;
    /**
     * Check if a request is allowed based on API key
     */
    checkRateLimitByApiKey(keyId: string, endpoint: string, limit: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }>;
    /**
     * Check if a request is allowed based on institute
     */
    checkRateLimitByInstitute(instituteId: string, endpoint: string, limit: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }>;
    /**
     * Core rate limit check using sliding window counter
     */
    checkRateLimit(key: string, limit: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }>;
    /**
     * Token bucket rate limiting
     * Allows burst traffic within limits
     */
    checkTokenBucket(key: string, capacity: number, refillRate: number, tokensNeeded?: number): Promise<{
        allowed: boolean;
        tokensRemaining: number;
    }>;
    /**
     * Get current rate limit status for a key
     */
    getStatus(key: string): Promise<{
        count: number;
        resetTime: number;
        resetIn: number;
    } | null>;
    /**
     * Reset rate limit for a specific key
     */
    reset(key: string): Promise<void>;
    /**
     * Reset all rate limits for an endpoint
     */
    resetByEndpoint(endpoint: string): Promise<number>;
    /**
     * Reset all rate limits
     */
    resetAll(): Promise<void>;
    /**
     * Get statistics about current rate limits
     */
    getStatistics(): {
        totalKeys: number;
        activeKeys: number;
        expiredKeys: number;
    };
    /**
     * Get formatted rate limit response
     */
    formatResponse(limit: number, remaining: number, resetTime: number): {
        limit: number;
        remaining: number;
        resetAt: string;
        resetIn: number;
    };
    /**
     * Clean up expired records
     * Runs periodically to prevent memory leaks
     */
    private startCleanupInterval;
    /**
     * Clean up resources on application shutdown
     */
    onApplicationShutdown(): void;
    /**
     * Remove expired rate limit records
     */
    private cleanupExpiredRecords;
    /**
     * Create rate limit exception
     */
    createRateLimitException(remaining: number, resetTime: number, message?: string): HttpException;
    /**
     * Increment counter for a key
     */
    increment(key: string, amount?: number): Promise<number>;
    /**
     * Decrement counter for a key
     */
    decrement(key: string, amount?: number): Promise<number>;
    /**
     * Get counter value
     */
    getCounter(key: string): Promise<number>;
    /**
     * Set counter value
     */
    setCounter(key: string, value: number, expiresIn?: number): Promise<void>;
    /**
     * Check if key is rate limited
     */
    isRateLimited(key: string, limit: number): Promise<boolean>;
    /**
     * Get remaining requests for a key
     */
    getRemaining(key: string, limit: number): Promise<number>;
}
//# sourceMappingURL=rate-limiting.service.d.ts.map