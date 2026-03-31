import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TestSection } from './test-section.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('test_questions')
@Unique(['testSectionId', 'questionId'])
export class TestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testSectionId: string;

  @Column()
  questionId: string;

  @Column()
  order: number;

  @Column('float', { nullable: true })
  positiveMarks: number;

  @Column('float', { nullable: true })
  negativeMarks: number;

  @ManyToOne(() => TestSection, (s) => s.testQuestions, { onDelete: 'CASCADE' })
  testSection: TestSection;

  @ManyToOne(() => Question, { eager: false })
  question: Question;
}
