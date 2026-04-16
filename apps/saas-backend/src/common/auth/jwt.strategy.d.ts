import type { AuthenticatedUser } from './strategies/jwt.strategy';
export { JwtStrategy } from './strategies/jwt.strategy';
export type { JwtPayload, AuthenticatedUser } from './strategies/jwt.strategy';
export interface AuthenticatedRequest {
    user: AuthenticatedUser;
}
//# sourceMappingURL=jwt.strategy.d.ts.map