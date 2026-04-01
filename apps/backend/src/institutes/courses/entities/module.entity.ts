import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('modules')
@Index(['courseId', 'slug'], { unique: true })
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courseId!: string;

  @ManyToOne(() => Course, (course) => course.modules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: false })
  isFree!: boolean;

  @OneToMany(() => Lesson, (lesson) => lesson.module, { cascade: true })
  lessons!: Lesson[];
}
