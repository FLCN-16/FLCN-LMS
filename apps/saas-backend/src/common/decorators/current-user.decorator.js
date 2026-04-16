"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
function extractUserId(payload) {
    const userId = payload?.sub ?? payload?.id ?? payload?.userId;
    if (!userId) {
        throw new common_1.UnauthorizedException('Authenticated user not found');
    }
    return userId;
}
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, context) => {
    const request = context.switchToHttp().getRequest();
    const payload = request.user;
    if (!payload) {
        throw new common_1.UnauthorizedException('Authenticated user not found');
    }
    return {
        id: extractUserId(payload),
        instituteId: typeof payload.instituteId === 'string'
            ? payload.instituteId
            : undefined,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        role: typeof payload.role === 'string' ? payload.role : undefined,
        payload,
    };
});
