import { Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}

  @Post('tests/:testId/recompute')
  recompute(@Param('testId') testId: string) {
    return this.service.recompute(testId);
  }

  @Get('tests/:testId')
  getTopN(@Param('testId') testId: string, @Query('limit') limit?: string) {
    return this.service.getTopN(testId, limit ? parseInt(limit) : 100);
  }

  @Get('tests/:testId/me')
  getUserRank(
    @Param('testId') testId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.service.getUserRank(testId, userId);
  }
}
