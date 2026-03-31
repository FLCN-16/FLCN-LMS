import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from './test.entity';
import { TestQuestion } from './test-question.entity';

@Entity('test_sections')
export class TestSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testId: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  order: number;

  @Column()
  totalQuestions: number;

  @Column({ nullable: true })
  maxAttemptable: number;

  @Column({ nullable: true })
  durationMins: number;

  @ManyToOne(() => Test, (t) => t.sections, { onDelete: 'CASCADE' })
  test: Test;

  @OneToMany(() => TestQuestion, (tq) => tq.testSection, { cascade: true })
  testQuestions: TestQuestion[];
}
