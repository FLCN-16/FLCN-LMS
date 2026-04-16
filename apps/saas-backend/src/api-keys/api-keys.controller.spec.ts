import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';

describe('ApiKeysController', () => {
  let controller: ApiKeysController;
  let service: ApiKeysService;

  const mockApiKeysService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
    delete: jest.fn(),
    getStats: jest.fn(),
    validateKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeysController],
      providers: [
        {
          provide: ApiKeysService,
          useValue: mockApiKeysService,
        },
      ],
    }).compile();

    controller = module.get<ApiKeysController>(ApiKeysController);
    service = module.get<ApiKeysService>(ApiKeysService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new API key', async () => {
      const instituteId = 'inst-123';
      const createDto = { name: 'Test Key', scopes: ['read:licenses'] };
      const mockResponse = {
        id: 'key-123',
        instituteId,
        name: 'Test Key',
        key: 'FLCN_test123',
        warning: 'Save this key securely. You will not be able to see it again!',
      };

      mockApiKeysService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createDto, instituteId);

      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(instituteId, createDto);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      const createDto = { name: 'Test Key' };

      await expect(controller.create(createDto, '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated list of keys', async () => {
      const instituteId = 'inst-123';
      const mockResponse = {
        data: [{ id: 'key-1', name: 'Key 1' }],
        total: 1,
      };

      mockApiKeysService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(instituteId, '1', '10');

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledWith(instituteId, 1, 10);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(
        controller.findAll('', undefined, undefined),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if pagination is invalid', async () => {
      await expect(
        controller.findAll('inst-123', '0', '10'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if limit exceeds 100', async () => {
      await expect(
        controller.findAll('inst-123', '1', '101'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single key', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';
      const mockResponse = { id: keyId, name: 'Test Key' };

      mockApiKeysService.findOne.mockResolvedValue(mockResponse);

      const result = await controller.findOne(keyId, instituteId);

      expect(result).toEqual(mockResponse);
      expect(service.findOne).toHaveBeenCalledWith(instituteId, keyId);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(controller.findOne('key-123', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a key', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';
      const updateDto = { name: 'Updated Name' };
      const mockResponse = { id: keyId, name: 'Updated Name' };

      mockApiKeysService.update.mockResolvedValue(mockResponse);

      const result = await controller.update(keyId, instituteId, updateDto);

      expect(result).toEqual(mockResponse);
      expect(service.update).toHaveBeenCalledWith(
        instituteId,
        keyId,
        updateDto,
      );
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(
        controller.update('key-123', '', { name: 'Updated' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('disable', () => {
    it('should disable a key', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';
      const mockResponse = { id: keyId, isActive: false };

      mockApiKeysService.disable.mockResolvedValue(mockResponse);

      const result = await controller.disable(keyId, instituteId);

      expect(result).toEqual(mockResponse);
      expect(service.disable).toHaveBeenCalledWith(instituteId, keyId);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(controller.disable('key-123', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('enable', () => {
    it('should enable a key', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';
      const mockResponse = { id: keyId, isActive: true };

      mockApiKeysService.enable.mockResolvedValue(mockResponse);

      const result = await controller.enable(keyId, instituteId);

      expect(result).toEqual(mockResponse);
      expect(service.enable).toHaveBeenCalledWith(instituteId, keyId);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(controller.enable('key-123', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a key', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';

      mockApiKeysService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(keyId, instituteId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(instituteId, keyId);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(controller.delete('key-123', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStats', () => {
    it('should return key statistics', async () => {
      const keyId = 'key-123';
      const instituteId = 'inst-123';
      const mockResponse = {
        totalRequests: 100,
        requestsThisHour: 50,
      };

      mockApiKeysService.getStats.mockResolvedValue(mockResponse);

      const result = await controller.getStats(keyId, instituteId);

      expect(result).toEqual(mockResponse);
      expect(service.getStats).toHaveBeenCalledWith(instituteId, keyId);
    });

    it('should throw BadRequestException if instituteId is missing', async () => {
      await expect(controller.getStats('key-123', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validate', () => {
    it('should validate an API key', async () => {
      const mockResponse = {
        isValid: true,
        keyId: 'key-123',
        message: 'API key is valid',
      };

      mockApiKeysService.validateKey.mockResolvedValue(mockResponse);

      const result = await controller.validate({ key: 'FLCN_test123' });

      expect(result).toEqual(mockResponse);
      expect(service.validateKey).toHaveBeenCalledWith('FLCN_test123');
    });

    it('should return invalid for bad key', async () => {
      const mockResponse = {
        isValid: false,
        message: 'Invalid API key',
      };

      mockApiKeysService.validateKey.mockResolvedValue(mockResponse);

      const result = await controller.validate({ key: 'INVALID' });

      expect(result.isValid).toBe(false);
    });
  });
});
