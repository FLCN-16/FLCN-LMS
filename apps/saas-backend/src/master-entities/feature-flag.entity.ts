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
 * Stores feature flags/toggles for the platform.
 * Can be global (instituteId = null) or institute-specific.
 * Allows enabling/disabling features per institute.
 *
 * Example records:
 * - flagName: "new_dashboard", instituteId: null, isEnabled: true (global)
 * - flagName: "new_dashboard", instituteId: "uuid-1", isEnabled: false (institute override)
 * - flagName: "beta_features", instituteId: "uuid-2", isEnabled: true (institute-specific)
 */
@Entity('feature_flags')
@Index('idx_feature_flags_institute', ['instituteId'])
@Index('idx_feature_flags_name', ['flagName'])
@Index('idx_feature_flags_institute_flag', ['instituteId', 'flagName'], {
  unique: true,
})
export class FeatureFlag {
  /**
   * Unique identifier for the feature flag
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to institute
   * If null, this is a global flag for all institutes
   * If set, this is an institute-specific flag override
   */
  @Column({
    type: 'uuid',
    nullable: true,
  })
  instituteId?: string;

  /**
   * Name of the feature flag
   * Convention: snake_case
   * Examples: 'new_dashboard', 'beta_features', 'dark_mode'
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  flagName!: string;

  /**
   * Whether this feature is enabled
   * true = feature is active, false = feature is disabled
   */
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isEnabled!: boolean;

  /**
   * Configuration for this feature flag (JSON)
   * Can store:
   * - Rollout percentage (0-100)
   * - User groups
   * - Feature parameters
   * - Any other config needed
   *
   * Example:
   * {
   *   "rolloutPercentage": 50,
   *   "userGroups": ["beta_users", "internal"],
   *   "config": { "maxItems": 10, "timeout": 5000 }
   * }
   */
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  config?: Record<string, any>;

  /**
   * When this flag was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When this flag was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Relation to Institute
   * null if this is a global flag
   * If set, allows access to institute details
   */
  @ManyToOne(() => Institute, (institute) => institute.featureFlags, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'instituteId' })
  institute?: Institute;
}
