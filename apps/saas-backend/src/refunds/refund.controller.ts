import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RequiredScopes } from '../api-keys/decorators/required-scopes.decorator';
import { CurrentUser } from '../licenses/decorators/current-user.decorator';
import { RateLimitGuard } from '../rate-limiting/guards/rate-limit.guard';
import { CreateRefundDto } from './dto/create-refund.dto';
import { RefundService } from './refund.service';

@Controller({
  version: '1',
})
@UseGuards(AuthGuard('jwt'), RateLimitGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  /**
   * Create a new refund request
   * POST /api/v1/refunds
   *
   * Requires: write:customers scope
   * The initiatedBy field is automatically populated from the authenticated user
   *
   * Request body:
   * - invoiceId: UUID of the invoice to refund
   * - amount: Refund amount (same currency as invoice)
   * - reason: Reason for the refund (customer_request, duplicate_charge, etc.)
   * - refundMethod: Payment method for refund (optional, defaults to original_payment_method)
   * - notes: Additional notes about the refund (optional)
   * - type: Either 'full' or 'partial' (optional, defaults to 'full')
   *
   * Returns: Created refund details
   */
  @Post()
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.CREATED)
  async createRefund(
    @Body() dto: CreateRefundDto,
    @CurrentUser() initiatedBy?: string,
  ) {
    if (!initiatedBy) {
      throw new BadRequestException(
        'User authentication is required to initiate a refund',
      );
    }

    return this.refundService.createRefund({
      ...dto,
      initiatedBy,
    });
  }

  /**
   * Get refund by ID
   * GET /api/v1/refunds/:id
   *
   * Requires: read:customers scope
   */
  @Get(':id')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRefund(@Param('id') id: string) {
    return this.refundService.getRefundById(id);
  }

  /**
   * Get refunds for an invoice with pagination
   * GET /api/v1/refunds/invoice/:invoiceId
   *
   * Query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   */
  @Get('invoice/:invoiceId')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRefundsByInvoice(
    @Param('invoiceId') invoiceId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.refundService.getRefundsByInvoice(invoiceId, pageNum, limitNum);
  }

  /**
   * Get refunds by status
   * GET /api/v1/refunds/status/:status
   *
   * Path parameters:
   * - status: One of pending, processing, completed, failed, rejected
   */
  @Get('status/:status')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRefundsByStatus(@Param('status') status: string) {
    const validStatuses = [
      'pending',
      'processing',
      'completed',
      'failed',
      'rejected',
    ];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`,
      );
    }
    return this.refundService.getRefundsByStatus(status);
  }

  /**
   * List all refunds with optional filtering
   * GET /api/v1/refunds
   *
   * Query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - status: Filter by refund status (optional)
   */
  @Get()
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async listRefunds(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.refundService.getAllRefunds(pageNum, limitNum, status);
  }

  /**
   * Process a refund (transition to processing/completed state)
   * POST /api/v1/refunds/:id/process
   *
   * Path parameters:
   * - id: Refund ID
   *
   * Requires: write:customers scope
   */
  @Post(':id/process')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async processRefund(@Param('id') id: string) {
    return this.refundService.processRefund(id);
  }

  /**
   * Approve and process a pending refund
   * POST /api/v1/refunds/:id/approve
   *
   * Path parameters:
   * - id: Refund ID
   *
   * Requires: write:customers scope
   */
  @Post(':id/approve')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async approveRefund(@Param('id') id: string) {
    return this.refundService.approveRefund(id);
  }

  /**
   * Retry a failed refund
   * POST /api/v1/refunds/:id/retry
   *
   * Path parameters:
   * - id: Refund ID
   *
   * Requires: write:customers scope
   * Only failed refunds with retry attempts remaining can be retried
   */
  @Post(':id/retry')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async retryRefund(@Param('id') id: string) {
    return this.refundService.retryRefund(id);
  }

  /**
   * Reject a refund
   * POST /api/v1/refunds/:id/reject
   *
   * Path parameters:
   * - id: Refund ID
   *
   * Request body:
   * - reason: Rejection reason (required)
   *
   * Requires: write:customers scope
   */
  @Post(':id/reject')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async rejectRefund(@Param('id') id: string, @Body('reason') reason: string) {
    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }
    return this.refundService.rejectRefund(id, reason);
  }

  /**
   * Cancel a pending refund
   * DELETE /api/v1/refunds/:id
   *
   * Path parameters:
   * - id: Refund ID
   *
   * Requires: write:customers scope
   * Only pending refunds can be cancelled
   */
  @Delete(':id')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async cancelRefund(@Param('id') id: string) {
    return this.refundService.cancelRefund(id);
  }

  /**
   * Get refund statistics
   * GET /api/v1/refunds/stats/summary
   *
   * Requires: read:customers scope
   * Returns aggregate refund metrics
   */
  @Get('stats/summary')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRefundStats() {
    return this.refundService.getRefundStats();
  }

  /**
   * Get pending refunds ready for batch processing
   * GET /api/v1/refunds/pending/list
   *
   * Requires: read:customers scope
   */
  @Get('pending/list')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getPendingRefunds() {
    return this.refundService.getPendingRefunds();
  }

  /**
   * Get refunds ready for retry
   * GET /api/v1/refunds/ready-retry/list
   *
   * Requires: read:customers scope
   * Returns failed refunds that have retry attempts remaining and are past nextRetryAt
   */
  @Get('ready-retry/list')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRefundsReadyForRetry() {
    return this.refundService.getRefundsReadyForRetry();
  }

  /**
   * Process all pending refunds in batch
   * POST /api/v1/refunds/batch/process
   *
   * Requires: write:customers scope
   * Attempts to process all pending refunds and returns summary
   */
  @Post('batch/process')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async processPendingRefunds() {
    return this.refundService.processPendingRefunds();
  }

  /**
   * Retry all failed refunds in batch
   * POST /api/v1/refunds/batch/retry
   *
   * Requires: write:customers scope
   * Attempts to retry all failed refunds that are ready and returns summary
   */
  @Post('batch/retry')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async retryFailedRefunds() {
    return this.refundService.retryFailedRefunds();
  }

  /**
   * Get total refunded amount for an invoice
   * GET /api/v1/refunds/invoice/:invoiceId/total-refunded
   *
   * Path parameters:
   * - invoiceId: Invoice UUID
   *
   * Requires: read:customers scope
   * Returns the sum of all completed refunds for the invoice
   */
  @Get('invoice/:invoiceId/total-refunded')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getTotalRefundedAmount(@Param('invoiceId') invoiceId: string) {
    const amount = await this.refundService.getTotalRefundedAmount(invoiceId);
    return { invoiceId, totalRefunded: amount };
  }

  /**
   * Check if invoice can be fully refunded
   * GET /api/v1/refunds/invoice/:invoiceId/can-refund
   *
   * Path parameters:
   * - invoiceId: Invoice UUID
   *
   * Requires: read:customers scope
   */
  @Get('invoice/:invoiceId/can-refund')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async canFullyRefund(@Param('invoiceId') invoiceId: string) {
    const canRefund = await this.refundService.canFullyRefund(invoiceId);
    const remaining =
      await this.refundService.getRemainingRefundableAmount(invoiceId);
    return { invoiceId, canRefund, remainingRefundable: remaining };
  }

  /**
   * Get remaining refundable amount for an invoice
   * GET /api/v1/refunds/invoice/:invoiceId/remaining-refundable
   *
   * Path parameters:
   * - invoiceId: Invoice UUID
   *
   * Requires: read:customers scope
   */
  @Get('invoice/:invoiceId/remaining-refundable')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRemainingRefundableAmount(@Param('invoiceId') invoiceId: string) {
    const amount =
      await this.refundService.getRemainingRefundableAmount(invoiceId);
    return { invoiceId, remainingRefundable: amount };
  }
}
