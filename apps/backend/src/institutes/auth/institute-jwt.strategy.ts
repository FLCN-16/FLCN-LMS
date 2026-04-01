import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { InstituteConnectionManager } from '../../database/institute/institute-connection.manager';
import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import type { AuthSessionUser } from '../../common/auth/auth.service';
import { User } from '../users/entities/user.entity';

export interface InstituteJwtPayload {
  sub: string;
  instituteSlug: string;
  email: string;
  role: string;
}

@Injectable()
export class InstituteJwtStrategy extends PassportStrategy(
  Strategy,
  'institute-jwt',
) {
  constructor(
     private connectionManager: InstituteConnectionManager,
     private instituteContext: InstituteContext,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.INSTITUTE_JWT_SECRET || process.env.JWT_SECRET,
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: InstituteJwtPayload) {
    const urlSlug = req.params.instituteSlug;

    // Security check — URL slug must match the JWT slug
    if (urlSlug && urlSlug !== payload.instituteSlug) {
      throw new UnauthorizedException('Institute mismatch');
    }

    const instituteId = (payload as any).instituteId;

    if (!instituteId) {
      throw new UnauthorizedException('Institute ID not found in token');
    }

    // Use the DataSource from context if it matches the token's institute
    let dataSource: DataSource;
    if (this.instituteContext.getInstituteId() === instituteId) {
      dataSource = this.instituteContext.getDataSource();
    } else {
      // Fallback: get from connection manager (middleware should have already handled this)
      dataSource = await this.connectionManager.getOrCreateDataSource(
        instituteId,
        (req as any).tenantDatabaseConfig, // Middleware should attach this for fallback
      );
    }

    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: payload.sub } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return { ...user, instituteSlug: payload.instituteSlug };
  }
}
