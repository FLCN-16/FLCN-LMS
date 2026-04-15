import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { License } from '../master-entities/license.entity';
import { Plan } from '../master-entities/plan.entity';
import { Institute } from '../master-entities/institute.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import {
  IssueLicenseDto,
  UpdateLicenseDto,
  VerifyLicenseDto,
  VerifyLicenseResponseDto,
  LicenseInfoDto,
  CheckFeatureResponseDto,
  ListLicensesQueryDto,
  LicenseListResponseDto,
  RevokeLicenseResponseDto,
  FeatureDto,
} from './dto/verify-license.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LicensesService {
  constructor(
    @InjectRepository(License, 'master')
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Plan, 'master')
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Institute, 'master')
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(SuperAdmin, 'master')
    private readonly superAdminRepository: Repository<SuperAdmin>,
  ) {}

  /**
   * Verify a license key and return its details
   * Updates verification count and last verified timestamp
   */
  async verifyLicense(dto: VerifyLicenseDto): Promise<VerifyLicenseResponseDto> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey: dto.licenseKey },
    });

    if (!license) {
      return {
        valid: false,
        status: 'invalid',
        message: 'License key not found',
      };
    }

    // Check if license is valid
    if (!license.isValid || license.status === 'invalid') {
      return {
        valid: false,
        status: 'invalid',
        message: 'License is invalid',
      };
    }

    // Check if license is expired
    if (
      license.expiryDate &&
      new Date(license.expiryDate) < new Date()
    ) {
      // Update status to expired
      await this.licenseRepository.update(license.id, {
        status: 'expired',
        isValid: false,
      });

      return {
        valid: false,
        status: 'expired',
        expiryDate: license.expiryDate,
        message: 'License has expired',
      };
    }

    // Check if license is suspended
    if (license.status === 'suspended') {
      return {
        valid: false,
        status: 'error',
        message: 'License is suspended',
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
      expiryDate: license.expiryDate,
      features: license.features as FeatureDto[],
      cacheTTL: 86400, // 24 hours in seconds
    };
  }

  /**
   * Issue a new license
   */
  async issueLicense(
    dto: IssueLicenseDto,
    issuedById: string,
  ): Promise<LicenseInfoDto> {
    // Check if license key already exists
    const existing = await this.licenseRepository.findOne({
      where: { licenseKey: dto.licenseKey },
    });

    if (existing) {
      throw new BadRequestException('License key already exists');
    }

    // Validate references if provided
    let plan: Plan | null = null;
    if (dto.planId) {
      plan = await this.planRepository.findOne({
        where: { id: dto.planId },
      });
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }
    }

    let institute: Institute | null = null;
    if (dto.instituteId) {
      institute = await this.instituteRepository.findOne({
        where: { id: dto.instituteId },
      });
      if (!institute) {
        throw new NotFoundException('Institute not found');
      }
    }

    const superAdmin = await this.superAdminRepository.findOne({
      where: { id: issuedById },
    });
    if (!superAdmin) {
      throw new UnauthorizedException('Super admin not found');
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
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
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
  async updateLicense(
    licenseId: string,
    dto: UpdateLicenseDto,
  ): Promise<LicenseInfoDto> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    // Update fields
    if (dto.organizationName) license.organizationName = dto.organizationName;
    if (dto.status) license.status = dto.status;
    if (dto.expiryDate) license.expiryDate = new Date(dto.expiryDate);
    if (dto.features) license.features = dto.features;
    if (dto.maxUsers !== undefined) license.maxUsers = dto.maxUsers;
    if (dto.notes) license.notes = dto.notes;

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
  async getLicenseById(licenseId: string): Promise<LicenseInfoDto> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
      relations: ['plan', 'institute', 'issuedBy'],
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return this.mapLicenseToDto(license);
  }

  /**
   * Get license by key
   */
  async getLicenseByKey(licenseKey: string): Promise<LicenseInfoDto> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
      relations: ['plan', 'institute', 'issuedBy'],
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return this.mapLicenseToDto(license);
  }

  /**
   * Check if a feature is enabled for a license
   */
  async checkFeature(
    licenseKey: string,
    featureName: string,
  ): Promise<CheckFeatureResponseDto> {
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

    if (
      license.expiryDate &&
      new Date(license.expiryDate) < new Date()
    ) {
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
  async getFeatures(licenseKey: string): Promise<FeatureDto[]> {
    const license = await this.licenseRepository.findOne({
      where: { licenseKey },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    if (!license.isValid) {
      throw new BadRequestException('License is not valid');
    }

    return license.features.filter((f) => f.enabled);
  }

  /**
   * List licenses with filters
   */
  async listLicenses(query: ListLicensesQueryDto): Promise<LicenseListResponseDto> {
    const skip = query.skip || 0;
    const take = query.take || 10;

    const where: any = {};

    if (query.search) {
      where.organizationName = Like(`%${query.search}%`);
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
  async revokeLicense(licenseId: string): Promise<RevokeLicenseResponseDto> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
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
  async suspendLicense(licenseId: string): Promise<LicenseInfoDto> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
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
  async reactivateLicense(licenseId: string): Promise<LicenseInfoDto> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    // Check expiry before reactivating
    const isExpired =
      license.expiryDate && new Date(license.expiryDate) < new Date();

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
  async deleteLicense(licenseId: string): Promise<void> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    await this.licenseRepository.remove(license);
  }

  /**
   * Get license statistics
   */
  async getLicenseStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    suspended: number;
    invalid: number;
  }> {
    const total = await this.licenseRepository.count();
    const active = await this.licenseRepository.count({
      where: { status: 'active' },
    });
    const expired = await this.licenseRepository.count({
      where: { status: 'expired' },
    });
    const suspended = await this.licenseRepository.count({
      where: { status: 'suspended' },
    });
    const invalid = await this.licenseRepository.count({
      where: { status: 'invalid' },
    });

    return { total, active, expired, suspended, invalid };
  }

  /**
   * Helper method to extract features from a plan
   */
  private extractFeaturesFromPlan(plan: Plan): FeatureDto[] {
    const features: FeatureDto[] = [];

    if (plan.features && typeof plan.features === 'object') {
      Object.entries(plan.features).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object') {
          features.push({
            name: key,
            enabled: value.enabled || false,
            limit: value.limit,
          });
        } else {
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
  private mapLicenseToDto(license: License): LicenseInfoDto {
    return plainToClass(LicenseInfoDto, {
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
}
