import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export type JwtUserPayload = {
  sub?: string;
  id?: string;
  userId?: string;
  instituteId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
};

export type AuthenticatedRequest = Request & {
  user?: JwtUserPayload;
};

export interface CurrentUserShape {
  id: string;
  instituteId?: string;
  email?: string;
  role?: string;
  payload: JwtUserPayload;
}

function extractUserId(payload?: JwtUserPayload): string {
  const userId = payload?.sub ?? payload?.id ?? payload?.userId;

  if (!userId) {
    throw new UnauthorizedException('Authenticated user not found');
  }

  return userId;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserShape => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = request.user;

    if (!payload) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    return {
      id: extractUserId(payload),
      instituteId:
        typeof payload.instituteId === 'string'
          ? payload.instituteId
          : undefined,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
      payload,
    };
  },
);
