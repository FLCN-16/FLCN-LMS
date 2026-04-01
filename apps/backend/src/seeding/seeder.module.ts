import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Institute } from '../master-entities/institute.entity';
import { User } from '../institutes/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Institute])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
