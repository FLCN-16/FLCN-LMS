import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedRequest } from '../../common/auth/jwt.strategy';

/**
 * Extracts the current user ID from the authenticated request
 *
 * Usage: @CurrentUser() userId: string
 *
 * Note: This decorator relies on JwtStrategy setting request.user.
 * It will return null if the request is not authenticated.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      return null;
    }

    return request.user.userId || request.user.id || null;
  },
);
