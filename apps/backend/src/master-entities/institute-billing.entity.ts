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

import { Institute } from './institute.entity';

/**
 * MASTER DATABASE ENTITY
 *
 * Stores subscription and billing information for each institute.
 * One billing record per institute.
 *
 * This entity is stored in the MASTER database only.
 */
@Entity('billing')
@Index('idx_billing_institute', ['instituteId'])
@Index('idx_billing_status', ['status'])
export class InstituteBilling {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to the institute
   * Unique constraint: one billing record per institute
   */
  @Column({ type: 'uuid', unique: true })
  instituteId!: string;

  /**
   * Stripe customer ID for payment processing
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string;

  /**
   * Stripe subscription ID
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  subscriptionId?: string;

  /**
   * Current subscription plan: free, pro, enterprise
   * Matches the plan in institutes table
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  plan?: string;

  /**
   * Subscription status
   * active: currently paying
   * past_due: payment failed, retry pending
   * unpaid: payment failed, subscription suspended
   * canceled: subscription cancelled
   */
  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status!: string;

  /**
   * Start date of current billing period
   */
  @Column({ type: 'date', nullable: true })
  currentPeriodStart?: Date;

  /**
   * End date of current billing period
   */
  @Column({ type: 'date', nullable: true })
  currentPeriodEnd?: Date;

  /**
   * Next billing date (when the subscription will renew)
   */
  @Column({ type: 'date', nullable: true })
  nextBillingDate?: Date;

  /**
   * Amount due (if any)
   * Precision: 10 digits total, 2 decimal places
   */
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  amountDue?: number;

  /**
   * Currency code (ISO 4217)
   * Examples: USD, EUR, INR
   */
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  /**
   * Payment method information (JSON)
   * Stores encrypted payment method details
   * Example: { type: 'card', last4: '4242', expMonth: 12, expYear: 2025 }
   */
  @Column({ type: 'jsonb', nullable: true })
  paymentMethod?: Record<string, unknown>;

  /**
   * Invoice history (JSON array)
   * Stores past invoices for record keeping
   * Example: [{ id: 'inv_123', date: '2024-01-01', amount: 99.99, status: 'paid' }]
   */
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
  invoices?: Record<string, unknown>[];

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
   * Relation to Institute
   * Allows: billing.institute.name, etc.
   */
  @ManyToOne(() => Institute, (institute) => institute.billing, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'instituteId' })
  institute?: Institute;
}
