"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("../common/auth/auth.service");
const super_admin_entity_1 = require("../master-entities/super-admin.entity");
const super_admins_service_1 = require("./super-admins.service");
describe('SuperAdminsService', () => {
    let service;
    let authService;
    let repository;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                super_admins_service_1.SuperAdminsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(super_admin_entity_1.SuperAdmin, 'master'),
                    useValue: mockSuperAdminRepository,
                },
                {
                    provide: auth_service_1.AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();
        service = module.get(super_admins_service_1.SuperAdminsService);
        authService = module.get(auth_service_1.AuthService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(super_admin_entity_1.SuperAdmin, 'master'));
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
            await expect(service.findOne('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('create', () => {
        it('should create a new admin', async () => {
            const createDto = {
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
            expect(mockAuthService.hashPassword).toHaveBeenCalledWith('securepassword');
        });
        it('should throw ConflictException if email already exists', async () => {
            const createDto = {
                email: 'admin@test.com',
                name: 'Admin User',
                password: 'password123',
            };
            mockSuperAdminRepository.findOne.mockResolvedValue(mockAdmin);
            await expect(service.create(createDto)).rejects.toThrow(common_1.ConflictException);
        });
        it('should hash the password before saving', async () => {
            const createDto = {
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
            expect(mockAuthService.hashPassword).toHaveBeenCalledWith('securepassword');
            expect(mockSuperAdminRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: createDto.email,
                hashedPassword,
            }));
        });
    });
    describe('update', () => {
        it('should update admin fields', async () => {
            const updateDto = {
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
            const updateDto = {
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
            await expect(service.update('non-existent', { name: 'Updated' })).rejects.toThrow(common_1.NotFoundException);
        });
        it('should not hash password if not provided', async () => {
            const updateDto = {
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
            await expect(service.remove('non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
