import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { LiveSession } from './live-session.entity';

@Entity('live_qa')
export class LiveQA {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sessionId!: string;

  @ManyToOne(() => LiveSession, (session) => session.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: LiveSession;

  @Column()
  askedById!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'askedById' })
  askedBy!: User;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'text', nullable: true })
  answer?: string;

  @Column({ type: 'timestamptz', nullable: true })
  answeredAt?: Date;

  @Column({ default: 0 })
  upvotes!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
