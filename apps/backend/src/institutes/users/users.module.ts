import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * UsersModule
 *
 * Provides user management services for the application.
 *
 * Changes from old pattern:
 * - Removed: TypeOrmModule.forFeature([User]) - no longer using @InjectRepository
 * - Updated: UsersService now injects InstituteContext for database access
 * - Result: Database repositories are fetched per-request from InstituteContext
 *
 * Exports:
 * - UsersService: For managing user operations (create, find, update, delete)
 *
 * Dependencies:
 * - InstituteContext: Provided globally by TenantsModule (automatic)
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
