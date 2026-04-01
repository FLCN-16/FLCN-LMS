import { DataSource } from 'typeorm';

import { ApiKey } from '../../master-entities/api-key.entity';
import { AuditLog } from '../../master-entities/audit-log.entity';
import { Branch } from '../../master-entities/branch.entity';
import { FeatureFlag } from '../../master-entities/feature-flag.entity';
import { InstituteBilling } from '../../master-entities/institute-billing.entity';
import { InstituteDatabase } from '../../master-entities/institute-database.entity';
import { Plan } from '../../master-entities/plan.entity';
import { SuperAdmin } from '../../master-entities/super-admin.entity';
import { Institute } from '../../master-entities/institute.entity';

/**
 * Master Database Entities
 *
 * These entities are stored in the MASTER database only.
 * They contain SaaS metadata, not tenant-specific data.
 *
 * Master DB holds:
 * - Institute configurations
 * - Database connection details
 * - Billing information
 * - Audit logs
 * - API keys
 * - Feature flags
 * - Branches
 */
export const MASTER_ENTITIES = [
  Institute,
  InstituteDatabase,
  InstituteBilling,
  AuditLog,
  ApiKey,
  FeatureFlag,
  Branch,
  SuperAdmin,
  Plan,
];

/**
 * Master DataSource
 *
 * Single shared database for all SaaS metadata.
 * Database name: flcn_master (fixed)
 *
 * Connection details from environment variables:
 * - MASTER_DB_HOST
 * - MASTER_DB_PORT
 * - MASTER_DB_USER
 * - MASTER_DB_PASS
 */
export const masterDataSource = new DataSource({
  type: 'postgres',
  host: process.env.MASTER_DB_HOST || 'localhost',
  port: Number(process.env.MASTER_DB_PORT) || 5432,
  username: process.env.MASTER_DB_USER || 'postgres',
  password: process.env.MASTER_DB_PASS || 'postgres',
  database: 'flcn_master', // Fixed database name for master DB
  entities: MASTER_ENTITIES,
  migrations: ['src/database/master/migrations/*.ts'],
  migrationsTableName: 'master_migrations',
  synchronize: false, // NEVER true in production
  logging: false,
});
