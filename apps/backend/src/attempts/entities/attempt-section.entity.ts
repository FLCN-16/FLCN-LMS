import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TestAttempt } from './test-attempt.entity';
import { QuestionResponse } from './question-response.entity';

@Entity('attempt_sections')
@Unique(['attemptId', 'testSectionId'])
export class AttemptSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attemptId: string;

  @Column()
  testSectionId: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  remainingTimeSecs: number;

  @ManyToOne(() => TestAttempt, (a) => a.sections, { onDelete: 'CASCADE' })
  attempt: TestAttempt;

  @OneToMany(() => QuestionResponse, (r) => r.attemptSection, { cascade: true })
  responses: QuestionResponse[];
}
