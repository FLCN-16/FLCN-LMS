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
exports.ApiKeysModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const api_key_entity_1 = require("../master-entities/api-key.entity");
const institute_entity_1 = require("../master-entities/institute.entity");
const api_keys_controller_1 = require("./api-keys.controller");
const api_keys_service_1 = require("./api-keys.service");
const api_key_guard_1 = require("./guards/api-key.guard");
/**
 * API Keys Module
 *
 * Manages API key generation, validation, and lifecycle for SaaS customers (institutes)
 * Provides authentication mechanism for external services (e.g., Gin backend)
 *
 * Exports:
 * - ApiKeysService: Core service for key management
 * - ApiKeyGuard: Guard for protecting endpoints with API key auth
 */
let ApiKeysModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([api_key_entity_1.ApiKey, institute_entity_1.Institute], 'master')],
            controllers: [api_keys_controller_1.ApiKeysController],
            providers: [api_keys_service_1.ApiKeysService, api_key_guard_1.ApiKeyGuard],
            exports: [api_keys_service_1.ApiKeysService, api_key_guard_1.ApiKeyGuard],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ApiKeysModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ApiKeysModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ApiKeysModule = _classThis;
})();
exports.ApiKeysModule = ApiKeysModule;
