import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { Institute } from './institute.entity';
import { SuperAdmin } from './super-admin.entity';

/**
 * MASTER DATABASE ENTITY
 *
 * Stores license information for institutes.
 * Tracks license keys, validity, features, and expiry dates.
 * These definitions are stored in the MASTER database only.
 */
@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  licenseKey!: string;

  @Column({ type: 'varchar', length: 255 })
  organizationName!: string;

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'invalid', 'suspended', 'pending'],
    default: 'pending',
  })
  status!: 'active' | 'expired' | 'invalid' | 'suspended' | 'pending';

  @Column({ type: 'boolean', default: false })
  isValid!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: Date;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  features!: Array<{
    name: string;
    enabled: boolean;
    limit?: number;
  }>;

  @Column({ type: 'bigint', default: 0 })
  maxUsers!: number;

  @Column({ type: 'uuid', nullable: true })
  planId?: string;

  @ManyToOne(() => Plan, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'planId' })
  plan?: Plan;

  @Column({ type: 'uuid', nullable: true })
  instituteId?: string;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instituteId' })
  institute?: Institute;

  @Column({ type: 'uuid', nullable: true })
  issuedById?: string;

  @ManyToOne(() => SuperAdmin, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'issuedById' })
  issuedBy?: SuperAdmin;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastVerifiedAt?: Date;

  @Column({ type: 'bigint', default: 0 })
  verificationCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
