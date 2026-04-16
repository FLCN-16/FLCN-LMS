"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseDuplicateException = void 0;
const common_1 = require("@nestjs/common");
/**
 * Thrown when attempting to create a license with a duplicate key
 */
class LicenseDuplicateException extends common_1.ConflictException {
    constructor(licenseKey) {
        super({
            statusCode: 409,
            message: `License key '${licenseKey}' already exists`,
            error: 'License Duplicate',
        });
    }
}
exports.LicenseDuplicateException = LicenseDuplicateException;
