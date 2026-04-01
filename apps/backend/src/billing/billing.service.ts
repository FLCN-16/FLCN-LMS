import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstituteBilling } from '../master-entities/institute-billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(InstituteBilling, 'master')
    private readonly repository: Repository<InstituteBilling>,
  ) {}

  async findAll(): Promise<InstituteBilling[]> {
    return this.repository.find({ relations: ['institute'] });
  }

  async findByInstitute(instituteId: string): Promise<InstituteBilling> {
    const billing = await this.repository.findOne({
      where: { instituteId },
      relations: ['institute'],
    });
    if (!billing) {
      throw new NotFoundException(`Billing record for institute ${instituteId} not found`);
    }
    return billing;
  }

  async create(dto: CreateBillingDto): Promise<InstituteBilling> {
    const billing = this.repository.create(dto);
    return this.repository.save(billing);
  }

  async update(id: string, dto: UpdateBillingDto): Promise<InstituteBilling> {
    const billing = await this.repository.findOne({ where: { id } });
    if (!billing) {
      throw new NotFoundException(`Billing record with ID ${id} not found`);
    }

    Object.assign(billing, dto);
    return this.repository.save(billing);
  }
}
