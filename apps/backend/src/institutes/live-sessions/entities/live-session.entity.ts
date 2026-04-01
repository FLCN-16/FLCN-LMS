import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';


import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { LiveAttendance } from './live-attendance.entity';
import { LiveChatMessage } from './live-chat-message.entity';
import { LivePoll } from './live-poll.entity';
import { LiveQA } from './live-qa.entity';

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

@Entity('live_sessions')
export class LiveSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instituteId!: string;



  @Column()
  courseId!: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column()
  instructorId!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'instructorId' })
  instructor!: User;

  @Column()
  title!: string;

  @Column({ type: 'timestamptz' })
  scheduledAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt?: Date;

  @Column({ nullable: true })
  recordingUrl?: string;

  @Column({ nullable: true })
  livekitRoomId?: string;

  @Column({ nullable: true })
  hlsUrl?: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.SCHEDULED,
  })
  status!: SessionStatus;

  @Column({ nullable: true })
  maxParticipants?: number;

  @OneToMany(() => LiveChatMessage, (m) => m.session)
  chatMessages!: LiveChatMessage[];

  @OneToMany(() => LiveQA, (q) => q.session)
  questions!: LiveQA[];

  @OneToMany(() => LivePoll, (p) => p.session)
  polls!: LivePoll[];

  @OneToMany(() => LiveAttendance, (a) => a.session)
  attendance!: LiveAttendance[];
}
