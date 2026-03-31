import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { StartAttemptDto } from './dto/start-attempt.dto';
import { SaveResponseDto } from './dto/save-response.dto';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly service: AttemptsService) {}

  @Post('tests/:testId/start')
  start(
    @Param('testId') testId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: StartAttemptDto,
  ) {
    return this.service.startAttempt(testId, userId, dto);
  }

  @Get(':id')
  getAttempt(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.service.getAttempt(id, userId);
  }

  @Post(':id/response')
  saveResponse(
    @Param('id') attemptId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: SaveResponseDto,
  ) {
    return this.service.saveResponse(attemptId, userId, dto);
  }

  @Post(':id/tab-switch')
  tabSwitch(
    @Param('id') attemptId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.service.updateTabSwitch(attemptId, userId);
  }

  @Post(':id/submit')
  submit(@Param('id') attemptId: string, @Headers('x-user-id') userId: string) {
    return this.service.submitAttempt(attemptId, userId);
  }

  @Get(':id/result')
  getResult(
    @Param('id') attemptId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.service.getResult(attemptId, userId);
  }

  @Patch(':id/disqualify')
  disqualify(@Param('id') attemptId: string) {
    return this.service.disqualify(attemptId);
  }

  @Get()
  getUserAttempts(
    @Headers('x-user-id') userId: string,
    @Query('testId') testId?: string,
  ) {
    return this.service.getUserAttempts(userId, testId);
  }
}
