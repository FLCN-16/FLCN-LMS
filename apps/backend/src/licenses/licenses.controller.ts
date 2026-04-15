import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequiredScopes } from '../api-keys/decorators/required-scopes.decorator';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import {
  RateLimitApiKey,
  RateLimitFeatureCheck,
  RateLimitLicenseVerify,
  RateLimitPublicApi,
} from '../rate-limiting/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limiting/guards/rate-limit.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  CheckFeatureResponseDto,
  FeatureDto,
  IssueLicenseDto,
  LicenseInfoDto,
  LicenseListResponseDto,
  ListLicensesQueryDto,
  RevokeLicenseResponseDto,
  UpdateLicenseDto,
  VerifyLicenseDto,
  VerifyLicenseResponseDto,
} from './dto/verify-license.dto';
import { LicensesService } from './licenses.service';

/**
 * License Management Controller
 *
 * Handles license verification, issuance, and management for the LMS system.
 * Provides endpoints for both Gin backend and NestJS dashboard integration.
 */
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  /**
   * Verify a license key
   *
   * POST /api/v1/licenses/verify
   * Public endpoint - used by Gin backend for license verification
   *
   * Request body:
   * - licenseKey: The license key to verify
   * - timestamp: Optional Unix timestamp for verification request
   *
   * Returns: License verification response with validity status and features
   */
  @Post('verify')
  @UseGuards(RateLimitGuard)
  @RateLimitLicenseVerify()
  @HttpCode(HttpStatus.OK)
  async verifyLicense(
    @Body() dto: VerifyLicenseDto,
  ): Promise<VerifyLicenseResponseDto> {
    return this.licensesService.verifyLicense(dto);
  }

  /**
   * Check if a specific feature is enabled for a license
   *
   * POST /api/v1/licenses/check-feature
   * Public endpoint - used by Gin backend to check feature availability
   *
   * Request body:
   * - licenseKey: The license key to check
   * - featureName: Name of the feature to check (e.g., 'live_sessions', 'advanced_analytics')
   *
   * Returns: Feature availability status with optional usage limit
   */
  @Post('check-feature')
  @UseGuards(RateLimitGuard)
  @RateLimitFeatureCheck()
  @HttpCode(HttpStatus.OK)
  async checkFeature(
    @Body() body: { licenseKey: string; featureName: string },
  ): Promise<CheckFeatureResponseDto> {
    return this.licensesService.checkFeature(body.licenseKey, body.featureName);
  }

  /**
   * Get license statistics summary
   *
   * GET /api/v1/licenses/stats/summary
   * Admin endpoint - returns aggregate license metrics
   *
   * Returns: Statistics for all licenses by status
   */
  @Get('stats/summary')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('read:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async getStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    suspended: number;
    invalid: number;
  }> {
    return this.licensesService.getLicenseStats();
  }

  /**
   * Issue a new license
   *
   * POST /api/v1/licenses/issue
   * Admin endpoint - requires super admin authentication
   *
   * Request body:
   * - organizationName: Name of the organization
   * - licenseKey: Unique license key
   * - planId: Optional UUID of associated plan
   * - instituteId: Optional UUID of associated institute
   * - expiryDate: Optional ISO date string for license expiration
   * - features: Optional array of feature configurations
   * - maxUsers: Optional maximum number of users allowed
   * - notes: Optional notes about the license
   *
   * Returns: Created license information
   */
  @Post('issue')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('write:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.CREATED)
  async issueLicense(
    @Body() dto: IssueLicenseDto,
    @CurrentUser() issuedById: string,
  ): Promise<LicenseInfoDto> {
    return this.licensesService.issueLicense(dto, issuedById);
  }

  /**
   * Get license by key
   *
   * GET /api/v1/licenses/key/:key
   * Admin endpoint - retrieve license details by license key
   *
   * Path parameters:
   * - key: The license key to retrieve
   *
   * Returns: Complete license information
   */
  @Get('key/:key')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('read:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async getLicenseByKey(@Param('key') key: string): Promise<LicenseInfoDto> {
    return this.licensesService.getLicenseByKey(key);
  }

  /**
   * Suspend a license
   *
   * PATCH /api/v1/licenses/:id/suspend
   * Admin endpoint - temporarily disable a license
   *
   * Path parameters:
   * - id: The license ID to suspend
   *
   * Returns: Updated license information
   */
  @Patch(':id/suspend')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('write:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async suspendLicense(@Param('id') id: string): Promise<LicenseInfoDto> {
    return this.licensesService.suspendLicense(id);
  }

  /**
   * Reactivate a suspended license
   *
   * PATCH /api/v1/licenses/:id/reactivate
   * Admin endpoint - restore a suspended license if not expired
   *
   * Path parameters:
   * - id: The license ID to reactivate
   *
   * Returns: Updated license information
   */
  @Patch(':id/reactivate')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('write:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async reactivateLicense(@Param('id') id: string): Promise<LicenseInfoDto> {
    return this.licensesService.reactivateLicense(id);
  }

  /**
   * Get all enabled features for a license
   *
   * GET /api/v1/licenses/:key/features
   * Admin endpoint - retrieve feature list for a specific license
   *
   * Path parameters:
   * - key: The license key
   *
   * Returns: Array of enabled features with their configurations
   */
  @Get(':key/features')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('read:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async getFeatures(@Param('key') key: string): Promise<FeatureDto[]> {
    return this.licensesService.getFeatures(key);
  }

  /**
   * Get license by ID
   *
   * GET /api/v1/licenses/:id
   * Admin endpoint - retrieve full license details
   *
   * Path parameters:
   * - id: The license UUID
   *
   * Returns: Complete license information including related entities
   */
  @Get(':id')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('read:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async getLicenseById(@Param('id') id: string): Promise<LicenseInfoDto> {
    return this.licensesService.getLicenseById(id);
  }

  /**
   * Update a license
   *
   * PUT /api/v1/licenses/:id
   * Admin endpoint - modify license properties
   *
   * Path parameters:
   * - id: The license UUID
   *
   * Request body: Partial license update (all fields optional)
   * - organizationName: Update organization name
   * - status: Change license status (active, suspended, invalid, expired, pending)
   * - expiryDate: Update expiration date
   * - features: Update feature configurations
   * - maxUsers: Update user limit
   * - notes: Update notes
   *
   * Returns: Updated license information
   */
  @Put(':id')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('write:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async updateLicense(
    @Param('id') id: string,
    @Body() dto: UpdateLicenseDto,
  ): Promise<LicenseInfoDto> {
    return this.licensesService.updateLicense(id, dto);
  }

  /**
   * Revoke a license
   *
   * DELETE /api/v1/licenses/:id
   * Admin endpoint - permanently invalidate a license
   *
   * Path parameters:
   * - id: The license UUID
   *
   * Returns: Revocation confirmation with timestamp
   */
  @Delete(':id')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('write:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async revokeLicense(
    @Param('id') id: string,
  ): Promise<RevokeLicenseResponseDto> {
    return this.licensesService.revokeLicense(id);
  }

  /**
   * List licenses with filtering and pagination
   *
   * GET /api/v1/licenses
   * Admin endpoint - retrieve licenses with optional filters
   *
   * Query parameters:
   * - skip: Number of records to skip (default: 0)
   * - take: Number of records to return (default: 10)
   * - search: Search by organization name (partial match)
   * - status: Filter by status (active, suspended, invalid, expired, pending)
   * - isValid: Filter by validity (true/false)
   * - instituteId: Filter by associated institute UUID
   * - planId: Filter by associated plan UUID
   *
   * Returns: Paginated list of licenses with metadata
   */
  @Get()
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @RequiredScopes('read:licenses')
  @RateLimitApiKey()
  @HttpCode(HttpStatus.OK)
  async listLicenses(
    @Query() query: ListLicensesQueryDto,
  ): Promise<LicenseListResponseDto> {
    return this.licensesService.listLicenses(query);
  }
}
