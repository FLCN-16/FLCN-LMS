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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const api_keys_module_1 = require("./api-keys/api-keys.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const billing_module_1 = require("./billing/billing.module");
const auth_module_1 = require("./common/auth/auth.module");
const licenses_module_1 = require("./licenses/licenses.module");
// Master Database Entities
const api_key_entity_1 = require("./master-entities/api-key.entity");
const audit_log_entity_1 = require("./master-entities/audit-log.entity");
const branch_entity_1 = require("./master-entities/branch.entity");
const feature_flag_entity_1 = require("./master-entities/feature-flag.entity");
const institute_billing_entity_1 = require("./master-entities/institute-billing.entity");
const institute_database_entity_1 = require("./master-entities/institute-database.entity");
const institute_entity_1 = require("./master-entities/institute.entity");
const invoice_entity_1 = require("./master-entities/invoice.entity");
const license_entity_1 = require("./master-entities/license.entity");
const plan_entity_1 = require("./master-entities/plan.entity");
const refund_entity_1 = require("./master-entities/refund.entity");
const super_admin_entity_1 = require("./master-entities/super-admin.entity");
const plans_module_1 = require("./plans/plans.module");
const rate_limiting_module_1 = require("./rate-limiting/rate-limiting.module");
const refund_module_1 = require("./refunds/refund.module");
const super_admins_module_1 = require("./super-admins/super-admins.module");
let AppModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                // Global configuration
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                // ========== RATE LIMITING ==========
                // Global rate limiting service (in-memory, Redis-ready)
                rate_limiting_module_1.RateLimitingModule,
                // ========== ROUTING ARCHITECTURE ==========
                // SaaS Platform Routes: /api/v1/...
                core_1.RouterModule.register([
                    {
                        path: '', // Root path for SaaS routes
                        children: [
                            { path: 'auth', module: auth_module_1.AuthModule },
                            { path: 'super-admins', module: super_admins_module_1.SuperAdminsModule },
                            { path: 'api-keys', module: api_keys_module_1.ApiKeysModule },
                            { path: 'licenses', module: licenses_module_1.LicensesModule },
                            { path: 'plans', module: plans_module_1.PlansModule },
                            { path: 'billing', module: billing_module_1.BillingModule },
                            { path: 'refunds', module: refund_module_1.RefundModule },
                        ],
                    },
                ]),
                // ========== MASTER DATABASE CONNECTION ==========
                // Stores SaaS platform data: licenses, customers, plans, billing, feature flags, analytics
                typeorm_1.TypeOrmModule.forRootAsync({
                    name: 'master',
                    inject: [config_1.ConfigService],
                    useFactory: (config) => {
                        const masterDatabaseUrl = config.get('MASTER_DATABASE_URL') ||
                            config.get('DATABASE_URL');
                        if (!masterDatabaseUrl) {
                            throw new Error('MASTER_DATABASE_URL or DATABASE_URL is required');
                        }
                        return {
                            type: 'postgres',
                            url: masterDatabaseUrl,
                            entities: [
                                institute_entity_1.Institute,
                                institute_database_entity_1.InstituteDatabase,
                                institute_billing_entity_1.InstituteBilling,
                                invoice_entity_1.Invoice,
                                refund_entity_1.Refund,
                                api_key_entity_1.ApiKey,
                                audit_log_entity_1.AuditLog,
                                feature_flag_entity_1.FeatureFlag,
                                branch_entity_1.Branch,
                                super_admin_entity_1.SuperAdmin,
                                plan_entity_1.Plan,
                                license_entity_1.License,
                            ],
                            synchronize: config.get('NODE_ENV') === 'development',
                            logging: config.get('NODE_ENV') === 'development',
                        };
                    },
                }),
                // ========== FEATURE MODULES ==========
                auth_module_1.AuthModule,
                super_admins_module_1.SuperAdminsModule,
                api_keys_module_1.ApiKeysModule,
                licenses_module_1.LicensesModule,
                plans_module_1.PlansModule,
                billing_module_1.BillingModule,
                refund_module_1.RefundModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AppModule = _classThis;
})();
exports.AppModule = AppModule;
