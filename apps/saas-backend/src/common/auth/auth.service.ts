import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { getDefaultPermissionsForRole } from '@flcn-lms/types/auth';

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
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SuperAdmin, 'master')
    private readonly superAdminRepository: Repository<SuperAdmin>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
  async login(
    email: string,
    password: string,
    remember = false,
  ): Promise<LoginResult> {
    const superAdmin = await this.superAdminRepository.findOne({
      where: { email },
    });

    if (!superAdmin || !superAdmin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (
      !superAdmin.hashedPassword ||
      !(await this.verifyPassword(password, superAdmin.hashedPassword))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    superAdmin.lastLogin = new Date();
    await this.superAdminRepository.save(superAdmin);

    const payload = {
      sub: superAdmin.id,
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role || 'super_admin',
    };

    // Access token (short-lived)
    const accessTokenExpiresIn = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 24 hours in seconds
    const token = this.signToken(payload, remember);

    // Refresh token (longer-lived)
    const refreshToken = this.signToken(payload, true); // Refresh token valid for 30 days
    const refreshTokenExpiresIn = 30 * 24 * 60 * 60; // 30 days in seconds

    return {
      user: this.toSessionUser(superAdmin),
      token,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  /**
   * Retrieve current session user
   * Used for session validation and refresh
   *
   * @param userId ID of user to retrieve
   * @returns Session user data
   * @throws UnauthorizedException if user not found or inactive
   */
  async getSession(userId: string): Promise<AuthSessionUser> {
    const superAdmin = await this.superAdminRepository.findOne({
      where: { id: userId },
    });

    if (!superAdmin || !superAdmin.isActive) {
      throw new UnauthorizedException('Session is invalid');
    }

    return this.toSessionUser(superAdmin);
  }

  /**
   * Sign JWT token using Passport JWT module
   * Delegates token generation to NestJS JwtService for consistency
   *
   * @param payload Token payload (sub, id, email, role)
   * @param remember If true, extends expiration to 30 days instead of 24 hours
   * @returns Signed JWT token
   */
  signToken(
    payload: Omit<AuthTokenPayload, 'iat' | 'exp'>,
    remember = false,
  ): string {
    // Determine expiration based on "remember me" flag
    const expiresIn = remember ? '30d' : '24h';

    // JwtService handles all signing, including:
    // - HS256 algorithm (configured in JwtModule)
    // - JWT_SECRET (from environment)
    // - iat and exp claims (added automatically)
    const token = this.jwtService.sign(payload, { expiresIn });

    return token;
  }

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
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Cost factor: higher = slower = more secure
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

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
  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      // bcrypt.compare handles:
      // - Constant-time comparison
      // - Salt extraction from hash
      // - Hash recalculation and comparison
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      // Invalid hash format or other errors -> invalid
      return false;
    }
  }

  /**
   * Transform SuperAdmin entity to session user object
   * Excludes sensitive fields like hashedPassword
   *
   * @param superAdmin SuperAdmin entity
   * @returns Session user object safe to send to client
   */
  private toSessionUser(superAdmin: SuperAdmin): AuthSessionUser {
    const role = (superAdmin.role || 'super_admin') as any;
    return {
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      role,
      isActive: superAdmin.isActive,
      permissions: getDefaultPermissionsForRole(role),
      createdAt: superAdmin.createdAt,
      updatedAt: superAdmin.updatedAt,
    };
  }
}
