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

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const ADMIN_AUTH_COOKIE_NAME = 'flcn-lms.panel.auth-token';

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password, dto.remember);
    
    const expires = dto.remember ? 30 : undefined;

    res.cookie(ADMIN_AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.isProduction(),
      expires:
        expires !== undefined
          ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
          : undefined,
    });

    return {
      user: result.user,
      token: result.token,
    };
  }

  @Get('session')
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
