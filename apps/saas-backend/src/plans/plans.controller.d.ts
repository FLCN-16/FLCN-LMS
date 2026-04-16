import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly service;
    constructor(service: PlansService);
    findAll(): Promise<import("../master-entities/plan.entity").Plan[]>;
    findOne(id: string): Promise<import("../master-entities/plan.entity").Plan>;
    create(dto: CreatePlanDto): Promise<import("../master-entities/plan.entity").Plan>;
    update(id: string, dto: UpdatePlanDto): Promise<import("../master-entities/plan.entity").Plan>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=plans.controller.d.ts.map