import { createHmac } from 'crypto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import type { User } from '@flcn-lms/types/auth';

import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import { User as UserEntity } from '../../institutes/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

const ADMIN_AUTH_COOKIE_NAME = 'flcn-lms.panel.auth-token';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  permissions: string[];
  iat: number;
  exp: number;
};

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    id?: string;
    userId?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    name?: string;
  };
};

@Controller({
  version: '1',
})
export class SaasAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly instituteContext: InstituteContext,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userRepo = this.instituteContext.getRepository(UserEntity);

    const user = await userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = this.verifyPassword(
      dto.password,
      user.hashedPassword,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.signJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: [],
    });

    const expires = dto.remember ? 30 : undefined;

    res.cookie(ADMIN_AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      expires:
        expires !== undefined
          ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
          : undefined,
    });

    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  @Get('session')
  async session(@Req() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const userRepo = this.instituteContext.getRepository(UserEntity);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.toUserResponse(user);
  }

  private toUserResponse(user: UserEntity): User {
    return {
      id: user.id,
      instituteId: user.instituteId ?? undefined,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      permissions: [],
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    if (!hashedPassword) {
      return false;
    }

    if (hashedPassword.startsWith('plain:')) {
      return hashedPassword.slice('plain:'.length) === password;
    }

    const [salt, digest] = hashedPassword.split(':');
    if (!salt || !digest) {
      return false;
    }

    const expected = createHmac('sha256', salt).update(password).digest('hex');
    return expected === digest;
  }

  private signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not configured');
    }

    const header = this.base64UrlEncode(
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }), 'utf8'),
    );

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24 * 30;

    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp,
    };

    const encodedPayload = this.base64UrlEncode(
      Buffer.from(JSON.stringify(fullPayload), 'utf8'),
    );

    const signingInput = `${header}.${encodedPayload}`;
    const signature = this.base64UrlEncode(
      createHmac('sha256', secret).update(signingInput).digest(),
    );

    return `${signingInput}.${signature}`;
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}
