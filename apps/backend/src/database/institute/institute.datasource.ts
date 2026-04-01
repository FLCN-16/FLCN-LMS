import { DataSource, DataSourceOptions } from 'typeorm';

import { TestAttempt } from '../../institutes/attempts/entities/test-attempt.entity';
import { TestResult } from '../../institutes/attempts/entities/test-result.entity';
import { Category } from '../../institutes/courses/entities/category.entity';
import { CourseEnrollment } from '../../institutes/courses/entities/course-enrollment.entity';
import { Course } from '../../institutes/courses/entities/course.entity';
import { LessonProgress } from '../../institutes/courses/entities/lesson-progress.entity';
import { Lesson } from '../../institutes/courses/entities/lesson.entity';
import { Module } from '../../institutes/courses/entities/module.entity';
import { ExamType } from '../../institutes/exam-types/entities/exam-type.entity';
import { Leaderboard } from '../../institutes/leaderboard/entities/leaderboard.entity';
import { LiveAttendance } from '../../institutes/live-sessions/entities/live-attendance.entity';
import { LiveChatMessage } from '../../institutes/live-sessions/entities/live-chat-message.entity';
import { LivePoll } from '../../institutes/live-sessions/entities/live-poll.entity';
import { LiveQA } from '../../institutes/live-sessions/entities/live-qa.entity';
import { LiveSession } from '../../institutes/live-sessions/entities/live-session.entity';
import { QuestionOption } from '../../institutes/questions/entities/question-option.entity';
import { Question } from '../../institutes/questions/entities/question.entity';
import { TestSeries } from '../../institutes/test-series/entities/test-series.entity';
import { Test } from '../../institutes/test-series/entities/test.entity';
import { User } from '../../institutes/users/entities/user.entity';

/**
 * Tenant Database Entities
 *
 * All entities that exist in EVERY tenant's database.
 * These entities do NOT have a instituteId column because the
 * tenant is implied by which database connection is used.
 *
 * Each institute/tenant gets their own complete copy of these tables.
 *
 * Example:
 * - pw_live database has users, courses, questions, etc. for Physics Wallah
 * - adda247 database has users, courses, questions, etc. for ADDA247
 * - flcn_org database has users, courses, questions, etc. for FLCN
 *
 * No cross-tenant queries are possible because data is isolated at the database level.
 */
export const INSTITUTE_ENTITIES = [
  // Core entities
  User,
  Category,
  Course,
  Module,
  Lesson,
  CourseEnrollment,
  LessonProgress,

  // Exam/Test entities
  ExamType,
  TestSeries,
  Test,
  TestAttempt,
  TestResult,

  // Question entities
  Question,
  QuestionOption,

  // Live session entities
  LiveSession,
  LiveChatMessage,
  LiveQA,
  LivePoll,
  LiveAttendance,

  // Leaderboard
  Leaderboard,
];

/**
 * Tenant Database Configuration
 *
 * Passed to createInstituteDataSource to establish connection
 * to a specific institute's database.
 */
export interface TenantDatabaseConfig {
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  connectionString?: string;
}

/**
 * Create a DataSource for a specific tenant/institute
 *
 * This factory function is called by InstituteConnectionManager
 * when a request comes in for a new tenant.
 *
 * Steps:
 * 1. Query master DB for tenant's database config
 * 2. Call this function with the config
 * 3. Initialize the DataSource (establishes connection)
 * 4. Cache it for future requests to that tenant
 *
 * @param config Database configuration for this tenant
 * @returns Initialized DataSource for the tenant's database
 *
 * Example usage:
 * const pw_live_config = {
 *   dbHost: 'db-prod.aws.com',
 *   dbPort: 5432,
 *   dbName: 'db_pw_live',
 *   dbUser: 'institute_user',
 *   dbPassword: 'encrypted_password',
 * }
 * const dataSource = createInstituteDataSource(pw_live_config)
 * await dataSource.initialize()
 */
export function createInstituteDataSource(
  config: TenantDatabaseConfig,
): DataSource {
  // Use connection string if provided, otherwise construct from components
  const connectionUrl = config.connectionString
    ? config.connectionString
    : `postgresql://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

  const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: connectionUrl,
    entities: INSTITUTE_ENTITIES,
    migrations: ['src/database/institute/migrations/*.ts'],
    migrationsTableName: 'inst_migrations', // same table name in every tenant DB
    synchronize: false, // NEVER true in production
    logging: false,
    extra: {
      // Connection pooling settings per tenant
      max: 10, // max connections per institute
      min: 1, // min connections per institute
      idleTimeoutMillis: 30000, // close idle connections after 30s
      connectionTimeoutMillis: 2000, // connection timeout
    },
  };

  return new DataSource(dataSourceOptions);
}

/**
 * CLI-only DataSource for TypeORM migrations
 *
 * Used by TypeORM CLI to:
 * - Generate new migrations
 * - Diff schema changes
 *
 * Points to a "throwaway" tenant database (any existing tenant DB)
 * just for schema diffing. Never actually migrates this DB in the CLI.
 *
 * Connection details from environment variables:
 * - INSTITUTE_DB_HOST
 * - INSTITUTE_DB_PORT
 * - INSTITUTE_DB_USER
 * - INSTITUTE_DB_PASS
 * - TENANT_CLI_DB (optional — defaults to 'db_pw_live')
 *
 * Example:
 * pnpm run typeorm:cli migration:generate src/database/tenant/migrations/AddNewColumn
 */
export const tenantDataSourceForCLI = new DataSource({
  type: 'postgres',
  host: process.env.INSTITUTE_DB_HOST || 'localhost',
  port: Number(process.env.INSTITUTE_DB_PORT) || 5432,
  username: process.env.INSTITUTE_DB_USER || 'postgres',
  password: process.env.INSTITUTE_DB_PASS || 'postgres',
  database: process.env.TENANT_CLI_DB || 'db_pw_live', // any tenant DB for diffing
  entities: INSTITUTE_ENTITIES,
  migrations: ['src/database/institute/migrations/*.ts'],
  migrationsTableName: 'inst_migrations',
  synchronize: false,
  logging: false,
});
