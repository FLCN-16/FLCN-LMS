import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TestSeriesService } from './test-series.service';
import { CreateTestSeriesDto } from './dto/create-test-series.dto';
import { CreateTestDto } from './dto/create-test.dto';

@Controller('test-series')
export class TestSeriesController {
  constructor(private readonly service: TestSeriesService) {}

  // Series
  @Post()
  createSeries(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateTestSeriesDto,
  ) {
    return this.service.createSeries(tenantId, userId, dto);
  }

  @Get()
  findAllSeries(@Headers('x-tenant-id') tenantId: string) {
    return this.service.findAllSeries(tenantId);
  }

  @Get(':id')
  findOneSeries(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.findOneSeries(tenantId, id);
  }

  @Patch(':id')
  updateSeries(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTestSeriesDto>,
  ) {
    return this.service.updateSeries(tenantId, id, dto);
  }

  @Patch(':id/publish')
  publishSeries(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.publishSeries(tenantId, id);
  }

  @Delete(':id')
  removeSeries(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.service.removeSeries(tenantId, id);
  }

  // Tests within a series
  @Post(':id/tests')
  createTest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') seriesId: string,
    @Body() dto: CreateTestDto,
  ) {
    return this.service.createTest(tenantId, seriesId, dto);
  }

  @Get(':id/tests')
  findAllTests(@Headers('x-tenant-id') tenantId: string, @Param('id') seriesId: string) {
    return this.service.findAllTests(tenantId, seriesId);
  }

  @Get(':id/tests/:testId')
  findOneTest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') seriesId: string,
    @Param('testId') testId: string,
  ) {
    return this.service.findOneTest(tenantId, seriesId, testId);
  }

  @Patch(':id/tests/:testId')
  updateTest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') seriesId: string,
    @Param('testId') testId: string,
    @Body() dto: Partial<CreateTestDto>,
  ) {
    return this.service.updateTest(tenantId, seriesId, testId, dto);
  }

  @Patch(':id/tests/:testId/publish')
  publishTest(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') seriesId: string,
    @Param('testId') testId: string,
  ) {
    return this.service.publishTest(tenantId, seriesId, testId);
  }

  // Enrollments
  @Post(':id/enroll')
  enroll(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') seriesId: string,
    @Body('paymentId') paymentId?: string,
  ) {
    return this.service.enroll(tenantId, seriesId, userId, paymentId);
  }

  @Get(':id/enrollments')
  getEnrollments(@Headers('x-tenant-id') tenantId: string, @Param('id') seriesId: string) {
    return this.service.getEnrollments(tenantId, seriesId);
  }
}
