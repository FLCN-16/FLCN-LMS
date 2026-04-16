import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { PermissionDescriptor } from '@flcn-lms/types/auth';

import type { AuthenticatedRequest } from '../auth/jwt.strategy';
import {
  CaslAbilityFactory,
  toAbilityUser,
} from '../casl/casl-ability.factory';
import { CHECK_PERMISSION_KEY } from '../decorators/check-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<PermissionDescriptor>(
      CHECK_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    this.abilityFactory.ensureRequestAccess(
      context,
      toAbilityUser(request.user),
      permission,
    );

    return true;
  }
}
