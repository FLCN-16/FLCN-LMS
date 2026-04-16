import { ApiKeysService } from './api-keys.service';
import { ApiKeyDetailDto, ApiKeyResponseDto, ApiKeyValidationResponseDto, CreateApiKeyDto, UpdateApiKeyDto, ValidateApiKeyDto } from './dto/create-api-key.dto';
/**
 * API Keys Controller
 *
 * Manages API key lifecycle for SaaS customers (institutes)
 * All endpoints require valid authentication
 *
 * Routes:
 * POST   /api-keys                    - Create new API key
 * GET    /api-keys                    - List API keys
 * GET    /api-keys/:keyId             - Get specific key
 * PUT    /api-keys/:keyId             - Update key
 * PATCH  /api-keys/:keyId/disable     - Disable key
 * PATCH  /api-keys/:keyId/enable      - Enable key
 * DELETE /api-keys/:keyId             - Delete key
 * GET    /api-keys/:keyId/stats       - Get usage statistics
 * POST   /api-keys/validate           - Validate a key (public)
 */
export declare class ApiKeysController {
    private readonly apiKeysService;
    constructor(apiKeysService: ApiKeysService);
    /**
     * Create a new API key for an institute
     *
     * POST /api-keys
     *
     * Body:
     * {
     *   "name": "Production Gin Backend",
     *   "scopes": ["read:licenses", "read:features"],
     *   "rateLimit": 5000,
     *   "expiresAt": "2025-12-31T23:59:59Z"
     * }
     *
     * Returns: ApiKeyResponseDto with raw key (shown only once)
     */
    create(createApiKeyDto: CreateApiKeyDto, instituteId: string): Promise<ApiKeyResponseDto>;
    /**
     * List all API keys for an institute
     *
     * GET /api-keys?instituteId=xxx&page=1&limit=10
     *
     * Returns: { data: ApiKeyDetailDto[], total: number }
     */
    findAll(instituteId: string, page?: string, limit?: string): Promise<{
        data: ApiKeyDetailDto[];
        total: number;
    }>;
    /**
     * Get a specific API key by ID
     *
     * GET /api-keys/:keyId?instituteId=xxx
     *
     * Returns: ApiKeyDetailDto (without the raw key)
     */
    findOne(keyId: string, instituteId: string): Promise<ApiKeyDetailDto>;
    /**
     * Update an API key's properties
     *
     * PUT /api-keys/:keyId?instituteId=xxx
     *
     * Body:
     * {
     *   "name": "Updated Name",
     *   "scopes": ["read:licenses"],
     *   "rateLimit": 2000,
     *   "expiresAt": "2025-06-30T23:59:59Z"
     * }
     *
     * Returns: Updated ApiKeyDetailDto
     */
    update(keyId: string, instituteId: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKeyDetailDto>;
    /**
     * Disable an API key
     *
     * PATCH /api-keys/:keyId/disable?instituteId=xxx
     *
     * Returns: Updated ApiKeyDetailDto with isActive=false
     */
    disable(keyId: string, instituteId: string): Promise<ApiKeyDetailDto>;
    /**
     * Re-enable an API key
     *
     * PATCH /api-keys/:keyId/enable?instituteId=xxx
     *
     * Returns: Updated ApiKeyDetailDto with isActive=true
     */
    enable(keyId: string, instituteId: string): Promise<ApiKeyDetailDto>;
    /**
     * Delete an API key
     *
     * DELETE /api-keys/:keyId?instituteId=xxx
     *
     * Returns: 204 No Content
     */
    delete(keyId: string, instituteId: string): Promise<void>;
    /**
     * Get usage statistics for an API key
     *
     * GET /api-keys/:keyId/stats?instituteId=xxx
     *
     * Returns: { totalRequests, lastUsedAt, requestsThisHour }
     */
    getStats(keyId: string, instituteId: string): Promise<{
        totalRequests: number;
        lastUsedAt?: Date;
        requestsThisHour: number;
    }>;
    /**
     * Validate an API key
     *
     * PUBLIC ENDPOINT - Can be called by external services (e.g., Gin backend)
     *
     * POST /api-keys/validate
     *
     * Body:
     * {
     *   "key": "FLCN_abcd1234efgh5678ijkl9012mnop3456"
     * }
     *
     * Returns: ApiKeyValidationResponseDto
     * {
     *   "isValid": true,
     *   "keyId": "xxx",
     *   "instituteId": "yyy",
     *   "scopes": ["read:licenses"],
     *   "rateLimit": 1000,
     *   "remainingRequests": 999,
     *   "expiresAt": "2025-12-31T23:59:59Z",
     *   "message": "API key is valid"
     * }
     */
    validate(validateApiKeyDto: ValidateApiKeyDto): Promise<ApiKeyValidationResponseDto>;
}
//# sourceMappingURL=api-keys.controller.d.ts.map