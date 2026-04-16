import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

/**
 * Feature configuration DTO
 */
export class FeatureDto {
  @IsString()
  name!: string;

  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

/**
 * Request DTO for verifying a license
 */
export class VerifyLicenseDto {
  @IsString()
  licenseKey!: string;

  @IsOptional()
  @IsNumber()
  timestamp?: number;
}

/**
 * Response DTO for license verification
 */
export class VerifyLicenseResponseDto {
  valid!: boolean;

  @IsEnum(['valid', 'invalid', 'expired', 'error'])
  status!: 'valid' | 'invalid' | 'expired' | 'error';

  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  expiryDate?: Date;

  @Type(() => FeatureDto)
  features!: FeatureDto[];

  @IsOptional()
  @IsNumber()
  cacheTTL?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

/**
 * License information DTO for responses
 */
export class LicenseInfoDto {
  @IsUUID()
  id!: string;

  @IsString()
  licenseKey!: string;

  @IsString()
  organizationName!: string;

  @IsEnum(['active', 'expired', 'invalid', 'suspended', 'pending'])
  status!: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';

  @IsBoolean()
  isValid!: boolean;

  @IsOptional()
  expiryDate?: Date;

  @Type(() => FeatureDto)
  features!: FeatureDto[];

  @IsNumber()
  maxUsers!: number;

  @IsOptional()
  lastVerifiedAt?: Date;

  @IsNumber()
  verificationCount!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

/**
 * Request DTO for issuing a new license
 */
export class IssueLicenseDto {
  @IsString()
  organizationName!: string;

  @IsString()
  licenseKey!: string;

  @IsOptional()
  @IsUUID()
  planId?: string;

  @IsOptional()
  @IsUUID()
  instituteId?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  @ArrayMinSize(1)
  features?: FeatureDto[];

  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Request DTO for updating a license
 */
export class UpdateLicenseDto {
  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsEnum(['active', 'expired', 'invalid', 'suspended', 'pending'])
  status?: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Request DTO for checking if a feature is enabled
 */
export class CheckFeatureDto {
  @IsString()
  licenseKey!: string;

  @IsString()
  featureName!: string;
}

/**
 * Response DTO for feature check
 */
export class CheckFeatureResponseDto {
  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsString()
  message!: string;
}

/**
 * Query DTO for listing licenses with filters
 */
export class ListLicensesQueryDto {
  @IsOptional()
  @IsNumber()
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['active', 'expired', 'invalid', 'suspended', 'pending'])
  status?: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';

  @IsOptional()
  @IsBoolean()
  isValid?: boolean;

  @IsOptional()
  @IsUUID()
  instituteId?: string;

  @IsOptional()
  @IsUUID()
  planId?: string;
}

/**
 * Response DTO for paginated license list
 */
export class LicenseListResponseDto {
  @Type(() => LicenseInfoDto)
  data!: LicenseInfoDto[];

  @IsNumber()
  total!: number;

  @IsNumber()
  skip!: number;

  @IsNumber()
  take!: number;
}

/**
 * Response DTO for license revocation
 */
export class RevokeLicenseResponseDto {
  @IsString()
  message!: string;

  @IsString()
  licenseKey!: string;

  @IsDateString()
  revokedAt!: Date;
}
