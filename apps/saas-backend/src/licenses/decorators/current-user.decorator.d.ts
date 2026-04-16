/**
 * Extracts the current user ID from the authenticated request
 *
 * Usage: @CurrentUser() userId: string
 *
 * Note: This decorator relies on JwtStrategy setting request.user.
 * It will return null if the request is not authenticated.
 */
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
//# sourceMappingURL=current-user.decorator.d.ts.map