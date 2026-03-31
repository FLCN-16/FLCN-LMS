import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAttempt } from './entities/test-attempt.entity';
import { AttemptSection } from './entities/attempt-section.entity';
import { QuestionResponse } from './entities/question-response.entity';
import { TestResult } from './entities/test-result.entity';
import { Leaderboard } from '../leaderboard/entities/leaderboard.entity';
import { Test } from '../test-series/entities/test.entity';
import { TestSection } from '../test-series/entities/test-section.entity';
import { Question } from '../questions/entities/question.entity';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';

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
