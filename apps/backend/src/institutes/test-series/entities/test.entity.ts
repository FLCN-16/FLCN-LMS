import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { TestSection } from './test-section.entity';
import { TestSeries } from './test-series.entity';

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
  id!: string;

  @Column()
  testSeriesId!: string;

  @ManyToOne(() => TestSeries, (series) => series.tests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testSeriesId' })
  testSeries!: TestSeries;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TestType })
  testType!: TestType;

  @Column()
  durationMins!: number;

  @Column()
  totalMarks!: number;

  @Column()
  totalQuestions!: number;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ type: 'timestamptz', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endsAt?: Date;

  @Column({ default: true })
  shuffleQuestions!: boolean;

  @Column({ default: true })
  shuffleOptions!: boolean;

  @Column({
    type: 'enum',
    enum: ResultMode,
    default: ResultMode.INSTANT,
  })
  showResultAfter!: ResultMode;

  @Column({ default: 1 })
  attemptLimit!: number;

  @Column({ default: false })
  isPublished!: boolean;

  @Column({ default: 0 })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => TestSection, (section) => section.test, {
    cascade: true,
  })
  sections!: TestSection[];
}
