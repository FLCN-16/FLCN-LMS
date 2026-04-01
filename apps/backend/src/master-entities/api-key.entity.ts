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
 * Stores API keys for institute integrations and third-party access.
 * Each key is hashed and associated with a specific institute.
 */
@Entity('api_keys')
@Index('idx_api_keys_institute', ['instituteId'])
@Index('idx_api_keys_hash', ['keyHash'])
@Index('idx_api_keys_active', ['isActive'])
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Foreign key to institute
   */
  @Column({ type: 'uuid' })
  instituteId!: string;

  /**
   * Hashed API key (store hash, not the actual key)
   * Unique across all keys
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  keyHash!: string;

  /**
   * Display name for this API key
   * Helps users identify which key is which
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  /**
   * Scopes/permissions this key has
   * Example: ['read:courses', 'write:users', 'read:analytics']
   */
  @Column({ type: 'simple-array', nullable: true })
  scopes?: string[];

  /**
   * Rate limit (requests per hour)
   */
  @Column({ type: 'integer', default: 1000 })
  rateLimit!: number;

  /**
   * When was this key last used?
   */
  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  /**
   * Total requests made with this key
   */
  @Column({ type: 'integer', default: 0 })
  totalRequests!: number;

  /**
   * Whether this key is active
   */
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * When does this key expire? (optional)
   */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * Relation to Institute
   */
  @ManyToOne(() => Institute, (institute) => institute.apiKeys, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instituteId' })
  institute!: Institute;
}
