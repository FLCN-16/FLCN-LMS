import { Repository } from 'typeorm';
import { Institute } from '../master-entities/institute.entity';
import { License } from '../master-entities/license.entity';
import { Plan } from '../master-entities/plan.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { CheckFeatureResponseDto, FeatureDto, IssueLicenseDto, LicenseInfoDto, LicenseListResponseDto, ListLicensesQueryDto, RevokeLicenseResponseDto, UpdateLicenseDto, VerifyLicenseDto, VerifyLicenseResponseDto } from './dto/verify-license.dto';
export declare class LicensesService {
    private readonly licenseRepository;
    private readonly planRepository;
    private readonly instituteRepository;
    private readonly superAdminRepository;
    constructor(licenseRepository: Repository<License>, planRepository: Repository<Plan>, instituteRepository: Repository<Institute>, superAdminRepository: Repository<SuperAdmin>);
    /**
     * Verify a license key and return its details
     * Updates verification count and last verified timestamp
     */
    verifyLicense(dto: VerifyLicenseDto): Promise<VerifyLicenseResponseDto>;
    /**
     * Issue a new license
     */
    issueLicense(dto: IssueLicenseDto, issuedById: string): Promise<LicenseInfoDto>;
    /**
     * Update an existing license
     */
    updateLicense(licenseId: string, dto: UpdateLicenseDto): Promise<LicenseInfoDto>;
    /**
     * Get license by ID
     */
    getLicenseById(licenseId: string): Promise<LicenseInfoDto>;
    /**
     * Get license by key
     */
    getLicenseByKey(licenseKey: string): Promise<LicenseInfoDto>;
    /**
     * Check if a feature is enabled for a license
     */
    checkFeature(licenseKey: string, featureName: string): Promise<CheckFeatureResponseDto>;
    /**
     * Get all features for a license
     */
    getFeatures(licenseKey: string): Promise<FeatureDto[]>;
    /**
     * List licenses with filters
     */
    listLicenses(query: ListLicensesQueryDto): Promise<LicenseListResponseDto>;
    /**
     * Revoke a license
     */
    revokeLicense(licenseId: string): Promise<RevokeLicenseResponseDto>;
    /**
     * Suspend a license
     */
    suspendLicense(licenseId: string): Promise<LicenseInfoDto>;
    /**
     * Reactivate a suspended license
     */
    reactivateLicense(licenseId: string): Promise<LicenseInfoDto>;
    /**
     * Delete a license
     */
    deleteLicense(licenseId: string): Promise<void>;
    /**
     * Get license statistics
     * Uses a single aggregated query to ensure counts are consistent across concurrent writes
     */
    getLicenseStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        suspended: number;
        invalid: number;
    }>;
    /**
     * Helper method to extract features from a plan
     */
    private extractFeaturesFromPlan;
    /**
     * Helper method to map License entity to DTO
     */
    private mapLicenseToDto;
}
//# sourceMappingURL=licenses.service.d.ts.map