import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuperAdmin } from '../../master-entities/super-admin.entity';
import { AuthService } from './auth.service';
import { SaasAuthController } from './saas-auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * AuthModule
 *
 * Provides authentication for the SaaS platform using Passport.js.
 * Handles JWT token generation and validation for super admins.
 *
 * Architecture:
 * - AuthService: Generates and validates tokens, handles password hashing with bcrypt
 * - JwtStrategy: Passport.js strategy for JWT authentication
 * - SaasAuthController: Login/logout endpoints
 *
 * Features:
 * - JWT token-based authentication
 * - Bcrypt password hashing with configurable work factor
 * - Constant-time comparison to prevent timing attacks
 * - "Remember me" functionality (extended expiration)
 * - Built-in support for future OAuth/Google login extensions
 *
 * Future extensibility:
 * - Add GoogleStrategy for Google OAuth login
 * - Add GitHubStrategy for GitHub OAuth login
 * - Add multi-factor authentication middleware
 * - Add refresh token support
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([SuperAdmin], 'master'),

    // ========== PASSPORT CONFIGURATION ==========
    // Enables @UseGuards(AuthGuard('jwt')) decorator throughout the app
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ========== JWT CONFIGURATION ==========
    // Manages JWT token generation with environment-based expiration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not configured');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '24h', // Default expiration
            algorithm: 'HS256',
          },
        };
      },
    }),
  ],

  controllers: [SaasAuthController],
  providers: [AuthService, JwtStrategy],

  // ========== EXPORTS ==========
  // Make AuthService and JwtStrategy available to other modules
  // AuthService: Use for password hashing and token generation
  // JwtStrategy: Already registered with Passport, but exported for type safety
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
