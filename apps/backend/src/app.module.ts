import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './common/auth/auth.module';
import { InstituteRoutingMiddleware } from './common/middleware/institute-routing.middleware';
import { InstitutesAdminModule } from './institutes-admin/institutes-admin.module';
import { AttemptsModule } from './institutes/attempts/attempts.module';
import { InstituteAuthModule } from './institutes/auth/institute-auth.module';
import { CoursesModule } from './institutes/courses/courses.module';
import { ExamTypesModule } from './institutes/exam-types/exam-types.module';
import { LeaderboardModule } from './institutes/leaderboard/leaderboard.module';
import { LiveSessionsModule } from './institutes/live-sessions/live-sessions.module';
import { QuestionsModule } from './institutes/questions/questions.module';
import { TestSeriesModule } from './institutes/test-series/test-series.module';
import { UsersModule } from './institutes/users/users.module';
import { SuperAdminsModule } from './super-admins/super-admins.module';
import { BillingModule } from './billing/billing.module';
import { PlansModule } from './plans/plans.module';
import { StatsModule } from './institutes/stats/stats.module';

// Entities
import { ApiKey } from './master-entities/api-key.entity';
import { AuditLog } from './master-entities/audit-log.entity';
import { Branch } from './master-entities/branch.entity';
import { FeatureFlag } from './master-entities/feature-flag.entity';
import { InstituteBilling } from './master-entities/institute-billing.entity';
import { InstituteDatabase } from './master-entities/institute-database.entity';
import { Institute } from './master-entities/institute.entity';
import { Plan } from './master-entities/plan.entity';
import { SuperAdmin } from './master-entities/super-admin.entity';

// Institute Entities (for legacy/direct access if needed)
import { AttemptSection } from './institutes/attempts/entities/attempt-section.entity';
import { QuestionResponse } from './institutes/attempts/entities/question-response.entity';
import { TestAttempt } from './institutes/attempts/entities/test-attempt.entity';
import { TestResult } from './institutes/attempts/entities/test-result.entity';
import { Category } from './institutes/courses/entities/category.entity';
import { CourseEnrollment } from './institutes/courses/entities/course-enrollment.entity';
import { Course } from './institutes/courses/entities/course.entity';
import { LessonProgress } from './institutes/courses/entities/lesson-progress.entity';
import { Lesson } from './institutes/courses/entities/lesson.entity';
import { Module as CourseModule } from './institutes/courses/entities/module.entity';
import { ExamType } from './institutes/exam-types/entities/exam-type.entity';
import { Leaderboard } from './institutes/leaderboard/entities/leaderboard.entity';
import { LiveAttendance } from './institutes/live-sessions/entities/live-attendance.entity';
import { LiveChatMessage } from './institutes/live-sessions/entities/live-chat-message.entity';
import { LivePoll } from './institutes/live-sessions/entities/live-poll.entity';
import { LiveQA } from './institutes/live-sessions/entities/live-qa.entity';
import { LiveSession } from './institutes/live-sessions/entities/live-session.entity';
import { QuestionOption } from './institutes/questions/entities/question-option.entity';
import { Question } from './institutes/questions/entities/question.entity';
import { TestQuestion } from './institutes/test-series/entities/test-question.entity';
import { TestSection } from './institutes/test-series/entities/test-section.entity';
import { TestSeriesEnrollment } from './institutes/test-series/entities/test-series-enrollment.entity';
import { TestSeries } from './institutes/test-series/entities/test-series.entity';
import { Test } from './institutes/test-series/entities/test.entity';
import { User } from './institutes/users/entities/user.entity';
import { INSTITUTE_ENTITIES } from './database/institute/institute-entities';


@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true }),

    // Routing Architecture
    RouterModule.register([
      {
        path: '', // For SaaS routes: /api/v1/... (prefix and version handled by main.ts)
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'super-admins', module: SuperAdminsModule },
          { path: 'billing', module: BillingModule },
          { path: 'plans', module: PlansModule },
          { path: 'institutes', module: InstitutesAdminModule },
        ],
      },
      {
        path: ':instituteSlug', // For Institute routes: /api/v1/:instituteSlug/...
        children: [
          { path: 'auth', module: InstituteAuthModule },
          { path: 'courses', module: CoursesModule },
          { path: 'test-series', module: TestSeriesModule },
          { path: 'attempts', module: AttemptsModule },
          { path: 'leaderboard', module: LeaderboardModule },
          { path: 'live-sessions', module: LiveSessionsModule },
          { path: 'students', module: UsersModule },
          { path: 'exam-types', module: ExamTypesModule },
          { path: 'questions', module: QuestionsModule },
          { path: 'stats', module: StatsModule },
        ],
      },
    ]),

    // ========== MASTER DATABASE CONNECTION ==========
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
            ApiKey,
            AuditLog,
            FeatureFlag,
            Branch,
            SuperAdmin,
            Plan,
          ],
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') === 'development',
        };
      },
    }),

    // ========== TENANT DATABASE CONNECTION (ROOT) ==========
    TypeOrmModule.forRootAsync({
      name: 'legacy',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: INSTITUTE_ENTITIES,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    AuthModule,
    InstitutesAdminModule,
    InstituteAuthModule,
    CoursesModule,
    ExamTypesModule,
    QuestionsModule,
    SuperAdminsModule,
    BillingModule,
    PlansModule,
    TestSeriesModule,
    AttemptsModule,
    LeaderboardModule,
    LiveSessionsModule,
    UsersModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware for the application
   *
   * InstituteRoutingMiddleware must execute BEFORE all route handlers
   * to ensure InstituteContext is properly initialized
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InstituteRoutingMiddleware).forRoutes('*');
  }
}
