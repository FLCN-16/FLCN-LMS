import { Repository } from 'typeorm';
import { ApiKey } from '../master-entities/api-key.entity';
import { Institute } from '../master-entities/institute.entity';
import { ApiKeyDetailDto, ApiKeyResponseDto, ApiKeyValidationResponseDto, CreateApiKeyDto, UpdateApiKeyDto } from './dto/create-api-key.dto';
/**
 * API Keys Service
 *
 * Manages API key generation, validation, and lifecycle
 * Handles secure key storage and usage tracking
 */
export declare class ApiKeysService {
    private apiKeyRepository;
    private instituteRepository;
    constructor(apiKeyRepository: Repository<ApiKey>, instituteRepository: Repository<Institute>);
    /**
     * Generate a new API key
     * Format: FLCN_<random_32_chars>
     */
    private generateRawKey;
    /**
     * Hash an API key using SHA-256
     * Store only the hash in the database
     */
    private hashKey;
    /**
     * Create a new API key for an institute
     */
    create(instituteId: string, createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyResponseDto>;
    /**
     * Validate an API key
     * Returns key details if valid, null otherwise
     */
    validateKey(key: string): Promise<ApiKeyValidationResponseDto>;
    /**
     * Check if key has a specific scope
     */
    hasScope(key: string, requiredScope: string): Promise<boolean>;
    /**
     * Get all API keys for an institute (without showing the actual key)
     */
    findAll(instituteId: string, page?: number, limit?: number): Promise<{
        data: ApiKeyDetailDto[];
        total: number;
    }>;
    /**
     * Get a single API key by ID
     */
    findOne(instituteId: string, keyId: string): Promise<ApiKeyDetailDto>;
    /**
     * Update an API key
     */
    update(instituteId: string, keyId: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKeyDetailDto>;
    /**
     * Disable an API key
     */
    disable(instituteId: string, keyId: string): Promise<ApiKeyDetailDto>;
    /**
     * Re-enable an API key
     */
    enable(instituteId: string, keyId: string): Promise<ApiKeyDetailDto>;
    /**
     * Delete an API key
     */
    delete(instituteId: string, keyId: string): Promise<void>;
    /**
     * Get usage statistics for a key
     */
    getStats(instituteId: string, keyId: string): Promise<{
        totalRequests: number;
        lastUsedAt?: Date;
        requestsThisHour: number;
    }>;
    /**
     * Map ApiKey entity to detail DTO (safe for public response)
     */
    private mapToDetailDto;
}
//# sourceMappingURL=api-keys.service.d.ts.map