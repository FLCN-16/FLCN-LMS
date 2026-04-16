import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { SuperAdmin } from '../../master-entities/super-admin.entity';
/**
 * JWT Token Payload
 * Structure of data encoded in JWT tokens
 */
export interface AuthTokenPayload {
    sub: string;
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
/**
 * Authenticated Session User
 * User object stored in session/request context
 */
export interface AuthSessionUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Login Result
 * Returned from login endpoint
 */
export interface LoginResult {
    user: AuthSessionUser;
    token: string;
    refreshToken: string;
    expiresIn: number;
    refreshTokenExpiresIn: number;
}
/**
 * Authentication Service
 *
 * Handles:
 * - User login and token generation
 * - Password hashing (bcrypt with work factor)
 * - Session management
 * - Token generation via Passport JWT module
 *
 * Security:
 * - Bcrypt password hashing with 10 salt rounds (configurable)
 * - Constant-time password comparison via bcrypt
 * - JWT signature verification handled by passport-jwt
 * - No timing attack vectors
 *
 * Future extensibility:
 * - Refresh token support
 * - Multi-factor authentication
 * - OAuth2/Google login integration
 */
export declare class AuthService {
    private readonly superAdminRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(superAdminRepository: Repository<SuperAdmin>, jwtService: JwtService, configService: ConfigService);
    /**
     * Authenticate user with email and password
     * Generates JWT token on successful authentication
     *
     * @param email Super admin email
     * @param password Plain text password
     * @param remember If true, extends token expiration to 30 days
     * @returns Login result with user data and JWT token
     * @throws UnauthorizedException if credentials are invalid
     */
    login(email: string, password: string, remember?: boolean): Promise<LoginResult>;
    /**
     * Retrieve current session user
     * Used for session validation and refresh
     *
     * @param userId ID of user to retrieve
     * @returns Session user data
     * @throws UnauthorizedException if user not found or inactive
     */
    getSession(userId: string): Promise<AuthSessionUser>;
    /**
     * Sign JWT token using Passport JWT module
     * Delegates token generation to NestJS JwtService for consistency
     *
     * @param payload Token payload (sub, id, email, role)
     * @param remember If true, extends expiration to 30 days instead of 24 hours
     * @returns Signed JWT token
     */
    signToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>, remember?: boolean): string;
    /**
     * Hash password using bcrypt
     * Provides proper work factor-based hashing for security
     *
     * @param password Plain text password to hash
     * @returns Bcrypt hash (includes salt)
     *
     * Security notes:
     * - Uses 10 salt rounds (configurable cost factor)
     * - Bcrypt automatically handles salt generation and storage
     * - Resistant to rainbow table and brute force attacks
     * - Takes ~100-200ms per hash (by design, to slow attackers)
     */
    hashPassword(password: string): Promise<string>;
    /**
     * Verify password against bcrypt hash
     * Uses constant-time comparison built into bcrypt.compare()
     *
     * @param password Plain text password to verify
     * @param hashedPassword Bcrypt hash to compare against
     * @returns True if password matches, false otherwise
     *
     * Security notes:
     * - bcrypt.compare() performs constant-time comparison
     * - No timing information leaks to attacker
     * - Catches errors silently (returns false on invalid input)
     */
    private verifyPassword;
    /**
     * Transform SuperAdmin entity to session user object
     * Excludes sensitive fields like hashedPassword
     *
     * @param superAdmin SuperAdmin entity
     * @returns Session user object safe to send to client
     */
    private toSessionUser;
}
//# sourceMappingURL=auth.service.d.ts.map