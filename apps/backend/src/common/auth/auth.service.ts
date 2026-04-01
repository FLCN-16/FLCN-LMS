import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Role, UserPermissions } from '@flcn-lms/types/auth';
import { getDefaultPermissionsForRole } from '@flcn-lms/types/auth';

import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import type { User } from '../../institutes/users/entities/user.entity';
import { User as UserEntity } from '../../institutes/users/entities/user.entity';

export interface AuthTokenPayload {
  sub: string;
  id: string;
  userId: string;
  instituteId?: string;
  email: string;
  role: string;
  permissions?: string[];
  iat: number;
  exp: number;
}

export interface AuthSessionUser {
  id: string;
  instituteId?: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: Role;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  user: AuthSessionUser;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private instituteContext: InstituteContext,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticate a user with email and password
   * @param username - User email
   * @param password - User password (plain text)
   * @param remember - Whether to extend token expiration (30 days vs 1 day)
   * @returns LoginResult with user data and JWT token
   */
  async login(
    username: string,
    password: string,
    remember = false,
  ): Promise<LoginResult> {
    const userRepo = this.instituteContext.getRepository(UserEntity);

    const user = await userRepo.findOne({
      where: { email: username },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (
      !user.hashedPassword ||
      !this.verifyPassword(password, user.hashedPassword)
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(
      {
        sub: user.id,
        id: user.id,
        userId: user.id,
        instituteId: user.instituteId,
        email: user.email,
        role: user.role,
      },
      remember,
    );

    return {
      user: this.toSessionUser(user),
      token,
    };
  }

  /**
   * Get the current user session
   * @param userId - User ID
   * @returns AuthSessionUser with user information
   */
  async getSession(userId: string): Promise<AuthSessionUser> {
    const userRepo = this.instituteContext.getRepository(UserEntity);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session is invalid');
    }

    return this.toSessionUser(user);
  }

  /**
   * Sign a JWT token
   * @param payload - Token payload (without iat and exp)
   * @param remember - Whether to extend expiration to 30 days
   * @returns Signed JWT token
   */
  signToken(
    payload: Omit<AuthTokenPayload, 'iat' | 'exp'>,
    remember = false,
  ): string {
    const secret = this.getJwtSecret();
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresInSeconds = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const tokenPayload: AuthTokenPayload = {
      ...payload,
      iat: issuedAt,
      exp: issuedAt + expiresInSeconds,
    };

    const header = this.base64UrlEncode(
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }), 'utf8'),
    );
    const body = this.base64UrlEncode(
      Buffer.from(JSON.stringify(tokenPayload), 'utf8'),
    );
    const signingInput = `${header}.${body}`;
    const signature = this.base64UrlEncode(
      createHmac('sha256', secret).update(signingInput).digest(),
    );

    return `${signingInput}.${signature}`;
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string
   * @returns Decoded token payload
   * @throws UnauthorizedException if token is invalid or expired
   */
  verifyToken(token: string): AuthTokenPayload {
    const secret = this.getJwtSecret();
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', secret).update(signingInput).digest(),
    );

    if (!this.safeEqual(encodedSignature, expectedSignature)) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const header = JSON.parse(this.base64UrlDecodeToString(encodedHeader)) as {
      alg?: string;
      typ?: string;
    };

    if (header.alg !== 'HS256') {
      throw new UnauthorizedException('Unsupported token algorithm');
    }

    const payload = JSON.parse(
      this.base64UrlDecodeToString(encodedPayload),
    ) as AuthTokenPayload;

    if (typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedException('Token has expired');
    }

    return payload;
  }

  /**
   * Verify a password against its hash
   * @param password - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns true if password matches, false otherwise
   */
  private verifyPassword(password: string, hashedPassword: string): boolean {
    const candidate = this.hashPassword(password);
    const left = Buffer.from(candidate);
    const right = Buffer.from(hashedPassword);

    if (left.length !== right.length) {
      return false;
    }

    return timingSafeEqual(left, right);
  }

  /**
   * Hash a password using SHA256
   * @param password - Plain text password
   * @returns Hashed password as hex string
   */
  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  /**
   * Get JWT secret from configuration
   * @returns JWT secret string
   * @throws UnauthorizedException if secret is not configured
   */
  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    return secret;
  }

  /**
   * Convert a User entity to AuthSessionUser format
   * @param user - User entity
   * @returns AuthSessionUser object
   */
  private toSessionUser(user: User): AuthSessionUser {
    return {
      id: user.id,
      instituteId: user.instituteId,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role as unknown as Role,
      permissions: getDefaultPermissionsForRole(user.role as unknown as Role),
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Base64 URL encode a buffer
   * @param buffer - Buffer to encode
   * @returns Base64 URL encoded string
   */
  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  /**
   * Base64 URL decode to string
   * @param value - Base64 URL encoded string
   * @returns Decoded string
   */
  private base64UrlDecodeToString(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );

    return Buffer.from(padded, 'base64').toString('utf8');
  }

  /**
   * Safely compare two strings using timing-safe comparison
   * @param left - First string
   * @param right - Second string
   * @returns true if strings are equal, false otherwise
   */
  private safeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  }
}
