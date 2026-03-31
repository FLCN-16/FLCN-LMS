import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from './test.entity';
import { TestSeriesEnrollment } from './test-series-enrollment.entity';

@Entity('test_series')
export class TestSeries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  examType: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: true })
  isPaid: boolean;

  @Column('float', { nullable: true })
  price: number;

  @Column({ default: 0 })
  totalTests: number;

  @Column({ nullable: true })
  validTill: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Test, (t) => t.testSeries)
  tests: Test[];

  @OneToMany(() => TestSeriesEnrollment, (e) => e.testSeries)
  enrollments: TestSeriesEnrollment[];
}
