import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Institute } from '../master-entities/institute.entity';
import { Plan } from '../master-entities/plan.entity';
import { SuperAdmin } from '../master-entities/super-admin.entity';

export interface SeederOptions {
  email: string;
  password?: string;
  name: string;
  role?: string;
}

export interface CustomerSeederOptions {
  name: string;
  slug: string;
  email: string;
  industry?: string;
  maxLicenses?: number;
}

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  /**
   * Seed a super admin user for the SaaS platform
   */
  async seedSuperAdmin(options: SeederOptions): Promise<SuperAdmin> {
    const { email, name } = options;

    try {
      // Check if super admin already exists
      const existingAdmin = await this.superAdminRepository.findOne({
        where: { email },
      });

      if (existingAdmin) {
        this.logger.warn(`Super admin already exists: ${email}`);
        return existingAdmin;
      }

      // Create super admin
      const superAdmin = this.superAdminRepository.create({
        email,
        name,
        isActive: true,
      });

      const savedAdmin = await this.superAdminRepository.save(superAdmin);
      this.logger.log(`Super admin created: ${email}`);

      return savedAdmin;
    } catch (error) {
      this.logger.error('Failed to seed super admin:', error);
      throw error;
    }
  }

  /**
   * Seed a customer/institute in the platform
   */
  async seedCustomer(options: CustomerSeederOptions): Promise<Institute> {
    const {
      name,
      slug,
      email,
      industry = 'education',
      maxLicenses = 100,
    } = options;

    try {
      // Check if customer already exists
      const existingCustomer = await this.instituteRepository.findOne({
        where: { slug },
      });

      if (existingCustomer) {
        this.logger.warn(`Customer already exists: ${slug}`);
        return existingCustomer;
      }

      // Create customer/institute
      const customer = this.instituteRepository.create({
        name,
        slug,
        maxUsers: maxLicenses,
        isActive: true,
      } as any);

      const savedCustomer = (await this.instituteRepository.save(
        customer,
      )) as unknown as Institute;
      this.logger.log(`Customer created: ${slug}`);

      return savedCustomer;
    } catch (error) {
      this.logger.error('Failed to seed customer:', error);
      throw error;
    }
  }

  /**
   * Seed a plan
   */
  async seedPlan(planData: Partial<Plan>): Promise<Plan> {
    const { name } = planData;

    try {
      if (!name) {
        throw new Error('Plan name is required');
      }

      // Check if plan already exists
      const existingPlan = await this.planRepository.findOne({
        where: { name },
      });

      if (existingPlan) {
        this.logger.warn(`Plan already exists: ${name}`);
        return existingPlan;
      }

      // Create plan
      const plan = this.planRepository.create(planData);
      const savedPlan = await this.planRepository.save(plan);
      this.logger.log(`Plan created: ${name}`);

      return savedPlan;
    } catch (error) {
      this.logger.error('Failed to seed plan:', error);
      throw error;
    }
  }

  /**
   * Get seeding status
   */
  async getStatus(): Promise<{
    superAdmins: number;
    customers: number;
    plans: number;
  }> {
    try {
      const superAdminCount = await this.superAdminRepository.count();
      const customerCount = await this.instituteRepository.count();
      const planCount = await this.planRepository.count();

      return {
        superAdmins: superAdminCount,
        customers: customerCount,
        plans: planCount,
      };
    } catch (error) {
      this.logger.error('Failed to get seeding status:', error);
      throw error;
    }
  }
}
