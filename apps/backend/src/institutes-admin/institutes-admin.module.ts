import { Global, Module } from '@nestjs/common';

import { InstituteRoutingMiddleware } from '../common/middleware/institute-routing.middleware';
import { InstituteConnectionManager } from '../database/institute/institute-connection.manager';
import { InstitutesAdminController } from './institutes-admin.controller';
import { InstituteContext } from './services/institute-context.service';

/**
 * InstitutesAdminModule
 */
@Global()
@Module({
  controllers: [InstitutesAdminController],
  providers: [
    InstituteContext,
    InstituteConnectionManager,
    InstituteRoutingMiddleware,
  ],
  exports: [
    InstituteContext,
    InstituteConnectionManager,
    InstituteRoutingMiddleware,
  ],
})
export class InstitutesAdminModule {}
