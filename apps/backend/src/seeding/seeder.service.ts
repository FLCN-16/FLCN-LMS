import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac, randomBytes } from 'crypto';

import { User, UserRole } from '../institutes/users/entities/user.entity';
import { Institute } from '../master-entities/institute.entity';

export interface SeederOptions {
  instituteSlug?: string;
  tenantName?: string;
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Institute)
    private readonly tenantRepository: Repository<Institute>,
  ) {}

  async seedSuperAdmin(options: SeederOptions): Promise<User> {
    const {
      instituteSlug = 'default',
      tenantName = 'Default Tenant',
      email,
      password,
      name,
    } = options;

    try {
      // Check if tenant exists
      let tenant = await this.tenantRepository.findOne({
        where: { slug: instituteSlug },
      });

      if (!tenant) {
        this.logger.log(`Creating tenant: ${instituteSlug}`);
        tenant = this.tenantRepository.create({
          slug: instituteSlug,
          name: tenantName,
          isActive: true,
        });
        tenant = await this.tenantRepository.save(tenant);
        this.logger.log(`Tenant created with ID: ${tenant.id}`);
      } else {
        this.logger.log(`Tenant already exists: ${instituteSlug}`);
      }

      // Check if super admin already exists
      const existingUser = await this.userRepository.findOne({
        where: { email, instituteId: tenant.id },
      });

      if (existingUser) {
        this.logger.warn(`Super admin user already exists: ${email}`);
        return existingUser;
      }

      // Create super admin user
      const hashedPassword = this.hashPassword(password);
      const superAdmin = this.userRepository.create({
        instituteId: tenant.id,
        name,
        email,
        hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(superAdmin);
      this.logger.log(`Super admin user created: ${email}`);

      return savedUser;
    } catch (error) {
      this.logger.error('Failed to seed super admin:', error);
      throw error;
    }
  }

  async seedAdminUser(options: SeederOptions & { instituteId?: string }): Promise<User> {
    const { instituteId, email, password, name } = options;

    try {
      if (!instituteId) {
        throw new Error('instituteId is required for admin user seeding');
      }

      // Verify tenant exists
      const tenant = await this.tenantRepository.findOne({
        where: { id: instituteId },
      });

      if (!tenant) {
        throw new Error(`Tenant not found: ${instituteId}`);
      }

      // Check if admin already exists
      const existingUser = await this.userRepository.findOne({
        where: { email, instituteId },
      });

      if (existingUser) {
        this.logger.warn(`Admin user already exists: ${email}`);
        return existingUser;
      }

      // Create admin user
      const hashedPassword = this.hashPassword(password);
      const admin = this.userRepository.create({
        instituteId,
        name,
        email,
        hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(admin);
      this.logger.log(`Admin user created: ${email}`);

      return savedUser;
    } catch (error) {
      this.logger.error('Failed to seed admin user:', error);
      throw error;
    }
  }

  async seedInstructor(options: SeederOptions & { instituteId?: string }): Promise<User> {
    const { instituteId, email, password, name } = options;

    try {
      if (!instituteId) {
        throw new Error('instituteId is required for instructor seeding');
      }

      // Verify tenant exists
      const tenant = await this.tenantRepository.findOne({
        where: { id: instituteId },
      });

      if (!tenant) {
        throw new Error(`Tenant not found: ${instituteId}`);
      }

      // Check if instructor already exists
      const existingUser = await this.userRepository.findOne({
        where: { email, instituteId },
      });

      if (existingUser) {
        this.logger.warn(`Instructor user already exists: ${email}`);
        return existingUser;
      }

      // Create instructor user
      const hashedPassword = this.hashPassword(password);
      const instructor = this.userRepository.create({
        instituteId,
        name,
        email,
        hashedPassword,
        role: UserRole.INSTRUCTOR,
        isActive: true,
      });

      const savedUser = await this.userRepository.save(instructor);
      this.logger.log(`Instructor user created: ${email}`);

      return savedUser;
    } catch (error) {
      this.logger.error('Failed to seed instructor user:', error);
      throw error;
    }
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha256', salt).update(password).digest('hex');
    return `${salt}:${hash}`;
  }
}
