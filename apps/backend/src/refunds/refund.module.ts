import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeysModule } from '../api-keys/api-keys.module';
import { Invoice } from '../master-entities/invoice.entity';
import { Refund } from '../master-entities/refund.entity';
import { RateLimitingModule } from '../rate-limiting/rate-limiting.module';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';

/**
 * Refund Module
 *
 * Handles refund management and processing
 * Supports full and partial refunds with retry logic
 *
 * Controllers:
 * - RefundController - API endpoints for refund operations
 *
 * Services:
 * - RefundService - Refund processing and lifecycle management
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Refund, Invoice], 'master'),
    ApiKeysModule,
    RateLimitingModule,
  ],
  controllers: [RefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
