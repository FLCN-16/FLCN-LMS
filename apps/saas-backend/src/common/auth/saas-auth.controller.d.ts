import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
type AuthenticatedRequest = Request & {
    user?: {
        sub?: string;
        id?: string;
        email?: string;
        role?: string;
    };
};
export declare class SaasAuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(dto: LoginDto, res: Response): Promise<{
        user: import("./auth.service").AuthSessionUser;
        token: string;
        refreshToken: string;
        expiresIn: number;
        refreshTokenExpiresIn: number;
        expiresAt: Date;
        refreshTokenExpiresAt: Date;
    }>;
    session(req: AuthenticatedRequest): Promise<import("./auth.service").AuthSessionUser>;
    private isProduction;
}
export {};
//# sourceMappingURL=saas-auth.controller.d.ts.map