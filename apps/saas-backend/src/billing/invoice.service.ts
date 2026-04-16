import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InstituteBilling } from '../master-entities/institute-billing.entity';
import { Invoice } from '../master-entities/invoice.entity';
import { CreateInvoiceDto, LineItemDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice, 'master')
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InstituteBilling, 'master')
    private billingRepository: Repository<InstituteBilling>,
  ) {}

  /**
   * Create a new invoice
   */
  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const billing = await this.billingRepository.findOne({
      where: { id: dto.billingId },
    });

    if (!billing) {
      throw new NotFoundException(`Billing record not found: ${dto.billingId}`);
    }

    const lineItemsTotal = this.calculateLineItemsTotal(
      (dto.lineItems as any[]) || [],
    );
    const amountDue = lineItemsTotal - (dto.amountPaid || 0);

    const invoice = this.invoiceRepository.create({
      ...dto,
      amount: lineItemsTotal,
      amountDue: Math.max(0, amountDue),
      status: dto.status || 'open',
      currency: dto.currency || 'USD',
    } as any);

    const saved = (await this.invoiceRepository.save(
      invoice,
    )) as unknown as Invoice;
    this.logger.log(
      `Invoice created: ${saved.id} for billing: ${dto.billingId}`,
    );
    return saved;
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['billing'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice not found: ${id}`);
    }

    return invoice;
  }

  /**
   * Get all invoices for a billing record
   */
  async getInvoicesByBilling(
    billingId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Invoice[]; total: number }> {
    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: { billingId },
      relations: ['billing'],
      order: { invoiceDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: invoices, total };
  }

  /**
   * Get all invoices with optional filtering
   */
  async getAllInvoices(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ data: Invoice[]; total: number }> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (status) {
      query.where('invoice.status = :status', { status });
    }

    const [invoices, total] = await query
      .leftJoinAndSelect('invoice.billing', 'billing')
      .orderBy('invoice.invoiceDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data: invoices, total };
  }

  /**
   * Update invoice
   */
  async updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (dto.status === 'paid' && !invoice.paidDate && !dto.paidDate) {
      throw new BadRequestException(
        'paidDate is required when marking invoice as paid',
      );
    }

    if (dto.lineItems) {
      const lineItemsTotal = this.calculateLineItemsTotal(dto.lineItems);
      invoice.amount = lineItemsTotal;
      invoice.amountDue = Math.max(
        0,
        lineItemsTotal - (invoice.amountPaid || 0),
      );
    }

    Object.assign(invoice, dto);
    const updated = await this.invoiceRepository.save(invoice);
    this.logger.log(`Invoice updated: ${id}`);
    return updated;
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(
    id: string,
    paidDate?: Date,
    receiptId?: string,
  ): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice is already marked as paid');
    }

    invoice.status = 'paid';
    invoice.paidDate = paidDate || new Date();
    invoice.amountPaid = invoice.amount;
    invoice.amountDue = 0;

    if (receiptId) {
      invoice.receiptId = receiptId;
    }

    const updated = await this.invoiceRepository.save(invoice);
    this.logger.log(`Invoice marked as paid: ${id}`);
    return updated;
  }

  /**
   * Mark invoice as sent
   */
  async markAsSent(id: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    invoice.isSent = true;
    invoice.sentAt = new Date();

    const updated = await this.invoiceRepository.save(invoice);
    this.logger.log(`Invoice marked as sent: ${id}`);
    return updated;
  }

  /**
   * Cancel invoice
   */
  async cancelInvoice(id: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === 'void') {
      throw new BadRequestException('Invoice is already cancelled');
    }

    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    invoice.status = 'void';
    const updated = await this.invoiceRepository.save(invoice);
    this.logger.log(`Invoice cancelled: ${id}`);
    return updated;
  }

  /**
   * Get invoice statistics for a billing record
   */
  async getInvoiceStats(billingId: string): Promise<{
    totalInvoices: number;
    totalAmount: number;
    totalPaid: number;
    totalDue: number;
    paidInvoices: number;
    overdueInvoices: number;
  }> {
    const invoices = await this.invoiceRepository.find({
      where: { billingId },
    });

    const now = new Date();
    const stats = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      paidInvoices: 0,
      overdueInvoices: 0,
    };

    invoices.forEach((invoice) => {
      stats.totalAmount += Number(invoice.amount);
      stats.totalPaid += Number(invoice.amountPaid);
      stats.totalDue += Number(invoice.amountDue);

      if (invoice.status === 'paid') {
        stats.paidInvoices++;
      }

      if (
        invoice.status === 'open' &&
        invoice.dueDate &&
        invoice.dueDate < now
      ) {
        stats.overdueInvoices++;
      }
    });

    return stats;
  }

  /**
   * Delete invoice
   */
  async deleteInvoice(id: string): Promise<void> {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot delete a paid invoice');
    }

    await this.invoiceRepository.delete(id);
    this.logger.log(`Invoice deleted: ${id}`);
  }

  /**
   * Calculate total from line items
   */
  private calculateLineItemsTotal(
    lineItems: (LineItemDto | Record<string, unknown>)[],
  ): number {
    if (!lineItems || lineItems.length === 0) {
      return 0;
    }

    return lineItems.reduce((total, item: any) => {
      const quantity = item.quantity || 1;
      const unitPrice = item.unitPrice || 0;
      return total + quantity * unitPrice;
    }, 0);
  }

  /**
   * Get invoices by status
   */
  async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { status },
      relations: ['billing'],
      order: { invoiceDate: 'DESC' },
    });
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(): Promise<Invoice[]> {
    const now = new Date();
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.billing', 'billing')
      .where('invoice.status = :status', { status: 'open' })
      .andWhere('invoice.dueDate < :now', { now })
      .orderBy('invoice.dueDate', 'ASC')
      .getMany();
  }

  /**
   * Get unpaid invoices for a billing record
   */
  async getUnpaidInvoicesByBilling(billingId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { billingId, status: 'open' },
      order: { invoiceDate: 'DESC' },
    });
  }

  /**
   * Record partial payment
   */
  async recordPartialPayment(
    id: string,
    amount: number,
    receiptId?: string,
  ): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === 'paid') {
      throw new BadRequestException('Invoice is already paid');
    }

    if (invoice.status === 'void') {
      throw new BadRequestException(
        'Cannot record payment on cancelled invoice',
      );
    }

    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    invoice.amountPaid = Number(invoice.amountPaid) + amount;
    invoice.amountDue = Math.max(
      0,
      Number(invoice.amount) - Number(invoice.amountPaid),
    );

    if (invoice.amountDue === 0) {
      invoice.status = 'paid';
      invoice.paidDate = new Date();
    }

    if (receiptId) {
      invoice.receiptId = receiptId;
    }

    const updated = await this.invoiceRepository.save(invoice);
    this.logger.log(
      `Partial payment recorded on invoice: ${id}, amount: ${amount}`,
    );
    return updated;
  }

  /**
   * Bulk update invoice status
   */
  async bulkUpdateStatus(ids: string[], status: string): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder()
      .update(Invoice)
      .set({ status })
      .where('id IN (:...ids)', { ids })
      .execute();

    this.logger.log(`Updated ${result.affected} invoices to status: ${status}`);
    return result.affected || 0;
  }

  /**
   * Get revenue for a period
   */
  async getRevenueByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalRevenue: number; invoicesCount: number }> {
    const invoices = await this.invoiceRepository.find({
      where: {
        status: 'paid',
      },
    });

    const filtered = invoices.filter(
      (inv) =>
        inv.paidDate && inv.paidDate >= startDate && inv.paidDate <= endDate,
    );

    const totalRevenue = filtered.reduce(
      (sum, inv) => sum + Number(inv.amountPaid),
      0,
    );

    return {
      totalRevenue,
      invoicesCount: filtered.length,
    };
  }
}
