import { CheckFeatureDto, CheckFeatureResponseDto, FeatureDto, IssueLicenseDto, LicenseInfoDto, LicenseListResponseDto, ListLicensesQueryDto, RevokeLicenseResponseDto, UpdateLicenseDto, VerifyLicenseDto, VerifyLicenseResponseDto } from './dto/verify-license.dto';
import { LicensesService } from './licenses.service';
/**
 * License Management Controller
 *
 * Handles license verification, issuance, and management for the LMS system.
 * Provides endpoints for both Gin backend and NestJS dashboard integration.
 */
export declare class LicensesController {
    private readonly licensesService;
    constructor(licensesService: LicensesService);
    /**
     * Verify a license key
     *
     * POST /api/v1/licenses/verify
     * Public endpoint - used by Gin backend for license verification
     *
     * Request body:
     * - licenseKey: The license key to verify
     * - timestamp: Optional Unix timestamp for verification request
     *
     * Returns: License verification response with validity status and features
     */
    verifyLicense(dto: VerifyLicenseDto): Promise<VerifyLicenseResponseDto>;
    /**
     * Check if a specific feature is enabled for a license
     *
     * POST /api/v1/licenses/check-feature
     * Public endpoint - used by Gin backend to check feature availability
     *
     * Request body:
     * - licenseKey: The license key to check
     * - featureName: Name of the feature to check (e.g., 'live_sessions', 'advanced_analytics')
     *
     * Returns: Feature availability status with optional usage limit
     */
    checkFeature(dto: CheckFeatureDto): Promise<CheckFeatureResponseDto>;
    /**
     * Get license statistics summary
     *
     * GET /api/v1/licenses/stats/summary
     * Admin endpoint - returns aggregate license metrics
     *
     * Returns: Statistics for all licenses by status
     */
    getStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        suspended: number;
        invalid: number;
    }>;
    /**
     * Issue a new license
     *
     * POST /api/v1/licenses/issue
     * Admin endpoint - requires super admin authentication
     *
     * Request body:
     * - organizationName: Name of the organization
     * - licenseKey: Unique license key
     * - planId: Optional UUID of associated plan
     * - instituteId: Optional UUID of associated institute
     * - expiryDate: Optional ISO date string for license expiration
     * - features: Optional array of feature configurations
     * - maxUsers: Optional maximum number of users allowed
     * - notes: Optional notes about the license
     *
     * Returns: Created license information
     */
    issueLicense(dto: IssueLicenseDto, issuedById: string): Promise<LicenseInfoDto>;
    /**
     * Get license by key
     *
     * GET /api/v1/licenses/key/:key
     * Admin endpoint - retrieve license details by license key
     *
     * Path parameters:
     * - key: The license key to retrieve
     *
     * Returns: Complete license information
     */
    getLicenseByKey(key: string): Promise<LicenseInfoDto>;
    /**
     * Suspend a license
     *
     * PATCH /api/v1/licenses/:id/suspend
     * Admin endpoint - temporarily disable a license
     *
     * Path parameters:
     * - id: The license ID to suspend
     *
     * Returns: Updated license information
     */
    suspendLicense(id: string): Promise<LicenseInfoDto>;
    /**
     * Reactivate a suspended license
     *
     * PATCH /api/v1/licenses/:id/reactivate
     * Admin endpoint - restore a suspended license if not expired
     *
     * Path parameters:
     * - id: The license ID to reactivate
     *
     * Returns: Updated license information
     */
    reactivateLicense(id: string): Promise<LicenseInfoDto>;
    /**
     * Get all enabled features for a license
     *
     * GET /api/v1/licenses/:key/features
     * Admin endpoint - retrieve feature list for a specific license
     *
     * Path parameters:
     * - key: The license key
     *
     * Returns: Array of enabled features with their configurations
     */
    getFeatures(key: string): Promise<FeatureDto[]>;
    /**
     * Get license by ID
     *
     * GET /api/v1/licenses/:id
     * Admin endpoint - retrieve full license details
     *
     * Path parameters:
     * - id: The license UUID
     *
     * Returns: Complete license information including related entities
     */
    getLicenseById(id: string): Promise<LicenseInfoDto>;
    /**
     * Update a license
     *
     * PUT /api/v1/licenses/:id
     * Admin endpoint - modify license properties
     *
     * Path parameters:
     * - id: The license UUID
     *
     * Request body: Partial license update (all fields optional)
     * - organizationName: Update organization name
     * - status: Change license status (active, suspended, invalid, expired, pending)
     * - expiryDate: Update expiration date
     * - features: Update feature configurations
     * - maxUsers: Update user limit
     * - notes: Update notes
     *
     * Returns: Updated license information
     */
    updateLicense(id: string, dto: UpdateLicenseDto): Promise<LicenseInfoDto>;
    /**
     * Revoke a license
     *
     * DELETE /api/v1/licenses/:id
     * Admin endpoint - permanently invalidate a license
     *
     * Path parameters:
     * - id: The license UUID
     *
     * Returns: Revocation confirmation with timestamp
     */
    revokeLicense(id: string): Promise<RevokeLicenseResponseDto>;
    /**
     * List licenses with filtering and pagination
     *
     * GET /api/v1/licenses
     * Admin endpoint - retrieve licenses with optional filters
     *
     * Query parameters:
     * - skip: Number of records to skip (default: 0)
     * - take: Number of records to return (default: 10)
     * - search: Search by organization name (partial match)
     * - status: Filter by status (active, suspended, invalid, expired, pending)
     * - isValid: Filter by validity (true/false)
     * - instituteId: Filter by associated institute UUID
     * - planId: Filter by associated plan UUID
     *
     * Returns: Paginated list of licenses with metadata
     */
    listLicenses(query: ListLicensesQueryDto): Promise<LicenseListResponseDto>;
}
//# sourceMappingURL=licenses.controller.d.ts.map