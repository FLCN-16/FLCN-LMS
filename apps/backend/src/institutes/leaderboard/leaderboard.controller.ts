import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LeaderboardService } from './leaderboard.service';

@Controller({
  path: 'leaderboard',
  version: '1',
})
@UseGuards(JwtStrategy)
export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}

  @Post('tests/:testId/recompute')
  @CheckPermission('manage', 'Leaderboard')
  recompute(@Param('testId') testId: string) {
    return this.service.recompute(testId);
  }

  @Get('tests/:testId')
  @CheckPermission('read', 'Leaderboard')
  getTopN(@Param('testId') testId: string, @Query('limit') limit?: string) {
    return this.service.getTopN(testId, limit ? parseInt(limit, 10) : 100);
  }

  @Get('tests/:testId/me')
  @CheckPermission('read', 'Leaderboard')
  getUserRank(
    @Param('testId') testId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.getUserRank(testId, user.id);
  }
}
