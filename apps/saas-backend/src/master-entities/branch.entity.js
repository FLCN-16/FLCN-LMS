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
exports.Branch = void 0;
const typeorm_1 = require("typeorm");
const institute_entity_1 = require("./institute.entity");
/**
 * MASTER DATABASE ENTITY
 *
 * Represents a branch/location of an institute.
 * Each institute can have multiple branches (regional offices, centers, sub-organizations).
 * Allows for multi-location management within a single institute.
 */
let Branch = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('branches'), (0, typeorm_1.Index)('idx_branches_institute', ['instituteId']), (0, typeorm_1.Index)('idx_branches_slug', ['instituteId', 'slug'], { unique: true }), (0, typeorm_1.Index)('idx_branches_active', ['isActive'])];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _instituteId_decorators;
    let _instituteId_initializers = [];
    let _instituteId_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _settings_decorators;
    let _settings_initializers = [];
    let _settings_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _institute_decorators;
    let _institute_initializers = [];
    let _institute_extraInitializers = [];
    var Branch = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
            _instituteId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
            _slug_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 50,
                    nullable: false,
                })];
            _name_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 255,
                    nullable: false,
                })];
            _description_decorators = [(0, typeorm_1.Column)({
                    type: 'text',
                    nullable: true,
                })];
            _email_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 255,
                    nullable: true,
                })];
            _phone_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 20,
                    nullable: true,
                })];
            _address_decorators = [(0, typeorm_1.Column)({
                    type: 'text',
                    nullable: true,
                })];
            _city_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 100,
                    nullable: true,
                })];
            _state_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 100,
                    nullable: true,
                })];
            _country_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 100,
                    nullable: true,
                })];
            _postalCode_decorators = [(0, typeorm_1.Column)({
                    type: 'varchar',
                    length: 20,
                    nullable: true,
                })];
            _isActive_decorators = [(0, typeorm_1.Column)({
                    type: 'boolean',
                    default: true,
                    nullable: false,
                })];
            _settings_decorators = [(0, typeorm_1.Column)({
                    type: 'jsonb',
                    nullable: true,
                })];
            _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
            _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
            _institute_decorators = [(0, typeorm_1.ManyToOne)(() => institute_entity_1.Institute, (institute) => institute.branches, {
                    onDelete: 'CASCADE',
                }), (0, typeorm_1.JoinColumn)({ name: 'instituteId' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _instituteId_decorators, { kind: "field", name: "instituteId", static: false, private: false, access: { has: obj => "instituteId" in obj, get: obj => obj.instituteId, set: (obj, value) => { obj.instituteId = value; } }, metadata: _metadata }, _instituteId_initializers, _instituteId_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: obj => "settings" in obj, get: obj => obj.settings, set: (obj, value) => { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _institute_decorators, { kind: "field", name: "institute", static: false, private: false, access: { has: obj => "institute" in obj, get: obj => obj.institute, set: (obj, value) => { obj.institute = value; } }, metadata: _metadata }, _institute_initializers, _institute_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Branch = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        /**
         * Foreign key to institute
         * Each branch belongs to exactly one institute
         */
        instituteId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _instituteId_initializers, void 0));
        /**
         * URL-friendly identifier for the branch
         * Unique within the institute
         * Examples: 'hq', 'delhi-center', 'bangalore-office'
         */
        slug = (__runInitializers(this, _instituteId_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
        /**
         * Display name for this branch
         * Examples: 'Headquarters', 'Delhi Center', 'Bangalore Office'
         */
        name = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _name_initializers, void 0));
        /**
         * Description of this branch
         */
        description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
        /**
         * Contact email for this branch
         */
        email = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _email_initializers, void 0));
        /**
         * Contact phone for this branch
         */
        phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
        /**
         * Full address of this branch
         */
        address = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
        /**
         * City where this branch is located
         */
        city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
        /**
         * State/Province where this branch is located
         */
        state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
        /**
         * Country where this branch is located
         */
        country = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _country_initializers, void 0));
        /**
         * Postal code for this branch
         */
        postalCode = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
        /**
         * Whether this branch is active
         */
        isActive = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
        /**
         * Custom settings for this branch (JSON)
         */
        settings = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
        /**
         * When this branch was created
         */
        createdAt = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        /**
         * When this branch was last updated
         */
        updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
        // ========== Relations ==========
        /**
         * Relation to Institute
         * Each branch belongs to exactly one institute
         */
        institute = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _institute_initializers, void 0));
        constructor() {
            __runInitializers(this, _institute_extraInitializers);
        }
    };
    return Branch = _classThis;
})();
exports.Branch = Branch;
