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
export declare const RequiredScopes: (...scopes: string[]) => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=required-scopes.decorator.d.ts.map