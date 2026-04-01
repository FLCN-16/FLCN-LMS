import { Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository, ObjectLiteral, EntityTarget } from 'typeorm';

/**
 * REQUEST-SCOPED SERVICE: InstituteContext
 *
 * This service is scoped to the request lifetime and holds the current institute's context.
 * It provides:
 * 1. Current institute metadata (id, slug)
 * 2. The DataSource (connection) for the institute's database
 * 3. Methods to retrieve repositories for institute-specific entities
 *
 * Injected by InstituteRoutingMiddleware during request processing.
 * Each request gets its own instance of this service.
 */
@Injectable({ scope: Scope.REQUEST })
export class InstituteContext {
  private instituteId?: string;
  private instituteSlug?: string;
  private dataSource?: DataSource;

  /**
   * Set the current institute context
   * Called by InstituteRoutingMiddleware after identifying the institute
   *
   * @param instituteId - UUID of the institute
   * @param instituteSlug - Slug identifier of the institute
   * @param dataSource - TypeORM DataSource for this institute's database
   */
  setContext(
    instituteId: string,
    instituteSlug: string,
    dataSource: DataSource,
  ): void {
    this.instituteId = instituteId;
    this.instituteSlug = instituteSlug;
    this.dataSource = dataSource;
  }

  /**
   * Get the current institute ID
   *
   * @returns UUID of the current institute
   * @throws Error if context has not been initialized
   */
  getInstituteId(): string {
    if (!this.instituteId) {
      throw new Error(
        'InstituteContext not initialized. Ensure InstituteRoutingMiddleware is applied.',
      );
    }
    return this.instituteId;
  }

  /**
   * Get the current institute slug
   *
   * @returns Slug identifier of the current institute
   * @throws Error if context has not been initialized
   */
  getInstituteSlug(): string {
    if (!this.instituteSlug) {
      throw new Error(
        'InstituteContext not initialized. Ensure InstituteRoutingMiddleware is applied.',
      );
    }
    return this.instituteSlug;
  }

  /**
   * Get the DataSource for the current institute's database
   *
   * @returns TypeORM DataSource connected to the institute's database
   * @throws Error if context has not been initialized
   */
  getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error(
        'InstituteContext not initialized. Ensure InstituteRoutingMiddleware is applied.',
      );
    }
    return this.dataSource;
  }

  /**
   * Get a repository for an institute-specific entity
   * This allows services to access repositories without using @InjectRepository()
   *
   * Usage:
   *   const userRepository = instituteContext.getRepository(User);
   *   const users = await userRepository.find();
   *
   * @param target - The entity class or entity schema
   * @returns TypeORM Repository for the given entity
   * @throws Error if context has not been initialized
   */
  getRepository<Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
  ): Repository<Entity> {
    const dataSource = this.getDataSource();
    return dataSource.getRepository(target);
  }

  /**
   * Check if context is initialized
   *
   * @returns true if context has been set, false otherwise
   */
  isInitialized(): boolean {
    return !!(this.instituteId && this.instituteSlug && this.dataSource);
  }

  /**
   * Clear the context (useful for testing)
   * Normally not needed in production
   */
  clear(): void {
    this.instituteId = undefined;
    this.instituteSlug = undefined;
    this.dataSource = undefined;
  }
}
