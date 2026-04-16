/**
 * Allowed API key scopes
 * Restrict scopes to this allowlist to prevent arbitrary scope injection
 */
export declare const ALLOWED_API_KEY_SCOPES: readonly ["read:licenses", "write:licenses", "read:features", "write:features", "read:customers", "write:customers", "read:analytics", "write:analytics", "read:invoices", "write:invoices"];
/**
 * DTO for creating a new API key
 */
export declare class CreateApiKeyDto {
    /**
     * Display name for this API key (e.g., "Gin Backend Key")
     */
    name?: string;
    /**
     * Scopes/permissions this key has
     * Example: ['read:licenses', 'read:features', 'write:analytics']
     * Must be from ALLOWED_API_KEY_SCOPES allowlist
     */
    scopes?: string[];
    /**
     * Rate limit (requests per hour)
     * Defaults to 1000 if not specified
     */
    rateLimit?: number;
    /**
     * Optional expiration date (ISO 8601 format)
     */
    expiresAt?: string;
}
/**
 * DTO for API key response (shown only once during creation)
 * Includes the raw key for copying
 */
export declare class ApiKeyResponseDto {
    id: string;
    instituteId: string;
    name?: string;
    scopes?: string[];
    rateLimit: number;
    /**
     * The raw API key - only shown once during creation!
     * Store this securely - it cannot be retrieved later
     */
    key: string;
    expiresAt?: Date;
    createdAt: Date;
    /**
     * Warning message
     */
    warning: string;
}
/**
 * DTO for API key details (without showing the raw key)
 * Safe to return in list/get endpoints
 */
export declare class ApiKeyDetailDto {
    id: string;
    instituteId: string;
    name?: string;
    scopes?: string[];
    rateLimit: number;
    /**
     * First 8 characters of the key hash for display (e.g., "FLCN_mk9...")
     */
    keyPreview: string;
    lastUsedAt?: Date;
    totalRequests: number;
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DTO for updating an API key
 */
export declare class UpdateApiKeyDto {
    name?: string;
    scopes?: string[];
    rateLimit?: number;
    expiresAt?: string;
}
/**
 * DTO for validating an API key
 */
export declare class ValidateApiKeyDto {
    key: string;
}
/**
 * DTO for API key validation response
 */
export declare class ApiKeyValidationResponseDto {
    isValid: boolean;
    keyId?: string;
    instituteId?: string;
    scopes?: string[];
    rateLimit?: number;
    remainingRequests?: number;
    expiresAt?: Date;
    message: string;
}
//# sourceMappingURL=create-api-key.dto.d.ts.map