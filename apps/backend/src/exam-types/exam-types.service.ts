import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamType } from './entities/exam-type.entity';
import { CreateExamTypeDto, UpdateExamTypeDto } from './dto/exam-type.dto';

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private readonly repo: Repository<ExamType>,
  ) {}

  async findAll(
    tenantId: string,
    includeInactive = false,
  ): Promise<ExamType[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .where('e.tenantId = :tenantId', { tenantId });

    if (!includeInactive) qb.andWhere('e.isActive = true');

    return qb.orderBy('e.order', 'ASC').addOrderBy('e.label', 'ASC').getMany();
  }

  async create(tenantId: string, dto: CreateExamTypeDto): Promise<ExamType> {
    const entity = this.repo.create({ ...dto, tenantId });
    return this.repo.save(entity);
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateExamTypeDto,
  ): Promise<ExamType> {
    const entity = await this.repo.findOne({ where: { id, tenantId } });
    if (!entity) throw new NotFoundException('Exam type not found');
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id, tenantId } });
    if (!entity) throw new NotFoundException('Exam type not found');
    await this.repo.remove(entity);
  }

  /** Seed defaults for a new tenant */
  async seed(tenantId: string): Promise<void> {
    const defaults = [
      { slug: 'JEE_MAINS', label: 'JEE Mains', order: 1 },
      { slug: 'JEE_ADVANCED', label: 'JEE Advanced', order: 2 },
      { slug: 'NEET', label: 'NEET', order: 3 },
      { slug: 'UPSC', label: 'UPSC', order: 4 },
      { slug: 'GATE', label: 'GATE', order: 5 },
      { slug: 'CAT', label: 'CAT', order: 6 },
    ];

    for (const d of defaults) {
      const exists = await this.repo.findOne({
        where: { tenantId, slug: d.slug },
      });
      if (!exists) await this.repo.save(this.repo.create({ ...d, tenantId }));
    }
  }
}
