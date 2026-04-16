import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { SuperAdmin } from '../../master-entities/super-admin.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let superAdminRepository: any;

  const mockSuperAdminRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(SuperAdmin, 'master'),
          useValue: mockSuperAdminRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    superAdminRepository = module.get(getRepositoryToken(SuperAdmin, 'master'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
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

    it('should successfully login with valid credentials', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token-123');

      const result = await service.login('admin@test.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt-token-123');
      expect(result.user).toHaveProperty('id', 'admin-123');
      expect(result.user).toHaveProperty('email', 'admin@test.com');
      expect(result.user).not.toHaveProperty('hashedPassword');
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@test.com', 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      await expect(
        service.login('admin@test.com', 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('admin@test.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password hash is missing', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        hashedPassword: null,
      });

      await expect(
        service.login('admin@test.com', 'password123'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should set token expiration to 30 days with remember flag', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token-30d');

      await service.login('admin@test.com', 'password123', true);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ expiresIn: '30d' }),
      );
    });
  });

  describe('getSession', () => {
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

    it('should retrieve active session user', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.getSession('admin-123');

      expect(result).toHaveProperty('id', 'admin-123');
      expect(result).toHaveProperty('email', 'admin@test.com');
      expect(result).not.toHaveProperty('hashedPassword');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue(null);

      await expect(service.getSession('non-existent')).rejects.toThrow(
        'Session is invalid',
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      mockSuperAdminRepository.findOne.mockResolvedValue({
        ...mockAdmin,
        isActive: false,
      });

      await expect(service.getSession('admin-123')).rejects.toThrow(
        'Session is invalid',
      );
    });
  });

  describe('signToken', () => {
    it('should sign token with 24h expiration by default', () => {
      mockJwtService.sign.mockReturnValue('jwt-token');

      const payload = {
        sub: 'admin-123',
        id: 'admin-123',
        email: 'admin@test.com',
        role: 'super_admin',
      };

      const result = service.signToken(payload);

      expect(result).toBe('jwt-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({ expiresIn: '24h' }),
      );
    });

    it('should sign token with 30d expiration when remember is true', () => {
      mockJwtService.sign.mockReturnValue('jwt-token-30d');

      const payload = {
        sub: 'admin-123',
        id: 'admin-123',
        email: 'admin@test.com',
        role: 'super_admin',
      };

      const result = service.signToken(payload, true);

      expect(result).toBe('jwt-token-30d');
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({ expiresIn: '30d' }),
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should handle bcrypt errors gracefully', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));

      await expect(service.hashPassword('password')).rejects.toThrow(
        'Hash failed',
      );
    });
  });

  describe('password verification (private verifyPassword)', () => {
    it('should verify correct password', async () => {
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@test.com',
        hashedPassword,
        isActive: true,
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      // We verify through the login flow since verifyPassword is private
      await service.login('admin@test.com', password);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should reject incorrect password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@test.com',
        hashedPassword: '$2b$10$hashedpassword',
        isActive: true,
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(
        service.login('admin@test.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle bcrypt errors by returning false', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(
        new Error('Invalid hash format'),
      );

      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@test.com',
        hashedPassword: 'invalid-hash',
        isActive: true,
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(
        service.login('admin@test.com', 'password'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('toSessionUser (private)', () => {
    it('should exclude password field from admin object', async () => {
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

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockJwtService.sign.mockReturnValue('token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('admin@test.com', 'password123');

      expect(result.user).toEqual({
        id: 'admin-123',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'super_admin',
        isActive: true,
        createdAt: mockAdmin.createdAt,
        updatedAt: mockAdmin.updatedAt,
      });

      expect(result.user).not.toHaveProperty('hashedPassword');
    });

    it('should default role to super_admin if not set', async () => {
      const mockAdmin = {
        id: 'admin-123',
        email: 'admin@test.com',
        name: 'Admin User',
        hashedPassword: '$2b$10$hashedpassword',
        role: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
      mockJwtService.sign.mockReturnValue('token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('admin@test.com', 'password123');

      expect(result.user.role).toBe('super_admin');
    });
  });
});
