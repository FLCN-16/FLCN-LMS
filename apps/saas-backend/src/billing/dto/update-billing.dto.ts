import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

import { CreateBillingDto } from './create-billing.dto';

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  @IsString()
  @IsOptional()
  status?: string;
}
