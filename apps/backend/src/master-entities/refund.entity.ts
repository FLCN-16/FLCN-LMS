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

import { Invoice } from './invoice.entity';

/**
 * MASTER DATABASE ENTITY
 *
 * Stores refund transactions for invoices and payments.
 * Tracks partial and full refunds with status and reason.
 *
 * This entity is stored in the MASTER database only.
 */
@Entity('refunds')
@Index('idx_refunds_invoice', ['invoiceId'])
@Index('idx_refunds_status', ['status'])
@Index('idx_refunds_date', ['refundDate'])
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to the invoice being refunded
   */
  @Column({ type: 'uuid' })
  invoiceId!: string;

  /**
   * Refund amount (in same currency as invoice)
   * Precision: 10 digits total, 2 decimal places
   */
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  /**
   * Refund reason
   * Examples: customer_request, duplicate_charge, damaged_product, etc.
   */
  @Column({ type: 'varchar', length: 255 })
  reason!: string;

  /**
   * Refund status
   * pending: Initiated, awaiting processing
   * processing: Being processed by payment gateway
   * completed: Successfully refunded
   * failed: Refund failed, may retry
   * rejected: Refund rejected by payment gateway
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
  })
  status!: string;

  /**
   * Stripe refund ID for reference
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeRefundId?: string;

  /**
   * Original payment/transaction ID that was refunded
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  originTransactionId?: string;

  /**
   * Date when refund was processed
   */
  @Column({ type: 'date', nullable: true })
  refundDate?: Date;

  /**
   * Refund method
   * Examples: credit_card, bank_transfer, original_payment_method, etc.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  refundMethod?: string;

  /**
   * Error message if refund failed
   */
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  /**
   * Additional notes about the refund
   */
  @Column({ type: 'text', nullable: true })
  notes?: string;

  /**
   * Whether this is a partial or full refund
   * full: Entire invoice amount
   * partial: Only part of invoice amount
   */
  @Column({
    type: 'varchar',
    length: 20,
    default: 'full',
  })
  type!: string;

  /**
   * Number of retry attempts made
   */
  @Column({ type: 'integer', default: 0 })
  retryCount!: number;

  /**
   * Maximum retry attempts before giving up
   */
  @Column({ type: 'integer', default: 3 })
  maxRetries!: number;

  /**
   * Next retry date (for failed refunds)
   */
  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt?: Date;

  /**
   * Admin/user who initiated the refund
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  initiatedBy?: string;

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
   * Relation to Invoice
   * Allows: refund.invoice.amount, etc.
   */
  @ManyToOne(() => Invoice, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice?: Invoice;
}
