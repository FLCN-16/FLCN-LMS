import { Injectable, NotFoundException } from '@nestjs/common';

import type {
  CreateCategoryPayload,
  CreateCoursePayload,
  CreateEnrollmentPayload,
  CreateLessonPayload,
  CreateLiveSessionPayload,
  CreateModulePayload,
  UpdateCategoryPayload,
  UpdateCoursePayload,
  UpdateLessonPayload,
  UpdateLiveSessionPayload,
  UpdateModulePayload,
  UpsertLessonProgressPayload,
} from '@flcn-lms/types/courses';
import type { TenantSummary } from '@flcn-lms/types/leaderboard';
import type {
  CourseEnrollment as CourseEnrollmentType,
  CourseLesson,
  CourseMetadata,
  CourseModule,
  LessonProgress as LessonProgressType,
} from '@flcn-lms/types/test-series';

import { LiveAttendance } from '../live-sessions/entities/live-attendance.entity';
import { LiveChatMessage } from '../live-sessions/entities/live-chat-message.entity';
import { LivePoll } from '../live-sessions/entities/live-poll.entity';
import { LiveQA } from '../live-sessions/entities/live-qa.entity';
import {
  LiveSession,
  SessionStatus,
} from '../live-sessions/entities/live-session.entity';
import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import { Category } from './entities/category.entity';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { Course } from './entities/course.entity';
import { LessonProgress } from './entities/lesson-progress.entity';
import {
  Lesson,
  LessonType as LessonEntityType,
} from './entities/lesson.entity';
import { Module as CourseModuleEntity } from './entities/module.entity';

@Injectable()
export class CoursesService {
  constructor(private instituteContext: InstituteContext) {}

  async createCategory(dto: CreateCategoryPayload): Promise<Category> {
    const categoryRepo = this.instituteContext.getRepository(Category);
    const instituteId = this.instituteContext.getInstituteId();
    const category = categoryRepo.create({
      ...dto,
      instituteId: instituteId,
    } as any);
    return (await categoryRepo.save(category)) as unknown as Category;
  }

