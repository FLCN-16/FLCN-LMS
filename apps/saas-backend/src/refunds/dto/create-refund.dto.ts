import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * DTO for creating a refund request
 *
 * Validates:
 * - invoiceId: Must be a valid UUID
 * - amount: Must be a positive number (>0)
 * - reason: Must be a non-empty string
 * - refundMethod: Optional payment method for refund
 * - notes: Optional additional notes
 * - type: Optional refund type (full or partial)
 */
export class CreateRefundDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsOptional()
  @IsString()
  refundMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['full', 'partial'])
  type?: 'full' | 'partial';
}
