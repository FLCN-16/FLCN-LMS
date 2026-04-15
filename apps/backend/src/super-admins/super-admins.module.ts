import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../common/auth/auth.module';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { SuperAdminsController } from './super-admins.controller';
import { SuperAdminsService } from './super-admins.service';

@Module({
  imports: [TypeOrmModule.forFeature([SuperAdmin], 'master'), AuthModule],
  providers: [SuperAdminsService],
  controllers: [SuperAdminsController],
  exports: [SuperAdminsService],
})
export class SuperAdminsModule {}
