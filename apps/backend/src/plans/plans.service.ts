import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../master-entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan, 'master')
    private readonly repository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.repository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async create(dto: CreatePlanDto): Promise<Plan> {
    const plan = this.repository.create(dto);
    return this.repository.save(plan);
  }

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    Object.assign(plan, dto);
    return this.repository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    await this.repository.remove(plan);
  }
}
