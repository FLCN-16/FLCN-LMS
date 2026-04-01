import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import {
  CurrentUser,
  type CurrentUserShape,
} from '../../common/decorators/current-user.decorator';
import { CreateTestSeriesDto } from './dto/create-test-series.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { TestSeriesService } from './test-series.service';

@Controller({
  path: 'test-series',
  version: '1',
})
@UseGuards(JwtStrategy)
export class TestSeriesController {
  constructor(private readonly service: TestSeriesService) {}

  @Post()
  @CheckPermission('create', 'TestSeries')
  createSeries(
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: CreateTestSeriesDto,
  ) {
    return this.service.createSeries(currentUser.id, dto);
  }

  @Get()
  @CheckPermission('read', 'TestSeries')
  findAllSeries() {
    return this.service.findAllSeries();
  }

  @Get(':id')
  @CheckPermission('read', 'TestSeries')
  findOneSeries(@Param('id') id: string) {
    return this.service.findOneSeries(id);
  }

  @Patch(':id')
  @CheckPermission('update', 'TestSeries')
  updateSeries(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTestSeriesDto>,
  ) {
    return this.service.updateSeries(id, dto);
  }

  @Patch(':id/publish')
  @CheckPermission('publish', 'TestSeries')
  publishSeries(@Param('id') id: string) {
    return this.service.publishSeries(id);
  }

  @Delete(':id')
  @CheckPermission('delete', 'TestSeries')
  removeSeries(@Param('id') id: string) {
    return this.service.removeSeries(id);
  }

  @Post(':id/tests')
  @CheckPermission('create', 'Test')
  createTest(@Param('id') seriesId: string, @Body() dto: CreateTestDto) {
    return this.service.createTest(seriesId, dto);
  }

  @Get(':id/tests')
  @CheckPermission('read', 'Test')
  findAllTests(@Param('id') seriesId: string) {
    return this.service.findAllTests(seriesId);
  }

  @Get(':id/tests/:testId')
  @CheckPermission('read', 'Test')
  findOneTest(@Param('id') seriesId: string, @Param('testId') testId: string) {
    return this.service.findOneTest(seriesId, testId);
  }

  @Patch(':id/tests/:testId')
  @CheckPermission('update', 'Test')
  updateTest(
    @Param('id') seriesId: string,
    @Param('testId') testId: string,
    @Body() dto: Partial<CreateTestDto>,
  ) {
    return this.service.updateTest(seriesId, testId, dto);
  }

  @Patch(':id/tests/:testId/publish')
  @CheckPermission('publish', 'Test')
  publishTest(@Param('id') seriesId: string, @Param('testId') testId: string) {
    return this.service.publishTest(seriesId, testId);
  }

  @Post(':id/enroll')
  @CheckPermission('enroll', 'TestSeries')
  enroll(
    @CurrentUser() currentUser: CurrentUserShape,
    @Param('id') seriesId: string,
    @Body('paymentId') paymentId?: string,
  ) {
    return this.service.enroll(seriesId, currentUser.id, paymentId);
  }

  @Get(':id/enrollments')
  @CheckPermission('read', 'TestSeries')
  getEnrollments(@Param('id') seriesId: string) {
    return this.service.getEnrollments(seriesId);
  }
}
