import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../common/auth/auth.service';
import { SuperAdmin } from '../master-entities/super-admin.entity';
import { SuperAdminsService } from './super-admins.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';

describe('SuperAdminsService', () => {
  let service: SuperAdminsService;
  let authService: AuthService;
  let repository: any;

  const mockSuperAdminRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthService = {
    hashPassword: jest.fn(),
  };

  const mockAdmin = {
    id: 'admin-123',
    email: 'admin@test.com',
    name: 'Admin User',
    hashedPassword: '$2b$10$hashedpassword',
    role: 'super_admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperAdminsService,
        {
          provide: getRepositoryToken(SuperAdmin, 'master'),
          useValue: mockSuperAdminRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<SuperAdminsService>(SuperAdminsService);
    authService = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(SuperAdmin, 'master'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all admins without passwords', async () => {
      const adminList = [mockAdmin];
      mockSuperAdminRepository.find.mockResolvedValue(adminList);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('hashedPassword');
      expect(result[0]).toHaveProperty('id', 'admin-123');
    });

    it('should return empty array when no admins exist', async () => {
      mockSuperAdminRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return admin without password', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findOne('admin-123');

      expect(result).not.toHaveProperty('hashedPassword');
      expect(result).toHaveProperty('id', 'admin-123');
      expect(result).toHaveProperty('email', 'admin@test.com');
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new admin', async () => {
      const createDto: CreateSuperAdminDto = {
        email: 'newadmin@test.com',
        name: 'New Admin',
        password: 'securepassword',
      };

      const hashedPassword = '$2b$10$newhash';
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockSuperAdminRepository.findOne.mockResolvedValue(null); // No conflict
      mockSuperAdminRepository.create.mockReturnValue({
        ...createDto,
        hashedPassword,
        isActive: true,
        role: 'super_admin',
      });
      mockSuperAdminRepository.save.mockResolvedValue({
        ...createDto,
        hashedPassword,
        id: 'admin-456',
        isActive: true,
        role: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createDto);

      expect(result).not.toHaveProperty('hashedPassword');
      expect(result).toHaveProperty('email', 'newadmin@test.com');
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(
        'securepassword',
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      const createDto: CreateSuperAdminDto = {
        email: 'admin@test.com',
        name: 'Admin User',
        password: 'password123',
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password before saving', async () => {
      const createDto: CreateSuperAdminDto = {
        email: 'newadmin@test.com',
        name: 'New Admin',
        password: 'securepassword',
      };

      const hashedPassword = '$2b$10$newhash';
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockSuperAdminRepository.findOne.mockResolvedValue(null);
      mockSuperAdminRepository.create.mockReturnValue({
        email: createDto.email,
        name: createDto.name,
        hashedPassword,
      });
      mockSuperAdminRepository.save.mockResolvedValue({
        ...mockAdmin,
        email: createDto.email,
        name: createDto.name,
      });

      await service.create(createDto);

      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(
        'securepassword',
      );
      expect(mockSuperAdminRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createDto.email,
          hashedPassword,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update admin fields', async () => {
      const updateDto: UpdateSuperAdminDto = {
        name: 'Updated Name',
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockSuperAdminRepository.save.mockResolvedValue({
        ...mockAdmin,
        name: 'Updated Name',
      });

      const result = await service.update('admin-123', updateDto);

      expect(result.name).toBe('Updated Name');
      expect(result).not.toHaveProperty('hashedPassword');
    });

    it('should hash new password if provided', async () => {
      const updateDto: UpdateSuperAdminDto = {
        password: 'newpassword',
      };

      const newHashedPassword = '$2b$10$newhash';
      mockAuthService.hashPassword.mockResolvedValue(newHashedPassword);
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockSuperAdminRepository.save.mockResolvedValue({
        ...mockAdmin,
        hashedPassword: newHashedPassword,
      });

      await service.update('admin-123', updateDto);

      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('newpassword');
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not hash password if not provided', async () => {
      const updateDto: UpdateSuperAdminDto = {
        name: 'Updated Name',
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockSuperAdminRepository.save.mockResolvedValue({
        ...mockAdmin,
        name: 'Updated Name',
      });

      await service.update('admin-123', updateDto);

      expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an admin', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockSuperAdminRepository.remove.mockResolvedValue(undefined);

      await service.remove('admin-123');

      expect(mockSuperAdminRepository.remove).toHaveBeenCalledWith(mockAdmin);
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
