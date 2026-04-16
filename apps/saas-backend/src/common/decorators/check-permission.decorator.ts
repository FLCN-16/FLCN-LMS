import { SetMetadata } from '@nestjs/common';

import type { AppAction, AppSubject } from '@flcn-lms/types/auth';

export const CHECK_PERMISSION_KEY = 'check_permission';

export function CheckPermission(action: AppAction, subject: AppSubject) {
  return SetMetadata(CHECK_PERMISSION_KEY, { action, subject });
}
