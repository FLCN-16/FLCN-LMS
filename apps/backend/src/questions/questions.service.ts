import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Difficulty, Question, QuestionType } from './entities/question.entity';
import { QuestionOption } from './entities/question-option.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepo: Repository<QuestionOption>,
  ) {}

  async create(
    tenantId: string,
    userId: string,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    const question = this.questionRepo.create({
      ...dto,
      tenantId,
      createdBy: userId,
      options: dto.options.map((o) => this.optionRepo.create(o)),
    });
    return this.questionRepo.save(question);
  }

  async findAll(
    tenantId: string,
    filters: {
      subject?: string;
      topic?: string;
      difficulty?: Difficulty;
      type?: QuestionType;
      isApproved?: boolean;
    },
  ): Promise<Question[]> {
    const qb = this.questionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.options', 'options')
      .where('q.tenantId = :tenantId', { tenantId });

    if (filters.subject)
      qb.andWhere('q.subject = :subject', { subject: filters.subject });
    if (filters.topic)
      qb.andWhere('q.topic = :topic', { topic: filters.topic });
    if (filters.difficulty)
      qb.andWhere('q.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    if (filters.type) qb.andWhere('q.type = :type', { type: filters.type });
    if (filters.isApproved !== undefined)
      qb.andWhere('q.isApproved = :isApproved', {
        isApproved: filters.isApproved,
      });

    return qb.orderBy('q.createdAt', 'DESC').getMany();
  }

  async findOne(tenantId: string, id: string): Promise<Question> {
    const q = await this.questionRepo.findOne({
      where: { id, tenantId },
      relations: ['options'],
    });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async update(
    tenantId: string,
    id: string,
    dto: Partial<CreateQuestionDto>,
  ): Promise<Question> {
    const q = await this.findOne(tenantId, id);
    Object.assign(q, dto);
    if (dto.options) {
      await this.optionRepo.delete({ questionId: id });
      q.options = dto.options.map((o) => this.optionRepo.create(o));
    }
    return this.questionRepo.save(q);
  }

  async approve(tenantId: string, id: string): Promise<Question> {
    const q = await this.findOne(tenantId, id);
    q.isApproved = true;
    return this.questionRepo.save(q);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const q = await this.findOne(tenantId, id);
    await this.questionRepo.remove(q);
  }
}
