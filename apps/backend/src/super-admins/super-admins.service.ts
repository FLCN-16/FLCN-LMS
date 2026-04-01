import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';

@Injectable()
export class SuperAdminsService {
  constructor(
    @InjectRepository(SuperAdmin, 'master')
    private readonly repository: Repository<SuperAdmin>,
  ) {}

  async findAll(): Promise<SuperAdmin[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<SuperAdmin> {
    const admin = await this.repository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
    }
    return admin;
  }

  async create(dto: CreateSuperAdminDto): Promise<SuperAdmin> {
    const existing = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`SuperAdmin with email ${dto.email} already exists`);
    }

    const admin = this.repository.create({
      ...dto,
      hashedPassword: dto.password, // TODO: Add real hashing in a proper auth flow
    });

    return this.repository.save(admin);
  }

  async update(id: string, dto: UpdateSuperAdminDto): Promise<SuperAdmin> {
    const admin = await this.findOne(id);

    if (dto.password) {
      admin.hashedPassword = dto.password; // TODO: Add real hashing
    }

    Object.assign(admin, dto);
    return this.repository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    await this.repository.remove(admin);
  }
}
