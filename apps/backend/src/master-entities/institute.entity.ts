import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiKey } from './api-key.entity';
import { AuditLog } from './audit-log.entity';
import { Branch } from './branch.entity';
import { FeatureFlag } from './feature-flag.entity';
import { InstituteBilling } from './institute-billing.entity';
import { InstituteDatabase } from './institute-database.entity';
import { Plan } from './plan.entity';

/**
 * MASTER DATABASE ENTITY: Institute
 *
 * Represents an educational institute/organization in the FLCN-LMS platform.
 * All institute metadata is stored in the MASTER database.
 * Each institute has their own separate database for all their data.
 *
 * Example records:
 * - id: "uuid-1", slug: "pw-live", name: "Physics Wallah"
 * - id: "uuid-2", slug: "adda247", name: "ADDA247"
 * - id: "uuid-3", slug: "flcn-org", name: "FLCN"
 */
@Entity('institutes')
@Index('idx_institutes_slug', ['slug'])
@Index('idx_institutes_domain', ['customDomain'])
@Index('idx_institutes_active', ['isActive'])
export class Institute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Unique slug identifier for the institute
   * Used in subdomain routing: pw-live.example.com
   * Format: lowercase alphanumeric with hyphens
   * Examples: 'pw-live', 'adda247', 'flcn-org'
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  slug!: string;

  /**
   * Human-readable name of the institute/organization
   * Examples: 'Physics Wallah', 'ADDA247', 'FLCN'
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  /**
   * Logo URL for the institute
   * Points to CDN or cloud storage
   */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  logoUrl?: string;

  /**
   * Custom domain for white-label/branded access
   * Example: 'www.pw.com', 'www.adda247.com'
   * When set, users can access via custom domain instead of subdomain
   * This is optional and unique across all institutes
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  customDomain?: string;

  /**
   * Foreign key to the subscription plan
   */
  @Column({ type: 'uuid', nullable: true })
  planId?: string;

  /**
   * Subscription plan tier
   * Controls feature access and usage limits
   */
  @ManyToOne(() => Plan, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'planId' })
  subscriptionPlan?: Plan;

  /**
   * Whether this institute is active/enabled
   * Inactive institutes cannot make API requests
   * Set to false to suspend an institute without deleting it
   */
  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive!: boolean;

  /**
   * Custom settings and configuration for this institute (JSON)
   * Can store:
   * - Theme preferences
   * - Feature flags
   * - Custom branding
   * - API configuration
   * - Any other institute-specific settings
   */
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  settings?: Record<string, any>;

  /**
   * Maximum number of users allowed for this institute
   * Based on subscription plan
   * Enforced at application level
   */
  @Column({
    type: 'integer',
    default: 100,
    nullable: false,
  })
  maxUsers!: number;

  /**
   * Maximum number of courses allowed for this institute
   * Based on subscription plan
   */
  @Column({
    type: 'integer',
    default: 50,
    nullable: false,
  })
  maxCourses!: number;

  /**
   * Maximum storage in GB allowed for this institute
   * Based on subscription plan
   */
  @Column({
    type: 'integer',
    default: 10,
    nullable: false,
  })
  maxStorageGb!: number;

  /**
   * Timestamp when this institute was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Timestamp when this institute was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  // ========== Relations ==========

  /**
   * Relation to InstituteDatabase
   * Each institute has exactly one database configuration
   * Eagerly loaded for quick access during request routing
   */
  @OneToMany(() => InstituteDatabase, (database) => database.institute, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  databases!: InstituteDatabase[];

  /**
   * Relation to Branch
   * Each institute can have multiple branches (locations/sub-organizations)
   */
  @OneToMany(() => Branch, (branch) => branch.institute, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  branches!: Branch[];

  /**
   * Relation to Billing
   * Each institute has one billing record
   */
  @OneToMany(() => InstituteBilling, (billing) => billing.institute, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  billing!: InstituteBilling[];

  /**
   * Audit logs for this institute
   */
  @OneToMany(() => AuditLog, (log) => log.institute, {
    cascade: false,
  })
  auditLogs!: AuditLog[];

  /**
   * API keys for this institute
   */
  @OneToMany(() => ApiKey, (key) => key.institute, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  apiKeys!: ApiKey[];

  /**
   * Feature flags for this institute
   */
  @OneToMany(() => FeatureFlag, (flag) => flag.institute, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  featureFlags!: FeatureFlag[];
}
