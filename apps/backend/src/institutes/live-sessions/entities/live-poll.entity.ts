import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LiveSession } from './live-session.entity';

@Entity('live_polls')
export class LivePoll {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sessionId!: string;

  @ManyToOne(() => LiveSession, (session) => session.polls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: LiveSession;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'simple-array' })
  options!: string[];

  @Column({ type: 'jsonb', default: {} })
  votes!: Record<string, number>;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
