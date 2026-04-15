import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from '../master-entities/invoice.entity';
import { Refund } from '../master-entities/refund.entity';

interface CreateRefundDto {
  invoiceId: string;
  amount: number;
  reason: string;
  refundMethod?: string;
  notes?: string;
  initiatedBy?: string;
  type?: 'full' | 'partial';
}

interface UpdateRefundDto {
  status?: string;
  notes?: string;
  refundMethod?: string;
}

@Injectable()
export class RefundService {
  private readonly logger = new Logger(RefundService.name);

  constructor(
    @InjectRepository(Refund, 'master')
    private refundRepository: Repository<Refund>,
    @InjectRepository(Invoice, 'master')
    private invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Create a new refund request
   */
  async createRefund(dto: CreateRefundDto): Promise<Refund> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: dto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice not found: ${dto.invoiceId}`);
    }

    if (invoice.status === 'void') {
      throw new BadRequestException('Cannot refund a cancelled invoice');
    }

    const refundType = dto.type || 'full';
    const maxRefundAmount = Number(invoice.amountPaid);

    if (dto.amount <= 0) {
      throw new BadRequestException('Refund amount must be greater than 0');
    }

    if (dto.amount > maxRefundAmount) {
      throw new BadRequestException(
        `Refund amount cannot exceed paid amount: ${maxRefundAmount}`,
      );
    }

    const refund = this.refundRepository.create({
      invoiceId: dto.invoiceId,
      amount: dto.amount,
      reason: dto.reason,
      type: refundType,
      status: 'pending',
      refundMethod: dto.refundMethod || 'original_payment_method',
      notes: dto.notes,
      initiatedBy: dto.initiatedBy,
      retryCount: 0,
      maxRetries: 3,
    });

    const saved = await this.refundRepository.save(refund);
    this.logger.log(
      `Refund created: ${saved.id} for invoice: ${dto.invoiceId}, amount: ${dto.amount}`,
    );
    return saved;
  }

  /**
   * Get refund by ID
   */
  async getRefundById(id: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });

    if (!refund) {
      throw new NotFoundException(`Refund not found: ${id}`);
    }

    return refund;
  }

  /**
   * Get all refunds for an invoice
   */
  async getRefundsByInvoice(
    invoiceId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Refund[]; total: number }> {
    const [refunds, total] = await this.refundRepository.findAndCount({
      where: { invoiceId },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: refunds, total };
  }

  /**
   * Get refunds by status
   */
  async getRefundsByStatus(status: string): Promise<Refund[]> {
    return this.refundRepository.find({
      where: { status },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all refunds with pagination
   */
  async getAllRefunds(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ data: Refund[]; total: number }> {
    const query = this.refundRepository.createQueryBuilder('refund');

    if (status) {
      query.where('refund.status = :status', { status });
    }

    const [refunds, total] = await query
      .leftJoinAndSelect('refund.invoice', 'invoice')
      .orderBy('refund.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data: refunds, total };
  }

  /**
   * Update refund status
   */
  async updateRefund(id: string, dto: UpdateRefundDto): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (dto.status) {
      refund.status = dto.status;

      if (dto.status === 'completed') {
        refund.refundDate = new Date();
      }
    }

    if (dto.notes !== undefined) {
      refund.notes = dto.notes;
    }

    if (dto.refundMethod) {
      refund.refundMethod = dto.refundMethod;
    }

    const updated = await this.refundRepository.save(refund);
    this.logger.log(`Refund updated: ${id}, new status: ${refund.status}`);
    return updated;
  }

  /**
   * Process a refund (simulate Stripe processing)
   */
  async processRefund(id: string): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (refund.status === 'completed') {
      throw new BadRequestException('Refund is already completed');
    }

    if (refund.status === 'processing') {
      throw new BadRequestException('Refund is already being processed');
    }

    refund.status = 'processing';
    await this.refundRepository.save(refund);

    // Simulate Stripe API call for processing
    // In real implementation, call Stripe API here
    try {
      // Simulate successful processing
      const isSuccessful = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccessful) {
        refund.status = 'completed';
        refund.refundDate = new Date();
        refund.stripeRefundId = `re_${Date.now()}`;
      } else {
        throw new Error('Refund processing failed');
      }
    } catch (error) {
      refund.status = 'failed';
      refund.errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Schedule retry if retries remaining
      if (refund.retryCount < refund.maxRetries) {
        refund.retryCount++;
        refund.nextRetryAt = new Date(Date.now() + 60 * 60 * 1000); // Retry in 1 hour
        this.logger.warn(
          `Refund processing failed, scheduled for retry: ${id}, attempt ${refund.retryCount}`,
        );
      } else {
        this.logger.error(
          `Refund processing failed and max retries exceeded: ${id}`,
        );
      }
    }

    return this.refundRepository.save(refund);
  }

  /**
   * Retry failed refund
   */
  async retryRefund(id: string): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (refund.status === 'completed') {
      throw new BadRequestException('Cannot retry a completed refund');
    }

    if (refund.status === 'rejected') {
      throw new BadRequestException('Cannot retry a rejected refund');
    }

    if (refund.retryCount >= refund.maxRetries) {
      throw new BadRequestException('Maximum retry attempts reached');
    }

    refund.status = 'pending';
    refund.nextRetryAt = undefined;
    await this.refundRepository.save(refund);

    return this.processRefund(id);
  }

  /**
   * Approve refund
   */
  async approveRefund(id: string): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (refund.status !== 'pending') {
      throw new BadRequestException(
        `Cannot approve refund with status: ${refund.status}`,
      );
    }

    return this.processRefund(id);
  }

  /**
   * Reject refund
   */
  async rejectRefund(id: string, reason: string): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (refund.status !== 'pending' && refund.status !== 'processing') {
      throw new BadRequestException(
        `Cannot reject refund with status: ${refund.status}`,
      );
    }

    refund.status = 'rejected';
    refund.errorMessage = reason;
    const updated = await this.refundRepository.save(refund);
    this.logger.log(`Refund rejected: ${id}, reason: ${reason}`);
    return updated;
  }

  /**
   * Get refund statistics
   */
  async getRefundStats(): Promise<{
    totalRefunds: number;
    totalAmount: number;
    completedRefunds: number;
    completedAmount: number;
    pendingRefunds: number;
    failedRefunds: number;
  }> {
    const refunds = await this.refundRepository.find();

    const stats = {
      totalRefunds: refunds.length,
      totalAmount: 0,
      completedRefunds: 0,
      completedAmount: 0,
      pendingRefunds: 0,
      failedRefunds: 0,
    };

    refunds.forEach((refund) => {
      stats.totalAmount += Number(refund.amount);

      if (refund.status === 'completed') {
        stats.completedRefunds++;
        stats.completedAmount += Number(refund.amount);
      } else if (
        refund.status === 'pending' ||
        refund.status === 'processing'
      ) {
        stats.pendingRefunds++;
      } else if (refund.status === 'failed') {
        stats.failedRefunds++;
      }
    });

    return stats;
  }

  /**
   * Get pending refunds for batch processing
   */
  async getPendingRefunds(): Promise<Refund[]> {
    return this.refundRepository.find({
      where: { status: 'pending' },
      relations: ['invoice'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Get refunds ready for retry
   */
  async getRefundsReadyForRetry(): Promise<Refund[]> {
    const now = new Date();

    return this.refundRepository
      .createQueryBuilder('refund')
      .leftJoinAndSelect('refund.invoice', 'invoice')
      .where('refund.status = :status', { status: 'failed' })
      .andWhere('refund.retryCount < refund.maxRetries', {})
      .andWhere('refund.nextRetryAt <= :now', { now })
      .orderBy('refund.nextRetryAt', 'ASC')
      .getMany();
  }

  /**
   * Process all pending refunds
   */
  async processPendingRefunds(): Promise<{
    processed: number;
    successful: number;
  }> {
    const pendingRefunds = await this.getPendingRefunds();

    let successful = 0;

    for (const refund of pendingRefunds) {
      try {
        await this.processRefund(refund.id);
        successful++;
      } catch (error) {
        this.logger.error(`Error processing refund ${refund.id}:`, error);
      }
    }

    this.logger.log(
      `Processed ${pendingRefunds.length} pending refunds, ${successful} successful`,
    );
    return { processed: pendingRefunds.length, successful };
  }

  /**
   * Retry all failed refunds that are ready
   */
  async retryFailedRefunds(): Promise<{ retried: number; successful: number }> {
    const failedRefunds = await this.getRefundsReadyForRetry();

    let successful = 0;

    for (const refund of failedRefunds) {
      try {
        await this.retryRefund(refund.id);
        successful++;
      } catch (error) {
        this.logger.error(`Error retrying refund ${refund.id}:`, error);
      }
    }

    this.logger.log(
      `Retried ${failedRefunds.length} failed refunds, ${successful} successful`,
    );
    return { retried: failedRefunds.length, successful };
  }

  /**
   * Cancel a pending refund
   */
  async cancelRefund(id: string): Promise<Refund> {
    const refund = await this.getRefundById(id);

    if (refund.status !== 'pending') {
      throw new BadRequestException(
        `Cannot cancel refund with status: ${refund.status}`,
      );
    }

    refund.status = 'rejected';
    refund.errorMessage = 'Cancelled by user';
    const updated = await this.refundRepository.save(refund);
    this.logger.log(`Refund cancelled: ${id}`);
    return updated;
  }

  /**
   * Get total refunded amount for an invoice
   */
  async getTotalRefundedAmount(invoiceId: string): Promise<number> {
    const refunds = await this.refundRepository.find({
      where: { invoiceId, status: 'completed' },
    });

    return refunds.reduce((sum, r) => sum + Number(r.amount), 0);
  }

  /**
   * Check if invoice can be fully refunded
   */
  async canFullyRefund(invoiceId: string): Promise<boolean> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice not found: ${invoiceId}`);
    }

    const totalRefunded = await this.getTotalRefundedAmount(invoiceId);
    return totalRefunded < Number(invoice.amountPaid);
  }

  /**
   * Get remaining refundable amount for an invoice
   */
  async getRemainingRefundableAmount(invoiceId: string): Promise<number> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice not found: ${invoiceId}`);
    }

    const totalRefunded = await this.getTotalRefundedAmount(invoiceId);
    return Math.max(0, Number(invoice.amountPaid) - totalRefunded);
  }
}
