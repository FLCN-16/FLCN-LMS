import { IsOptional, IsString } from 'class-validator';

export class StartAttemptDto {
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
