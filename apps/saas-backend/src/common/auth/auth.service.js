"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const auth_1 = require("@flcn-lms/types/auth");
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
let AuthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        superAdminRepository;
        jwtService;
        configService;
        constructor(superAdminRepository, jwtService, configService) {
            this.superAdminRepository = superAdminRepository;
            this.jwtService = jwtService;
            this.configService = configService;
        }
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
        async login(email, password, remember = false) {
            const superAdmin = await this.superAdminRepository.findOne({
                where: { email },
            });
            if (!superAdmin || !superAdmin.isActive) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!superAdmin.hashedPassword ||
                !(await this.verifyPassword(password, superAdmin.hashedPassword))) {
                throw new common_1.UnauthorizedException('Invalid credentials');
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
        async getSession(userId) {
            const superAdmin = await this.superAdminRepository.findOne({
                where: { id: userId },
            });
            if (!superAdmin || !superAdmin.isActive) {
                throw new common_1.UnauthorizedException('Session is invalid');
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
        signToken(payload, remember = false) {
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
        async hashPassword(password) {
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
        async verifyPassword(password, hashedPassword) {
            try {
                // bcrypt.compare handles:
                // - Constant-time comparison
                // - Salt extraction from hash
                // - Hash recalculation and comparison
                return await bcrypt.compare(password, hashedPassword);
            }
            catch {
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
        toSessionUser(superAdmin) {
            const role = (superAdmin.role || 'super_admin');
            return {
                id: superAdmin.id,
                name: superAdmin.name,
                email: superAdmin.email,
                role,
                isActive: superAdmin.isActive,
                permissions: (0, auth_1.getDefaultPermissionsForRole)(role),
                createdAt: superAdmin.createdAt,
                updatedAt: superAdmin.updatedAt,
            };
        }
    };
    return AuthService = _classThis;
})();
exports.AuthService = AuthService;
