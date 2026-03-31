import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ResponseStatus } from '../entities/question-response.entity';

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

  @IsEnum(ResponseStatus)
  status: ResponseStatus;

  @IsOptional()
  @IsNumber()
  timeTakenSecs?: number;
}
