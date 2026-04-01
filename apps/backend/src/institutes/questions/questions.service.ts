import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  QuestionBankFilters,
  UpdateQuestionPayload,
} from '@flcn-lms/types/questions';

import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionOption } from './entities/question-option.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepo: Repository<QuestionOption>,
  ) {}

  async create(
    instituteId: string,
    userId: string,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    const question = this.questionRepo.create({
      ...dto,
      instituteId,
      createdById: userId,
      options: dto.options.map((option) => this.optionRepo.create(option)),
    });

    return this.questionRepo.save(question);
  }

  async findAll(
    instituteId: string,
    filters: QuestionBankFilters,
  ): Promise<Question[]> {
    const qb = this.questionRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.options', 'options')
      .where('q.instituteId = :instituteId', { instituteId });

    if (filters.subject) {
      qb.andWhere('q.subject = :subject', { subject: filters.subject });
    }

    if (filters.topic) {
      qb.andWhere('q.topic = :topic', { topic: filters.topic });
    }

    if (filters.difficulty) {
      qb.andWhere('q.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (filters.type) {
      qb.andWhere('q.type = :type', { type: filters.type });
    }

    if (filters.isApproved !== undefined) {
      qb.andWhere('q.isApproved = :isApproved', {
        isApproved: filters.isApproved,
      });
    }

    return qb.orderBy('q.createdAt', 'DESC').getMany();
  }

  async findOne(instituteId: string, id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id, instituteId },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async update(
    instituteId: string,
    id: string,
    dto: UpdateQuestionPayload,
  ): Promise<Question> {
    const question = await this.findOne(instituteId, id);

    Object.assign(question, dto);

    if (dto.options) {
      await this.optionRepo.delete({ questionId: id });
      question.options = dto.options.map((option) =>
        this.optionRepo.create(option),
      );
    }

    return this.questionRepo.save(question);
  }

  async approve(instituteId: string, id: string): Promise<Question> {
    const question = await this.findOne(instituteId, id);
    question.isApproved = true;
    return this.questionRepo.save(question);
  }

  async remove(instituteId: string, id: string): Promise<void> {
    const question = await this.findOne(instituteId, id);
    await this.questionRepo.remove(question);
  }
}
