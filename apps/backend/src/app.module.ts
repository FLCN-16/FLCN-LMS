import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeysModule } from './api-keys/api-keys.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingModule } from './billing/billing.module';
import { AuthModule } from './common/auth/auth.module';
import { LicensesModule } from './licenses/licenses.module';
// Master Database Entities
import { ApiKey } from './master-entities/api-key.entity';
import { AuditLog } from './master-entities/audit-log.entity';
import { Branch } from './master-entities/branch.entity';
import { FeatureFlag } from './master-entities/feature-flag.entity';
import { InstituteBilling } from './master-entities/institute-billing.entity';
import { InstituteDatabase } from './master-entities/institute-database.entity';
import { Institute } from './master-entities/institute.entity';
import { Invoice } from './master-entities/invoice.entity';
import { License } from './master-entities/license.entity';
import { Plan } from './master-entities/plan.entity';
import { Refund } from './master-entities/refund.entity';
import { SuperAdmin } from './master-entities/super-admin.entity';
import { PlansModule } from './plans/plans.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { RefundModule } from './refunds/refund.module';
import { SuperAdminsModule } from './super-admins/super-admins.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // ========== RATE LIMITING ==========
    // Global rate limiting service (in-memory, Redis-ready)
    RateLimitingModule,

    // ========== ROUTING ARCHITECTURE ==========
    // SaaS Platform Routes: /api/v1/...
    RouterModule.register([
      {
        path: '', // Root path for SaaS routes
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'super-admins', module: SuperAdminsModule },
          { path: 'api-keys', module: ApiKeysModule },
          { path: 'licenses', module: LicensesModule },
          { path: 'plans', module: PlansModule },
          { path: 'billing', module: BillingModule },
          { path: 'refunds', module: RefundModule },
        ],
      },
    ]),

    // ========== MASTER DATABASE CONNECTION ==========
    // Stores SaaS platform data: licenses, customers, plans, billing, feature flags, analytics
    TypeOrmModule.forRootAsync({
      name: 'master',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const masterDatabaseUrl =
          config.get<string>('MASTER_DATABASE_URL') ||
          config.get<string>('DATABASE_URL');

        if (!masterDatabaseUrl) {
          throw new Error('MASTER_DATABASE_URL or DATABASE_URL is required');
        }

        return {
          type: 'postgres',
          url: masterDatabaseUrl,
          entities: [
            Institute,
            InstituteDatabase,
            InstituteBilling,
            Invoice,
            Refund,
            ApiKey,
            AuditLog,
            FeatureFlag,
            Branch,
            SuperAdmin,
            Plan,
            License,
          ],
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') === 'development',
        };
      },
    }),

    // ========== FEATURE MODULES ==========
    AuthModule,
    SuperAdminsModule,
    ApiKeysModule,
    LicensesModule,
    PlansModule,
    BillingModule,
    RefundModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
