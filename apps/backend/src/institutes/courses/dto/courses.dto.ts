import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import type {
  CreateCategoryPayload,
  CreateCoursePayload,
  CreateEnrollmentPayload,
  CreateLessonPayload,
  CreateLivePollPayload,
  CreateLiveSessionPayload,
  CreateModulePayload,
  LiveSessionStatus,
  UpdateCategoryPayload,
  UpdateCoursePayload,
  UpdateLessonPayload,
  UpdateLiveSessionPayload,
  UpdateModulePayload,
  UpsertLessonProgressPayload,
} from '@flcn-lms/types/courses';
import type { CourseStatus, LessonType } from '@flcn-lms/types/test-series';

const COURSE_STATUSES = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;
const LESSON_TYPES = ['VIDEO', 'LIVE', 'PDF', 'QUIZ', 'DPP', 'TEXT'] as const;
const SESSION_STATUSES = ['scheduled', 'live', 'ended', 'cancelled'] as const;

export class CreateCategoryDto implements CreateCategoryPayload {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  seoImageUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCategoryDto implements UpdateCategoryPayload {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  seoImageUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateCourseDto implements Omit<
  CreateCoursePayload,
  'instructorId'
> {
  @IsString()
  categoryId!: string;

  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  seoImageUrl?: string;

  @IsOptional()
  @IsEnum(COURSE_STATUSES)
  status?: CourseStatus;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsNumber()
  validityDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];
}

export class UpdateCourseDto implements Omit<
  UpdateCoursePayload,
  'instructorId'
> {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  seoImageUrl?: string;

  @IsOptional()
  @IsEnum(COURSE_STATUSES)
  status?: CourseStatus;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsNumber()
  validityDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];
}

export class CreateModuleDto implements CreateModulePayload {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

export class UpdateModuleDto implements UpdateModulePayload {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

export class CreateLessonDto implements CreateLessonPayload {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsEnum(LESSON_TYPES)
  type!: LessonType;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  videoDurationSecs?: number;

  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsString()
  liveSessionId?: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  attachments?: { name: string; url: string }[];
}

export class UpdateLessonDto implements UpdateLessonPayload {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(LESSON_TYPES)
  type?: LessonType;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  videoDurationSecs?: number;

  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsString()
  liveSessionId?: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  attachments?: { name: string; url: string }[];
}

export class CreateEnrollmentDto implements CreateEnrollmentPayload {
  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class CreateLiveSessionDto implements Omit<
  CreateLiveSessionPayload,
  'instituteId' | 'instructorId'
> {
  @IsString()
  courseId!: string;

  @IsString()
  title!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @IsString()
  livekitRoomId?: string;

  @IsOptional()
  @IsString()
  hlsUrl?: string;

  @IsOptional()
  @IsEnum(SESSION_STATUSES)
  status?: LiveSessionStatus;

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;
}

export class UpdateLiveSessionDto implements UpdateLiveSessionPayload {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @IsOptional()
  @IsString()
  livekitRoomId?: string;

  @IsOptional()
  @IsString()
  hlsUrl?: string;

  @IsOptional()
  @IsEnum(SESSION_STATUSES)
  status?: LiveSessionStatus;

  @IsOptional()
  @IsNumber()
  maxParticipants?: number;
}

export class CreateLivePollDto implements CreateLivePollPayload {
  @IsString()
  question!: string;

  @IsArray()
  @IsString({ each: true })
  options!: string[];
}

export class UpsertLessonProgressDto implements UpsertLessonProgressPayload {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  watchedSecs?: number;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
