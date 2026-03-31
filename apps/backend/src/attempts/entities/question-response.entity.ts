import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AttemptSection } from './attempt-section.entity';

export enum ResponseStatus {
  UNATTEMPTED = 'UNATTEMPTED',
  ATTEMPTED = 'ATTEMPTED',
  MARKED_REVIEW = 'MARKED_REVIEW',
  ATTEMPTED_MARKED = 'ATTEMPTED_MARKED',
}

@Entity('question_responses')
@Unique(['attemptSectionId', 'questionId'])
export class QuestionResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attemptSectionId: string;

  @Column()
  questionId: string;

  @Column('simple-array', { nullable: true })
  selectedOptionIds: string[];

  @Column('float', { nullable: true })
  integerAnswer: number;

  @Column('text', { nullable: true })
  subjectiveAnswer: string;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.UNATTEMPTED,
  })
  status: ResponseStatus;

  @Column({ default: 0 })
  timeTakenSecs: number;

  @Column({ nullable: true })
  isCorrect: boolean;

  @Column('float', { nullable: true })
  marksAwarded: number;

  @ManyToOne(() => AttemptSection, (s) => s.responses, { onDelete: 'CASCADE' })
  attemptSection: AttemptSection;
}
