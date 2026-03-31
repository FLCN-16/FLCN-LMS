import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { TestType, ResultMode } from '@flcn-lms/types/test-series';

export class CreateTestSectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  order: number;

  @IsNumber()
  totalQuestions: number;

  @IsOptional()
  @IsNumber()
  maxAttemptable?: number;

  @IsOptional()
  @IsNumber()
  durationMins?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  questionIds?: string[];
}

export class CreateTestDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['FULL_LENGTH', 'SECTIONAL', 'CHAPTER_WISE', 'DPP', 'PREVIOUS_YEAR'])
  testType: TestType;

  @IsNumber()
  durationMins: number;

  @IsNumber()
  totalMarks: number;

  @IsNumber()
  totalQuestions: number;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  shuffleQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  shuffleOptions?: boolean;

  @IsOptional()
  @IsEnum(['INSTANT', 'AFTER_END_DATE', 'MANUAL'])
  showResultAfter?: ResultMode;

  @IsOptional()
  @IsNumber()
  attemptLimit?: number;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestSectionDto)
  sections?: CreateTestSectionDto[];
}
