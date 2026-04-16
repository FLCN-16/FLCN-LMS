import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Represents a branch/location of an institute.
 * Each institute can have multiple branches (regional offices, centers, sub-organizations).
 * Allows for multi-location management within a single institute.
 */
export declare class Branch {
    id: string;
    /**
     * Foreign key to institute
     * Each branch belongs to exactly one institute
     */
    instituteId: string;
    /**
     * URL-friendly identifier for the branch
     * Unique within the institute
     * Examples: 'hq', 'delhi-center', 'bangalore-office'
     */
    slug: string;
    /**
     * Display name for this branch
     * Examples: 'Headquarters', 'Delhi Center', 'Bangalore Office'
     */
    name: string;
    /**
     * Description of this branch
     */
    description?: string;
    /**
     * Contact email for this branch
     */
    email?: string;
    /**
     * Contact phone for this branch
     */
    phone?: string;
    /**
     * Full address of this branch
     */
    address?: string;
    /**
     * City where this branch is located
     */
    city?: string;
    /**
     * State/Province where this branch is located
     */
    state?: string;
    /**
     * Country where this branch is located
     */
    country?: string;
    /**
     * Postal code for this branch
     */
    postalCode?: string;
    /**
     * Whether this branch is active
     */
    isActive: boolean;
    /**
     * Custom settings for this branch (JSON)
     */
    settings?: Record<string, any>;
    /**
     * When this branch was created
     */
    createdAt: Date;
    /**
     * When this branch was last updated
     */
    updatedAt: Date;
    /**
     * Relation to Institute
     * Each branch belongs to exactly one institute
     */
    institute: Institute;
}
//# sourceMappingURL=branch.entity.d.ts.map