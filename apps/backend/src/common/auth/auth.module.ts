import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SaasAuthController } from './saas-auth.controller';

/**
 * AuthModule
 *
 * Provides authentication for the SaaS platform.
 * Handles JWT token generation and validation for super admins and API clients.
 */
@Module({
  imports: [ConfigModule],
  controllers: [SaasAuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, SaasAuthController],
})
export class AuthModule {}
