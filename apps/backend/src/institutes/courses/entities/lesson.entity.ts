import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { LessonProgress } from './lesson-progress.entity';
import { Module } from './module.entity';

export enum LessonType {
  VIDEO = 'VIDEO',
  LIVE = 'LIVE',
  PDF = 'PDF',
  QUIZ = 'QUIZ',
  DPP = 'DPP',
  TEXT = 'TEXT',
}

@Entity('lessons')
@Unique(['moduleId', 'slug'])
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  moduleId!: string;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'enum', enum: LessonType })
  type!: LessonType;

  @Column({ type: 'text', nullable: true })
  videoUrl!: string | null;

  @Column({ type: 'int', nullable: true })
  videoDurationSecs!: number | null;

  @Column({ type: 'text', nullable: true })
  pdfUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  textContent!: string | null;

  @Column({ type: 'text', nullable: true })
  liveSessionId!: string | null;

  @Column({ default: false })
  isFree!: boolean;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'text', nullable: true })
  thumbnailUrl!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  attachments!: { name: string; url: string }[] | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Module, (module) => module.lessons, { onDelete: 'CASCADE' })
  module!: Module;

  @OneToMany(() => LessonProgress, (progress) => progress.lesson)
  progress!: LessonProgress[];
}
