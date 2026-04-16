import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitingService } from '../rate-limiting.service';
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
export declare class RateLimitGuard implements CanActivate {
    private rateLimitingService;
    private reflector;
    constructor(rateLimitingService: RateLimitingService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    /**
     * Extract user ID from request
     * Looks for JWT token or user object attached by auth guard
     */
    private extractUserId;
    /**
     * Extract API key ID from request
     * API key guard should have attached this to request.apiKey
     */
    private extractApiKeyId;
    /**
     * Extract institute ID from request
     * Can be passed via query param, body, or from API key/user context
     */
    private extractInstituteId;
}
//# sourceMappingURL=rate-limit.guard.d.ts.map