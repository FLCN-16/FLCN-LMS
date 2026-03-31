import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { ResponseStatus } from '@flcn-lms/types/attempts';

export class SaveResponseDto {
  @IsString()
  questionId: string;

  @IsString()
  attemptSectionId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedOptionIds?: string[];

  @IsOptional()
  @IsNumber()
  integerAnswer?: number;

  @IsOptional()
  @IsString()
  subjectiveAnswer?: string;

  @IsEnum(['UNATTEMPTED', 'ATTEMPTED', 'MARKED_REVIEW', 'ATTEMPTED_MARKED'])
  status: ResponseStatus;

  @IsOptional()
  @IsNumber()
  timeTakenSecs?: number;
}
