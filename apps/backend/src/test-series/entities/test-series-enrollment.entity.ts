import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TestSeries } from './test-series.entity';

@Entity('test_series_enrollments')
@Unique(['testSeriesId', 'userId'])
export class TestSeriesEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testSeriesId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  enrolledAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => TestSeries, (ts) => ts.enrollments, { onDelete: 'CASCADE' })
  testSeries: TestSeries;
}
