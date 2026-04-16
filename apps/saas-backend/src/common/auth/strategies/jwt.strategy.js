"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
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
let JwtStrategy = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt');
    var JwtStrategy = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            JwtStrategy = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configService;
        constructor(configService) {
            const secret = configService.get('JWT_SECRET');
            if (!secret) {
                throw new Error('JWT_SECRET environment variable is not configured. Please set it in your .env file.');
            }
            super({
                // Extract JWT from Authorization header (Bearer token)
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                // Don't ignore expiration; fail if token is expired
                ignoreExpiration: false,
                // Use JWT_SECRET for verification
                secretOrKey: secret,
                // Allow async validation
                passReqToCallback: false,
            });
            this.configService = configService;
        }
        /**
         * Validate and transform JWT payload into authenticated user object
         * Called automatically by Passport after JWT signature verification
         *
         * @param payload Decoded JWT payload
         * @returns AuthenticatedUser object attached to request.user
         */
        async validate(payload) {
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
    };
    return JwtStrategy = _classThis;
})();
exports.JwtStrategy = JwtStrategy;
