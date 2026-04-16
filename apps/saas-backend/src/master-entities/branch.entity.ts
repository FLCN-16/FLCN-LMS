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
 * Represents a branch/location of an institute.
 * Each institute can have multiple branches (regional offices, centers, sub-organizations).
 * Allows for multi-location management within a single institute.
 */
@Entity('branches')
@Index('idx_branches_institute', ['instituteId'])
@Index('idx_branches_slug', ['instituteId', 'slug'], { unique: true })
@Index('idx_branches_active', ['isActive'])
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to institute
   * Each branch belongs to exactly one institute
   */
  @Column({ type: 'uuid' })
  instituteId!: string;

  /**
   * URL-friendly identifier for the branch
   * Unique within the institute
   * Examples: 'hq', 'delhi-center', 'bangalore-office'
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  slug!: string;

  /**
   * Display name for this branch
   * Examples: 'Headquarters', 'Delhi Center', 'Bangalore Office'
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  /**
   * Description of this branch
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  /**
   * Contact email for this branch
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email?: string;

  /**
   * Contact phone for this branch
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone?: string;

  /**
   * Full address of this branch
   */
  @Column({
    type: 'text',
    nullable: true,
  })
  address?: string;

  /**
   * City where this branch is located
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  city?: string;

  /**
   * State/Province where this branch is located
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  state?: string;

  /**
   * Country where this branch is located
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  country?: string;

  /**
   * Postal code for this branch
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  postalCode?: string;

  /**
   * Whether this branch is active
   */
  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive!: boolean;

  /**
   * Custom settings for this branch (JSON)
   */
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  settings?: Record<string, any>;

  /**
   * When this branch was created
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * When this branch was last updated
   */
  @UpdateDateColumn()
  updatedAt!: Date;

  // ========== Relations ==========

  /**
   * Relation to Institute
   * Each branch belongs to exactly one institute
   */
  @ManyToOne(() => Institute, (institute) => institute.branches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instituteId' })
  institute!: Institute;
}
