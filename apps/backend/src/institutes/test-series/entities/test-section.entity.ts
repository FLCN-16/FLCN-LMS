import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { AttemptSection } from '../../attempts/entities/attempt-section.entity';
import { TestQuestion } from './test-question.entity';
import { Test } from './test.entity';

@Entity('test_sections')
@Unique(['testId', 'title'])
export class TestSection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testId!: string;

  @ManyToOne(() => Test, (test) => test.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test!: Test;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 0 })
  order!: number;

  @Column()
  totalQuestions!: number;

  @Column({ nullable: true })
  maxAttemptable?: number;

  @Column({ nullable: true })
  durationMins?: number;

  @OneToMany(() => TestQuestion, (testQuestion) => testQuestion.testSection, {
    cascade: true,
  })
  testQuestions!: TestQuestion[];

  @OneToMany(
    () => AttemptSection,
    (attemptSection) => attemptSection.testSection,
  )
  attempts!: AttemptSection[];
}
