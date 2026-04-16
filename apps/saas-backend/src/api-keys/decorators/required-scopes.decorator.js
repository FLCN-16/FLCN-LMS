"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredScopes = void 0;
const common_1 = require("@nestjs/common");
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
const RequiredScopes = (...scopes) => (0, common_1.SetMetadata)('requiredScopes', scopes);
exports.RequiredScopes = RequiredScopes;
