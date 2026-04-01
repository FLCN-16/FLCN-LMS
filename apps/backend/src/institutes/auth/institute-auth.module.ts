import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from '../../common/auth/auth.service';
import { InstituteAuthController } from './institute-auth.controller';
import { InstituteJwtStrategy } from './institute-jwt.strategy';

@Module({
  imports: [ConfigModule],
  controllers: [InstituteAuthController],
  providers: [AuthService, InstituteJwtStrategy],
  exports: [AuthService, InstituteJwtStrategy, InstituteAuthController],
})
export class InstituteAuthModule {}
