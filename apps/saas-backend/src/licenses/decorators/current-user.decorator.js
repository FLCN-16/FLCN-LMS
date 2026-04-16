"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
/**
 * Extracts the current user ID from the authenticated request
 *
 * Usage: @CurrentUser() userId: string
 *
 * Note: This decorator relies on JwtStrategy setting request.user.
 * It will return null if the request is not authenticated.
 */
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        return null;
    }
    return request.user.userId || request.user.id || null;
});
