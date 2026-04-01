import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


import { Category } from './category.entity';
import { CourseEnrollment } from './course-enrollment.entity';
import { Module as CourseModule } from './module.entity';

@Entity('courses')
@Index(['instituteId', 'slug'], { unique: true })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instituteId!: string;



  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @Column()
  instructorId!: string;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  thumbnailUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  trailerUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  seoTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  seoKeywords!: string[] | null;

  @Column({ type: 'text', nullable: true })
  seoImageUrl!: string | null;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT',
  })
  status!: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

  @Column({ default: false })
  isPaid!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice!: number | null;

  @Column({ type: 'int', nullable: true })
  validityDays!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  highlights!: string[] | null;

  @Column({ default: 0 })
  totalStudents!: number;

  @Column({ default: 0 })
  totalLessons!: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => CourseModule, (module) => module.course, { cascade: true })
  modules!: CourseModule[];

  @OneToMany(() => CourseEnrollment, (enrollment) => enrollment.course)
  enrollments!: CourseEnrollment[];
}
