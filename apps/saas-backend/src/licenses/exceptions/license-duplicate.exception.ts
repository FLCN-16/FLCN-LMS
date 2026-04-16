import { ConflictException } from '@nestjs/common';

/**
 * Thrown when attempting to create a license with a duplicate key
 */
export class LicenseDuplicateException extends ConflictException {
  constructor(licenseKey: string) {
    super({
      statusCode: 409,
      message: `License key '${licenseKey}' already exists`,
      error: 'License Duplicate',
    });
  }
}
