import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';
import { LessonProgress } from './lesson-progress.entity';

@Entity('course_enrollments')
@Unique(['courseId', 'userId'])
export class CourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courseId!: string;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  paymentId?: string;

  @CreateDateColumn()
  enrolledAt!: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercent!: number;

  @OneToMany(() => LessonProgress, (progress) => progress.enrollment, {
    cascade: true,
  })
  lessonProgress!: LessonProgress[];
}
