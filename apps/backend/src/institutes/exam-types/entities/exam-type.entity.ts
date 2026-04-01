import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';



@Entity('exam_types')
@Unique(['instituteId', 'slug'])
export class ExamType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  instituteId!: string;



  @Column()
  slug!: string;

  @Column()
  label!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
