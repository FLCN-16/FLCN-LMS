import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Institute } from '../../master-entities/institute.entity';
import { User } from '../users/entities/user.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Category } from './entities/category.entity';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { Course } from './entities/course.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from './entities/lesson.entity';
import { Module as CourseModuleEntity } from './entities/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Institute,
      User,
      Category,
      Course,
      CourseModuleEntity,
      Lesson,
      CourseEnrollment,
      LessonProgress,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
