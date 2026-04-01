import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MASTER_ENTITIES } from './master.datasource';

/**
 * Master Database Module
 *
 * Provides the single shared database for all SaaS metadata.
 *
 * Configuration:
 * - Named connection: "master"
 * - Database: flcn_master (fixed)
 * - Auto-runs migrations on boot
 * - Global scope for availability everywhere
 *
 * All SaaS metadata entities are registered here:
 * - Institute (institute configuration)
 * - InstituteDatabase (DB connection config per institute)
 * - InstituteBilling (subscription info)
 * - AuditLog (system-wide audit trail)
 * - ApiKey (API key management)
 * - FeatureFlag (feature toggles)
 * - Branch (institute locations/sub-orgs)
 *
 * Other modules inject master repositories like:
 * @InjectRepository(Institute, 'master')
 * @InjectRepository(InstituteDatabase, 'master')
 * @InjectRepository(InstituteBilling, 'master')
 *
 * Environment Variables (from .env):
 * - MASTER_DB_HOST
 * - MASTER_DB_PORT
 * - MASTER_DB_USER
 * - MASTER_DB_PASS
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'master', // Named connection - IMPORTANT for multiple databases
      type: 'postgres',
      host: process.env.MASTER_DB_HOST || 'localhost',
      port: Number(process.env.MASTER_DB_PORT) || 5432,
      username: process.env.MASTER_DB_USER || 'postgres',
      password: process.env.MASTER_DB_PASS || 'postgres',
      database: 'flcn_master', // Fixed master database name
      entities: MASTER_ENTITIES,
      migrations: ['src/database/master/migrations/*.ts'],
      migrationsTableName: 'master_migrations',
      migrationsRun: true, // Auto-run master migrations on boot
      synchronize: false, // NEVER true in production - use migrations instead
      logging: false,
    }),
    // Register all master entities for this named connection
    TypeOrmModule.forFeature(MASTER_ENTITIES, 'master'),
  ],
  exports: [TypeOrmModule],
})
export class MasterDatabaseModule {}
