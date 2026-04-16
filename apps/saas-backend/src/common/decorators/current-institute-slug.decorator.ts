import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentInstituteSlug decorator
 *
 * Extracts the institute slug from the request.
 * Priorities:
 * 1. URL parameter ':instituteSlug' (from RouterModule)
 * 2. req.user.instituteSlug (from JWT payload)
 *
 * Usage in controllers:
 * @Get()
 * findAll(@CurrentInstituteSlug() slug: string) {
 *   return this.service.findAll(slug);
 * }
 */
export const CurrentInstituteSlug = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    // 1. Try to get from URL params (RouterModule path: 'api/:instituteSlug/v1')
    const urlSlug = request.params.instituteSlug;
    if (urlSlug) return urlSlug;

    // 2. Fallback to req.user.instituteSlug from JWT payload
    return request.user?.instituteSlug;
  },
);
