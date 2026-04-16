import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeysModule } from '../api-keys/api-keys.module';
import { Institute } from '../master-entities/institute.entity';
import { License } from '../master-entities/license.entity';
import { Plan } from '../master-entities/plan.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';

/**
 * License Module
 *
 * Handles license verification, issuance, and management
 * Integrates with the master database for license persistence
 *
 * Public endpoints:
 * - POST /licenses/verify - License verification (called by Gin backend)
 * - POST /licenses/check-feature - Feature checking (called by Gin backend)
 *
 * Admin endpoints (protected by API Key or JWT):
 * - POST /licenses/issue - Issue new license
 * - PUT /licenses/:id - Update license
 * - PATCH /licenses/:id/suspend - Suspend license
 * - PATCH /licenses/:id/reactivate - Reactivate license
 * - DELETE /licenses/:id - Revoke license
 * - GET /licenses - List licenses
 * - GET /licenses/:id - Get license by ID
 * - GET /licenses/key/:key - Get license by key
 * - GET /licenses/:key/features - Get features
 * - GET /licenses/stats/summary - Get statistics
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([License, Plan, Institute, SuperAdmin], 'master'),
    ApiKeysModule,
  ],
  controllers: [LicensesController],
  providers: [LicensesService],
  exports: [LicensesService],
})
export class LicensesModule {}
