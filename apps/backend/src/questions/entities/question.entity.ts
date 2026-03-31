import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionOption } from './question-option.entity';

export enum QuestionType {
  MCQ = 'MCQ',
  MSQ = 'MSQ',
  INTEGER = 'INTEGER',
  SUBJECTIVE = 'SUBJECTIVE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column()
  subject: string;

  @Column()
  topic: string;

  @Column({ nullable: true })
  subtopic: string;

  @Column({ type: 'enum', enum: Difficulty })
  difficulty: Difficulty;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  explanation: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('float', { default: 4 })
  positiveMarks: number;

  @Column('float', { default: 1 })
  negativeMarks: number;

  @Column({ nullable: true })
  correctInteger: number;

  @Column()
  createdBy: string;

  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => QuestionOption, (opt) => opt.question, { cascade: true })
  options: QuestionOption[];
}
