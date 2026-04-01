import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  SectionBreakdownEntry,
  TopicBreakdownEntry,
} from '@flcn-lms/types/attempts';

import { Leaderboard } from '../leaderboard/entities/leaderboard.entity';
import { Question } from '../questions/entities/question.entity';
import { TestSection } from '../test-series/entities/test-section.entity';
import { Test } from '../test-series/entities/test.entity';
import { SaveResponseDto } from './dto/save-response.dto';
import { StartAttemptDto } from './dto/start-attempt.dto';
import { AttemptSection } from './entities/attempt-section.entity';
import { QuestionResponse } from './entities/question-response.entity';
import { TestAttempt } from './entities/test-attempt.entity';
import { TestResult } from './entities/test-result.entity';
import { scoreResponses } from './scoring.util';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(TestAttempt)
    private readonly attemptRepo: Repository<TestAttempt>,
    @InjectRepository(AttemptSection)
    private readonly sectionRepo: Repository<AttemptSection>,
    @InjectRepository(QuestionResponse)
    private readonly responseRepo: Repository<QuestionResponse>,
    @InjectRepository(TestResult)
    private readonly resultRepo: Repository<TestResult>,
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(Test)
    private readonly testRepo: Repository<Test>,
    @InjectRepository(TestSection)
    private readonly testSectionRepo: Repository<TestSection>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async startAttempt(
    testId: string,
    userId: string,
    dto: StartAttemptDto,
  ): Promise<TestAttempt> {
    const test = await this.testRepo.findOne({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test not found');

    const existingCount = await this.attemptRepo.count({
      where: { testId, userId },
    });
    if (test.attemptLimit > 0 && existingCount >= test.attemptLimit) {
      throw new BadRequestException('Attempt limit reached');
    }

    const attempt = this.attemptRepo.create({
      testId,
      userId,
      attemptNumber: existingCount + 1,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      remainingTimeSecs: test.durationMins * 60,
    });

    return this.attemptRepo.save(attempt);
  }

  async getAttempt(attemptId: string, userId: string): Promise<TestAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, userId },
      relations: ['sections', 'sections.responses', 'sections.testSection'],
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    return attempt;
  }

  async saveResponse(
    attemptId: string,
    userId: string,
    dto: SaveResponseDto,
  ): Promise<QuestionResponse> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, userId },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Attempt is not in progress');
    }

    const existing = await this.responseRepo.findOne({
      where: {
        attemptSectionId: dto.attemptSectionId,
        questionId: dto.questionId,
      },
    });

    if (existing) {
      Object.assign(existing, {
        selectedOptionIds: dto.selectedOptionIds,
        integerAnswer: dto.integerAnswer,
        subjectiveAnswer: dto.subjectiveAnswer,
        status: dto.status,
        timeTakenSecs: dto.timeTakenSecs ?? existing.timeTakenSecs,
      });
      return this.responseRepo.save(existing);
    }

    const response = this.responseRepo.create({
      ...dto,
      attemptSectionId: dto.attemptSectionId,
    });

    return this.responseRepo.save(response);
  }

  async updateTabSwitch(attemptId: string, userId: string): Promise<void> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, userId },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    await this.attemptRepo.increment({ id: attemptId }, 'tabSwitchCount', 1);
  }

  async submitAttempt(attemptId: string, userId: string): Promise<TestResult> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, userId },
      relations: ['sections', 'sections.responses'],
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      throw new BadRequestException('Attempt already submitted');
    }

    const test = await this.testRepo.findOne({
      where: { id: attempt.testId },
      relations: ['sections', 'sections.testQuestions'],
    });

    if (!test) throw new NotFoundException('Test not found');

    const allQuestionIds = test.sections.flatMap((section) =>
      section.testQuestions.map((testQuestion) => testQuestion.questionId),
    );

    const questions = await this.questionRepo.findBy(
      allQuestionIds.map((id) => ({ id })),
    );

    const allResponses = attempt.sections.flatMap(
      (section) => section.responses,
    );
    const scored = scoreResponses(allResponses, questions);

    for (const scoredResponse of scored) {
      const response = allResponses.find(
        (item) => item.questionId === scoredResponse.questionId,
      );
      if (response) {
        response.isCorrect = scoredResponse.isCorrect;
        response.marksAwarded = scoredResponse.marksAwarded;
        await this.responseRepo.save(response);
      }
    }

    const correctCount = scored.filter((item) => item.isCorrect).length;
    const incorrectCount = scored.filter(
      (item) => !item.isCorrect && item.marksAwarded < 0,
    ).length;
    const unattemptedCount = allResponses.filter(
      (response) => response.status === 'UNATTEMPTED',
    ).length;
    const marksObtained = scored.reduce(
      (sum, item) => sum + item.marksAwarded,
      0,
    );
    const timeTakenSecs = allResponses.reduce(
      (sum, response) => sum + response.timeTakenSecs,
      0,
    );
    const accuracy =
      correctCount + incorrectCount > 0
        ? (correctCount / (correctCount + incorrectCount)) * 100
        : 0;

    const sectionBreakdown: Record<string, SectionBreakdownEntry> = {};
    for (const attemptSection of attempt.sections) {
      const testSection = test.sections.find(
        (section) => section.id === attemptSection.testSectionId,
      );
      const sectionResponses = attemptSection.responses;
      const sectionScored = scoreResponses(sectionResponses, questions);

      sectionBreakdown[testSection?.title ?? attemptSection.testSectionId] = {
        marks: sectionScored.reduce((sum, item) => sum + item.marksAwarded, 0),
        correct: sectionScored.filter((item) => item.isCorrect).length,
        timeSecs: sectionResponses.reduce(
          (sum, response) => sum + response.timeTakenSecs,
          0,
        ),
      };
    }

    const topicBreakdown: Record<string, TopicBreakdownEntry> = {};
    for (const item of scored) {
      const question = questions.find((q) => q.id === item.questionId);
      if (!question) continue;

      if (!topicBreakdown[question.topic]) {
        topicBreakdown[question.topic] = { correct: 0, wrong: 0, skipped: 0 };
      }

      if (item.isCorrect) {
        topicBreakdown[question.topic].correct++;
      } else if (item.marksAwarded < 0) {
        topicBreakdown[question.topic].wrong++;
      } else {
        topicBreakdown[question.topic].skipped =
          (topicBreakdown[question.topic].skipped ?? 0) + 1;
      }
    }

    attempt.status = 'SUBMITTED';
    attempt.submittedAt = new Date();
    await this.attemptRepo.save(attempt);

    const result = this.resultRepo.create({
      attemptId,
      testId: attempt.testId,
      userId,
      totalMarks: test.totalMarks,
      marksObtained,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      timeTakenSecs,
      sectionBreakdown,
      topicBreakdown,
    });

    return this.resultRepo.save(result);
  }

  async getResult(attemptId: string, userId: string): Promise<TestResult> {
    const result = await this.resultRepo.findOne({
      where: { attemptId, userId },
    });
    if (!result) throw new NotFoundException('Result not found');
    return result;
  }

  async disqualify(attemptId: string): Promise<TestAttempt> {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    attempt.isDisqualified = true;
    return this.attemptRepo.save(attempt);
  }

  async getUserAttempts(
    userId: string,
    testId?: string,
  ): Promise<TestAttempt[]> {
    const where: Record<string, string> = { userId };
    if (testId) where.testId = testId;
    return this.attemptRepo.find({ where, order: { startedAt: 'DESC' } });
  }
}
