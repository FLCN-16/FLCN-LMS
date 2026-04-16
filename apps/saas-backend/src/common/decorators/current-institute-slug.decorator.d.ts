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
export declare const CurrentInstituteSlug: (...dataOrPipes: unknown[]) => ParameterDecorator;
//# sourceMappingURL=current-institute-slug.decorator.d.ts.map