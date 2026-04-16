import { createHmac } from 'crypto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const ADMIN_AUTH_COOKIE_NAME = 'flcn-lms.saas.auth-token';
const REFRESH_TOKEN_COOKIE_NAME = 'flcn-lms.saas.refresh-token';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    id?: string;
    email?: string;
    role?: string;
  };
};

@Controller({
  version: '1',
})
export class SaasAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      dto.email,
      dto.password,
      dto.remember,
    );

    const expires = dto.remember ? 30 : undefined;

    // Set access token cookie (readable by JavaScript for Authorization header)
    res.cookie(ADMIN_AUTH_COOKIE_NAME, result.token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: this.isProduction(),
      expires:
        expires !== undefined
          ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
          : undefined,
    });

    // Set refresh token cookie (HttpOnly for security)
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      refreshTokenExpiresIn: result.refreshTokenExpiresIn,
      expiresAt: new Date(Date.now() + result.expiresIn * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + result.refreshTokenExpiresIn * 1000),
    };
  }

  @Get('session')
  @UseGuards(AuthGuard('jwt'))
  async session(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub ?? req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.authService.getSession(userId);
  }

  private isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}
