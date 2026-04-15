import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Institute } from '../master-entities/institute.entity';
import { Plan } from '../master-entities/plan.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { SeederService } from './seeder.service';

/**
 * SeederModule
 *
 * Provides seeding functionality for the SaaS platform master database.
 * Seeds initial data for:
 * - Super Admins
 * - Customers/Institutes
 * - Plans
 */
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [SuperAdmin, Institute, Plan],
      'master', // Use the master database connection
    ),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
