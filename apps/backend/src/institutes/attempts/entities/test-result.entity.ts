import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type {
  SectionBreakdownEntry,
  TestResult as SharedTestResult,
  TopicBreakdownEntry,
} from '@flcn-lms/types/attempts';

import { TestAttempt } from './test-attempt.entity';

@Entity('test_results')
export class TestResult implements SharedTestResult {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  attemptId!: string;

  @OneToOne(() => TestAttempt, (attempt) => attempt.result, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: TestAttempt;

  @Column()
  testId!: string;

  @Column()
  userId!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalMarks!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  marksObtained!: number;

  @Column()
  correctCount!: number;

  @Column()
  incorrectCount!: number;

  @Column()
  unattemptedCount!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentile?: number;

  @Column({ nullable: true })
  rank?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  accuracy!: number;

  @Column()
  timeTakenSecs!: number;

  @Column({ type: 'jsonb' })
  sectionBreakdown!: Record<string, SectionBreakdownEntry>;

  @Column({ type: 'jsonb' })
  topicBreakdown!: Record<string, TopicBreakdownEntry>;

  @CreateDateColumn()
  computedAt!: string;
}