  async findAllCategories(): Promise<Category[]> {
    const categoryRepo = this.instituteContext.getRepository(Category);
    return (await categoryRepo.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    })) as unknown as Category[];
  }

  async findCategory(id: string): Promise<Category> {
    const categoryRepo = this.instituteContext.getRepository(Category);
    const category = await categoryRepo.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category as Category;
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryPayload,
  ): Promise<Category> {
    const category = await this.findCategory(id);
    Object.assign(category, dto);
    const categoryRepo = this.instituteContext.getRepository(Category);
    return (await categoryRepo.save(category)) as unknown as Category;
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategory(id);
    const categoryRepo = this.instituteContext.getRepository(Category);
    await categoryRepo.remove(category);
  }

  async createCourse(dto: CreateCoursePayload): Promise<Course> {
    const courseRepo = this.instituteContext.getRepository(Course);
    const instituteId = this.instituteContext.getInstituteId();
    const course = courseRepo.create({
      ...dto,
      instituteId: instituteId,
    } as any);
    return (await courseRepo.save(course)) as unknown as Course;
  }

  async findAllCourses(): Promise<Course[]> {
    const courseRepo = this.instituteContext.getRepository(Course);
    return (await courseRepo.find({
      relations: ['modules', 'modules.lessons'],
      order: { createdAt: 'DESC' },
    })) as unknown as Course[];
  }

  async findCourse(id: string): Promise<Course> {
    const courseRepo = this.instituteContext.getRepository(Course);
    const course = await courseRepo.findOne({
      where: { id },
      relations: ['modules', 'modules.lessons', 'category'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course as Course;
  }

  async updateCourse(id: string, dto: UpdateCoursePayload): Promise<Course> {
    const course = await this.findCourse(id);
    Object.assign(course, dto);
    const courseRepo = this.instituteContext.getRepository(Course);
    return (await courseRepo.save(course)) as unknown as Course;
  }

  async publishCourse(id: string): Promise<Course> {
    const course = await this.findCourse(id);
    course.status = 'PUBLISHED';
    const courseRepo = this.instituteContext.getRepository(Course);
    return (await courseRepo.save(course)) as unknown as Course;
  }

  async removeCourse(id: string): Promise<void> {
    const course = await this.findCourse(id);
    const courseRepo = this.instituteContext.getRepository(Course);
    await courseRepo.remove(course);
  }

  async createModule(
    courseId: string,
    dto: CreateModulePayload,
  ): Promise<CourseModuleEntity> {
    await this.findCourse(courseId);
    const moduleRepo = this.instituteContext.getRepository(CourseModuleEntity);
    const module = moduleRepo.create({
      ...dto,
      courseId,
    } as any);
    return (await moduleRepo.save(module)) as unknown as CourseModuleEntity;
  }

  async updateModule(
    courseId: string,
    moduleId: string,
    dto: UpdateModulePayload,
  ): Promise<CourseModuleEntity> {
    await this.findCourse(courseId);
    const moduleRepo = this.instituteContext.getRepository(CourseModuleEntity);
    const module = await moduleRepo.findOne({
      where: { id: moduleId, courseId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    Object.assign(module, dto);
    return (await moduleRepo.save(module)) as unknown as CourseModuleEntity;
  }

  async removeModule(courseId: string, moduleId: string): Promise<void> {
    await this.findCourse(courseId);
    const moduleRepo = this.instituteContext.getRepository(CourseModuleEntity);
    const module = await moduleRepo.findOne({
      where: { id: moduleId, courseId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    await moduleRepo.remove(module);
  }

  async createLesson(
    courseId: string,
    moduleId: string,
    dto: CreateLessonPayload,
  ): Promise<Lesson> {
    await this.findCourse(courseId);

    const moduleRepo = this.instituteContext.getRepository(CourseModuleEntity);
    const module = await moduleRepo.findOne({
      where: { id: moduleId, courseId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const lessonRepo = this.instituteContext.getRepository(Lesson);
    const lesson = lessonRepo.create({
      moduleId,
      ...dto,
      type: dto.type as LessonEntityType,
    } as any);
    return (await lessonRepo.save(lesson)) as unknown as Lesson;
  }

  async updateLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    dto: UpdateLessonPayload,
  ): Promise<Lesson> {
    await this.findCourse(courseId);

    const lessonRepo = this.instituteContext.getRepository(Lesson);
    const lesson = await lessonRepo.findOne({
      where: { id: lessonId, moduleId },
      relations: ['module'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    Object.assign(lesson, dto);
    if (dto.type) {
      lesson.type = dto.type as LessonEntityType;
    }
    return (await lessonRepo.save(lesson)) as unknown as Lesson;
  }

  async removeLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): Promise<void> {
    await this.findCourse(courseId);

    const lessonRepo = this.instituteContext.getRepository(Lesson);
    const lesson = await lessonRepo.findOne({
      where: { id: lessonId, moduleId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await lessonRepo.remove(lesson);
  }

  async enrollCourse(
    courseId: string,
    userId: string,
    dto: CreateEnrollmentPayload = {},
  ): Promise<CourseEnrollment> {
    await this.findCourse(courseId);

    const enrollmentRepo =
      this.instituteContext.getRepository(CourseEnrollment);
    const existing = await enrollmentRepo.findOne({
      where: { courseId, userId },
    });

    if (existing) {
      return existing as CourseEnrollment;
    }

    const enrollment = enrollmentRepo.create({
      courseId,
      userId,
      paymentId: dto.paymentId,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    } as any);
    return (await enrollmentRepo.save(
      enrollment,
    )) as unknown as CourseEnrollment;
  }

  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    await this.findCourse(courseId);

    const enrollmentRepo =
      this.instituteContext.getRepository(CourseEnrollment);
    return (await enrollmentRepo.find({
      where: { courseId },
      order: { enrolledAt: 'DESC' },
    })) as unknown as CourseEnrollment[];
  }

  async getLessonProgress(enrollmentId: string): Promise<LessonProgress[]> {
    const lessonProgressRepo =
      this.instituteContext.getRepository(LessonProgress);
    return (await lessonProgressRepo.find({
      where: { enrollmentId },
      order: { updatedAt: 'DESC' },
    })) as unknown as LessonProgress[];
  }

  async upsertLessonProgress(
    enrollmentId: string,
    lessonId: string,
    dto: UpsertLessonProgressPayload,
  ): Promise<LessonProgress> {
    const nextValues = {
      ...dto,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
    };

    const lessonProgressRepo =
      this.instituteContext.getRepository(LessonProgress);
    const progress = await lessonProgressRepo.findOne({
      where: { enrollmentId, lessonId },
    });

    if (progress) {
      Object.assign(progress, nextValues);
      return (await lessonProgressRepo.save(
        progress,
      )) as unknown as LessonProgress;
    }

    const newProgress = lessonProgressRepo.create({
      enrollmentId,
      lessonId,
      ...nextValues,
    } as any);
    return (await lessonProgressRepo.save(
      newProgress,
    )) as unknown as LessonProgress;
  }

  async createLiveSession(dto: Omit<CreateLiveSessionPayload, 'instituteId'>): Promise<LiveSession> {
    await this.findCourse(dto.courseId);

    const instituteId = this.instituteContext.getInstituteId();
    const liveSessionRepo = this.instituteContext.getRepository(LiveSession);
    const session = liveSessionRepo.create({
      ...dto,
      instituteId: instituteId,
      status: dto.status
        ? (dto.status as SessionStatus)
        : SessionStatus.SCHEDULED,
      scheduledAt: new Date(dto.scheduledAt),
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined,
    } as any);
    return (await liveSessionRepo.save(session)) as unknown as LiveSession;
  }

  async findLiveSession(id: string): Promise<LiveSession> {
    const liveSessionRepo = this.instituteContext.getRepository(LiveSession);
    const session = await liveSessionRepo.findOne({
      where: { id },
      relations: [
        'course',
        'instructor',
        'chatMessages',
        'questions',
        'polls',
        'attendance',
      ],
    });

    if (!session) {
      throw new NotFoundException('Live session not found');
    }

    return session as LiveSession;
  }

  async updateLiveSession(
    id: string,
    dto: UpdateLiveSessionPayload,
  ): Promise<LiveSession> {
    const session = await this.findLiveSession(id);
    Object.assign(session, {
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      endedAt: dto.endedAt ? new Date(dto.endedAt) : undefined,
    });
    if (dto.status) {
      session.status = dto.status as SessionStatus;
    }
    const liveSessionRepo = this.instituteContext.getRepository(LiveSession);
    return (await liveSessionRepo.save(session)) as unknown as LiveSession;
  }

  async addLiveChatMessage(
    sessionId: string,
    userId: string,
    message: string,
  ): Promise<LiveChatMessage> {
    await this.findLiveSession(sessionId);
    const liveChatRepo = this.instituteContext.getRepository(LiveChatMessage);
    const chatMessage = liveChatRepo.create({
      sessionId,
      userId,
      message,
    } as any);
    return (await liveChatRepo.save(chatMessage)) as unknown as LiveChatMessage;
  }

  async askLiveQuestion(
    sessionId: string,
    askedById: string,
    question: string,
  ): Promise<LiveQA> {
    await this.findLiveSession(sessionId);
    const liveQaRepo = this.instituteContext.getRepository(LiveQA);
    const qa = liveQaRepo.create({
      sessionId,
      askedById,
      question,
    } as any);
    return (await liveQaRepo.save(qa)) as unknown as LiveQA;
  }

  async createLivePoll(
    sessionId: string,
    question: string,
    options: string[],
  ): Promise<LivePoll> {
    await this.findLiveSession(sessionId);
    const livePollRepo = this.instituteContext.getRepository(LivePoll);
    const poll = livePollRepo.create({
      sessionId,
      question,
      options,
    } as any);
    return (await livePollRepo.save(poll)) as unknown as LivePoll;
  }

  async markLiveAttendance(
    sessionId: string,
    userId: string,
  ): Promise<LiveAttendance> {
    await this.findLiveSession(sessionId);

    const liveAttendanceRepo =
      this.instituteContext.getRepository(LiveAttendance);
    const existing = await liveAttendanceRepo.findOne({
      where: { sessionId, userId },
    });

    if (existing) {
      return existing as LiveAttendance;
    }

    const attendance = liveAttendanceRepo.create({
      sessionId,
      userId,
    } as any);
    return (await liveAttendanceRepo.save(
      attendance,
    )) as unknown as LiveAttendance;
  }

  toCourseDto(course: Course): CourseMetadata {
    return {
      id: course.id,
      instituteId: course.instituteId,
      categoryId: course.categoryId,
      instructorId: course.instructorId,
      slug: course.slug,
      title: course.title,
      description: course.description ?? undefined,
      thumbnailUrl: course.thumbnailUrl ?? undefined,
      trailerUrl: course.trailerUrl ?? undefined,
      status: course.status,
      isPaid: course.isPaid,
      price: course.price ?? undefined,
      discountPrice: course.discountPrice ?? undefined,
      validityDays: course.validityDays ?? undefined,
      highlights: course.highlights ?? undefined,
      totalStudents: course.totalStudents,
      totalLessons: course.totalLessons,
      rating: course.rating,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      modules: course.modules?.map((module) => this.toModuleDto(module)),
    };
  }

  toModuleDto(module: CourseModuleEntity): CourseModule {
    return {
      id: module.id,
      courseId: module.courseId,
      slug: module.slug,
      title: module.title,
      description: module.description ?? undefined,
      order: module.order,
      isFree: module.isFree,
      lessons: module.lessons?.map((lesson) => this.toLessonDto(lesson)),
    };
  }

  toLessonDto(lesson: Lesson): CourseLesson {
    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      slug: lesson.slug,
      title: lesson.title,
      type: lesson.type as CourseLesson['type'],
      videoUrl: lesson.videoUrl ?? undefined,
      videoDurationSecs: lesson.videoDurationSecs ?? undefined,
      pdfUrl: lesson.pdfUrl ?? undefined,
      textContent: lesson.textContent ?? undefined,
      liveSessionId: lesson.liveSessionId ?? undefined,
      isFree: lesson.isFree,
      order: lesson.order,
      thumbnailUrl: lesson.thumbnailUrl ?? undefined,
      attachments: lesson.attachments ?? undefined,
      createdAt: lesson.createdAt.toISOString(),
    };
  }

  toEnrollmentDto(enrollment: CourseEnrollment): CourseEnrollmentType {
    return {
      id: enrollment.id,
      courseId: enrollment.courseId,
      userId: enrollment.userId,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      expiresAt: enrollment.expiresAt?.toISOString(),
      paymentId: enrollment.paymentId ?? undefined,
      progressPercent: enrollment.progressPercent,
    };
  }

  toLessonProgressDto(progress: LessonProgress): LessonProgressType {
    return {
      id: progress.id,
      enrollmentId: progress.enrollmentId,
      lessonId: progress.lessonId,
      isCompleted: progress.isCompleted,
      watchedSecs: progress.watchedSecs,
      completedAt: progress.completedAt?.toISOString(),
      updatedAt: progress.updatedAt.toISOString(),
    };
  }

  toTenantSummary(tenant: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string;
    customDomain?: string;
    isActive: boolean;
    createdAt?: Date;
  }): TenantSummary {
    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      customDomain: tenant.customDomain,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt?.toISOString(),
    };
  }
}
