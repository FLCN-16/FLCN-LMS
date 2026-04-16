import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKey } from '../master-entities/api-key.entity';
import { Institute } from '../master-entities/institute.entity';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyGuard } from './guards/api-key.guard';

/**
 * API Keys Module
 *
 * Manages API key generation, validation, and lifecycle for SaaS customers (institutes)
 * Provides authentication mechanism for external services (e.g., Gin backend)
 *
 * Exports:
 * - ApiKeysService: Core service for key management
 * - ApiKeyGuard: Guard for protecting endpoints with API key auth
 */
@Module({
  imports: [TypeOrmModule.forFeature([ApiKey, Institute], 'master')],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ApiKeyGuard],
  exports: [ApiKeysService, ApiKeyGuard],
})
export class ApiKeysModule {}
