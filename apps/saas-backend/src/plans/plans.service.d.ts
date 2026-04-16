import { Repository } from 'typeorm';
import { Plan } from '../master-entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlansService {
    private readonly repository;
    constructor(repository: Repository<Plan>);
    findAll(): Promise<Plan[]>;
    findOne(id: string): Promise<Plan>;
    create(dto: CreatePlanDto): Promise<Plan>;
    update(id: string, dto: UpdatePlanDto): Promise<Plan>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=plans.service.d.ts.map