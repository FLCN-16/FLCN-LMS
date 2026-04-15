import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SuperAdmin } from '../../master-entities/super-admin.entity';

export interface AuthTokenPayload {
  sub: string;
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
    @InjectRepository(SuperAdmin, 'master')
    private readonly superAdminRepository: Repository<SuperAdmin>,
    private readonly configService: ConfigService,
  ) {}

  async login(
    email: string,
    password: string,
    remember = false,
  ): Promise<LoginResult> {
    const superAdmin = await this.superAdminRepository.findOne({
      where: { email },
    });

    if (!superAdmin || !superAdmin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (
      !superAdmin.hashedPassword ||
      !this.verifyPassword(password, superAdmin.hashedPassword)
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signToken(
      {
        sub: superAdmin.id,
        id: superAdmin.id,
        email: superAdmin.email,
        role: superAdmin.role || 'super_admin',
      },
      remember,
    );

    return {
      user: this.toSessionUser(superAdmin),
      token,
    };
  }

  async getSession(userId: string): Promise<AuthSessionUser> {
    const superAdmin = await this.superAdminRepository.findOne({
      where: { id: userId },
    });

    if (!superAdmin || !superAdmin.isActive) {
      throw new UnauthorizedException('Session is invalid');
    }

    return this.toSessionUser(superAdmin);
  }

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

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha256', salt).update(password).digest('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':');
      if (!salt || !hash) return false;

      const candidate = createHmac('sha256', salt).update(password).digest('hex');
      return timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
    } catch {
      return false;
    }
  }

  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    return secret;
  }

  private toSessionUser(superAdmin: SuperAdmin): AuthSessionUser {
    return {
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role || 'super_admin',
      isActive: superAdmin.isActive,
      createdAt: superAdmin.createdAt,
      updatedAt: superAdmin.updatedAt,
    };
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private base64UrlDecodeToString(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );

    return Buffer.from(padded, 'base64').toString('utf8');
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
