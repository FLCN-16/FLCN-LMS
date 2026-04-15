import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class LineItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  quantity: number = 1;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  billingId!: string;

  @IsString()
  @IsOptional()
  stripeInvoiceId?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  invoiceDate!: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodStart!: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodEnd!: Date;

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

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  receiptId?: string;
}

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

export class InvoiceResponseDto {
  id!: string;
  billingId!: string;
  invoiceNumber?: string;
  invoiceDate!: Date;
  periodStart!: Date;
  periodEnd!: Date;
  amount!: number;
  amountPaid!: number;
  amountDue!: number;
  currency!: string;
  status!: string;
  lineItems?: Record<string, unknown>[];
  paymentMethod?: string;
  paidDate?: Date;
  dueDate?: Date;
  notes?: string;
  receiptId?: string;
  isSent!: boolean;
  sentAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class InvoiceStatsDto {
  totalInvoices!: number;
  totalAmount!: number;
  totalPaid!: number;
  totalDue!: number;
  paidInvoices!: number;
  overdueInvoices!: number;
}
