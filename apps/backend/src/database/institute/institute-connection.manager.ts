import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { InstituteDatabase } from '../../master-entities/institute-database.entity';
import { INSTITUTE_ENTITIES } from './institute-entities';

/**
 * SINGLETON SERVICE: InstituteConnectionManager
 *
 * Manages a pool/cache of TypeORM DataSource connections, one per institute.
 *
 * Responsibilities:
 * 1. Cache DataSource instances by institute ID
 * 2. Initialize new DataSource connections on first request
 * 3. Reuse cached connections for subsequent requests
 * 4. Handle connection configuration from master DB
 *
 * The middleware (InstituteRoutingMiddleware) calls this service:
 * 1. Pass the institute's database configuration from master DB
 * 2. Get the DataSource for that institute
 * 3. Inject the DataSource into InstituteContext
 *
 * Caching strategy:
 * - DataSources are expensive to initialize (connections established)
 * - Cache them by institute ID
 * - Reuse for all requests to that institute
 * - Optional: add connection pool limits, TTL, eviction
 *
 * Future enhancements:
 * - Connection pool limits per institute
 * - LRU eviction policy
 * - Health checks / reconnection
 * - Metrics collection
 */
@Injectable()
export class InstituteConnectionManager {
  private readonly logger = new Logger(InstituteConnectionManager.name);

  /**
   * Cache of DataSource instances
   * Key: institute ID (UUID)
   * Value: Initialized TypeORM DataSource
   */
  private dataSourceCache = new Map<string, DataSource>();

  /**
   * Get or create a DataSource for an institute
   *
   * Steps:
   * 1. Check if DataSource is already cached for this institute
   * 2. If cached and initialized, return it
   * 3. If not cached, initialize a new DataSource
   * 4. Cache and return the new DataSource
   *
   * @param instituteId - UUID of the institute
   * @param instituteDatabaseConfig - Database configuration from master DB
   * @param entities - Array of entity classes for this institute's database
   * @returns Initialized DataSource for the institute's database
   *
   * @throws Error if connection fails
   */
  async getOrCreateDataSource(
    instituteId: string,
    instituteDatabaseConfig: InstituteDatabase,
    entities: any[] = INSTITUTE_ENTITIES,
  ): Promise<DataSource> {
    // Check if already cached
    const cachedDataSource = this.dataSourceCache.get(instituteId);
    if (cachedDataSource && cachedDataSource.isInitialized) {
      this.logger.debug(
        `Using cached DataSource for institute ${instituteId}`,
      );
      return cachedDataSource;
    }

    // Initialize new DataSource
    this.logger.log(
      `Initializing new DataSource for institute ${instituteId} (db: ${instituteDatabaseConfig.dbName})`,
    );

    // Use connection string if available, otherwise construct from components
    const url = instituteDatabaseConfig.connectionString
      ? instituteDatabaseConfig.connectionString
      : `postgresql://${instituteDatabaseConfig.dbUser}:${instituteDatabaseConfig.dbPassword}@${instituteDatabaseConfig.dbHost}:${instituteDatabaseConfig.dbPort}/${instituteDatabaseConfig.dbName}`;

    const dataSource = new DataSource({
      type: 'postgres',
      url: url,
      // Load all institute-specific entities
      entities: entities,
      synchronize: false, // Never auto-sync in production
      logging: false, // Set to true for debugging connection issues
      maxQueryExecutionTime: 5000, // Log slow queries
      extra: {
        // Connection pool settings
        max: 10, // Max connections per institute
        min: 1, // Min connections per institute
        idleTimeoutMillis: 30000, // Close idle connections after 30s
        connectionTimeoutMillis: 2000, // Connection timeout
      },
    });

    try {
      // Initialize the connection
      await dataSource.initialize();
      this.logger.log(
        `Successfully initialized DataSource for institute ${instituteId}`,
      );

      // Cache the DataSource
      this.dataSourceCache.set(instituteId, dataSource);

      return dataSource;
    } catch (error) {
      this.logger.error(
        `Failed to initialize DataSource for institute ${instituteId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get a cached DataSource if it exists
   *
   * @param instituteId - UUID of the institute
   * @returns DataSource if cached and initialized, otherwise undefined
   */
  getCachedDataSource(instituteId: string): DataSource | undefined {
    const dataSource = this.dataSourceCache.get(instituteId);
    if (dataSource && dataSource.isInitialized) {
      return dataSource;
    }
    return undefined;
  }

  /**
   * Invalidate/clear the cached DataSource for an institute
   * Useful for reconnections or updates to institute DB config
   *
   * @param instituteId - UUID of the institute
   */
  async invalidateDataSource(instituteId: string): Promise<void> {
    const dataSource = this.dataSourceCache.get(instituteId);
    if (dataSource && dataSource.isInitialized) {
      this.logger.log(`Closing DataSource for institute ${instituteId}`);
      await dataSource.destroy();
    }
    this.dataSourceCache.delete(instituteId);
  }

  /**
   * Clear all cached DataSources
   * Useful for graceful shutdown or testing
   *
   * @returns Promise that resolves when all connections are closed
   */
  async closeAll(): Promise<void> {
    this.logger.log(
      `Closing all cached DataSources (${this.dataSourceCache.size} total)`,
    );
    const promises: Promise<void>[] = [];

    for (const [instituteId, dataSource] of this.dataSourceCache.entries()) {
      if (dataSource.isInitialized) {
        promises.push(dataSource.destroy());
      }
    }

    await Promise.all(promises);
    this.dataSourceCache.clear();
    this.logger.log('All DataSources closed successfully');
  }

  /**
   * Get a repository for an institute-specific entity by institute ID
   *
   * @param instituteId - UUID of the institute
   * @param entity - The entity class
   * @returns TypeORM Repository for the given entity
   */
  async getRepo<Entity extends ObjectLiteral>(
    instituteId: string,
    entity: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const dataSource = this.getCachedDataSource(instituteId);
    if (!dataSource) {
      throw new Error(
        `No initialized DataSource found for institute ${instituteId}. Context must be initialized first.`,
      );
    }
    return dataSource.getRepository(entity);
  }

  /**
   * Get the number of cached DataSources
   * Useful for monitoring/metrics
   *
   * @returns Number of institutes with cached DataSources
   */
  getCacheSize(): number {
    return this.dataSourceCache.size;
  }

  /**
   * Get all cached institute IDs
   * Useful for debugging/monitoring
   *
   * @returns Array of institute IDs with cached DataSources
   */
  getCachedInstituteIds(): string[] {
    return Array.from(this.dataSourceCache.keys());
  }
}
