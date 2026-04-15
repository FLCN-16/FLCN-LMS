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

import { RequiredScopes } from '../api-keys/decorators/required-scopes.decorator';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import { RateLimitApiKey } from '../rate-limiting/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limiting/guards/rate-limit.guard';
import {
  CreateInvoiceDto,
  InvoiceResponseDto,
  InvoiceStatsDto,
  UpdateInvoiceDto,
} from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
@UseGuards(ApiKeyGuard, RateLimitGuard)
@RateLimitApiKey()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * Create a new invoice
   * POST /api/v1/invoices
   */
  @Post()
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.createInvoice(dto);
  }

  /**
   * Get invoice by ID
   * GET /api/v1/invoices/:id
   */
  @Get(':id')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getInvoice(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.getInvoiceById(id);
  }

  /**
   * Get all invoices for a billing record
   * GET /api/v1/invoices/billing/:billingId
   */
  @Get('billing/:billingId')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getInvoicesByBilling(
    @Param('billingId') billingId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.invoiceService.getInvoicesByBilling(
      billingId,
      pageNum,
      limitNum,
    );
  }

  /**
   * List all invoices with optional filtering
   * GET /api/v1/invoices
   */
  @Get()
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async listInvoices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.invoiceService.getAllInvoices(pageNum, limitNum, status);
  }

  /**
   * Update an invoice
   * PUT /api/v1/invoices/:id
   */
  @Put(':id')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async updateInvoice(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.updateInvoice(id, dto);
  }

  /**
   * Mark invoice as paid
   * POST /api/v1/invoices/:id/mark-paid
   */
  @Post(':id/mark-paid')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async markAsPaid(
    @Param('id') id: string,
    @Body('receiptId') receiptId?: string,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.markAsPaid(id, new Date(), receiptId);
  }

  /**
   * Record partial payment on invoice
   * POST /api/v1/invoices/:id/record-payment
   */
  @Post(':id/record-payment')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async recordPayment(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('receiptId') receiptId?: string,
  ): Promise<InvoiceResponseDto> {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    return this.invoiceService.recordPartialPayment(id, amount, receiptId);
  }

  /**
   * Mark invoice as sent
   * POST /api/v1/invoices/:id/mark-sent
   */
  @Post(':id/mark-sent')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async markAsSent(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.markAsSent(id);
  }

  /**
   * Cancel/void an invoice
   * POST /api/v1/invoices/:id/cancel
   */
  @Post(':id/cancel')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.OK)
  async cancelInvoice(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.invoiceService.cancelInvoice(id);
  }

  /**
   * Delete an invoice
   * DELETE /api/v1/invoices/:id
   */
  @Delete(':id')
  @RequiredScopes('write:customers')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    return this.invoiceService.deleteInvoice(id);
  }

  /**
   * Get invoice statistics for a billing record
   * GET /api/v1/invoices/:billingId/stats
   */
  @Get(':billingId/stats')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getInvoiceStats(
    @Param('billingId') billingId: string,
  ): Promise<InvoiceStatsDto> {
    return this.invoiceService.getInvoiceStats(billingId);
  }

  /**
   * Get unpaid invoices for a billing record
   * GET /api/v1/invoices/:billingId/unpaid
   */
  @Get(':billingId/unpaid')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getUnpaidInvoices(@Param('billingId') billingId: string) {
    return this.invoiceService.getUnpaidInvoicesByBilling(billingId);
  }

  /**
   * Get invoices by status
   * GET /api/v1/invoices/status/:status
   */
  @Get('status/:status')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getInvoicesByStatus(@Param('status') status: string) {
    const validStatuses = ['draft', 'open', 'paid', 'uncollectible', 'void'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`,
      );
    }
    return this.invoiceService.getInvoicesByStatus(status);
  }

  /**
   * Get overdue invoices
   * GET /api/v1/invoices/overdue
   */
  @Get('overdue/list')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getOverdueInvoices() {
    return this.invoiceService.getOverdueInvoices();
  }

  /**
   * Get revenue for a period
   * GET /api/v1/invoices/revenue?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get('revenue/period')
  @RequiredScopes('read:customers')
  @HttpCode(HttpStatus.OK)
  async getRevenueByPeriod(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    if (!startDateStr || !endDateStr) {
      throw new BadRequestException(
        'startDate and endDate query parameters are required',
      );
    }

    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      if (startDate > endDate) {
        throw new BadRequestException('startDate must be before endDate');
      }

      return this.invoiceService.getRevenueByPeriod(startDate, endDate);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid date parameters');
    }
  }
}
