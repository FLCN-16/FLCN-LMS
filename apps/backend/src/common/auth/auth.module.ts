import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { InstitutesAdminModule } from '../../institutes-admin/institutes-admin.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SaasAuthController } from './saas-auth.controller';

@Module({
  imports: [ConfigModule, InstitutesAdminModule],
  controllers: [SaasAuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, SaasAuthController],
})
export class AuthModule {}
