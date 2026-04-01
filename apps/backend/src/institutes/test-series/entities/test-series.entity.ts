import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';


import { TestSeriesEnrollment } from './test-series-enrollment.entity';
import { Test } from './test.entity';

@Entity('test_series')
@Index(['instituteId', 'slug'], { unique: true })
export class TestSeries {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instituteId!: string;



  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  examType!: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  seoTitle?: string;

  @Column({ type: 'text', nullable: true })
  seoDescription?: string;

  @Column({ type: 'jsonb', nullable: true })
  seoKeywords?: string[];

  @Column({ nullable: true })
  seoImageUrl?: string;

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ default: 0 })
  totalTests!: number;

  @Column({ type: 'timestamptz', nullable: true })
  validTill?: Date;

  @Column({ default: false })
  isPublished!: boolean;

  @Column()
  createdById!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Test, (test) => test.testSeries, { cascade: true })
  tests!: Test[];

  @OneToMany(() => TestSeriesEnrollment, (enrollment) => enrollment.testSeries)
  enrollments!: TestSeriesEnrollment[];
}
