import { BadRequestException } from '@nestjs/common';

/**
 * Thrown when a license is invalid or not found
 */
export class LicenseInvalidException extends BadRequestException {
  constructor(message: string = 'License is invalid') {
    super({
      statusCode: 400,
      message,
      error: 'License Invalid',
    });
  }
}
