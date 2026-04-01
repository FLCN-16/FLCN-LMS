import { createHmac, timingSafeEqual } from 'crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export type JwtPayload = {
  sub?: string;
  id?: string;
  userId?: string;
  instituteId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class JwtStrategy implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  private readonly publicRoutes = new Set([
    'POST /auth/login',
    'GET /auth/session',
    'POST /auth/admin/login',
    'GET /auth/admin/session',
  ]);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const method = request.method?.toUpperCase() ?? '';
    const routePath = request.route?.path;
    const requestPath = request.originalUrl ?? request.url ?? '';
    const path = routePath ?? requestPath;
    const routeKey = `${method} ${path}`;

    if (this.publicRoutes.has(routeKey)) {
      return true;
    }

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization token format');
    }

    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    const payload = this.verifyJwt(token, secret);
    const userId = payload.sub ?? payload.id ?? payload.userId;

    if (!userId) {
      throw new UnauthorizedException('User id not found in token payload');
    }

    request.user = {
      ...payload,
      sub: payload.sub ?? userId,
      id: payload.id ?? userId,
      userId: payload.userId ?? userId,
      instituteId:
        typeof payload.instituteId === 'string' ? payload.instituteId : undefined,
    };

    return true;
  }

  private verifyJwt(token: string, secret: string): JwtPayload {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid JWT');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', secret).update(signingInput).digest(),
    );

    if (!this.safeEqual(encodedSignature, expectedSignature)) {
      throw new UnauthorizedException('Invalid JWT signature');
    }

    try {
      const header = JSON.parse(
        this.base64UrlDecodeToString(encodedHeader),
      ) as {
        alg?: string;
        typ?: string;
      };

      if (header.alg !== 'HS256') {
        throw new UnauthorizedException('Unsupported JWT algorithm');
      }

      const payload = JSON.parse(
        this.base64UrlDecodeToString(encodedPayload),
      ) as JwtPayload;

      if (typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('JWT has expired');
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Unable to decode JWT payload');
    }
  }

  private base64UrlDecodeToString(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );

    return Buffer.from(padded, 'base64').toString('utf8');
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  }
}
