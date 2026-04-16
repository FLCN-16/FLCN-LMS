"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseInvalidException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Thrown when a license is invalid or not found
 */
class LicenseInvalidException extends common_1.BadRequestException {
    constructor(message = 'License is invalid') {
        super({
            statusCode: 400,
            message,
            error: 'License Invalid',
        });
    }
}
exports.LicenseInvalidException = LicenseInvalidException;
