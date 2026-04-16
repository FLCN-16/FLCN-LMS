import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InstituteBilling } from './institute-billing.entity';

/**
 * MASTER DATABASE ENTITY
 *
 * Stores payment invoices for billing records.
 * One invoice per payment transaction or billing period.
 *
 * This entity is stored in the MASTER database only.
 */
@Entity('invoices')
@Index('idx_invoices_billing', ['billingId'])
@Index('idx_invoices_stripe_id', ['stripeInvoiceId'])
@Index('idx_invoices_status', ['status'])
@Index('idx_invoices_date', ['invoiceDate'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to the billing record
   */
  @Column({ type: 'uuid' })
  billingId!: string;

  /**
   * Stripe invoice ID for reference
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeInvoiceId?: string;

  /**
   * Invoice number/reference
   * Example: INV-2024-0001
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  invoiceNumber?: string;

  /**
   * Invoice date
   */
  @Column({ type: 'date' })
  invoiceDate!: Date;

  /**
   * Period start date
   */
  @Column({ type: 'date' })
  periodStart!: Date;

  /**
   * Period end date
   */
  @Column({ type: 'date' })
  periodEnd!: Date;

  /**
   * Invoice amount (in cents to avoid floating point issues)
   * Precision: 10 digits total, 2 decimal places
   */
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  /**
   * Amount already paid (in cents)
   */
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  amountPaid!: number;

  /**
   * Amount still due (in cents)
   */
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  amountDue!: number;

  /**
   * Currency code (ISO 4217)
   * Example: USD, EUR, INR
   */
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  /**
   * Invoice status
   * draft: Not yet sent
   * open: Sent, awaiting payment
   * paid: Payment received
   * uncollectible: Cannot be collected
   * void: Cancelled
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: 'open',
  })
  status!: string;

  /**
   * Description or line items (JSON array)
   * Example: [
   *   { description: 'Premium Plan', quantity: 1, unitPrice: 99.99 },
   *   { description: 'Tax', quantity: 1, unitPrice: 9.99 }
   * ]
   */
  @Column({ type: 'jsonb', nullable: true })
  lineItems?: Record<string, unknown>[];

  /**
   * Payment method used
   * Example: credit_card, bank_transfer, etc.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  /**
   * Date when payment was received
   */
  @Column({ type: 'date', nullable: true })
  paidDate?: Date;

  /**
   * Due date for payment
   */
  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  /**
   * Notes or memo on invoice
   */
  @Column({ type: 'text', nullable: true })
  notes?: string;

  /**
   * Payment receipt/transaction ID
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  receiptId?: string;

  /**
   * Whether invoice was sent to customer
   */
  @Column({ type: 'boolean', default: false })
  isSent!: boolean;

  /**
   * Date when invoice was sent
   */
  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  /**
   * Timestamp when record was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Timestamp when record was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Relation to InstituteBilling
   * Allows: invoice.billing.instituteId, etc.
   */
  @ManyToOne(() => InstituteBilling, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'billingId' })
  billing?: InstituteBilling;
}
