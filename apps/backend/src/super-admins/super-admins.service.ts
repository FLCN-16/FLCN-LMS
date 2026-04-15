import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthService } from '../common/auth/auth.service';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';

@Injectable()
export class SuperAdminsService {
  constructor(
    @InjectRepository(SuperAdmin, 'master')
    private readonly repository: Repository<SuperAdmin>,
    private readonly authService: AuthService,
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
      throw new ConflictException(
        `SuperAdmin with email ${dto.email} already exists`,
      );
    }

    const hashedPassword = this.authService.hashPassword(dto.password);
    const admin = this.repository.create({
      ...dto,
      hashedPassword,
    });

    return this.repository.save(admin);
  }

  async update(id: string, dto: UpdateSuperAdminDto): Promise<SuperAdmin> {
    const admin = await this.findOne(id);

    if (dto.password) {
      admin.hashedPassword = this.authService.hashPassword(dto.password);
    }

    Object.assign(admin, dto);
    return this.repository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    await this.repository.remove(admin);
  }
}
