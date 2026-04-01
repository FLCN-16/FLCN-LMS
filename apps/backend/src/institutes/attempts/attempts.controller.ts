import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import {
  CurrentUser,
  type CurrentUserShape,
} from '../../common/decorators/current-user.decorator';
import { AttemptsService } from './attempts.service';
import { SaveResponseDto } from './dto/save-response.dto';
import { StartAttemptDto } from './dto/start-attempt.dto';

@Controller({
  path: 'attempts',
  version: '1',
})
@UseGuards(JwtStrategy)
export class AttemptsController {
  constructor(private readonly service: AttemptsService) {}

  @Post('tests/:testId/start')
  @CheckPermission('create', 'Attempt')
  start(
    @Param('testId') testId: string,
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: StartAttemptDto,
  ) {
    return this.service.startAttempt(testId, currentUser.id, dto);
  }

  @Get(':id')
  @CheckPermission('read', 'Attempt')
  getAttempt(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserShape,
  ) {
    return this.service.getAttempt(id, currentUser.id);
  }

  @Post(':id/response')
  @CheckPermission('update', 'Attempt')
  saveResponse(
    @Param('id') attemptId: string,
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: SaveResponseDto,
  ) {
    return this.service.saveResponse(attemptId, currentUser.id, dto);
  }

  @Post(':id/tab-switch')
  @CheckPermission('update', 'Attempt')
  tabSwitch(
    @Param('id') attemptId: string,
    @CurrentUser() currentUser: CurrentUserShape,
  ) {
    return this.service.updateTabSwitch(attemptId, currentUser.id);
  }

  @Post(':id/submit')
  @CheckPermission('update', 'Attempt')
  submit(
    @Param('id') attemptId: string,
    @CurrentUser() currentUser: CurrentUserShape,
  ) {
    return this.service.submitAttempt(attemptId, currentUser.id);
  }

  @Get(':id/result')
  @CheckPermission('read', 'Attempt')
  getResult(
    @Param('id') attemptId: string,
    @CurrentUser() currentUser: CurrentUserShape,
  ) {
    return this.service.getResult(attemptId, currentUser.id);
  }

  @Patch(':id/disqualify')
  @CheckPermission('manage', 'Attempt')
  disqualify(@Param('id') attemptId: string) {
    return this.service.disqualify(attemptId);
  }

  @Get()
  @CheckPermission('read', 'Attempt')
  getUserAttempts(
    @CurrentUser() currentUser: CurrentUserShape,
    @Query('testId') testId?: string,
  ) {
    return this.service.getUserAttempts(currentUser.id, testId);
  }
}
