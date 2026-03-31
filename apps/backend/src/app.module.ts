import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Tenant } from './common/entities/tenant.entity';
import { Question } from './questions/entities/question.entity';
import { QuestionOption } from './questions/entities/question-option.entity';
import { TestSeries } from './test-series/entities/test-series.entity';
import { Test } from './test-series/entities/test.entity';
import { TestSection } from './test-series/entities/test-section.entity';
import { TestQuestion } from './test-series/entities/test-question.entity';
import { TestSeriesEnrollment } from './test-series/entities/test-series-enrollment.entity';
import { TestAttempt } from './attempts/entities/test-attempt.entity';
import { AttemptSection } from './attempts/entities/attempt-section.entity';
import { QuestionResponse } from './attempts/entities/question-response.entity';
import { TestResult } from './attempts/entities/test-result.entity';
import { Leaderboard } from './leaderboard/entities/leaderboard.entity';

import { ExamType } from './exam-types/entities/exam-type.entity';
import { QuestionsModule } from './questions/questions.module';
import { TestSeriesModule } from './test-series/test-series.module';
import { AttemptsModule } from './attempts/attempts.module';
import { ExamTypesModule } from './exam-types/exam-types.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          ExamType,
          Tenant,
          Question,
          QuestionOption,
          TestSeries,
          Test,
          TestSection,
          TestQuestion,
          TestSeriesEnrollment,
          TestAttempt,
          AttemptSection,
          QuestionResponse,
          TestResult,
          Leaderboard,
        ],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    ExamTypesModule,
    QuestionsModule,
    TestSeriesModule,
    AttemptsModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
