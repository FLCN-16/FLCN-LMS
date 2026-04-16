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
exports.LicensesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rate_limit_decorator_1 = require("../rate-limiting/decorators/rate-limit.decorator");
const rate_limit_guard_1 = require("../rate-limiting/guards/rate-limit.guard");
/**
 * License Management Controller
 *
 * Handles license verification, issuance, and management for the LMS system.
 * Provides endpoints for both Gin backend and NestJS dashboard integration.
 */
let LicensesController = (() => {
    let _classDecorators = [(0, common_1.Controller)({
            version: '1',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _verifyLicense_decorators;
    let _checkFeature_decorators;
    let _getStats_decorators;
    let _issueLicense_decorators;
    let _getLicenseByKey_decorators;
    let _suspendLicense_decorators;
    let _reactivateLicense_decorators;
    let _getFeatures_decorators;
    let _getLicenseById_decorators;
    let _updateLicense_decorators;
    let _revokeLicense_decorators;
    let _listLicenses_decorators;
    var LicensesController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _verifyLicense_decorators = [(0, common_1.Post)('verify'), (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard), (0, rate_limit_decorator_1.RateLimitLicenseVerify)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _checkFeature_decorators = [(0, common_1.Post)('check-feature'), (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard), (0, rate_limit_decorator_1.RateLimitFeatureCheck)(), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getStats_decorators = [(0, common_1.Get)('stats/summary'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _issueLicense_decorators = [(0, common_1.Post)('issue'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
            _getLicenseByKey_decorators = [(0, common_1.Get)('key/:key'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _suspendLicense_decorators = [(0, common_1.Patch)(':id/suspend'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _reactivateLicense_decorators = [(0, common_1.Patch)(':id/reactivate'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getFeatures_decorators = [(0, common_1.Get)(':key/features'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _getLicenseById_decorators = [(0, common_1.Get)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _updateLicense_decorators = [(0, common_1.Put)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _revokeLicense_decorators = [(0, common_1.Delete)(':id'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            _listLicenses_decorators = [(0, common_1.Get)(), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
            __esDecorate(this, null, _verifyLicense_decorators, { kind: "method", name: "verifyLicense", static: false, private: false, access: { has: obj => "verifyLicense" in obj, get: obj => obj.verifyLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _checkFeature_decorators, { kind: "method", name: "checkFeature", static: false, private: false, access: { has: obj => "checkFeature" in obj, get: obj => obj.checkFeature }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: obj => "getStats" in obj, get: obj => obj.getStats }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _issueLicense_decorators, { kind: "method", name: "issueLicense", static: false, private: false, access: { has: obj => "issueLicense" in obj, get: obj => obj.issueLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getLicenseByKey_decorators, { kind: "method", name: "getLicenseByKey", static: false, private: false, access: { has: obj => "getLicenseByKey" in obj, get: obj => obj.getLicenseByKey }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _suspendLicense_decorators, { kind: "method", name: "suspendLicense", static: false, private: false, access: { has: obj => "suspendLicense" in obj, get: obj => obj.suspendLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _reactivateLicense_decorators, { kind: "method", name: "reactivateLicense", static: false, private: false, access: { has: obj => "reactivateLicense" in obj, get: obj => obj.reactivateLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getFeatures_decorators, { kind: "method", name: "getFeatures", static: false, private: false, access: { has: obj => "getFeatures" in obj, get: obj => obj.getFeatures }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getLicenseById_decorators, { kind: "method", name: "getLicenseById", static: false, private: false, access: { has: obj => "getLicenseById" in obj, get: obj => obj.getLicenseById }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateLicense_decorators, { kind: "method", name: "updateLicense", static: false, private: false, access: { has: obj => "updateLicense" in obj, get: obj => obj.updateLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _revokeLicense_decorators, { kind: "method", name: "revokeLicense", static: false, private: false, access: { has: obj => "revokeLicense" in obj, get: obj => obj.revokeLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listLicenses_decorators, { kind: "method", name: "listLicenses", static: false, private: false, access: { has: obj => "listLicenses" in obj, get: obj => obj.listLicenses }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LicensesController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        licensesService = __runInitializers(this, _instanceExtraInitializers);
        constructor(licensesService) {
            this.licensesService = licensesService;
        }
        /**
         * Verify a license key
         *
         * POST /api/v1/licenses/verify
         * Public endpoint - used by Gin backend for license verification
         *
         * Request body:
         * - licenseKey: The license key to verify
         * - timestamp: Optional Unix timestamp for verification request
         *
         * Returns: License verification response with validity status and features
         */
        async verifyLicense(dto) {
            return this.licensesService.verifyLicense(dto);
        }
        /**
         * Check if a specific feature is enabled for a license
         *
         * POST /api/v1/licenses/check-feature
         * Public endpoint - used by Gin backend to check feature availability
         *
         * Request body:
         * - licenseKey: The license key to check
         * - featureName: Name of the feature to check (e.g., 'live_sessions', 'advanced_analytics')
         *
         * Returns: Feature availability status with optional usage limit
         */
        async checkFeature(dto) {
            return this.licensesService.checkFeature(dto.licenseKey, dto.featureName);
        }
        /**
         * Get license statistics summary
         *
         * GET /api/v1/licenses/stats/summary
         * Admin endpoint - returns aggregate license metrics
         *
         * Returns: Statistics for all licenses by status
         */
        async getStats() {
            return this.licensesService.getLicenseStats();
        }
        /**
         * Issue a new license
         *
         * POST /api/v1/licenses/issue
         * Admin endpoint - requires super admin authentication
         *
         * Request body:
         * - organizationName: Name of the organization
         * - licenseKey: Unique license key
         * - planId: Optional UUID of associated plan
         * - instituteId: Optional UUID of associated institute
         * - expiryDate: Optional ISO date string for license expiration
         * - features: Optional array of feature configurations
         * - maxUsers: Optional maximum number of users allowed
         * - notes: Optional notes about the license
         *
         * Returns: Created license information
         */
        async issueLicense(dto, issuedById) {
            return this.licensesService.issueLicense(dto, issuedById);
        }
        /**
         * Get license by key
         *
         * GET /api/v1/licenses/key/:key
         * Admin endpoint - retrieve license details by license key
         *
         * Path parameters:
         * - key: The license key to retrieve
         *
         * Returns: Complete license information
         */
        async getLicenseByKey(key) {
            return this.licensesService.getLicenseByKey(key);
        }
        /**
         * Suspend a license
         *
         * PATCH /api/v1/licenses/:id/suspend
         * Admin endpoint - temporarily disable a license
         *
         * Path parameters:
         * - id: The license ID to suspend
         *
         * Returns: Updated license information
         */
        async suspendLicense(id) {
            return this.licensesService.suspendLicense(id);
        }
        /**
         * Reactivate a suspended license
         *
         * PATCH /api/v1/licenses/:id/reactivate
         * Admin endpoint - restore a suspended license if not expired
         *
         * Path parameters:
         * - id: The license ID to reactivate
         *
         * Returns: Updated license information
         */
        async reactivateLicense(id) {
            return this.licensesService.reactivateLicense(id);
        }
        /**
         * Get all enabled features for a license
         *
         * GET /api/v1/licenses/:key/features
         * Admin endpoint - retrieve feature list for a specific license
         *
         * Path parameters:
         * - key: The license key
         *
         * Returns: Array of enabled features with their configurations
         */
        async getFeatures(key) {
            return this.licensesService.getFeatures(key);
        }
        /**
         * Get license by ID
         *
         * GET /api/v1/licenses/:id
         * Admin endpoint - retrieve full license details
         *
         * Path parameters:
         * - id: The license UUID
         *
         * Returns: Complete license information including related entities
         */
        async getLicenseById(id) {
            return this.licensesService.getLicenseById(id);
        }
        /**
         * Update a license
         *
         * PUT /api/v1/licenses/:id
         * Admin endpoint - modify license properties
         *
         * Path parameters:
         * - id: The license UUID
         *
         * Request body: Partial license update (all fields optional)
         * - organizationName: Update organization name
         * - status: Change license status (active, suspended, invalid, expired, pending)
         * - expiryDate: Update expiration date
         * - features: Update feature configurations
         * - maxUsers: Update user limit
         * - notes: Update notes
         *
         * Returns: Updated license information
         */
        async updateLicense(id, dto) {
            return this.licensesService.updateLicense(id, dto);
        }
        /**
         * Revoke a license
         *
         * DELETE /api/v1/licenses/:id
         * Admin endpoint - permanently invalidate a license
         *
         * Path parameters:
         * - id: The license UUID
         *
         * Returns: Revocation confirmation with timestamp
         */
        async revokeLicense(id) {
            return this.licensesService.revokeLicense(id);
        }
        /**
         * List licenses with filtering and pagination
         *
         * GET /api/v1/licenses
         * Admin endpoint - retrieve licenses with optional filters
         *
         * Query parameters:
         * - skip: Number of records to skip (default: 0)
         * - take: Number of records to return (default: 10)
         * - search: Search by organization name (partial match)
         * - status: Filter by status (active, suspended, invalid, expired, pending)
         * - isValid: Filter by validity (true/false)
         * - instituteId: Filter by associated institute UUID
         * - planId: Filter by associated plan UUID
         *
         * Returns: Paginated list of licenses with metadata
         */
        async listLicenses(query) {
            return this.licensesService.listLicenses(query);
        }
    };
    return LicensesController = _classThis;
})();
exports.LicensesController = LicensesController;
