import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores feature flags/toggles for the platform.
 * Can be global (instituteId = null) or institute-specific.
 * Allows enabling/disabling features per institute.
 *
 * Example records:
 * - flagName: "new_dashboard", instituteId: null, isEnabled: true (global)
 * - flagName: "new_dashboard", instituteId: "uuid-1", isEnabled: false (institute override)
 * - flagName: "beta_features", instituteId: "uuid-2", isEnabled: true (institute-specific)
 */
export declare class FeatureFlag {
    /**
     * Unique identifier for the feature flag
     */
    id: string;
    /**
     * Foreign key to institute
     * If null, this is a global flag for all institutes
     * If set, this is an institute-specific flag override
     */
    instituteId?: string;
    /**
     * Name of the feature flag
     * Convention: snake_case
     * Examples: 'new_dashboard', 'beta_features', 'dark_mode'
     */
    flagName: string;
    /**
     * Whether this feature is enabled
     * true = feature is active, false = feature is disabled
     */
    isEnabled: boolean;
    /**
     * Configuration for this feature flag (JSON)
     * Can store:
     * - Rollout percentage (0-100)
     * - User groups
     * - Feature parameters
     * - Any other config needed
     *
     * Example:
     * {
     *   "rolloutPercentage": 50,
     *   "userGroups": ["beta_users", "internal"],
     *   "config": { "maxItems": 10, "timeout": 5000 }
     * }
     */
    config?: Record<string, any>;
    /**
     * When this flag was created
     */
    createdAt: Date;
    /**
     * When this flag was last updated
     */
    updatedAt: Date;
    /**
     * Relation to Institute
     * null if this is a global flag
     * If set, allows access to institute details
     */
    institute?: Institute;
}
//# sourceMappingURL=feature-flag.entity.d.ts.map