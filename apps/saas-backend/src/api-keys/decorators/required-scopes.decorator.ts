import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify required scopes for an endpoint
 *
 * Usage:
 * @RequiredScopes('read:licenses', 'write:analytics')
 * @Post('/licenses/issue')
 * async issueLicense() { ... }
 *
 * The API key must have ALL specified scopes to access the endpoint
 */
export const RequiredScopes = (...scopes: string[]) =>
  SetMetadata('requiredScopes', scopes);
