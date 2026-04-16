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
export declare class AuthModule {
}
//# sourceMappingURL=auth.module.d.ts.map