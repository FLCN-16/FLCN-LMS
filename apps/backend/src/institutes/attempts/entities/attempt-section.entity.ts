import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { TestSection } from '../../test-series/entities/test-section.entity';
import { QuestionResponse } from './question-response.entity';
import { TestAttempt } from './test-attempt.entity';

@Entity('attempt_sections')
@Unique(['attemptId', 'testSectionId'])
export class AttemptSection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  attemptId!: string;

  @ManyToOne(() => TestAttempt, (attempt) => attempt.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptId' })
  attempt!: TestAttempt;

  @Column()
  testSectionId!: string;

  @ManyToOne(() => TestSection, (section) => section.attempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testSectionId' })
  testSection!: TestSection;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  submittedAt?: Date;

  @Column({ nullable: true })
  remainingTimeSecs?: number;

  @OneToMany(() => QuestionResponse, (response) => response.attemptSection, {
    cascade: true,
  })
  responses!: QuestionResponse[];
}
