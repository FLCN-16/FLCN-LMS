import {
  Body,
  Controller, Version,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { CheckPermission } from '../../common/decorators/check-permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserShape } from '../../common/decorators/current-user.decorator';
import { CoursesService } from './courses.service';
import {
  CreateCategoryDto,
  CreateCourseDto,
  CreateEnrollmentDto,
  CreateLessonDto,
  CreateLivePollDto,
  CreateLiveSessionDto,
  CreateModuleDto,
  UpdateCategoryDto,
  UpdateCourseDto,
  UpdateLessonDto,
  UpdateLiveSessionDto,
  UpdateModuleDto,
  UpsertLessonProgressDto,
} from './dto/courses.dto';

@Controller({
  path: 'courses',
  version: '1',
})
@UseGuards(JwtStrategy)
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post('categories')
  @CheckPermission('create', 'CourseCategory')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get('categories')
  @CheckPermission('read', 'CourseCategory')
  findAllCategories() {
    return this.service.findAllCategories();
  }

  @Get('categories/:id')
  @CheckPermission('read', 'CourseCategory')
  findCategory(@Param('id') id: string) {
    return this.service.findCategory(id);
  }

  @Patch('categories/:id')
  @CheckPermission('update', 'CourseCategory')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @CheckPermission('delete', 'CourseCategory')
  removeCategory(@Param('id') id: string) {
    return this.service.removeCategory(id);
  }

  @Post()
  @CheckPermission('create', 'Course')
  createCourse(
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: CreateCourseDto,
  ) {
    return this.service.createCourse({
      ...dto,
      instructorId: currentUser.id,
    });
  }

  @Get()
  @CheckPermission('read', 'Course')
  findAllCourses() {
    return this.service.findAllCourses();
  }

  @Get(':id')
  @CheckPermission('read', 'Course')
  findCourse(@Param('id') id: string) {
    return this.service.findCourse(id);
  }

  @Patch(':id')
  @CheckPermission('update', 'Course')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.updateCourse(id, dto);
  }

  @Post(':id/publish')
  @CheckPermission('publish', 'Course')
  publishCourse(@Param('id') id: string) {
    return this.service.publishCourse(id);
  }

  @Delete(':id')
  @CheckPermission('delete', 'Course')
  removeCourse(@Param('id') id: string) {
    return this.service.removeCourse(id);
  }

  @Post(':courseId/modules')
  @CheckPermission('update', 'Course')
  createModule(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.service.createModule(courseId, dto);
  }

  @Patch(':courseId/modules/:moduleId')
  @CheckPermission('update', 'Course')
  updateModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.service.updateModule(courseId, moduleId, dto);
  }

  @Delete(':courseId/modules/:moduleId')
  @CheckPermission('update', 'Course')
  removeModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.service.removeModule(courseId, moduleId);
  }

  @Post(':courseId/modules/:moduleId/lessons')
  @CheckPermission('update', 'Course')
  createLesson(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.service.createLesson(courseId, moduleId, dto);
  }

  @Patch(':courseId/modules/:moduleId/lessons/:lessonId')
  @CheckPermission('update', 'Course')
  updateLesson(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.service.updateLesson(courseId, moduleId, lessonId, dto);
  }

  @Delete(':courseId/modules/:moduleId/lessons/:lessonId')
  @CheckPermission('update', 'Course')
  removeLesson(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.service.removeLesson(courseId, moduleId, lessonId);
  }

  @Post(':courseId/enroll')
  @CheckPermission('enroll', 'Course')
  enrollCourse(
    @CurrentUser() currentUser: CurrentUserShape,
    @Param('courseId') courseId: string,
    @Body() dto: CreateEnrollmentDto,
  ) {
    return this.service.enrollCourse(courseId, currentUser.id, dto);
  }

  @Get(':courseId/enrollments')
  @CheckPermission('read', 'Course')
  getCourseEnrollments(@Param('courseId') courseId: string) {
    return this.service.getCourseEnrollments(courseId);
  }

  @Get('enrollments/:enrollmentId/progress')
  @CheckPermission('read', 'Course')
  getLessonProgress(@Param('enrollmentId') enrollmentId: string) {
    return this.service.getLessonProgress(enrollmentId);
  }

  @Patch('enrollments/:enrollmentId/lessons/:lessonId/progress')
  @CheckPermission('update', 'Course')
  upsertLessonProgress(
    @Param('enrollmentId') enrollmentId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpsertLessonProgressDto,
  ) {
    return this.service.upsertLessonProgress(enrollmentId, lessonId, dto);
  }

  @Post('live-sessions')
  @CheckPermission('create', 'LiveClass')
  createLiveSession(
    @CurrentUser() currentUser: CurrentUserShape,
    @Body() dto: CreateLiveSessionDto,
  ) {
    return this.service.createLiveSession({
      instructorId: currentUser.id,
      ...dto,
    });
  }

  @Get('live-sessions/:id')
  @CheckPermission('read', 'LiveClass')
  findLiveSession(@Param('id') id: string) {
    return this.service.findLiveSession(id);
  }

  @Patch('live-sessions/:id')
  @CheckPermission('update', 'LiveClass')
  updateLiveSession(
    @Param('id') id: string,
    @Body() dto: UpdateLiveSessionDto,
  ) {
    return this.service.updateLiveSession(id, dto);
  }

  @Post('live-sessions/:id/chat')
  @CheckPermission('update', 'LiveClass')
  addLiveChatMessage(
    @CurrentUser() currentUser: CurrentUserShape,
    @Param('id') sessionId: string,
    @Body('message') message: string,
  ) {
    return this.service.addLiveChatMessage(sessionId, currentUser.id, message);
  }

  @Post('live-sessions/:id/questions')
  @CheckPermission('update', 'LiveClass')
  askLiveQuestion(
    @CurrentUser() currentUser: CurrentUserShape,
    @Param('id') sessionId: string,
    @Body('question') question: string,
  ) {
    return this.service.askLiveQuestion(sessionId, currentUser.id, question);
  }

  @Post('live-sessions/:id/polls')
  @CheckPermission('update', 'LiveClass')
  createLivePoll(
    @Param('id') sessionId: string,
    @Body() dto: CreateLivePollDto,
  ) {
    return this.service.createLivePoll(sessionId, dto.question, dto.options);
  }

  @Post('live-sessions/:id/attendance')
  @CheckPermission('read', 'LiveClass')
  markLiveAttendance(
    @CurrentUser() currentUser: CurrentUserShape,
    @Param('id') sessionId: string,
  ) {
    return this.service.markLiveAttendance(sessionId, currentUser.id);
  }

  @Get('live-sessions')
  @CheckPermission('read', 'LiveClass')
  findLiveSessions(@Query('courseId') courseId?: string) {
    if (!courseId) {
      return [];
    }

    return this.service.findCourse(courseId).then((course) => course);
  }
}
