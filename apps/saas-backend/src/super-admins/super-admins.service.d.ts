import { Repository } from 'typeorm';
import { AuthService } from '../common/auth/auth.service';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
export declare class SuperAdminsService {
    private readonly repository;
    private readonly authService;
    constructor(repository: Repository<SuperAdmin>, authService: AuthService);
    findAll(): Promise<Omit<SuperAdmin, 'hashedPassword'>[]>;
    findOne(id: string): Promise<Omit<SuperAdmin, 'hashedPassword'>>;
    create(dto: CreateSuperAdminDto): Promise<Omit<SuperAdmin, 'hashedPassword'>>;
    update(id: string, dto: UpdateSuperAdminDto): Promise<Omit<SuperAdmin, 'hashedPassword'>>;
    remove(id: string): Promise<void>;
    /**
     * Remove sensitive password field from admin object before returning
     */
    private excludePassword;
}
//# sourceMappingURL=super-admins.service.d.ts.map