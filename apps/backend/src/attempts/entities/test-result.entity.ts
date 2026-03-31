import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TestAttempt } from './test-attempt.entity';

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  attemptId: string;

  @Column()
  testId: string;

  @Column()
  userId: string;

  @Column('float')
  totalMarks: number;

  @Column('float')
  marksObtained: number;

  @Column()
  correctCount: number;

  @Column()
  incorrectCount: number;

  @Column()
  unattemptedCount: number;

  @Column('float', { nullable: true })
  percentile: number;

  @Column({ nullable: true })
  rank: number;

  @Column('float')
  accuracy: number;

  @Column()
  timeTakenSecs: number;

  @Column('jsonb')
  sectionBreakdown: Record<string, unknown>;

  @Column('jsonb')
  topicBreakdown: Record<string, unknown>;

  @CreateDateColumn()
  computedAt: Date;

  @OneToOne(() => TestAttempt, (a) => a.result)
  @JoinColumn({ name: 'attemptId' })
  attempt: TestAttempt;
}
