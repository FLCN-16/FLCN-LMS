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
exports.LicensesService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const verify_license_dto_1 = require("./dto/verify-license.dto");
let LicensesService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LicensesService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LicensesService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        licenseRepository;
        planRepository;
        instituteRepository;
        superAdminRepository;
        constructor(licenseRepository, planRepository, instituteRepository, superAdminRepository) {
            this.licenseRepository = licenseRepository;
            this.planRepository = planRepository;
            this.instituteRepository = instituteRepository;
            this.superAdminRepository = superAdminRepository;
        }
        /**
         * Verify a license key and return its details
         * Updates verification count and last verified timestamp
         */
        async verifyLicense(dto) {
            const license = await this.licenseRepository.findOne({
                where: { licenseKey: dto.licenseKey },
            });
            if (!license) {
                return {
                    valid: false,
                    status: 'invalid',
                    message: 'License key not found',
                    features: [],
                };
            }
            // Check if license is valid
            if (!license.isValid || license.status === 'invalid') {
                return {
                    valid: false,
                    status: 'invalid',
                    message: 'License is invalid',
                    organizationName: license.organizationName,
                    maxUsers: license.maxUsers,
                    features: [],
                };
            }
            // Check if license is expired
            if (license.expiryDate && new Date(license.expiryDate) < new Date()) {
                // Update status to expired
                await this.licenseRepository.update(license.id, {
                    status: 'expired',
                    isValid: false,
                });
                return {
                    valid: false,
                    status: 'expired',
                    organizationName: license.organizationName,
                    maxUsers: license.maxUsers,
                    expiryDate: license.expiryDate,
                    message: 'License has expired',
                    features: [],
                };
            }
            // Check if license is suspended
            if (license.status === 'suspended') {
                return {
                    valid: false,
                    status: 'error',
                    organizationName: license.organizationName,
                    maxUsers: license.maxUsers,
                    message: 'License is suspended',
                    features: [],
                };
            }
            // Update verification metadata
            await this.licenseRepository.update(license.id, {
                lastVerifiedAt: new Date(),
                verificationCount: license.verificationCount + 1,
            });
            return {
                valid: true,
                status: 'valid',
                organizationName: license.organizationName,
                maxUsers: license.maxUsers,
                expiryDate: license.expiryDate,
                features: license.features,
                cacheTTL: 86400, // 24 hours in seconds
            };
        }
        /**
         * Issue a new license
         */
        async issueLicense(dto, issuedById) {
            // Check if license key already exists
            const existing = await this.licenseRepository.findOne({
                where: { licenseKey: dto.licenseKey },
            });
            if (existing) {
                throw new common_1.BadRequestException('License key already exists');
            }
            // Validate references if provided
            let plan = null;
            if (dto.planId) {
                plan = await this.planRepository.findOne({
                    where: { id: dto.planId },
                });
                if (!plan) {
                    throw new common_1.NotFoundException('Plan not found');
                }
            }
            let institute = null;
            if (dto.instituteId) {
                institute = await this.instituteRepository.findOne({
                    where: { id: dto.instituteId },
                });
                if (!institute) {
                    throw new common_1.NotFoundException('Institute not found');
                }
            }
            const superAdmin = await this.superAdminRepository.findOne({
                where: { id: issuedById },
            });
            if (!superAdmin) {
                throw new common_1.UnauthorizedException('Super admin not found');
            }
            // Determine features based on plan
            let features = dto.features || [];
            if (plan && !dto.features) {
                features = this.extractFeaturesFromPlan(plan);
            }
            // Create license
            const license = this.licenseRepository.create({
                licenseKey: dto.licenseKey,
                organizationName: dto.organizationName,
                status: 'active',
                isValid: true,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
                features: features,
                maxUsers: dto.maxUsers || 0,
                planId: dto.planId,
                instituteId: dto.instituteId,
                issuedById: issuedById,
                notes: dto.notes,
                lastVerifiedAt: new Date(),
                verificationCount: 0,
            });
            const savedLicense = await this.licenseRepository.save(license);
            return this.mapLicenseToDto(savedLicense);
        }
        /**
         * Update an existing license
         */
        async updateLicense(licenseId, dto) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            // Update fields
            if (dto.organizationName)
                license.organizationName = dto.organizationName;
            if (dto.status)
                license.status = dto.status;
            if (dto.expiryDate)
                license.expiryDate = new Date(dto.expiryDate);
            if (dto.features)
                license.features = dto.features;
            if (dto.maxUsers !== undefined)
                license.maxUsers = dto.maxUsers;
            if (dto.notes)
                license.notes = dto.notes;
            // Update isValid based on status
            if (dto.status) {
                license.isValid = dto.status === 'active';
            }
            const updated = await this.licenseRepository.save(license);
            return this.mapLicenseToDto(updated);
        }
        /**
         * Get license by ID
         */
        async getLicenseById(licenseId) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
                relations: ['plan', 'institute', 'issuedBy'],
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            return this.mapLicenseToDto(license);
        }
        /**
         * Get license by key
         */
        async getLicenseByKey(licenseKey) {
            const license = await this.licenseRepository.findOne({
                where: { licenseKey },
                relations: ['plan', 'institute', 'issuedBy'],
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            return this.mapLicenseToDto(license);
        }
        /**
         * Check if a feature is enabled for a license
         */
        async checkFeature(licenseKey, featureName) {
            const license = await this.licenseRepository.findOne({
                where: { licenseKey },
            });
            if (!license) {
                return {
                    enabled: false,
                    message: 'License not found',
                };
            }
            if (!license.isValid) {
                return {
                    enabled: false,
                    message: 'License is not valid',
                };
            }
            if (license.expiryDate && new Date(license.expiryDate) < new Date()) {
                return {
                    enabled: false,
                    message: 'License has expired',
                };
            }
            const feature = license.features.find((f) => f.name === featureName);
            if (!feature) {
                return {
                    enabled: false,
                    message: `Feature '${featureName}' not found in license`,
                };
            }
            return {
                enabled: feature.enabled,
                limit: feature.limit,
                message: feature.enabled
                    ? `Feature '${featureName}' is enabled`
                    : `Feature '${featureName}' is disabled`,
            };
        }
        /**
         * Get all features for a license
         */
        async getFeatures(licenseKey) {
            const license = await this.licenseRepository.findOne({
                where: { licenseKey },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            if (!license.isValid) {
                throw new common_1.BadRequestException('License is not valid');
            }
            return license.features.filter((f) => f.enabled);
        }
        /**
         * List licenses with filters
         */
        async listLicenses(query) {
            const skip = query.skip || 0;
            const take = query.take || 10;
            const where = {};
            if (query.search) {
                where.organizationName = (0, typeorm_1.Like)(`%${query.search}%`);
            }
            if (query.status) {
                where.status = query.status;
            }
            if (query.isValid !== undefined) {
                where.isValid = query.isValid;
            }
            if (query.instituteId) {
                where.instituteId = query.instituteId;
            }
            if (query.planId) {
                where.planId = query.planId;
            }
            const [data, total] = await this.licenseRepository.findAndCount({
                where,
                skip,
                take,
                relations: ['plan', 'institute', 'issuedBy'],
                order: { createdAt: 'DESC' },
            });
            return {
                data: data.map((license) => this.mapLicenseToDto(license)),
                total,
                skip,
                take,
            };
        }
        /**
         * Revoke a license
         */
        async revokeLicense(licenseId) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            await this.licenseRepository.update(licenseId, {
                status: 'invalid',
                isValid: false,
            });
            return {
                message: 'License revoked successfully',
                licenseKey: license.licenseKey,
                revokedAt: new Date(),
            };
        }
        /**
         * Suspend a license
         */
        async suspendLicense(licenseId) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            const updated = await this.licenseRepository.save({
                ...license,
                status: 'suspended',
                isValid: false,
            });
            return this.mapLicenseToDto(updated);
        }
        /**
         * Reactivate a suspended license
         */
        async reactivateLicense(licenseId) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            // Check expiry before reactivating
            const isExpired = license.expiryDate && new Date(license.expiryDate) < new Date();
            const updated = await this.licenseRepository.save({
                ...license,
                status: isExpired ? 'expired' : 'active',
                isValid: !isExpired,
            });
            return this.mapLicenseToDto(updated);
        }
        /**
         * Delete a license
         */
        async deleteLicense(licenseId) {
            const license = await this.licenseRepository.findOne({
                where: { id: licenseId },
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            await this.licenseRepository.remove(license);
        }
        /**
         * Get license statistics
         * Uses a single aggregated query to ensure counts are consistent across concurrent writes
         */
        async getLicenseStats() {
            const result = await this.licenseRepository
                .createQueryBuilder('license')
                .select("COUNT(CASE WHEN license.status = 'active' THEN 1 END)", 'active')
                .addSelect("COUNT(CASE WHEN license.status = 'expired' THEN 1 END)", 'expired')
                .addSelect("COUNT(CASE WHEN license.status = 'suspended' THEN 1 END)", 'suspended')
                .addSelect("COUNT(CASE WHEN license.status = 'invalid' THEN 1 END)", 'invalid')
                .addSelect('COUNT(*)', 'total')
                .getRawOne();
            return {
                total: parseInt(result?.total, 10) || 0,
                active: parseInt(result?.active, 10) || 0,
                expired: parseInt(result?.expired, 10) || 0,
                suspended: parseInt(result?.suspended, 10) || 0,
                invalid: parseInt(result?.invalid, 10) || 0,
            };
        }
        /**
         * Helper method to extract features from a plan
         */
        extractFeaturesFromPlan(plan) {
            const features = [];
            if (plan.features && typeof plan.features === 'object') {
                Object.entries(plan.features).forEach(([key, value]) => {
                    if (typeof value === 'object') {
                        features.push({
                            name: key,
                            enabled: value.enabled || false,
                            limit: value.limit,
                        });
                    }
                    else {
                        features.push({
                            name: key,
                            enabled: Boolean(value),
                        });
                    }
                });
            }
            return features;
        }
        /**
         * Helper method to map License entity to DTO
         */
        mapLicenseToDto(license) {
            return (0, class_transformer_1.plainToClass)(verify_license_dto_1.LicenseInfoDto, {
                id: license.id,
                licenseKey: license.licenseKey,
                organizationName: license.organizationName,
                status: license.status,
                isValid: license.isValid,
                expiryDate: license.expiryDate,
                features: license.features,
                maxUsers: license.maxUsers,
                lastVerifiedAt: license.lastVerifiedAt,
                verificationCount: license.verificationCount,
                createdAt: license.createdAt,
                updatedAt: license.updatedAt,
            });
        }
    };
    return LicensesService = _classThis;
})();
exports.LicensesService = LicensesService;
