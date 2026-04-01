import {
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  priceMonthly!: number;

  @IsNumber()
  priceYearly!: number;

  @IsObject()
  @IsOptional()
  features?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
