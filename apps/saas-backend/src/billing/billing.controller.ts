import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { RequiredScopes } from '../api-keys/decorators/required-scopes.decorator';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import { RateLimitApiKey } from '../rate-limiting/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limiting/guards/rate-limit.guard';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { StripeService } from './stripe.service';

@Controller({
  version: '1',
})
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * List all billing records
   * GET /api/v1/billing
   */
  @Get()
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async listAllBilling() {
    return this.billingService.findAll();
  }

  /**
   * Get billing record for a specific institute
   * GET /api/v1/billing/:instituteId
   */
  @Get(':instituteId')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getBillingByInstitute(@Param('instituteId') instituteId: string) {
    return this.billingService.findByInstitute(instituteId);
  }

  /**
   * Create a new billing record
   * POST /api/v1/billing
   * Body: { instituteId, stripeCustomerId?, plan? }
   */
  @Post()
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.CREATED)
  async createBilling(@Body() dto: CreateBillingDto) {
    const existing = await this.stripeService.getBillingByInstitute(
      dto.instituteId,
    );
    if (existing) {
      throw new BadRequestException(
        `Billing record already exists for institute: ${dto.instituteId}`,
      );
    }
    return this.billingService.create(dto);
  }

  /**
   * Update a billing record
   * PUT /api/v1/billing/:id
   */
  @Put(':id')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async updateBilling(@Param('id') id: string, @Body() dto: UpdateBillingDto) {
    return this.billingService.update(id, dto);
  }

  /**
   * Get subscription details for a billing record
   * GET /api/v1/billing/:id/subscription
   */
  @Get(':id/subscription')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getSubscriptionDetails(@Param('id') id: string) {
    const billing = await this.billingService.findByInstitute(id);
    if (!billing) {
      throw new NotFoundException(`Billing record not found: ${id}`);
    }

    return {
      billingId: billing.id,
      subscriptionId: billing.subscriptionId,
      status: billing.status,
      plan: billing.plan,
      currentPeriodStart: billing.currentPeriodStart,
      currentPeriodEnd: billing.currentPeriodEnd,
      nextBillingDate: billing.nextBillingDate,
      amountDue: billing.amountDue,
      currency: billing.currency,
    };
  }

  /**
   * Get invoice history for a billing record
   * GET /api/v1/billing/:id/invoices
   */
  @Get(':id/invoices')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getInvoices(@Param('id') id: string) {
    const billing = await this.billingService.findByInstitute(id);
    if (!billing) {
      throw new NotFoundException(`Billing record not found: ${id}`);
    }

    return {
      billingId: billing.id,
      invoices: billing.invoices || [],
      total: (billing.invoices || []).length,
    };
  }

  /**
   * Retry a failed payment
   * POST /api/v1/billing/:id/retry-payment
   */
  @Post(':id/retry-payment')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async retryFailedPayment(@Param('id') id: string) {
    await this.stripeService.retryFailedPayment(id);
    return {
      success: true,
      message: 'Payment retry initiated',
      billingId: id,
    };
  }

  /**
   * Cancel a subscription
   * POST /api/v1/billing/:id/cancel-subscription
   */
  @Post(':id/cancel-subscription')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Param('id') id: string) {
    await this.stripeService.cancelSubscription(id);
    return {
      success: true,
      message: 'Subscription cancellation initiated',
      billingId: id,
    };
  }

  /**
   * Update billing status
   * POST /api/v1/billing/:id/status
   * Body: { status: 'active' | 'past_due' | 'unpaid' | 'canceled' }
   */
  @Post(':id/status')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async updateBillingStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const validStatuses = ['active', 'past_due', 'unpaid', 'canceled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`,
      );
    }
    return this.stripeService.updateBillingStatus(id, status);
  }
}
