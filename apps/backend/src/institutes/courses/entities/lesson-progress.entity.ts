import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { CourseEnrollment } from './course-enrollment.entity';
import { Lesson } from './lesson.entity';

@Entity('lesson_progress')
@Unique(['enrollmentId', 'lessonId'])
export class LessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  enrollmentId!: string;

  @ManyToOne(
    () => CourseEnrollment,
    (enrollment) => enrollment.lessonProgress,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'enrollmentId' })
  enrollment!: CourseEnrollment;

  @Column()
  lessonId!: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson!: Lesson;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ default: 0 })
  watchedSecs!: number;

  @Column({ nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
