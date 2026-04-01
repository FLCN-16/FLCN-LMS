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

import { AuthService } from '../../common/auth/auth.service';
import type { AuthSessionUser } from '../../common/auth/auth.service';
import { LoginDto } from '../../common/auth/dto/login.dto';

const TENANT_AUTH_COOKIE_NAME = 'flcn-lms.tenant.auth-token';

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    id?: string;
    userId?: string;
    email?: string;
    role?: string;
    instituteId?: string;
    permissions?: string[];
    name?: string;
  };
};

@Controller({
  version: '1',
})
export class InstituteAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      dto.email,
      dto.password,
      !!dto.remember,
    );

    const expiresDays = dto.remember ? 30 : undefined;

    res.cookie(TENANT_AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      expires:
        expiresDays !== undefined
          ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000)
          : undefined,
    });

    return {
      user: this.toUserResponse(result.user),
      token: result.token,
    };
  }

  @Get('session')
  async session(@Req() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const sessionUser = await this.authService.getSession(userId);

    return this.toUserResponse(sessionUser);
  }

  private toUserResponse(user: AuthSessionUser): User {
    return {
      id: user.id,
      instituteId: user.instituteId ?? undefined,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      permissions: user.permissions ?? [],
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}
