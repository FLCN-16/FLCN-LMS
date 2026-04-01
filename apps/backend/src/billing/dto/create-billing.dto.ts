import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBillingDto {
  @IsUUID()
  @IsNotEmpty()
  instituteId!: string;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @IsNumber()
  @IsOptional()
  amountDue?: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
