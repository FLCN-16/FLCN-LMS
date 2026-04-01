import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { SuperAdminsService } from './super-admins.service';
import { SuperAdminsController } from './super-admins.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SuperAdmin], 'master')],
  providers: [SuperAdminsService],
  controllers: [SuperAdminsController],
  exports: [SuperAdminsService],
})
export class SuperAdminsModule {}
