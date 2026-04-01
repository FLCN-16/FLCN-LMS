import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { LiveSession } from './live-session.entity';

@Entity('live_attendance')
@Unique(['sessionId', 'userId'])
export class LiveAttendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sessionId!: string;

  @ManyToOne(() => LiveSession, (session) => session.attendance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: LiveSession;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  joinedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  leftAt?: Date;

  @Column({ nullable: true })
  durationSecs?: number;
}
