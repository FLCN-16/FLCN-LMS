import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { SuperAdminsService } from './super-admins.service';
export declare class SuperAdminsController {
    private readonly service;
    constructor(service: SuperAdminsService);
    findAll(): Promise<Omit<import("../master-entities/super-admin.entity").SuperAdmin, "hashedPassword">[]>;
    findOne(id: string): Promise<Omit<import("../master-entities/super-admin.entity").SuperAdmin, "hashedPassword">>;
    create(dto: CreateSuperAdminDto): Promise<Omit<import("../master-entities/super-admin.entity").SuperAdmin, "hashedPassword">>;
    update(id: string, dto: UpdateSuperAdminDto): Promise<Omit<import("../master-entities/super-admin.entity").SuperAdmin, "hashedPassword">>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=super-admins.controller.d.ts.map