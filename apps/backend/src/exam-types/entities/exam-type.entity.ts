import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('exam_types')
@Unique(['tenantId', 'slug'])
export class ExamType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  slug: string; // e.g. "JEE_MAINS"

  @Column()
  label: string; // e.g. "JEE Mains"

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
