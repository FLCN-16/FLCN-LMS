import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysService } from '../api-keys.service';
/**
 * API Key Authentication Guard
 *
 * Validates API keys from the Authorization header
 * Format: Authorization: Bearer FLCN_<key>
 * or Authorization: <key>
 *
 * Usage:
 * @UseGuards(ApiKeyGuard)
 * @RequiredScopes('read:licenses', 'write:analytics')
 */
export declare class ApiKeyGuard implements CanActivate {
    private apiKeysService;
    private reflector;
    constructor(apiKeysService: ApiKeysService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=api-key.guard.d.ts.map