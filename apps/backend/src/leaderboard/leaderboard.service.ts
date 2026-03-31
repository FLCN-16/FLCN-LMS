import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { TestResult } from '../attempts/entities/test-result.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepo: Repository<Leaderboard>,
    @InjectRepository(TestResult)
    private readonly resultRepo: Repository<TestResult>,
  ) {}

  /** Recompute leaderboard for a test — call after each submission or on a schedule */
  async recompute(testId: string): Promise<void> {
    const results = await this.resultRepo.find({
      where: { testId },
      order: { marksObtained: 'DESC', timeTakenSecs: 'ASC' },
    });

    const total = results.length;

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const rank = i + 1;
      const percentile = total > 1 ? ((total - rank) / (total - 1)) * 100 : 100;

      await this.leaderboardRepo.upsert(
        {
          testId,
          userId: r.userId,
          rank,
          marksObtained: r.marksObtained,
          percentile: Math.round(percentile * 100) / 100,
          timeTakenSecs: r.timeTakenSecs,
        },
        ['testId', 'userId'],
      );

      // Update percentile on result too
      await this.resultRepo.update(r.id, { percentile, rank });
    }
  }

  async getTopN(testId: string, limit = 100): Promise<Leaderboard[]> {
    return this.leaderboardRepo.find({
      where: { testId },
      order: { rank: 'ASC' },
      take: limit,
    });
  }

  async getUserRank(
    testId: string,
    userId: string,
  ): Promise<Leaderboard | null> {
    return this.leaderboardRepo.findOne({ where: { testId, userId } });
  }
}
