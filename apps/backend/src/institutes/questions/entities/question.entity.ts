import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Difficulty, QuestionType } from '@flcn-lms/types/questions';

import { TestQuestion } from '../../test-series/entities/test-question.entity';
import { QuestionOption } from './question-option.entity';

@Entity('questions')
@Index(['instituteId', 'subject', 'difficulty', 'isApproved'])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instituteId!: string;

  @Column({ type: 'enum', enum: ['MCQ', 'MSQ', 'INTEGER', 'SUBJECTIVE'] })
  type!: QuestionType;

  @Column()
  subject!: string;

  @Column()
  topic!: string;

  @Column({ nullable: true })
  subtopic?: string;

  @Column({ type: 'enum', enum: ['EASY', 'MEDIUM', 'HARD'] })
  difficulty!: Difficulty;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 4 })
  positiveMarks!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1 })
  negativeMarks!: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  correctInteger?: number;

  @Column()
  createdById!: string;

  @Column({ default: false })
  isApproved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => QuestionOption, (opt) => opt.question, { cascade: true })
  options!: QuestionOption[];

  @OneToMany(() => TestQuestion, (testQuestion) => testQuestion.question)
  testQuestions!: TestQuestion[];
}
