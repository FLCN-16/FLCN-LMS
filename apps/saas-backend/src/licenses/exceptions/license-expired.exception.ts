import { BadRequestException } from '@nestjs/common';

/**
 * Thrown when a license has expired
 */
export class LicenseExpiredException extends BadRequestException {
  constructor(expiryDate?: Date) {
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
