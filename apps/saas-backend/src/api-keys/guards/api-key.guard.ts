import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ApiKeysService } from '../api-keys.service';

/**
 * API Key Authentication Guard
 *
 * Validates API keys from the Authorization header
 * Format: Authorization: Bearer FLCN_<key>
 * or Authorization: <key>
 *
 * Usage:
 * @UseGuards(ApiKeyGuard)
 * @RequiredScopes('read:licenses', 'write:analytics')
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private apiKeysService: ApiKeysService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract API key from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // Support both "Bearer FLCN_xxx" and "FLCN_xxx" formats
    let apiKey: string;
    if (authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    } else {
      apiKey = authHeader;
    }

    if (!apiKey || apiKey.length === 0) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    // Validate the API key
    const validationResult = await this.apiKeysService.validateKey(apiKey);

    if (!validationResult.isValid) {
      throw new UnauthorizedException(validationResult.message);
    }

    // Check required scopes if specified
    const requiredScopes = this.reflector.get<string[]>(
      'requiredScopes',
      context.getHandler(),
    );

    if (requiredScopes && requiredScopes.length > 0) {
      const hasAllScopes = requiredScopes.every((scope) =>
        validationResult.scopes?.includes(scope),
      );

      if (!hasAllScopes) {
        throw new ForbiddenException(
          `API key missing required scopes: ${requiredScopes.join(', ')}`,
        );
      }
    }

    // Attach key details to request for downstream use
    request.apiKey = {
      keyId: validationResult.keyId,
      instituteId: validationResult.instituteId,
      scopes: validationResult.scopes,
      rateLimit: validationResult.rateLimit,
      remainingRequests: validationResult.remainingRequests,
    };

    return true;
  }
}
