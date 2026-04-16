import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * MASTER DATABASE ENTITY
 *
 * Stores SaaS subscription plans (e.g., Free, Pro, Enterprise).
 * These definitions are stored in the MASTER database only.
 */
@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  priceMonthly!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  priceYearly!: number;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  features!: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
