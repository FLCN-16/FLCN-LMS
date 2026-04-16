import { Repository } from 'typeorm';
import { InstituteBilling } from '../master-entities/institute-billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
export declare class BillingService {
    private readonly repository;
    constructor(repository: Repository<InstituteBilling>);
    findAll(): Promise<InstituteBilling[]>;
    findByInstitute(instituteId: string): Promise<InstituteBilling>;
    create(dto: CreateBillingDto): Promise<InstituteBilling>;
    update(id: string, dto: UpdateBillingDto): Promise<InstituteBilling>;
}
//# sourceMappingURL=billing.service.d.ts.map