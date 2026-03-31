import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionType, Difficulty } from '../entities/question.entity';

export class CreateOptionDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  order: number;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  subject: string;

  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  subtopic?: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  positiveMarks?: number;

  @IsOptional()
  @IsNumber()
  negativeMarks?: number;

  @IsOptional()
  @IsNumber()
  correctInteger?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
