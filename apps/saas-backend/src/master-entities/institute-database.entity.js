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
exports.InstituteDatabase = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY: InstituteDatabase
 *
 * Maps each institute to their database connection configuration.
 * This entity ONLY exists in the MASTER database.
 *
 * When a request comes in for an institute, this entity is queried to get
 * the database credentials, and a connection to that institute's database is created.
 *
 * Example record:
 * {
 *   id: "uuid-x",
 *   instituteId: "uuid-1",
 *   dbHost: "db-server-1.aws.com",
 *   dbPort: 5432,
 *   dbName: "db_pw_live",
 *   dbUser: "institute_user",
 *   dbPassword: "encrypted_password_here",
 *   isActive: true
 * }
 */
let InstituteDatabase = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('institute_databases'), (0, typeorm_1.Index)('idx_institute_databases_institute_id', ['instituteId']), (0, typeorm_1.Index)('idx_institute_databases_db_name', ['dbName']), (0, typeorm_1.Index)('idx_institute_databases_active', ['isActive'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _dbHost_decorators;
    let _dbHost_initializers = [];
    let _dbHost_extraInitializers = [];
    let _dbPort_decorators;
    let _dbPort_initializers = [];
    let _dbPort_extraInitializers = [];
    let _dbName_decorators;
    let _dbName_initializers = [];
    let _dbName_extraInitializers = [];
    let _dbUser_decorators;
    let _dbUser_initializers = [];
    let _dbUser_extraInitializers = [];
    let _dbPassword_decorators;
    let _dbPassword_initializers = [];
    let _dbPassword_extraInitializers = [];
    let _connectionString_decorators;
    let _connectionString_initializers = [];
    let _connectionString_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var InstituteDatabase = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', unique: true })];
            _dbHost_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 255, default: 'localhost' })];
            _dbPort_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 5432 })];
            _dbName_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true })];
            _dbUser_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 100 })];
            _dbPassword_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 500 })];
            _connectionString_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
            _isActive_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.databases, {
                    onDelete: 'CASCADE',
                    eager: false,
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _dbHost_decorators, { kind: "field", name: "dbHost", static: false, private: false, access: { has: obj => "dbHost" in obj, get: obj => obj.dbHost, set: (obj, value) => { obj.dbHost = value; } }, metadata: _metadata }, _dbHost_initializers, _dbHost_extraInitializers);
            __esDecorate(null, null, _dbPort_decorators, { kind: "field", name: "dbPort", static: false, private: false, access: { has: obj => "dbPort" in obj, get: obj => obj.dbPort, set: (obj, value) => { obj.dbPort = value; } }, metadata: _metadata }, _dbPort_initializers, _dbPort_extraInitializers);
            __esDecorate(null, null, _dbName_decorators, { kind: "field", name: "dbName", static: false, private: false, access: { has: obj => "dbName" in obj, get: obj => obj.dbName, set: (obj, value) => { obj.dbName = value; } }, metadata: _metadata }, _dbName_initializers, _dbName_extraInitializers);
            __esDecorate(null, null, _dbUser_decorators, { kind: "field", name: "dbUser", static: false, private: false, access: { has: obj => "dbUser" in obj, get: obj => obj.dbUser, set: (obj, value) => { obj.dbUser = value; } }, metadata: _metadata }, _dbUser_initializers, _dbUser_extraInitializers);
            __esDecorate(null, null, _dbPassword_decorators, { kind: "field", name: "dbPassword", static: false, private: false, access: { has: obj => "dbPassword" in obj, get: obj => obj.dbPassword, set: (obj, value) => { obj.dbPassword = value; } }, metadata: _metadata }, _dbPassword_initializers, _dbPassword_extraInitializers);
            __esDecorate(null, null, _connectionString_decorators, { kind: "field", name: "connectionString", static: false, private: false, access: { has: obj => "connectionString" in obj, get: obj => obj.connectionString, set: (obj, value) => { obj.connectionString = value; } }, metadata: _metadata }, _connectionString_initializers, _connectionString_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InstituteDatabase = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * Unique identifier for this database configuration
         */
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to the institute this database belongs to
         * Unique constraint ensures one database per institute
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * Database server hostname/IP
         * Examples: 'localhost', 'db.example.com', 'db-prod-1.aws.com'
         * Can point to different servers for scaling
         */
        dbHost = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _dbHost_initializers, void 0));
        /**
         * Database server port
         * Default PostgreSQL port is 5432
         */
        dbPort = (__runInitializers(this, _dbHost_extraInitializers), __runInitializers(this, _dbPort_initializers, void 0));
        /**
         * Database name for this institute
         * Convention: db_{institute_slug}
         * Examples: 'db_pw_live', 'db_adda247', 'db_flcn_org'
         */
        dbName = (__runInitializers(this, _dbPort_extraInitializers), __runInitializers(this, _dbName_initializers, void 0));
        /**
         * Database user for authentication
         * Can be shared user or unique per institute
         */
        dbUser = (__runInitializers(this, _dbName_extraInitializers), __runInitializers(this, _dbUser_initializers, void 0));
        /**
         * Database password for authentication
         * IMPORTANT: Should be encrypted in production!
         * Use encryption/decryption service with vault
         */
        dbPassword = (__runInitializers(this, _dbUser_extraInitializers), __runInitializers(this, _dbPassword_initializers, void 0));
        /**
         * Optional: Pre-constructed connection string
         * Can be useful for special connection configurations
         */
        connectionString = (__runInitializers(this, _dbPassword_extraInitializers), __runInitializers(this, _connectionString_initializers, void 0));
        /**
         * Whether this database configuration is active
         * Inactive configurations will be rejected during routing
         */
        isActive = (__runInitializers(this, _connectionString_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
        /**
         * Timestamp when this configuration was created
         */
        createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * Timestamp when this configuration was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        /**
         * Relation to Institute
         * Enables: instituteDatabase.institute.name, etc.
         */
        institute = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return InstituteDatabase = _classThis;
})();
exports.InstituteDatabase = InstituteDatabase;
