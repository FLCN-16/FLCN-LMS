import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    private readonly abilityFactory;
    constructor(reflector: Reflector, abilityFactory: CaslAbilityFactory);
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=permissions.guard.d.ts.map