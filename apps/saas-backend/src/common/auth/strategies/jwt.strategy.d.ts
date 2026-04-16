import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
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
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
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
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    /**
     * Validate and transform JWT payload into authenticated user object
     * Called automatically by Passport after JWT signature verification
     *
     * @param payload Decoded JWT payload
     * @returns AuthenticatedUser object attached to request.user
     */
    validate(payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map