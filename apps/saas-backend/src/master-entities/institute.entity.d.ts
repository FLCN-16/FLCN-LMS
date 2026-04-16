import { ApiKey } from './api-key.entity';
import { AuditLog } from './audit-log.entity';
import { Branch } from './branch.entity';
import { FeatureFlag } from './feature-flag.entity';
import { InstituteBilling } from './institute-billing.entity';
import { InstituteDatabase } from './institute-database.entity';
import { Plan } from './plan.entity';
/**
 * MASTER DATABASE ENTITY: Institute
 *
 * Represents an educational institute/organization in the FLCN-LMS platform.
 * All institute metadata is stored in the MASTER database.
 * Each institute has their own separate database for all their data.
 *
 * Example records:
 * - id: "uuid-1", slug: "pw-live", name: "Physics Wallah"
 * - id: "uuid-2", slug: "adda247", name: "ADDA247"
 * - id: "uuid-3", slug: "flcn-org", name: "FLCN"
 */
export declare class Institute {
    id: string;
    /**
     * Unique slug identifier for the institute
     * Used in subdomain routing: pw-live.example.com
     * Format: lowercase alphanumeric with hyphens
     * Examples: 'pw-live', 'adda247', 'flcn-org'
     */
    slug: string;
    /**
     * Human-readable name of the institute/organization
     * Examples: 'Physics Wallah', 'ADDA247', 'FLCN'
     */
    name: string;
    /**
     * Logo URL for the institute
     * Points to CDN or cloud storage
     */
    logoUrl?: string;
    /**
     * Custom domain for white-label/branded access
     * Example: 'www.pw.com', 'www.adda247.com'
     * When set, users can access via custom domain instead of subdomain
     * This is optional and unique across all institutes
     */
    customDomain?: string;
    /**
     * Foreign key to the subscription plan
     */
    planId?: string;
    /**
     * Subscription plan tier
     * Controls feature access and usage limits
     */
    subscriptionPlan?: Plan;
    /**
     * Whether this institute is active/enabled
     * Inactive institutes cannot make API requests
     * Set to false to suspend an institute without deleting it
     */
    isActive: boolean;
    /**
     * Custom settings and configuration for this institute (JSON)
     * Can store:
     * - Theme preferences
     * - Feature flags
     * - Custom branding
     * - API configuration
     * - Any other institute-specific settings
     */
    settings?: Record<string, any>;
    /**
     * Maximum number of users allowed for this institute
     * Based on subscription plan
     * Enforced at application level
     */
    maxUsers: number;
    /**
     * Maximum number of courses allowed for this institute
     * Based on subscription plan
     */
    maxCourses: number;
    /**
     * Maximum storage in GB allowed for this institute
     * Based on subscription plan
     */
    maxStorageGb: number;
    /**
     * Timestamp when this institute was created
     */
    createdAt: Date;
    /**
     * Timestamp when this institute was last updated
     */
    updatedAt: Date;
    /**
     * Relation to InstituteDatabase
     * Each institute has exactly one database configuration
     * Eagerly loaded for quick access during request routing
     */
    databases: InstituteDatabase[];
    /**
     * Relation to Branch
     * Each institute can have multiple branches (locations/sub-organizations)
     */
    branches: Branch[];
    /**
     * Relation to Billing
     * Each institute has one billing record
     */
    billing: InstituteBilling[];
    /**
     * Audit logs for this institute
     */
    auditLogs: AuditLog[];
    /**
     * API keys for this institute
     */
    apiKeys: ApiKey[];
    /**
     * Feature flags for this institute
     */
    featureFlags: FeatureFlag[];
}
//# sourceMappingURL=institute.entity.d.ts.map