"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const api_key_entity_1 = require("../master-entities/api-key.entity");
const institute_entity_1 = require("../master-entities/institute.entity");
const api_keys_service_1 = require("./api-keys.service");
describe('ApiKeysService', () => {
    let service;
    let apiKeyRepository;
    let instituteRepository;
    const mockApiKeyRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findAndCount: jest.fn(),
        delete: jest.fn(),
    };
    const mockInstituteRepository = {
        findOne: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                api_keys_service_1.ApiKeysService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(api_key_entity_1.ApiKey, 'master'),
                    useValue: mockApiKeyRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(institute_entity_1.Institute, 'master'),
                    useValue: mockInstituteRepository,
                },
            ],
        }).compile();
        service = module.get(api_keys_service_1.ApiKeysService);
        apiKeyRepository = module.get((0, typeorm_1.getRepositoryToken)(api_key_entity_1.ApiKey, 'master'));
        instituteRepository = module.get((0, typeorm_1.getRepositoryToken)(institute_entity_1.Institute, 'master'));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('create', () => {
        it('should create a new API key successfully', async () => {
            const instituteId = 'inst-123';
            const createDto = {
                name: 'Test Key',
                scopes: ['read:licenses'],
                rateLimit: 1000,
            };
            const mockInstitute = { id: instituteId };
            const mockApiKey = {
                id: 'key-123',
                instituteId,
                keyHash: 'abc123hash',
                ...createDto,
                isActive: true,
                createdAt: new Date(),
            };
            mockInstituteRepository.findOne.mockResolvedValue(mockInstitute);
            mockApiKeyRepository.findOne.mockResolvedValue(null); // No collision
            mockApiKeyRepository.create.mockReturnValue(mockApiKey);
            mockApiKeyRepository.save.mockResolvedValue(mockApiKey);
            const result = await service.create(instituteId, createDto);
            expect(result).toHaveProperty('key');
            expect(result).toHaveProperty('warning');
            expect(result.key).toMatch(/^FLCN_/);
            expect(mockInstituteRepository.findOne).toHaveBeenCalledWith({
                where: { id: instituteId },
            });
        });
        it('should throw NotFoundException if institute does not exist', async () => {
            const instituteId = 'non-existent';
            const createDto = { name: 'Test Key' };
            mockInstituteRepository.findOne.mockResolvedValue(null);
            await expect(service.create(instituteId, createDto)).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw BadRequestException on key collision', async () => {
            const instituteId = 'inst-123';
            const createDto = { name: 'Test Key' };
            mockInstituteRepository.findOne.mockResolvedValue({ id: instituteId });
            mockApiKeyRepository.findOne.mockResolvedValue({ id: 'existing-key' }); // Collision detected
            await expect(service.create(instituteId, createDto)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('validateKey', () => {
        it('should return valid response for active, non-expired key', async () => {
            const key = 'FLCN_test123';
            const mockApiKey = {
                id: 'key-123',
                instituteId: 'inst-123',
                keyHash: 'abc123hash',
                isActive: true,
                scopes: ['read:licenses'],
                rateLimit: 1000,
                totalRequests: 5,
                expiresAt: new Date(Date.now() + 86400000), // 1 day in future
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            mockApiKeyRepository.save.mockResolvedValue(mockApiKey);
            const result = await service.validateKey(key);
            expect(result.isValid).toBe(true);
            expect(result.keyId).toBe('key-123');
            expect(result.message).toBe('API key is valid');
        });
        it('should return invalid for non-existent key', async () => {
            mockApiKeyRepository.findOne.mockResolvedValue(null);
            const result = await service.validateKey('FLCN_invalid');
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid API key');
        });
        it('should return invalid for inactive key', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: false,
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.validateKey('FLCN_test');
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('API key is inactive');
        });
        it('should return invalid for expired key', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: true,
                expiresAt: new Date(Date.now() - 1000), // 1 second in past
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.validateKey('FLCN_test');
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('API key has expired');
        });
        it('should update lastUsedAt and totalRequests on validation', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: true,
                totalRequests: 5,
                rateLimit: 1000,
                scopes: [],
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            mockApiKeyRepository.save.mockResolvedValue({
                ...mockApiKey,
                totalRequests: 6,
            });
            await service.validateKey('FLCN_test');
            expect(mockApiKeyRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                totalRequests: 6,
                lastUsedAt: expect.any(Date),
            }));
        });
    });
    describe('hasScope', () => {
        it('should return true if key has required scope', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: true,
                expiresAt: new Date(Date.now() + 86400000),
                scopes: ['read:licenses', 'write:features'],
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.hasScope('FLCN_test', 'read:licenses');
            expect(result).toBe(true);
        });
        it('should return false if key does not have required scope', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: true,
                expiresAt: new Date(Date.now() + 86400000),
                scopes: ['read:licenses'],
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.hasScope('FLCN_test', 'write:features');
            expect(result).toBe(false);
        });
        it('should return false for inactive key', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: false,
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.hasScope('FLCN_test', 'read:licenses');
            expect(result).toBe(false);
        });
        it('should return false for expired key', async () => {
            const mockApiKey = {
                id: 'key-123',
                isActive: true,
                expiresAt: new Date(Date.now() - 1000),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockApiKey);
            const result = await service.hasScope('FLCN_test', 'read:licenses');
            expect(result).toBe(false);
        });
    });
    describe('findAll', () => {
        it('should return paginated list of keys', async () => {
            const instituteId = 'inst-123';
            const mockKeys = [
                {
                    id: 'key-1',
                    instituteId,
                    name: 'Key 1',
                    keyHash: 'hash1',
                    isActive: true,
                    createdAt: new Date(),
                },
            ];
            mockApiKeyRepository.findAndCount.mockResolvedValue([mockKeys, 1]);
            const result = await service.findAll(instituteId, 1, 10);
            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(mockApiKeyRepository.findAndCount).toHaveBeenCalledWith({
                where: { instituteId },
                order: { createdAt: 'DESC' },
                skip: 0,
                take: 10,
            });
        });
    });
    describe('findOne', () => {
        it('should return key details', async () => {
            const keyId = 'key-123';
            const instituteId = 'inst-123';
            const mockKey = {
                id: keyId,
                instituteId,
                name: 'Test Key',
                keyHash: 'abc123hash',
                isActive: true,
                createdAt: new Date(),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockKey);
            const result = await service.findOne(instituteId, keyId);
            expect(result).toHaveProperty('id', keyId);
            expect(result).not.toHaveProperty('key'); // Key should not be in detail
        });
        it('should throw NotFoundException if key not found', async () => {
            mockApiKeyRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne('inst-123', 'non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('update', () => {
        it('should update key properties', async () => {
            const keyId = 'key-123';
            const instituteId = 'inst-123';
            const updateDto = {
                name: 'Updated Name',
                rateLimit: 2000,
            };
            const mockKey = {
                id: keyId,
                instituteId,
                name: 'Old Name',
                rateLimit: 1000,
                keyHash: 'abc123hash',
                isActive: true,
                createdAt: new Date(),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockKey);
            mockApiKeyRepository.save.mockResolvedValue({
                ...mockKey,
                ...updateDto,
            });
            const result = await service.update(instituteId, keyId, updateDto);
            expect(result.name).toBe('Updated Name');
            expect(result.rateLimit).toBe(2000);
        });
    });
    describe('disable', () => {
        it('should disable a key', async () => {
            const keyId = 'key-123';
            const instituteId = 'inst-123';
            const mockKey = {
                id: keyId,
                instituteId,
                isActive: true,
                keyHash: 'abc123hash',
                createdAt: new Date(),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockKey);
            mockApiKeyRepository.save.mockResolvedValue({
                ...mockKey,
                isActive: false,
            });
            const result = await service.disable(instituteId, keyId);
            expect(result.isActive).toBe(false);
        });
    });
    describe('enable', () => {
        it('should enable a key', async () => {
            const keyId = 'key-123';
            const instituteId = 'inst-123';
            const mockKey = {
                id: keyId,
                instituteId,
                isActive: false,
                keyHash: 'abc123hash',
                createdAt: new Date(),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockKey);
            mockApiKeyRepository.save.mockResolvedValue({
                ...mockKey,
                isActive: true,
            });
            const result = await service.enable(instituteId, keyId);
            expect(result.isActive).toBe(true);
        });
    });
    describe('delete', () => {
        it('should delete a key', async () => {
            mockApiKeyRepository.delete.mockResolvedValue({ affected: 1 });
            await service.delete('inst-123', 'key-123');
            expect(mockApiKeyRepository.delete).toHaveBeenCalledWith({
                id: 'key-123',
                instituteId: 'inst-123',
            });
        });
        it('should throw NotFoundException if key not found', async () => {
            mockApiKeyRepository.delete.mockResolvedValue({ affected: 0 });
            await expect(service.delete('inst-123', 'non-existent')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('getStats', () => {
        it('should return key statistics', async () => {
            const mockKey = {
                id: 'key-123',
                instituteId: 'inst-123',
                totalRequests: 150,
                rateLimit: 1000,
                lastUsedAt: new Date(),
            };
            mockApiKeyRepository.findOne.mockResolvedValue(mockKey);
            const result = await service.getStats('inst-123', 'key-123');
            expect(result).toHaveProperty('totalRequests', 150);
            expect(result).toHaveProperty('lastUsedAt');
            expect(result).toHaveProperty('requestsThisHour');
        });
    });
});
