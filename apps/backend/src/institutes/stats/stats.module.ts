import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { StatsController } from './stats.controller';

@Module({
  imports: [CoursesModule, UsersModule],
  controllers: [StatsController],
})
export class StatsModule {}
