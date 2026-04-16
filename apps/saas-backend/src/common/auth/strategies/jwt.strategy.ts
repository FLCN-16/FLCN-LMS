import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT Payload interface
 * Defines the structure of decoded JWT tokens
 */
export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  instituteId?: string;
  permissions?: string[];
}

/**
 * Authenticated user object attached to request
 * Used throughout the application to identify the current user
 */
export interface AuthenticatedUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  instituteId?: string;
}

/**
 * Passport JWT Strategy
 *
 * Uses Passport.js for JWT authentication, providing:
 * - Clean, standard authentication middleware
 * - Automatic token extraction from Authorization header
 * - Easy extensibility for OAuth2, Google login, etc. in the future
 * - Built-in token expiration handling
 *
 * Usage:
 * @UseGuards(AuthGuard('jwt'))
 * async protectedRoute(@Request() req) {
 *   console.log(req.user); // AuthenticatedUser object
 * }
 *
 * Future extensibility:
 * - Google OAuth: extends PassportStrategy(Strategy) with GoogleStrategy
 * - GitHub OAuth: extends PassportStrategy(Strategy) with GitHubStrategy
 * - Multi-factor auth: add checks in validate() method
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET environment variable is not configured. Please set it in your .env file.',
      );
    }

    super({
      // Extract JWT from Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Don't ignore expiration; fail if token is expired
      ignoreExpiration: false,

      // Use JWT_SECRET for verification
      secretOrKey: secret,

      // Allow async validation
      passReqToCallback: false,
    });
  }

  /**
   * Validate and transform JWT payload into authenticated user object
   * Called automatically by Passport after JWT signature verification
   *
   * @param payload Decoded JWT payload
   * @returns AuthenticatedUser object attached to request.user
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Map JWT payload to user object
    // This ensures a consistent interface throughout the application
    return {
      id: payload.sub || payload.id,
      userId: payload.sub || payload.id,
      email: payload.email,
      role: payload.role,
      instituteId: payload.instituteId,
    };
  }
}
