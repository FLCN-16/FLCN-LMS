import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column()
  order: number;

  @ManyToOne(() => Question, (q) => q.options, { onDelete: 'CASCADE' })
  question: Question;
}
