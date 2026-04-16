/**
 * Feature configuration DTO
 */
export declare class FeatureDto {
    name: string;
    enabled: boolean;
    limit?: number;
}
/**
 * Request DTO for verifying a license
 */
export declare class VerifyLicenseDto {
    licenseKey: string;
    timestamp?: number;
}
/**
 * Response DTO for license verification
 */
export declare class VerifyLicenseResponseDto {
    valid: boolean;
    status: 'valid' | 'invalid' | 'expired' | 'error';
    organizationName?: string;
    maxUsers?: number;
    expiryDate?: Date;
    features: FeatureDto[];
    cacheTTL?: number;
    message?: string;
}
/**
 * License information DTO for responses
 */
export declare class LicenseInfoDto {
    id: string;
    licenseKey: string;
    organizationName: string;
    status: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';
    isValid: boolean;
    expiryDate?: Date;
    features: FeatureDto[];
    maxUsers: number;
    lastVerifiedAt?: Date;
    verificationCount: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Request DTO for issuing a new license
 */
export declare class IssueLicenseDto {
    organizationName: string;
    licenseKey: string;
    planId?: string;
    instituteId?: string;
    expiryDate?: string;
    features?: FeatureDto[];
    maxUsers?: number;
    notes?: string;
}
/**
 * Request DTO for updating a license
 */
export declare class UpdateLicenseDto {
    organizationName?: string;
    status?: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';
    expiryDate?: string;
    features?: FeatureDto[];
    maxUsers?: number;
    notes?: string;
}
/**
 * Request DTO for checking if a feature is enabled
 */
export declare class CheckFeatureDto {
    licenseKey: string;
    featureName: string;
}
/**
 * Response DTO for feature check
 */
export declare class CheckFeatureResponseDto {
    enabled: boolean;
    limit?: number;
    message: string;
}
/**
 * Query DTO for listing licenses with filters
 */
export declare class ListLicensesQueryDto {
    skip?: number;
    take?: number;
    search?: string;
    status?: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';
    isValid?: boolean;
    instituteId?: string;
    planId?: string;
}
/**
 * Response DTO for paginated license list
 */
export declare class LicenseListResponseDto {
    data: LicenseInfoDto[];
    total: number;
    skip: number;
    take: number;
}
/**
 * Response DTO for license revocation
 */
export declare class RevokeLicenseResponseDto {
    message: string;
    licenseKey: string;
    revokedAt: Date;
}
//# sourceMappingURL=verify-license.dto.d.ts.map