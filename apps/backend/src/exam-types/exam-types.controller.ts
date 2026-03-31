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
} from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto, UpdateExamTypeDto } from './dto/exam-type.dto';

@Controller('exam-types')
export class ExamTypesController {
  constructor(private readonly service: ExamTypesService) {}

  @Get()
  findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.service.findAll(tenantId, includeInactive === 'true');
  }

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateExamTypeDto,
  ) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExamTypeDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }

  @Post('seed')
  seed(@Headers('x-tenant-id') tenantId: string) {
    return this.service.seed(tenantId);
  }
}
