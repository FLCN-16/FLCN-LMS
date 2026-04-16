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
exports.LicensesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const api_keys_module_1 = require("../api-keys/api-keys.module");
const institute_entity_1 = require("../master-entities/institute.entity");
const license_entity_1 = require("../master-entities/license.entity");
const plan_entity_1 = require("../master-entities/plan.entity");
const super_admin_entity_1 = require("../master-entities/super-admin.entity");
const licenses_controller_1 = require("./licenses.controller");
const licenses_service_1 = require("./licenses.service");
/**
 * License Module
 *
 * Handles license verification, issuance, and management
 * Integrates with the master database for license persistence
 *
 * Public endpoints:
 * - POST /licenses/verify - License verification (called by Gin backend)
 * - POST /licenses/check-feature - Feature checking (called by Gin backend)
 *
 * Admin endpoints (protected by API Key or JWT):
 * - POST /licenses/issue - Issue new license
 * - PUT /licenses/:id - Update license
 * - PATCH /licenses/:id/suspend - Suspend license
 * - PATCH /licenses/:id/reactivate - Reactivate license
 * - DELETE /licenses/:id - Revoke license
 * - GET /licenses - List licenses
 * - GET /licenses/:id - Get license by ID
 * - GET /licenses/key/:key - Get license by key
 * - GET /licenses/:key/features - Get features
 * - GET /licenses/stats/summary - Get statistics
 */
let LicensesModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([license_entity_1.License, plan_entity_1.Plan, institute_entity_1.Institute, super_admin_entity_1.SuperAdmin], 'master'),
                api_keys_module_1.ApiKeysModule,
            ],
            controllers: [licenses_controller_1.LicensesController],
            providers: [licenses_service_1.LicensesService],
            exports: [licenses_service_1.LicensesService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LicensesModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LicensesModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return LicensesModule = _classThis;
})();
exports.LicensesModule = LicensesModule;
