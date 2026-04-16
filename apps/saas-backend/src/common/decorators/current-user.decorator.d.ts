import { Request } from 'express';
export type JwtUserPayload = {
    sub?: string;
    id?: string;
    userId?: string;
    instituteId?: string;
    email?: string;
    role?: string;
    permissions?: string[];
    [key: string]: unknown;
};
export type AuthenticatedRequest = Request & {
    user?: JwtUserPayload;
};
export interface CurrentUserShape {
    id: string;
    instituteId?: string;
    email?: string;
    role?: string;
    payload: JwtUserPayload;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
//# sourceMappingURL=current-user.decorator.d.ts.map