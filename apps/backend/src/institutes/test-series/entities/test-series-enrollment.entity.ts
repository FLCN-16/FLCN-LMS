import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { TestSeries } from './test-series.entity';

@Entity('test_series_enrollments')
@Unique(['testSeriesId', 'userId'])
export class TestSeriesEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testSeriesId!: string;

  @ManyToOne(() => TestSeries, (series) => series.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testSeriesId' })
  testSeries!: TestSeries;

  @Column()
  userId!: string;

  @CreateDateColumn()
  enrolledAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ nullable: true })
  paymentId?: string;
}
