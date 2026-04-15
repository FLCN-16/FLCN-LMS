import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateSuperAdminDto } from './create-super-admin.dto';

export class UpdateSuperAdminDto extends PartialType(CreateSuperAdminDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
