import { Controller, Get, Inject, Logger, Version } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InstituteConnectionManager } from '../database/institute/institute-connection.manager';
import { Institute } from '../master-entities/institute.entity';
import { InstituteContext } from './services/institute-context.service';

/**
 * InstitutesAdminController
 *
 * Test and diagnostic endpoints for the multi-tenancy infrastructure.
 * Verifies that:
 * 1. Institute context is properly initialized
 * 2. Database routing is working correctly
 * 3. Master and institute databases are accessible
 *
 * ENDPOINTS:
 * GET /institutes/context - Get current institute context
 * GET /institutes/info - Get institute information from master DB
 */
@Controller({
  version: '1',
})
export class InstitutesAdminController {
  private readonly logger = new Logger(InstitutesAdminController.name);

  constructor(
    private readonly instituteContext: InstituteContext,
    @Inject('master')
    private readonly masterDataSource: DataSource,
    private readonly databaseManager: InstituteConnectionManager,
  ) {}

  /**
   * GET /tenants/context
   *
   * Returns the current institute context for this request.
   * Useful for debugging and verifying that the middleware is working correctly.
   *
   * @returns Institute context information (ID, slug, initialization status)
   */
  @Get('context')
  async getContext() {
    try {
      const instituteId = this.instituteContext.getInstituteId();
      const instituteSlug = this.instituteContext.getInstituteSlug();
      const isInitialized = this.instituteContext.isInitialized();

      this.logger.log(
        `Retrieved context for institute: ${instituteSlug} (${instituteId})`,
      );

      return {
        success: true,
        data: {
          instituteId,
          instituteSlug,
          isInitialized,
          timestamp: new Date().toISOString(),
        },
        message: 'Institute context is properly initialized by middleware',
      };
    } catch (error) {
      this.logger.error(`Failed to get context: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message:
          'Institute context is not initialized. Check that InstituteRoutingMiddleware is applied.',
      };
    }
  }

  /**
   * GET /tenants/info
   *
   * Retrieves institute information from the master database.
   * Shows: name, plan, status, database configuration.
   *
   * @returns Institute metadata and database configuration
   */
  @Get('info')
  async getInstituteInfo() {
    try {
      const instituteId = this.instituteContext.getInstituteId();
      const instituteRepo = this.masterDataSource.getRepository(Institute);

      const institute = await instituteRepo.findOne({
        where: { id: instituteId },
        relations: ['databases'],
      });

      if (!institute) {
        this.logger.warn(
          `Institute not found in master database: ${instituteId}`,
        );
        return {
          success: false,
          error: 'Institute not found in master database',
        };
      }

      this.logger.log(`Retrieved institute info: ${institute.name}`);

      return {
        success: true,
        data: {
          id: institute.id,
          name: institute.name,
          slug: institute.slug,
          plan: institute.planId,
          isActive: institute.isActive,
          maxUsers: institute.maxUsers,
          maxCourses: institute.maxCourses,
          maxStorageGb: institute.maxStorageGb,
          createdAt: institute.createdAt,
          databases: institute.databases?.map((db) => ({
            id: db.id,
            dbName: db.dbName,
            dbHost: db.dbHost,
            dbPort: db.dbPort,
            isActive: db.isActive,
            createdAt: db.createdAt,
          })),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get institute info: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * GET /tenants/health
   *
   * Health check for the institute database connection.
   * Executes a simple query to verify the connection is working.
   *
   * @returns Database connection status and timestamp
   */
  @Get('health')
  async healthCheck() {
    try {
      const instituteId = this.instituteContext.getInstituteId();
      const instituteSlug = this.instituteContext.getInstituteSlug();
      const dataSource = this.instituteContext.getDataSource();

      // Verify DataSource is initialized
      if (!dataSource.isInitialized) {
        throw new Error('Institute DataSource is not initialized');
      }

      // Execute a simple query to verify connection
      const result = await dataSource.query('SELECT NOW() as current_time');
      const currentTime = result[0]?.current_time;

      this.logger.log(
        `Health check passed for institute: ${instituteSlug} (${instituteId})`,
      );

      return {
        success: true,
        data: {
          institute: {
            id: instituteId,
            slug: instituteSlug,
          },
          database: {
            connected: true,
            isInitialized: dataSource.isInitialized,
            timestamp: currentTime,
          },
        },
        message: 'Institute database connection is healthy',
      };
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        message: 'Institute database connection failed',
      };
    }
  }

  /**
   * GET /tenants/cache-stats
   *
   * Returns statistics about the DataSource cache.
   * Shows how many institute databases are currently cached.
   * Useful for monitoring and debugging connection pooling.
   *
   * @returns Cache statistics (size, cached institutes)
   */
  @Get('cache-stats')
  async getCacheStats() {
    try {
      const cacheSize = this.databaseManager.getCacheSize();
      const cachedInstituteIds = this.databaseManager.getCachedInstituteIds();
      const currentInstituteId = this.instituteContext.getInstituteId();

      this.logger.log(
        `Cache stats: ${cacheSize} institutes cached, current: ${currentInstituteId}`,
      );

      return {
        success: true,
        data: {
          currentRequest: {
            instituteId: currentInstituteId,
            isCached:
              cachedInstituteIds.includes(currentInstituteId) && cacheSize > 0,
          },
          cache: {
            totalCached: cacheSize,
            cachedInstituteIds,
            maxPerInstitute: 10, // Connection pool size
          },
        },
        message: 'Cache statistics retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to get cache stats: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * GET /tenants/master-health
   *
   * Health check for the master database connection.
   * Verifies that the master database is accessible.
   *
   * @returns Master database connection status
   */
  @Get('master-health')
  async masterHealthCheck() {
    try {
      // Execute a simple query on master database
      const result = await this.masterDataSource.query(
        'SELECT NOW() as current_time',
      );
      const currentTime = result[0]?.current_time;

      this.logger.log('Master database health check passed');

      return {
        success: true,
        data: {
          master: {
            connected: true,
            isInitialized: this.masterDataSource.isInitialized,
            timestamp: currentTime,
          },
        },
        message: 'Master database connection is healthy',
      };
    } catch (error) {
      this.logger.error(
        `Master database health check failed: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
        message: 'Master database connection failed',
      };
    }
  }
}
