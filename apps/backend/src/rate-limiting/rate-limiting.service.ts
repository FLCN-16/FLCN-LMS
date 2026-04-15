import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';

import {
  calculateRetryAfter,
  formatRateLimitResponse,
  RATE_LIMIT_KEYS,
  RATE_LIMIT_WINDOWS,
  RateLimitStrategy,
  windowMsToSeconds,
} from './rate-limiting.config';

/**
 * In-memory store for rate limiting data
 * In production, this would be replaced with Redis
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
  tokens?: number;
  lastRequestTime?: number;
}

interface RateLimitStore {
  [key: string]: RateLimitRecord;
}

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
@Injectable()
export class RateLimitingService implements OnApplicationShutdown {
  private store: RateLimitStore = {};
  private readonly strategy: RateLimitStrategy =
    RateLimitStrategy.SLIDING_WINDOW;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired records every 5 minutes
    this.startCleanupInterval();
  }

  /**
   * Check if a request is allowed based on IP and endpoint
   */
  async checkRateLimitByIp(
    ip: string,
    endpoint: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = RATE_LIMIT_KEYS.byIp(ip, endpoint);
    return this.checkRateLimit(key, limit, windowMs);
  }

  /**
   * Check if a request is allowed based on user and endpoint
   */
  async checkRateLimitByUser(
    userId: string,
    endpoint: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = RATE_LIMIT_KEYS.byUser(userId, endpoint);
    return this.checkRateLimit(key, limit, windowMs);
  }

  /**
   * Check if a request is allowed based on API key
   */
  async checkRateLimitByApiKey(
    keyId: string,
    endpoint: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = RATE_LIMIT_KEYS.byApiKey(keyId, endpoint);
    return this.checkRateLimit(key, limit, windowMs);
  }

  /**
   * Check if a request is allowed based on institute
   */
  async checkRateLimitByInstitute(
    instituteId: string,
    endpoint: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = RATE_LIMIT_KEYS.byInstitute(instituteId, endpoint);
    return this.checkRateLimit(key, limit, windowMs);
  }

  /**
   * Core rate limit check using sliding window counter
   */
  async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
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
  async checkTokenBucket(
    key: string,
    capacity: number,
    refillRate: number,
    tokensNeeded: number = 1,
  ): Promise<{ allowed: boolean; tokensRemaining: number }> {
    const now = Date.now();
    const record = this.store[key];

    if (!record) {
      this.store[key] = {
        tokens: capacity,
        lastRequestTime: now,
        count: 0,
        resetTime: now + RATE_LIMIT_WINDOWS.HOUR,
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
  async getStatus(
    key: string,
  ): Promise<{ count: number; resetTime: number; resetIn: number } | null> {
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
  async reset(key: string): Promise<void> {
    delete this.store[key];
  }

  /**
   * Reset all rate limits for an endpoint
   */
  async resetByEndpoint(endpoint: string): Promise<number> {
    const keys = Object.keys(this.store).filter((k) => k.includes(endpoint));
    keys.forEach((key) => delete this.store[key]);
    return keys.length;
  }

  /**
   * Reset all rate limits
   */
  async resetAll(): Promise<void> {
    this.store = {};
  }

  /**
   * Get statistics about current rate limits
   */
  getStatistics(): {
    totalKeys: number;
    activeKeys: number;
    expiredKeys: number;
  } {
    const now = Date.now();
    let activeKeys = 0;
    let expiredKeys = 0;

    Object.values(this.store).forEach((record) => {
      if (now < record.resetTime) {
        activeKeys++;
      } else {
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
  formatResponse(
    limit: number,
    remaining: number,
    resetTime: number,
  ): {
    limit: number;
    remaining: number;
    resetAt: string;
    resetIn: number;
  } {
    return formatRateLimitResponse(limit, remaining, resetTime);
  }

  /**
   * Clean up expired records
   * Runs periodically to prevent memory leaks
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredRecords();
      },
      5 * 60 * 1000,
    ); // Every 5 minutes
  }

  /**
   * Clean up resources on application shutdown
   */
  onApplicationShutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Remove expired rate limit records
   */
  private cleanupExpiredRecords(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    Object.entries(this.store).forEach(([key, record]) => {
      if (now >= record.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => delete this.store[key]);

    if (keysToDelete.length > 0) {
      console.log(
        `[RateLimiting] Cleaned up ${keysToDelete.length} expired records`,
      );
    }
  }

  /**
   * Create rate limit exception
   */
  createRateLimitException(
    remaining: number,
    resetTime: number,
    message?: string,
  ): HttpException {
    const retryAfter = calculateRetryAfter(resetTime, Date.now());
    const defaultMessage =
      message || 'Too many requests, please try again after some time.';

    const exception = new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: defaultMessage,
        retryAfter,
        resetAt: new Date(resetTime).toISOString(),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );

    // Add headers
    exception.getResponse = function () {
      const response = {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
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
  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: Date.now() + RATE_LIMIT_WINDOWS.HOUR,
      };
    }

    this.store[key].count += amount;
    return this.store[key].count;
  }

  /**
   * Decrement counter for a key
   */
  async decrement(key: string, amount: number = 1): Promise<number> {
    if (!this.store[key]) {
      return 0;
    }

    this.store[key].count = Math.max(0, this.store[key].count - amount);
    return this.store[key].count;
  }

  /**
   * Get counter value
   */
  async getCounter(key: string): Promise<number> {
    return this.store[key]?.count || 0;
  }

  /**
   * Set counter value
   */
  async setCounter(
    key: string,
    value: number,
    expiresIn?: number,
  ): Promise<void> {
    this.store[key] = {
      count: value,
      resetTime: expiresIn
        ? Date.now() + expiresIn
        : Date.now() + RATE_LIMIT_WINDOWS.HOUR,
    };
  }

  /**
   * Check if key is rate limited
   */
  async isRateLimited(key: string, limit: number): Promise<boolean> {
    const counter = await this.getCounter(key);
    return counter > limit;
  }

  /**
   * Get remaining requests for a key
   */
  async getRemaining(key: string, limit: number): Promise<number> {
    const counter = await this.getCounter(key);
    return Math.max(0, limit - counter);
  }
}
