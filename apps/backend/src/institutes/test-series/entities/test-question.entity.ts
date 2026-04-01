import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Question } from '../../questions/entities/question.entity';
import { TestSection } from './test-section.entity';

@Entity('test_questions')
@Unique(['testSectionId', 'questionId'])
export class TestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testSectionId!: string;

  @ManyToOne(() => TestSection, (section) => section.testQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testSectionId' })
  testSection!: TestSection;

  @Column()
  questionId!: string;

  @ManyToOne(() => Question, (question) => question.testQuestions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column({ default: 0 })
  order!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  positiveMarks?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  negativeMarks?: number;
}
