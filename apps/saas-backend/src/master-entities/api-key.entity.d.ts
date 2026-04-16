import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Stores API keys for institute integrations and third-party access.
 * Each key is hashed and associated with a specific institute.
 */
export declare class ApiKey {
    id: string;
    /**
     * Foreign key to institute
     */
    instituteId: string;
    /**
     * Hashed API key (store hash, not the actual key)
     * Unique across all keys
     */
    keyHash: string;
    /**
     * Display name for this API key
     * Helps users identify which key is which
     */
    name?: string;
    /**
     * Scopes/permissions this key has
     * Example: ['read:courses', 'write:users', 'read:analytics']
     */
    scopes?: string[];
    /**
     * Rate limit (requests per hour)
     */
    rateLimit: number;
    /**
     * When was this key last used?
     */
    lastUsedAt?: Date;
    /**
     * Total requests made with this key
     */
    totalRequests: number;
    /**
     * Whether this key is active
     */
    isActive: boolean;
    /**
     * When does this key expire? (optional)
     */
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    /**
     * Relation to Institute
     */
    institute: Institute;
}
//# sourceMappingURL=api-key.entity.d.ts.map