import {
  BadRequestException,
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
import { AuthGuard } from '@nestjs/passport';

import { ApiKeysService } from './api-keys.service';
import {
  ApiKeyDetailDto,
  ApiKeyResponseDto,
  ApiKeyValidationResponseDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
  ValidateApiKeyDto,
} from './dto/create-api-key.dto';

/**
 * API Keys Controller
 *
 * Manages API key lifecycle for SaaS customers (institutes)
 * All endpoints require valid authentication
 *
 * Routes:
 * POST   /api-keys                    - Create new API key
 * GET    /api-keys                    - List API keys
 * GET    /api-keys/:keyId             - Get specific key
 * PUT    /api-keys/:keyId             - Update key
 * PATCH  /api-keys/:keyId/disable     - Disable key
 * PATCH  /api-keys/:keyId/enable      - Enable key
 * DELETE /api-keys/:keyId             - Delete key
 * GET    /api-keys/:keyId/stats       - Get usage statistics
 * POST   /api-keys/validate           - Validate a key (public)
 */
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  /**
   * Create a new API key for an institute
   *
   * POST /api-keys
   *
   * Body:
   * {
   *   "name": "Production Gin Backend",
   *   "scopes": ["read:licenses", "read:features"],
   *   "rateLimit": 5000,
   *   "expiresAt": "2025-12-31T23:59:59Z"
   * }
   *
   * Returns: ApiKeyResponseDto with raw key (shown only once)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Query('instituteId') instituteId: string,
  ): Promise<ApiKeyResponseDto> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.create(instituteId, createApiKeyDto);
  }

  /**
   * List all API keys for an institute
   *
   * GET /api-keys?instituteId=xxx&page=1&limit=10
   *
   * Returns: { data: ApiKeyDetailDto[], total: number }
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query('instituteId') instituteId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.apiKeysService.findAll(instituteId, pageNum, limitNum);
  }

  /**
   * Get a specific API key by ID
   *
   * GET /api-keys/:keyId?instituteId=xxx
   *
   * Returns: ApiKeyDetailDto (without the raw key)
   */
  @Get(':keyId')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
  ): Promise<ApiKeyDetailDto> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.findOne(instituteId, keyId);
  }

  /**
   * Update an API key's properties
   *
   * PUT /api-keys/:keyId?instituteId=xxx
   *
   * Body:
   * {
   *   "name": "Updated Name",
   *   "scopes": ["read:licenses"],
   *   "rateLimit": 2000,
   *   "expiresAt": "2025-06-30T23:59:59Z"
   * }
   *
   * Returns: Updated ApiKeyDetailDto
   */
  @Put(':keyId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDetailDto> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.update(instituteId, keyId, updateApiKeyDto);
  }

  /**
   * Disable an API key
   *
   * PATCH /api-keys/:keyId/disable?instituteId=xxx
   *
   * Returns: Updated ApiKeyDetailDto with isActive=false
   */
  @Patch(':keyId/disable')
  @UseGuards(AuthGuard('jwt'))
  async disable(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
  ): Promise<ApiKeyDetailDto> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.disable(instituteId, keyId);
  }

  /**
   * Re-enable an API key
   *
   * PATCH /api-keys/:keyId/enable?instituteId=xxx
   *
   * Returns: Updated ApiKeyDetailDto with isActive=true
   */
  @Patch(':keyId/enable')
  @UseGuards(AuthGuard('jwt'))
  async enable(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
  ): Promise<ApiKeyDetailDto> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.enable(instituteId, keyId);
  }

  /**
   * Delete an API key
   *
   * DELETE /api-keys/:keyId?instituteId=xxx
   *
   * Returns: 204 No Content
   */
  @Delete(':keyId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
  ): Promise<void> {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.delete(instituteId, keyId);
  }

  /**
   * Get usage statistics for an API key
   *
   * GET /api-keys/:keyId/stats?instituteId=xxx
   *
   * Returns: { totalRequests, lastUsedAt, requestsThisHour }
   */
  @Get(':keyId/stats')
  @UseGuards(AuthGuard('jwt'))
  async getStats(
    @Param('keyId') keyId: string,
    @Query('instituteId') instituteId: string,
  ) {
    if (!instituteId) {
      throw new BadRequestException('instituteId query parameter is required');
    }
    return this.apiKeysService.getStats(instituteId, keyId);
  }

  /**
   * Validate an API key
   *
   * PUBLIC ENDPOINT - Can be called by external services (e.g., Gin backend)
   *
   * POST /api-keys/validate
   *
   * Body:
   * {
   *   "key": "FLCN_abcd1234efgh5678ijkl9012mnop3456"
   * }
   *
   * Returns: ApiKeyValidationResponseDto
   * {
   *   "isValid": true,
   *   "keyId": "xxx",
   *   "instituteId": "yyy",
   *   "scopes": ["read:licenses"],
   *   "rateLimit": 1000,
   *   "remainingRequests": 999,
   *   "expiresAt": "2025-12-31T23:59:59Z",
   *   "message": "API key is valid"
   * }
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(
    @Body() validateApiKeyDto: ValidateApiKeyDto,
  ): Promise<ApiKeyValidationResponseDto> {
    return this.apiKeysService.validateKey(validateApiKeyDto.key);
  }
}
