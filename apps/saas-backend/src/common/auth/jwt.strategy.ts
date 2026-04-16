// Re-export JWT strategy and types for cleaner imports
import type { AuthenticatedUser } from './strategies/jwt.strategy';

export { JwtStrategy } from './strategies/jwt.strategy';
export type { JwtPayload, AuthenticatedUser } from './strategies/jwt.strategy';

// Type for authenticated requests
export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}
