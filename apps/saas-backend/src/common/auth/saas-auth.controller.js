"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaasAuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ADMIN_AUTH_COOKIE_NAME = 'flcn-lms.saas.auth-token';
const REFRESH_TOKEN_COOKIE_NAME = 'flcn-lms.saas.refresh-token';
let SaasAuthController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _login_decorators;
    let _session_decorators;
    var SaasAuthController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _login_decorators = [(0, common_1.Post)('login'), (0, common_1.HttpCode)(200)];
            _session_decorators = [(0, common_1.Get)('session'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'))];
            __esDecorate(this, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _session_decorators, { kind: "method", name: "session", static: false, private: false, access: { has: obj => "session" in obj, get: obj => obj.session }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SaasAuthController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        authService = __runInitializers(this, _instanceExtraInitializers);
        configService;
        constructor(authService, configService) {
            this.authService = authService;
            this.configService = configService;
        }
        async login(dto, res) {
            const result = await this.authService.login(dto.email, dto.password, dto.remember);
            const expires = dto.remember ? 30 : undefined;
            // Set access token cookie (readable by JavaScript for Authorization header)
            res.cookie(ADMIN_AUTH_COOKIE_NAME, result.token, {
                httpOnly: false,
                sameSite: 'lax',
                secure: this.isProduction(),
                expires: expires !== undefined
                    ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
                    : undefined,
            });
            // Set refresh token cookie (HttpOnly for security)
            res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: this.isProduction(),
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
            return {
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken,
                expiresIn: result.expiresIn,
                refreshTokenExpiresIn: result.refreshTokenExpiresIn,
                expiresAt: new Date(Date.now() + result.expiresIn * 1000),
                refreshTokenExpiresAt: new Date(Date.now() + result.refreshTokenExpiresIn * 1000),
            };
        }
        async session(req) {
            const userId = req.user?.sub ?? req.user?.id;
            if (!userId) {
                throw new common_1.UnauthorizedException('Not authenticated');
            }
            return this.authService.getSession(userId);
        }
        isProduction() {
            return this.configService.get('NODE_ENV') === 'production';
        }
    };
    return SaasAuthController = _classThis;
})();
exports.SaasAuthController = SaasAuthController;
