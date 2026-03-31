import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TestSeries } from './test-series.entity';
import { TestSection } from './test-section.entity';

export enum TestType {
  FULL_LENGTH = 'FULL_LENGTH',
  SECTIONAL = 'SECTIONAL',
  CHAPTER_WISE = 'CHAPTER_WISE',
  DPP = 'DPP',
  PREVIOUS_YEAR = 'PREVIOUS_YEAR',
}

export enum ResultMode {
  INSTANT = 'INSTANT',
  AFTER_END_DATE = 'AFTER_END_DATE',
  MANUAL = 'MANUAL',
}

@Entity('tests')
@Unique(['testSeriesId', 'slug'])
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testSeriesId: string;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TestType })
  testType: TestType;

  @Column()
  durationMins: number;

  @Column()
  totalMarks: number;

  @Column()
  totalQuestions: number;

  @Column('text', { nullable: true })
  instructions: string;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  endsAt: Date;

  @Column({ default: true })
  shuffleQuestions: boolean;

  @Column({ default: true })
  shuffleOptions: boolean;

  @Column({ type: 'enum', enum: ResultMode, default: ResultMode.INSTANT })
  showResultAfter: ResultMode;

  @Column({ default: 1 })
  attemptLimit: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => TestSeries, (ts) => ts.tests, { onDelete: 'CASCADE' })
  testSeries: TestSeries;

  @OneToMany(() => TestSection, (s) => s.test, { cascade: true })
  sections: TestSection[];
}
