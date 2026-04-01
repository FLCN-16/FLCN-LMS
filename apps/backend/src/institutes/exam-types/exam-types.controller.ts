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

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import { CreateExamTypeDto, UpdateExamTypeDto } from './dto/exam-type.dto';
import { ExamTypesService } from './exam-types.service';

@Controller({
  path: 'exam-types',
  version: '1',
})
@UseGuards(JwtStrategy)
export class ExamTypesController {
  constructor(private readonly service: ExamTypesService) {}

  @Get()
  @CheckPermission('read', 'ExamType')
  findAll(
    @Headers('x-institute-id') instituteId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.service.findAll(instituteId, includeInactive === 'true');
  }

  @Post()
  @CheckPermission('create', 'ExamType')
  create(
    @Headers('x-institute-id') instituteId: string,
    @Body() dto: CreateExamTypeDto,
  ) {
    return this.service.create(instituteId, dto);
  }

  @Patch(':id')
  @CheckPermission('update', 'ExamType')
  update(
    @Headers('x-institute-id') instituteId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExamTypeDto,
  ) {
    return this.service.update(instituteId, id, dto);
  }

  @Delete(':id')
  @CheckPermission('delete', 'ExamType')
  remove(@Headers('x-institute-id') instituteId: string, @Param('id') id: string) {
    return this.service.remove(instituteId, id);
  }

  @Post('seed')
  @CheckPermission('create', 'ExamType')
  seed(@Headers('x-institute-id') instituteId: string) {
    return this.service.seed(instituteId);
  }
}
