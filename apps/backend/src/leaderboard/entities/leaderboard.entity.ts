import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leaderboard')
@Unique(['testId', 'userId'])
@Index(['testId', 'rank'])
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  testId: string;

  @Column()
  userId: string;

  @Column()
  rank: number;

  @Column('float')
  marksObtained: number;

  @Column('float')
  percentile: number;

  @Column()
  timeTakenSecs: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
