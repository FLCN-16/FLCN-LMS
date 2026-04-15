import { IsString, IsArray, IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

/**
 * DTO for creating a new API key
 */
export class CreateApiKeyDto {
  /**
   * Display name for this API key (e.g., "Gin Backend Key")
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Scopes/permissions this key has
   * Example: ['read:licenses', 'read:features', 'write:analytics']
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  /**
   * Rate limit (requests per hour)
   * Defaults to 1000 if not specified
   */
  @IsNumber()
  @Min(10)
  @Max(100000)
  @IsOptional()
  rateLimit?: number;

  /**
   * Optional expiration date (ISO 8601 format)
   */
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

/**
 * DTO for API key response (shown only once during creation)
 * Includes the raw key for copying
 */
export class ApiKeyResponseDto {
  id: string;
  instituteId: string;
  name?: string;
  scopes?: string[];
  rateLimit: number;

  /**
   * The raw API key - only shown once during creation!
   * Store this securely - it cannot be retrieved later
   */
  key: string;

  expiresAt?: Date;
  createdAt: Date;

  /**
   * Warning message
   */
  warning: string;
}

/**
 * DTO for API key details (without showing the raw key)
 * Safe to return in list/get endpoints
 */
export class ApiKeyDetailDto {
  id: string;
  instituteId: string;
  name?: string;
  scopes?: string[];
  rateLimit: number;

  /**
   * First 8 characters of the key hash for display (e.g., "FLCN_mk9...")
   */
  keyPreview: string;

  lastUsedAt?: Date;
  totalRequests: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for updating an API key
 */
export class UpdateApiKeyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @IsNumber()
  @Min(10)
  @Max(100000)
  @IsOptional()
  rateLimit?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

/**
 * DTO for validating an API key
 */
export class ValidateApiKeyDto {
  @IsString()
  key: string;
}

/**
 * DTO for API key validation response
 */
export class ApiKeyValidationResponseDto {
  isValid: boolean;
  keyId?: string;
  instituteId?: string;
  scopes?: string[];
  rateLimit?: number;
  remainingRequests?: number;
  expiresAt?: Date;
  message: string;
}
