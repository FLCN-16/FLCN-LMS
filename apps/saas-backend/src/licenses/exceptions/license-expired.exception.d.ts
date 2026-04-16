import { BadRequestException } from '@nestjs/common';
/**
 * Thrown when a license has expired
 */
export declare class LicenseExpiredException extends BadRequestException {
    constructor(expiryDate?: Date);
}
//# sourceMappingURL=license-expired.exception.d.ts.map