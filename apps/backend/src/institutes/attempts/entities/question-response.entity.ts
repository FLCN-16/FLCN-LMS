import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import type { ResponseStatus } from '@flcn-lms/types/attempts';

import { AttemptSection } from './attempt-section.entity';

@Entity('question_responses')
@Unique(['attemptSectionId', 'questionId'])
export class QuestionResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  attemptSectionId!: string;

  @ManyToOne(() => AttemptSection, (section) => section.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attemptSectionId' })
  attemptSection!: AttemptSection;

  @Column()
  questionId!: string;

  @Column({ type: 'simple-array', nullable: true })
  selectedOptionIds?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  integerAnswer?: number;

  @Column({ type: 'text', nullable: true })
  subjectiveAnswer?: string;

  @Column({
    type: 'enum',
    enum: ['UNATTEMPTED', 'ATTEMPTED', 'MARKED_REVIEW', 'ATTEMPTED_MARKED'],
    default: 'UNATTEMPTED',
  })
  status!: ResponseStatus;

  @Column({ default: 0 })
  timeTakenSecs!: number;

  @Column({ nullable: true })
  isCorrect?: boolean;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  marksAwarded?: number;
}
