import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiKey } from '../master-entities/api-key.entity';
import { Institute } from '../master-entities/institute.entity';
import {
  ApiKeyDetailDto,
  ApiKeyResponseDto,
  ApiKeyValidationResponseDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from './dto/create-api-key.dto';

/**
 * API Keys Service
 *
 * Manages API key generation, validation, and lifecycle
 * Handles secure key storage and usage tracking
 */
@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey, 'master')
    private apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(Institute, 'master')
    private instituteRepository: Repository<Institute>,
  ) {}

  /**
   * Generate a new API key
   * Format: FLCN_<random_32_chars>
   */
  private generateRawKey(): string {
    const randomBytes = crypto.randomBytes(24).toString('hex');
    return `FLCN_${randomBytes}`;
  }

  /**
   * Hash an API key using SHA-256
   * Store only the hash in the database
   */
  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  /**
   * Create a new API key for an institute
   */
  async create(
    instituteId: string,
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    // Verify institute exists
    const institute = await this.instituteRepository.findOne({
      where: { id: instituteId },
    });

    if (!institute) {
      throw new NotFoundException(`Institute ${instituteId} not found`);
    }

    // Generate raw key and hash it
    const rawKey = this.generateRawKey();
    const keyHash = this.hashKey(rawKey);

    // Check for duplicate hash (extremely unlikely but possible)
    const existingKey = await this.apiKeyRepository.findOne({
      where: { keyHash },
    });

    if (existingKey) {
      throw new BadRequestException(
        'API key collision detected. Please try again.',
      );
    }

    // Create and save the key
    const apiKey = this.apiKeyRepository.create({
      instituteId,
      keyHash,
      name: createApiKeyDto.name,
      scopes: createApiKeyDto.scopes || ['read:licenses', 'read:features'],
      rateLimit: createApiKeyDto.rateLimit || 1000,
      isActive: true,
      expiresAt: createApiKeyDto.expiresAt
        ? new Date(createApiKeyDto.expiresAt)
        : undefined,
    });

    await this.apiKeyRepository.save(apiKey);

    return {
      id: apiKey.id,
      instituteId: apiKey.instituteId,
      name: apiKey.name,
      scopes: apiKey.scopes,
      rateLimit: apiKey.rateLimit,
      key: rawKey, // Only returned once!
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
      warning: 'Save this key securely. You will not be able to see it again!',
    };
  }

  /**
   * Validate an API key
   * Returns key details if valid, null otherwise
   */
  async validateKey(key: string): Promise<ApiKeyValidationResponseDto> {
    const keyHash = this.hashKey(key);

    const apiKey = await this.apiKeyRepository.findOne({
      where: { keyHash },
    });

    if (!apiKey) {
      return {
        isValid: false,
        message: 'Invalid API key',
      };
    }

    // Check if key is active
    if (!apiKey.isActive) {
      return {
        isValid: false,
        message: 'API key is inactive',
      };
    }

    // Check if key has expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return {
        isValid: false,
        message: 'API key has expired',
      };
    }

    // Update last used timestamp and request count
    apiKey.lastUsedAt = new Date();
    apiKey.totalRequests = (apiKey.totalRequests || 0) + 1;
    await this.apiKeyRepository.save(apiKey);

    // Calculate remaining requests (per hour)
    // In production, this would integrate with a rate limiter (Redis)
    const remainingRequests =
      apiKey.rateLimit - (apiKey.totalRequests % apiKey.rateLimit);

    return {
      isValid: true,
      keyId: apiKey.id,
      instituteId: apiKey.instituteId,
      scopes: apiKey.scopes,
      rateLimit: apiKey.rateLimit,
      remainingRequests,
      expiresAt: apiKey.expiresAt,
      message: 'API key is valid',
    };
  }

  /**
   * Check if key has a specific scope
   */
  async hasScope(key: string, requiredScope: string): Promise<boolean> {
    const keyHash = this.hashKey(key);

    const apiKey = await this.apiKeyRepository.findOne({
      where: { keyHash },
    });

    if (!apiKey || !apiKey.isActive) {
      return false;
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return false;
    }

    return apiKey.scopes?.includes(requiredScope) || false;
  }

  /**
   * Get all API keys for an institute (without showing the actual key)
   */
  async findAll(
    instituteId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ApiKeyDetailDto[]; total: number }> {
    const [keys, total] = await this.apiKeyRepository.findAndCount({
      where: { instituteId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = keys.map((key) => this.mapToDetailDto(key));

    return { data, total };
  }

  /**
   * Get a single API key by ID
   */
  async findOne(instituteId: string, keyId: string): Promise<ApiKeyDetailDto> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, instituteId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }

    return this.mapToDetailDto(apiKey);
  }

  /**
   * Update an API key
   */
  async update(
    instituteId: string,
    keyId: string,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyDetailDto> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, instituteId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }

    // Update allowed fields
    if (updateApiKeyDto.name !== undefined) {
      apiKey.name = updateApiKeyDto.name;
    }
    if (updateApiKeyDto.scopes !== undefined) {
      apiKey.scopes = updateApiKeyDto.scopes;
    }
    if (updateApiKeyDto.rateLimit !== undefined) {
      apiKey.rateLimit = updateApiKeyDto.rateLimit;
    }
    if (updateApiKeyDto.expiresAt !== undefined) {
      apiKey.expiresAt = new Date(updateApiKeyDto.expiresAt);
    }

    await this.apiKeyRepository.save(apiKey);

    return this.mapToDetailDto(apiKey);
  }

  /**
   * Disable an API key
   */
  async disable(instituteId: string, keyId: string): Promise<ApiKeyDetailDto> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, instituteId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }

    apiKey.isActive = false;
    await this.apiKeyRepository.save(apiKey);

    return this.mapToDetailDto(apiKey);
  }

  /**
   * Re-enable an API key
   */
  async enable(instituteId: string, keyId: string): Promise<ApiKeyDetailDto> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, instituteId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }

    apiKey.isActive = true;
    await this.apiKeyRepository.save(apiKey);

    return this.mapToDetailDto(apiKey);
  }

  /**
   * Delete an API key
   */
  async delete(instituteId: string, keyId: string): Promise<void> {
    const result = await this.apiKeyRepository.delete({
      id: keyId,
      instituteId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }
  }

  /**
   * Get usage statistics for a key
   */
  async getStats(
    instituteId: string,
    keyId: string,
  ): Promise<{
    totalRequests: number;
    lastUsedAt?: Date;
    requestsThisHour: number;
  }> {
    const apiKey = await this.apiKeyRepository.findOne({
      where: { id: keyId, instituteId },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key ${keyId} not found`);
    }

    // In production, query Redis for hourly request count
    // For now, return approximate based on rate limit
    const requestsThisHour = apiKey.totalRequests % apiKey.rateLimit;

    return {
      totalRequests: apiKey.totalRequests,
      lastUsedAt: apiKey.lastUsedAt,
      requestsThisHour,
    };
  }

  /**
   * Map ApiKey entity to detail DTO (safe for public response)
   */
  private mapToDetailDto(apiKey: ApiKey): ApiKeyDetailDto {
    const keyPreview = apiKey.keyHash.substring(0, 8);

    return {
      id: apiKey.id,
      instituteId: apiKey.instituteId,
      name: apiKey.name,
      scopes: apiKey.scopes,
      rateLimit: apiKey.rateLimit,
      keyPreview: `${keyPreview}...`,
      lastUsedAt: apiKey.lastUsedAt,
      totalRequests: apiKey.totalRequests,
      isActive: apiKey.isActive,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    };
  }
}
