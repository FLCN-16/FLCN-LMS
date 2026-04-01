import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import type { Difficulty, QuestionType } from '@flcn-lms/types/questions';

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import {
  CurrentUser,
  type CurrentUserShape,
} from '../../common/decorators/current-user.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';

@Controller({
  path: 'questions',
  version: '1',
})
@UseGuards(JwtStrategy)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Post()
  @CheckPermission('create', 'Question')
  create(
    @Headers('x-institute-id') instituteId: string,
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.service.create(instituteId, currentUser.id, dto);
  }

  @Get()
  @CheckPermission('read', 'Question')
  findAll(
    @Headers('x-institute-id') instituteId: string,
    @Query('subject') subject?: string,
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('type') type?: QuestionType,
    @Query('isApproved') isApproved?: string,
  ) {
    return this.service.findAll(instituteId, {
      subject,
      topic,
      difficulty,
      type,
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
    });
  }

  @Get(':id')
  @CheckPermission('read', 'Question')
  findOne(@Headers('x-institute-id') instituteId: string, @Param('id') id: string) {
    return this.service.findOne(instituteId, id);
  }

  @Patch(':id')
  @CheckPermission('update', 'Question')
  update(
    @Headers('x-institute-id') instituteId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateQuestionDto>,
  ) {
    return this.service.update(instituteId, id, dto);
  }

  @Patch(':id/approve')
  @CheckPermission('approve', 'Question')
  approve(@Headers('x-institute-id') instituteId: string, @Param('id') id: string) {
    return this.service.approve(instituteId, id);
  }

  @Delete(':id')
  @CheckPermission('delete', 'Question')
  remove(@Headers('x-institute-id') instituteId: string, @Param('id') id: string) {
    return this.service.remove(instituteId, id);
  }
}
