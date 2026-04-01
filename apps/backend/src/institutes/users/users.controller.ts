import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import type { CreateUserPayload, UpdateUserPayload } from './users.service';
import { UserRole } from './entities/user.entity';

@Controller('students') // We use 'students' as the collection name in URLs for this context
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() payload: CreateUserPayload) {
    return this.usersService.createUser(payload);
  }

  @Get()
  findAll(@Query('role') role?: UserRole) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserPayload) {
    return this.usersService.updateUser(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.activateUser(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
