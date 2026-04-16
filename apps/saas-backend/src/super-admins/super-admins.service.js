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
exports.SuperAdminsService = void 0;
const common_1 = require("@nestjs/common");
let SuperAdminsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SuperAdminsService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SuperAdminsService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        repository;
        authService;
        constructor(repository, authService) {
            this.repository = repository;
            this.authService = authService;
        }
        async findAll() {
            const admins = await this.repository.find();
            return admins.map((admin) => this.excludePassword(admin));
        }
        async findOne(id) {
            const admin = await this.repository.findOne({ where: { id } });
            if (!admin) {
                throw new common_1.NotFoundException(`SuperAdmin with ID ${id} not found`);
            }
            return this.excludePassword(admin);
        }
        async create(dto) {
            const existing = await this.repository.findOne({
                where: { email: dto.email },
            });
            if (existing) {
                throw new common_1.ConflictException(`SuperAdmin with email ${dto.email} already exists`);
            }
            const hashedPassword = await this.authService.hashPassword(dto.password);
            const admin = this.repository.create({
                ...dto,
                hashedPassword,
            });
            const saved = await this.repository.save(admin);
            return this.excludePassword(saved);
        }
        async update(id, dto) {
            const admin = await this.repository.findOne({ where: { id } });
            if (!admin) {
                throw new common_1.NotFoundException(`SuperAdmin with ID ${id} not found`);
            }
            if (dto.password) {
                admin.hashedPassword = await this.authService.hashPassword(dto.password);
            }
            Object.assign(admin, dto);
            const updated = await this.repository.save(admin);
            return this.excludePassword(updated);
        }
        async remove(id) {
            const admin = await this.repository.findOne({ where: { id } });
            if (!admin) {
                throw new common_1.NotFoundException(`SuperAdmin with ID ${id} not found`);
            }
            await this.repository.remove(admin);
        }
        /**
         * Remove sensitive password field from admin object before returning
         */
        excludePassword(admin) {
            const { hashedPassword: _, ...adminWithoutPassword } = admin;
            return adminWithoutPassword;
        }
    };
    return SuperAdminsService = _classThis;
})();
exports.SuperAdminsService = SuperAdminsService;
