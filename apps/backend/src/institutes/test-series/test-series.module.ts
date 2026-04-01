import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestQuestion } from './entities/test-question.entity';
import { TestSection } from './entities/test-section.entity';
import { TestSeriesEnrollment } from './entities/test-series-enrollment.entity';
import { TestSeries } from './entities/test-series.entity';
import { Test } from './entities/test.entity';
import { TestSeriesController } from './test-series.controller';
import { TestSeriesService } from './test-series.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestSeries,
      Test,
      TestSection,
      TestQuestion,
      TestSeriesEnrollment,
    ]),
  ],
  controllers: [TestSeriesController],
  providers: [TestSeriesService],
  exports: [TestSeriesService],
})
export class TestSeriesModule {}
