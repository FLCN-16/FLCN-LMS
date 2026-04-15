import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';
import {
  extractApiKeyFromHeader,
  getClientIp,
  RATE_LIMIT_HEADERS,
} from '../rate-limiting.config';
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
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimitingService: RateLimitingService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Get rate limit metadata from decorator
    const rateLimitOptions = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

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
      let limitKey: string;
      let identifier: string;

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
          identifier = getClientIp(request);
          limitKey = `${identifier}:${endpoint}`;
          break;
      }

      // Check rate limit
      const result = await this.rateLimitingService.checkRateLimit(
        limitKey,
        rateLimitOptions.limit,
        rateLimitOptions.windowMs,
      );

      // Add rate limit headers to response
      response.setHeader(RATE_LIMIT_HEADERS.LIMIT, rateLimitOptions.limit);
      response.setHeader(
        RATE_LIMIT_HEADERS.REMAINING,
        Math.max(0, result.remaining),
      );
      response.setHeader(
        RATE_LIMIT_HEADERS.RESET,
        new Date(result.resetTime).toISOString(),
      );

      // If rate limited, throw exception
      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        response.setHeader(RATE_LIMIT_HEADERS.RETRY_AFTER, retryAfter);

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message:
              rateLimitOptions.message ||
              'Too many requests, please try again later.',
            retryAfter,
            resetAt: new Date(result.resetTime).toISOString(),
            limit: rateLimitOptions.limit,
            remaining: 0,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      // Re-throw if it's already an HttpException
      if (error instanceof HttpException) {
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
  private extractUserId(request: any): string {
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
    return `ip:${getClientIp(request)}`;
  }

  /**
   * Extract API key ID from request
   * API key guard should have attached this to request.apiKey
   */
  private extractApiKeyId(request: any): string {
    if (request.apiKey?.keyId) {
      return `key:${request.apiKey.keyId}`;
    }

    // Try to extract from header
    const apiKey = extractApiKeyFromHeader(request);
    if (apiKey) {
      return `key:${apiKey.substring(0, 20)}`;
    }

    // Fallback to IP
    return `ip:${getClientIp(request)}`;
  }

  /**
   * Extract institute ID from request
   * Can be passed via query param, body, or from API key/user context
   */
  private extractInstituteId(request: any): string {
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
    return `ip:${getClientIp(request)}`;
  }
}
