import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Leaderboard } from '../leaderboard/entities/leaderboard.entity';
import { Question } from '../questions/entities/question.entity';
import { TestSection } from '../test-series/entities/test-section.entity';
import { Test } from '../test-series/entities/test.entity';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { AttemptSection } from './entities/attempt-section.entity';
import { QuestionResponse } from './entities/question-response.entity';
import { TestAttempt } from './entities/test-attempt.entity';
import { TestResult } from './entities/test-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestAttempt,
      AttemptSection,
      QuestionResponse,
      TestResult,
      Leaderboard,
      Test,
      TestSection,
      Question,
    ]),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsService],
})
export class AttemptsModule {}
