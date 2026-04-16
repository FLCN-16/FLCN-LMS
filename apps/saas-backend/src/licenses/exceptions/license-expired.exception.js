"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseExpiredException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Thrown when a license has expired
 */
class LicenseExpiredException extends common_1.BadRequestException {
    constructor(expiryDate) {
        const message = expiryDate
            ? `License expired on ${expiryDate.toISOString()}`
            : 'License has expired';
        super({
            statusCode: 400,
            message,
            error: 'License Expired',
        });
    }
}
exports.LicenseExpiredException = LicenseExpiredException;
