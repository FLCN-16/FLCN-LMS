import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { LineItemDto } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  invoiceDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  periodStart?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  periodEnd?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  @IsOptional()
  lineItems?: LineItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  amountPaid?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(['draft', 'open', 'paid', 'uncollectible', 'void'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  paidDate?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  receiptId?: string;
}
