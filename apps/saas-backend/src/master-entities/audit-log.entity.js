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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Audit log for tracking all important actions across the system.
 * Used for compliance, debugging, and security monitoring.
 */
let AuditLog = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('audit_logs'), (0, typeorm_1.Index)('idx_audit_logs_institute', ['instituteId']), (0, typeorm_1.Index)('idx_audit_logs_action', ['action']), (0, typeorm_1.Index)('idx_audit_logs_created_at', ['createdAt']), (0, typeorm_1.Index)('idx_audit_logs_institute_created', ['instituteId', 'createdAt']), (0, typeorm_1.Index)('idx_audit_logs_user', ['userId'], { where: '"userId" IS NOT NULL' })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _oldValues_decorators;
    let _oldValues_initializers = [];
    let _oldValues_extraInitializers = [];
    let _newValues_decorators;
    let _newValues_initializers = [];
    let _newValues_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _requestMethod_decorators;
    let _requestMethod_initializers = [];
    let _requestMethod_extraInitializers = [];
    let _requestPath_decorators;
    let _requestPath_initializers = [];
    let _requestPath_extraInitializers = [];
    let _statusCode_decorators;
    let _statusCode_initializers = [];
    let _statusCode_extraInitializers = [];
    let _responseTimeMs_decorators;
    let _responseTimeMs_initializers = [];
    let _responseTimeMs_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var AuditLog = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'uuid' })];
            _userId_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'uuid' })];
            _action_decorators = [(0, typeorm_1.Column)({ length: 100 })];
            _resourceType_decorators = [(0, typeorm_1.Column)({ length: 50, nullable: true })];
            _resourceId_decorators = [(0, typeorm_1.Column)({ length: 100, nullable: true })];
            _oldValues_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _newValues_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _changes_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
            _ipAddress_decorators = [(0, typeorm_1.Column)({ length: 45, nullable: true })];
            _userAgent_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _requestMethod_decorators = [(0, typeorm_1.Column)({ length: 10, nullable: true })];
            _requestPath_decorators = [(0, typeorm_1.Column)({ length: 500, nullable: true })];
            _statusCode_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'integer' })];
            _responseTimeMs_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'integer' })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.auditLogs, {
                    onDelete: 'SET NULL',
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
            __esDecorate(null, null, _oldValues_decorators, { kind: "field", name: "oldValues", static: false, private: false, access: { has: obj => "oldValues" in obj, get: obj => obj.oldValues, set: (obj, value) => { obj.oldValues = value; } }, metadata: _metadata }, _oldValues_initializers, _oldValues_extraInitializers);
            __esDecorate(null, null, _newValues_decorators, { kind: "field", name: "newValues", static: false, private: false, access: { has: obj => "newValues" in obj, get: obj => obj.newValues, set: (obj, value) => { obj.newValues = value; } }, metadata: _metadata }, _newValues_initializers, _newValues_extraInitializers);
            __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
            __esDecorate(null, null, _requestMethod_decorators, { kind: "field", name: "requestMethod", static: false, private: false, access: { has: obj => "requestMethod" in obj, get: obj => obj.requestMethod, set: (obj, value) => { obj.requestMethod = value; } }, metadata: _metadata }, _requestMethod_initializers, _requestMethod_extraInitializers);
            __esDecorate(null, null, _requestPath_decorators, { kind: "field", name: "requestPath", static: false, private: false, access: { has: obj => "requestPath" in obj, get: obj => obj.requestPath, set: (obj, value) => { obj.requestPath = value; } }, metadata: _metadata }, _requestPath_initializers, _requestPath_extraInitializers);
            __esDecorate(null, null, _statusCode_decorators, { kind: "field", name: "statusCode", static: false, private: false, access: { has: obj => "statusCode" in obj, get: obj => obj.statusCode, set: (obj, value) => { obj.statusCode = value; } }, metadata: _metadata }, _statusCode_initializers, _statusCode_extraInitializers);
            __esDecorate(null, null, _responseTimeMs_decorators, { kind: "field", name: "responseTimeMs", static: false, private: false, access: { has: obj => "responseTimeMs" in obj, get: obj => obj.responseTimeMs, set: (obj, value) => { obj.responseTimeMs = value; } }, metadata: _metadata }, _responseTimeMs_initializers, _responseTimeMs_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuditLog = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Reference to institute (can be null for system-level logs)
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * User who performed the action (optional)
         */
        userId = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        /**
         * Type of action performed
         * Examples: 'CREATE_COURSE', 'UPDATE_USER', 'DELETE_TEST', etc.
         */
        action = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
        /**
         * Type of resource affected
         * Examples: 'COURSE', 'USER', 'TEST_SERIES', 'QUESTION'
         */
        resourceType = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
        /**
         * ID of the resource affected
         */
        resourceId = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
        /**
         * Previous values before the change (JSON)
         * Only populated for UPDATE actions
         */
        oldValues = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _oldValues_initializers, void 0));
        /**
         * New values after the change (JSON)
         * Only populated for UPDATE actions
         */
        newValues = (__runInitializers(this, _oldValues_extraInitializers), __runInitializers(this, _newValues_initializers, void 0));
        /**
         * Summary of changes (JSON)
         * Field-level diff of what changed
         */
        changes = (__runInitializers(this, _newValues_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
        /**
         * IP address of the client
         */
        ipAddress = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
        /**
         * User agent of the client
         */
        userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
        /**
         * HTTP request method
         * Examples: GET, POST, PUT, DELETE, PATCH
         */
        requestMethod = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _requestMethod_initializers, void 0));
        /**
         * HTTP request path
         * Example: /api/courses/uuid-123
         */
        requestPath = (__runInitializers(this, _requestMethod_extraInitializers), __runInitializers(this, _requestPath_initializers, void 0));
        /**
         * HTTP response status code
         * Examples: 200, 201, 400, 404, 500
         */
        statusCode = (__runInitializers(this, _requestPath_extraInitializers), __runInitializers(this, _statusCode_initializers, void 0));
        /**
         * How long the request took in milliseconds
         */
        responseTimeMs = (__runInitializers(this, _statusCode_extraInitializers), __runInitializers(this, _responseTimeMs_initializers, void 0));
        /**
         * When this action was logged
         */
        createdAt = (__runInitializers(this, _responseTimeMs_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Relation to Institute (if instituteId is set)
         */
        institute = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return AuditLog = _classThis;
})();
exports.AuditLog = AuditLog;
