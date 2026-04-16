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

  async findAll(): Promise<Omit<SuperAdmin, 'hashedPassword'>[]> {
    const admins = await this.repository.find();
    return admins.map((admin) => this.excludePassword(admin));
  }

  async findOne(id: string): Promise<Omit<SuperAdmin, 'hashedPassword'>> {
    const admin = await this.repository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
    }
    return this.excludePassword(admin);
  }

  async create(dto: CreateSuperAdminDto): Promise<Omit<SuperAdmin, 'hashedPassword'>> {
    const existing = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        `SuperAdmin with email ${dto.email} already exists`,
      );
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);
    const admin = this.repository.create({
      ...dto,
      hashedPassword,
    });

    const saved = await this.repository.save(admin);
    return this.excludePassword(saved);
  }

  async update(id: string, dto: UpdateSuperAdminDto): Promise<Omit<SuperAdmin, 'hashedPassword'>> {
    const admin = await this.repository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
    }

    if (dto.password) {
      admin.hashedPassword = await this.authService.hashPassword(dto.password);
    }

    Object.assign(admin, dto);
    const updated = await this.repository.save(admin);
    return this.excludePassword(updated);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.repository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
    }
    await this.repository.remove(admin);
  }

  /**
   * Remove sensitive password field from admin object before returning
   */
  private excludePassword(
    admin: SuperAdmin,
  ): Omit<SuperAdmin, 'hashedPassword'> {
    const { hashedPassword: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }
}
