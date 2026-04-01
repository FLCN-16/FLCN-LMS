import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  type ExecutionContext,
} from '@nestjs/common';

import type {
  AppAction,
  AppSubject,
  PermissionDescriptor,
  Role,
} from '@flcn-lms/types/auth';
import {
  isTenantScopedSubject,
  normalizePermissions,
} from '@flcn-lms/types/auth';

import type { JwtPayload } from '../auth/jwt.strategy';

export type AppAbility = MongoAbility<[AppAction, AppSubject]>;

export interface AbilityUser {
  id: string;
  role: Role;
  instituteId?: string;
  permissions?: string[];
}

export function createAppAbility(user: AbilityUser) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  const permissions = normalizePermissions(user.role, user.permissions);

  permissions.forEach((permission) => {
    const [action, subject] = permission.split(':') as [AppAction, AppSubject];
    can(action, subject);
  });

  return build();
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: AbilityUser): AppAbility {
    return createAppAbility(user);
  }

  ensureRequestAccess(
    context: ExecutionContext,
    user: AbilityUser,
    permission: PermissionDescriptor,
  ) {
    const ability = this.createForUser(user);

    if (!ability.can(permission.action, permission.subject)) {
      throw new ForbiddenException(
        `Missing permission ${permission.action}:${permission.subject}`,
      );
    }

    if (isTenantScopedSubject(permission.subject)) {
      const request = context.switchToHttp().getRequest<{
        headers: Record<string, string | string[] | undefined>;
      }>();
      const instituteIdHeader = request.headers['x-institute-id'];
      const requestTenantId =
        typeof instituteIdHeader === 'string' ? instituteIdHeader : undefined;

      if (
        !user.instituteId ||
        !requestTenantId ||
        requestTenantId !== user.instituteId
      ) {
        throw new ForbiddenException(
          'You cannot access resources outside your tenant scope',
        );
      }
    }
  }
}

export function toAbilityUser(payload: JwtPayload): AbilityUser {
  const userId = payload.sub ?? payload.id ?? payload.userId;

  if (!userId || typeof payload.role !== 'string') {
    throw new ForbiddenException('Authenticated user payload is incomplete');
  }

  return {
    id: userId,
    role: payload.role as Role,
    instituteId:
      typeof payload.instituteId === 'string' ? payload.instituteId : undefined,
    permissions: Array.isArray(payload.permissions)
      ? payload.permissions.filter(
          (permission): permission is string => typeof permission === 'string',
        )
      : undefined,
  };
}
