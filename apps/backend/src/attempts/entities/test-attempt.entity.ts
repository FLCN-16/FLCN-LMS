import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AttemptSection } from './attempt-section.entity';
import { TestResult } from './test-result.entity';

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  TIMED_OUT = 'TIMED_OUT',
  PAUSED = 'PAUSED',
}

@Entity('test_attempts')
@Unique(['testId', 'userId', 'attemptNumber'])
export class TestAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testId: string;

  @Column()
  userId: string;

  @Column({ default: 1 })
  attemptNumber: number;

  @Column({ type: 'enum', enum: AttemptStatus, default: AttemptStatus.IN_PROGRESS })
  status: AttemptStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  remainingTimeSecs: number;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ default: 0 })
  tabSwitchCount: number;

  @Column({ default: false })
  isDisqualified: boolean;

  @OneToMany(() => AttemptSection, (s) => s.attempt, { cascade: true })
  sections: AttemptSection[];

  @OneToOne(() => TestResult, (r) => r.attempt)
  result: TestResult;
}
