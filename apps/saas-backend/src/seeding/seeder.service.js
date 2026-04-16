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
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
let SeederService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SeederService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SeederService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        superAdminRepository;
        instituteRepository;
        planRepository;
        logger = new common_1.Logger(SeederService.name);
        constructor(superAdminRepository, instituteRepository, planRepository) {
            this.superAdminRepository = superAdminRepository;
            this.instituteRepository = instituteRepository;
            this.planRepository = planRepository;
        }
        /**
         * Seed a super admin user for the SaaS platform
         */
        async seedSuperAdmin(options) {
            const { email, name } = options;
            try {
                // Check if super admin already exists
                const existingAdmin = await this.superAdminRepository.findOne({
                    where: { email },
                });
                if (existingAdmin) {
                    this.logger.warn(`Super admin already exists: ${email}`);
                    return existingAdmin;
                }
                // Create super admin
                const superAdmin = this.superAdminRepository.create({
                    email,
                    name,
                    isActive: true,
                });
                const savedAdmin = await this.superAdminRepository.save(superAdmin);
                this.logger.log(`Super admin created: ${email}`);
                return savedAdmin;
            }
            catch (error) {
                this.logger.error('Failed to seed super admin:', error);
                throw error;
            }
        }
        /**
         * Seed a customer/institute in the platform
         */
        async seedCustomer(options) {
            const { name, slug, email, industry = 'education', maxLicenses = 100, } = options;
            try {
                // Check if customer already exists
                const existingCustomer = await this.instituteRepository.findOne({
                    where: { slug },
                });
                if (existingCustomer) {
                    this.logger.warn(`Customer already exists: ${slug}`);
                    return existingCustomer;
                }
                // Create customer/institute
                const customer = this.instituteRepository.create({
                    name,
                    slug,
                    maxUsers: maxLicenses,
                    isActive: true,
                });
                const savedCustomer = (await this.instituteRepository.save(customer));
                this.logger.log(`Customer created: ${slug}`);
                return savedCustomer;
            }
            catch (error) {
                this.logger.error('Failed to seed customer:', error);
                throw error;
            }
        }
        /**
         * Seed a plan
         */
        async seedPlan(planData) {
            const { name } = planData;
            try {
                if (!name) {
                    throw new Error('Plan name is required');
                }
                // Check if plan already exists
                const existingPlan = await this.planRepository.findOne({
                    where: { name },
                });
                if (existingPlan) {
                    this.logger.warn(`Plan already exists: ${name}`);
                    return existingPlan;
                }
                // Create plan
                const plan = this.planRepository.create(planData);
                const savedPlan = await this.planRepository.save(plan);
                this.logger.log(`Plan created: ${name}`);
                return savedPlan;
            }
            catch (error) {
                this.logger.error('Failed to seed plan:', error);
                throw error;
            }
        }
        /**
         * Get seeding status
         */
        async getStatus() {
            try {
                const superAdminCount = await this.superAdminRepository.count();
                const customerCount = await this.instituteRepository.count();
                const planCount = await this.planRepository.count();
                return {
                    superAdmins: superAdminCount,
                    customers: customerCount,
                    plans: planCount,
                };
            }
            catch (error) {
                this.logger.error('Failed to get seeding status:', error);
                throw error;
            }
        }
    };
    return SeederService = _classThis;
})();
exports.SeederService = SeederService;
