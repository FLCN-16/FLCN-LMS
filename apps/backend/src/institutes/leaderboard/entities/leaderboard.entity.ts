import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import type { LeaderboardEntry } from '@flcn-lms/types/leaderboard';

import { Test } from '../../test-series/entities/test.entity';
import { User } from '../../users/entities/user.entity';

@Entity('leaderboard')
@Unique(['testId', 'userId'])
@Index(['testId', 'rank'])
export class Leaderboard implements LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testId!: string;

  @ManyToOne(() => Test, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test!: Test;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  rank!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  marksObtained!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentile!: number;

  @Column()
  timeTakenSecs!: number;

  @UpdateDateColumn()
  updatedAt!: string;
}
