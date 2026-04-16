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
export declare class SeederService {
    private readonly superAdminRepository;
    private readonly instituteRepository;
    private readonly planRepository;
    private readonly logger;
    constructor(superAdminRepository: Repository<SuperAdmin>, instituteRepository: Repository<Institute>, planRepository: Repository<Plan>);
    /**
     * Seed a super admin user for the SaaS platform
     */
    seedSuperAdmin(options: SeederOptions): Promise<SuperAdmin>;
    /**
     * Seed a customer/institute in the platform
     */
    seedCustomer(options: CustomerSeederOptions): Promise<Institute>;
    /**
     * Seed a plan
     */
    seedPlan(planData: Partial<Plan>): Promise<Plan>;
    /**
     * Get seeding status
     */
    getStatus(): Promise<{
        superAdmins: number;
        customers: number;
        plans: number;
    }>;
}
//# sourceMappingURL=seeder.service.d.ts.map