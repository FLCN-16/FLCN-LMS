import { ConflictException } from '@nestjs/common';
/**
 * Thrown when attempting to create a license with a duplicate key
 */
export declare class LicenseDuplicateException extends ConflictException {
    constructor(licenseKey: string);
}
//# sourceMappingURL=license-duplicate.exception.d.ts.map