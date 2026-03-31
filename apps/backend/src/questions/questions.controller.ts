import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Difficulty, QuestionType } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('subject') subject?: string,
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('type') type?: QuestionType,
    @Query('isApproved') isApproved?: string,
  ) {
    return this.service.findAll(tenantId, {
      subject,
      topic,
      difficulty,
      type,
      isApproved: isApproved !== undefined ? isApproved === 'true' : undefined,
    });
  }

  @Get(':id')
  findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateQuestionDto>,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Patch(':id/approve')
  approve(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.approve(tenantId, id);
  }

  @Delete(':id')
  remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}
