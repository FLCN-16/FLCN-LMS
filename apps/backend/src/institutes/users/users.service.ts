import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { InstituteContext } from '../../institutes-admin/services/institute-context.service';
import { User, UserRole } from './entities/user.entity';

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: UserRole;
  hashedPassword?: string;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: UserRole;
  hashedPassword?: string;
  isActive?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private instituteContext: InstituteContext) {}

  async createUser(payload: CreateUserPayload): Promise<User> {
    const userRepo = this.instituteContext.getRepository(User);

    // Validate required fields
    if (!payload.name || !payload.email) {
      throw new BadRequestException('Name and email are required');
    }

    // Check if user already exists
    const existingUser = await userRepo.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create new user
    const user = userRepo.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      avatarUrl: payload.avatarUrl,
      role: payload.role ?? UserRole.STUDENT,
      hashedPassword: payload.hashedPassword,
      isActive: payload.isActive ?? true,
    });

    return userRepo.save(user);
  }

  async findById(id: string): Promise<User> {
    const userRepo = this.instituteContext.getRepository(User);

    const user = await userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRepo = this.instituteContext.getRepository(User);

    const user = await userRepo.findOne({
      where: { email },
    });

    return user ?? null;
  }

  async findAll(): Promise<User[]> {
    const userRepo = this.instituteContext.getRepository(User);

    return userRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const userRepo = this.instituteContext.getRepository(User);

    return userRepo.find({
      where: { role },
      order: { createdAt: 'DESC' },
    });
  }

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const user = await this.findById(id);
    const userRepo = this.instituteContext.getRepository(User);

    // Check for email uniqueness if email is being updated
    if (payload.email && payload.email !== user.email) {
      const existingUser = await userRepo.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    // Update only provided fields
    Object.assign(user, payload);

    return userRepo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    const userRepo = this.instituteContext.getRepository(User);

    await userRepo.remove(user);
  }

  async userExists(email: string): Promise<boolean> {
    const userRepo = this.instituteContext.getRepository(User);

    const count = await userRepo.count({
      where: { email },
    });

    return count > 0;
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.findById(id);
    user.isActive = false;

    const userRepo = this.instituteContext.getRepository(User);
    return userRepo.save(user);
  }

  async activateUser(id: string): Promise<User> {
    const user = await this.findById(id);
    user.isActive = true;

    const userRepo = this.instituteContext.getRepository(User);
    return userRepo.save(user);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.findById(id);

    if (!hashedPassword) {
      throw new BadRequestException('Password is required');
    }

    user.hashedPassword = hashedPassword;

    const userRepo = this.instituteContext.getRepository(User);
    return userRepo.save(user);
  }

  async countByRole(role: UserRole): Promise<number> {
    const userRepo = this.instituteContext.getRepository(User);

    return userRepo.count({
      where: { role },
    });
  }

  async totalCount(): Promise<number> {
    const userRepo = this.instituteContext.getRepository(User);

    return userRepo.count();
  }

  toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
