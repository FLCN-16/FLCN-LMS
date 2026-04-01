import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Institute } from './institute.entity';

/**
 * MASTER DATABASE ENTITY
 *
 * Audit log for tracking all important actions across the system.
 * Used for compliance, debugging, and security monitoring.
 */
@Entity('audit_logs')
@Index('idx_audit_logs_institute', ['instituteId'])
@Index('idx_audit_logs_action', ['action'])
@Index('idx_audit_logs_created_at', ['createdAt'])
@Index('idx_audit_logs_institute_created', ['instituteId', 'createdAt'])
@Index('idx_audit_logs_user', ['userId'], { where: '"userId" IS NOT NULL' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Reference to institute (can be null for system-level logs)
   */
  @Column({ nullable: true, type: 'uuid' })
  instituteId?: string;

  /**
   * User who performed the action (optional)
   */
  @Column({ nullable: true, type: 'uuid' })
  userId?: string;

  /**
   * Type of action performed
   * Examples: 'CREATE_COURSE', 'UPDATE_USER', 'DELETE_TEST', etc.
   */
  @Column({ length: 100 })
  action!: string;

  /**
   * Type of resource affected
   * Examples: 'COURSE', 'USER', 'TEST_SERIES', 'QUESTION'
   */
  @Column({ length: 50, nullable: true })
  resourceType?: string;

  /**
   * ID of the resource affected
   */
  @Column({ length: 100, nullable: true })
  resourceId?: string;

  /**
   * Previous values before the change (JSON)
   * Only populated for UPDATE actions
   */
  @Column({ type: 'jsonb', nullable: true })
  oldValues?: Record<string, unknown>;

  /**
   * New values after the change (JSON)
   * Only populated for UPDATE actions
   */
  @Column({ type: 'jsonb', nullable: true })
  newValues?: Record<string, unknown>;

  /**
   * Summary of changes (JSON)
   * Field-level diff of what changed
   */
  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, unknown>;

  /**
   * IP address of the client
   */
  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  /**
   * User agent of the client
   */
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  /**
   * HTTP request method
   * Examples: GET, POST, PUT, DELETE, PATCH
   */
  @Column({ length: 10, nullable: true })
  requestMethod?: string;

  /**
   * HTTP request path
   * Example: /api/courses/uuid-123
   */
  @Column({ length: 500, nullable: true })
  requestPath?: string;

  /**
   * HTTP response status code
   * Examples: 200, 201, 400, 404, 500
   */
  @Column({ nullable: true, type: 'integer' })
  statusCode?: number;

  /**
   * How long the request took in milliseconds
   */
  @Column({ nullable: true, type: 'integer' })
  responseTimeMs?: number;

  /**
   * When this action was logged
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Relation to Institute (if instituteId is set)
   */
  @ManyToOne(() => Institute, (institute) => institute.auditLogs, {
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'instituteId' })
  institute?: Institute;
}
