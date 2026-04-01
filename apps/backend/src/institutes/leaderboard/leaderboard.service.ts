import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { LeaderboardEntry } from '@flcn-lms/types/leaderboard';

import { TestResult } from '../attempts/entities/test-result.entity';
import { Leaderboard } from './entities/leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(TestResult)
    private readonly resultRepo: Repository<TestResult>,
  ) {}

  /**
   * Recompute leaderboard for a test.
   * Rank is ordered by:
   * 1) marksObtained DESC
   * 2) timeTakenSecs ASC
   */
  async recompute(testId: string): Promise<void> {
    const results = await this.resultRepo.find({
      where: { testId },
      order: { marksObtained: 'DESC', timeTakenSecs: 'ASC' },
    });

    const total = results.length;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const rank = i + 1;
      const percentile = total > 1 ? ((total - rank) / (total - 1)) * 100 : 100;

      await this.leaderboardRepo.upsert(
        {
          testId,
          userId: result.userId,
          rank,
          marksObtained: result.marksObtained,
          percentile: Math.round(percentile * 100) / 100,
          timeTakenSecs: result.timeTakenSecs,
        },
        ['testId', 'userId'],
      );

      await this.resultRepo.update(result.id, {
        percentile: Math.round(percentile * 100) / 100,
        rank,
      });
    }
  }

  async getTopN(testId: string, limit = 100): Promise<LeaderboardEntry[]> {
    const entries = await this.leaderboardRepo.find({
      where: { testId },
      order: { rank: 'ASC' },
      take: limit,
    });

    return entries.map((entry) => this.toLeaderboardEntry(entry));
  }

  async getUserRank(
    testId: string,
    userId: string,
  ): Promise<LeaderboardEntry | null> {
    const entry = await this.leaderboardRepo.findOne({
      where: { testId, userId },
    });

    return entry ? this.toLeaderboardEntry(entry) : null;
  }

  private toLeaderboardEntry(entry: Leaderboard): LeaderboardEntry {
    return {
      id: entry.id,
      testId: entry.testId,
      userId: entry.userId,
      rank: entry.rank,
      marksObtained: Number(entry.marksObtained),
      percentile: Number(entry.percentile),
      timeTakenSecs: entry.timeTakenSecs,
      updatedAt: entry.updatedAt,
    };
  }
}
