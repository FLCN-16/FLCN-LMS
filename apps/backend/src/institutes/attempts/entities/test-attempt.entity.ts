import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import type { AttemptStatus } from '@flcn-lms/types/attempts';

import { User } from '../../users/entities/user.entity';
import { AttemptSection } from './attempt-section.entity';
import { TestResult } from './test-result.entity';

@Entity('test_attempts')
@Unique(['testId', 'userId', 'attemptNumber'])
export class TestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ default: 1 })
  attemptNumber!: number;

  @Column({
    type: 'enum',
    enum: ['IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT', 'PAUSED'],
    default: 'IN_PROGRESS',
  })
  status!: AttemptStatus;

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  submittedAt?: Date;

  @Column({ nullable: true })
  remainingTimeSecs?: number;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ default: 0 })
  tabSwitchCount!: number;

  @Column({ default: false })
  isDisqualified!: boolean;

  @OneToMany(() => AttemptSection, (section) => section.attempt, {
    cascade: true,
  })
  sections!: AttemptSection[];

  @OneToOne(() => TestResult, (result) => result.attempt)
  result!: TestResult;
}
