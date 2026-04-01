import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { DataSource } from 'typeorm';

import { InstituteConnectionManager } from '../../database/institute/institute-connection.manager';
import { InstituteContext } from '../../institutes-admin/services/institute-context.service';

/**
 * Tenant Routing Middleware
 *
 * Routes incoming API requests to the correct tenant database
 *
 * Flow:
 * 1. Identify tenant from request (header, subdomain, or domain)
 * 2. Query master database for tenant configuration
 * 3. Retrieve tenant database credentials
 * 4. Get/create connection to tenant-specific database
 * 5. Set InstituteContext for request lifecycle
 * 6. Pass request to handlers with tenant context available
 *
 * Tenant Identification Strategies:
 * - X-Tenant-Slug header (highest priority)
 * - X-Tenant-Id header
 * - Subdomain (tenant.example.com)
 * - Custom domain mapping (future)
 */
@Injectable()
export class InstituteRoutingMiddleware implements NestMiddleware {
  constructor(
    private instituteContext: InstituteContext,
    private connectionManager: InstituteConnectionManager,
    @Inject('master')
    private masterDataSource: DataSource,
  ) {}

  private readonly logger = new Logger(InstituteRoutingMiddleware.name);


  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Skip tenant resolution for health checks and static files
      if (this.shouldSkipTenantResolution(req.path)) {
        return next();
      }

      // ============ STEP 1: RESOLVE TENANT ============
      const instituteSlug = this.resolveTenantSlug(req);

      // Skip resolution if no slug found (e.g. SaaS routes)
      if (!instituteSlug) {
        return next();
      }

      this.logger.log(`Resolving tenant: ${instituteSlug} for path: ${req.path}`);

      // ============ STEP 2: QUERY MASTER DATABASE ============
      // Get tenant metadata from master database
      const tenant = await this.masterDataSource.query(
        'SELECT id, slug, name, "isActive" FROM institutes WHERE slug = $1',
        [instituteSlug],
      );

      if (!tenant || tenant.length === 0) {
        // If it's a SaaS route that looked like a tenant route, just pass
        // But usually, we want to fail if it's clearly a tenant route pattern
        if (req.path.startsWith('/api/v1/')) {
           const segments = req.path.split('/').filter(Boolean);
           const saasModules = ['auth', 'super-admins', 'billing', 'plans', 'institutes'];
           if (saasModules.includes(segments[2])) {
             return next();
           }
        }
        throw new BadRequestException(`Institute not found: ${instituteSlug}`);
      }

      const tenantRecord = tenant[0];

      if (!tenantRecord.isActive) {
        throw new BadRequestException(`Institute is inactive: ${instituteSlug}`);
      }


      // ============ STEP 3: GET TENANT DATABASE CONFIG ============
      // Get database connection details from master database
      const dbConfig = await this.masterDataSource.query(
        'SELECT "dbHost", "dbPort", "dbName", "dbUser", "dbPassword", "connectionString" FROM institute_databases WHERE "instituteId" = $1',
        [tenantRecord.id],
      );

      if (!dbConfig || dbConfig.length === 0) {
        throw new BadRequestException(
          `No database configuration found for tenant: ${instituteSlug}`,
        );
      }

      const dbDetails = dbConfig[0];

      console.log(`📡 Database config found: ${dbDetails.dbName}`);

      // ============ STEP 4: ROUTE TO TENANT DATABASE ============
      const tenantDataSource =
        await this.connectionManager.getOrCreateDataSource(
          tenantRecord.id,
          dbDetails,
        );

      // ============ STEP 5: SET TENANT CONTEXT ============
      this.instituteContext.setContext(
        tenantRecord.id,
        tenantRecord.slug,
        tenantDataSource,
      );

      // Attach tenant info to Express request
      (req as any).institute = {
        id: tenantRecord.id,
        slug: tenantRecord.slug,
        name: tenantRecord.name,
      };

      this.logger.debug(
        `Routed request to institute database: ${dbDetails.dbName} for path: ${req.method} ${req.path}`,
      );

      // Continue to next middleware/handler
      next();
    } catch (error) {
      console.error('❌ Tenant routing error:', error);

      // Handle known error types
      if (error instanceof BadRequestException) {
        const response = error.getResponse();
        return res.status(400).json({
          statusCode: 400,
          message: typeof response === 'string' ? response : response,
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
        });
      }

      // Generic error response
      return res.status(500).json({
        statusCode: 500,
        message: 'Failed to resolve tenant and route request',
        error: error instanceof Error ? error.message : 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Resolve tenant identifier from request
   *
   * Priority order:
   * 1. X-Tenant-Slug header (most explicit)
   * 2. X-Tenant-Id header
   * 3. Subdomain extraction (tenant.example.com)
   * 4. Custom domain lookup (future enhancement)
   *
   * @returns tenant slug or null if not found
   */
  private resolveTenantSlug(req: Request): string | null {
    // 1. Check Path Segment: /api/v1/:instituteSlug/...
    const path = req.path;
    const pathParts = path.split('/').filter(Boolean);
    
    // api/v1/:slug/...
    if (pathParts[0] === 'api' && pathParts[2] && !['auth', 'super-admins', 'billing', 'plans', 'institutes'].includes(pathParts[2])) {
      return pathParts[2];
    }

    // 2. Check X-Institute-Slug header
    const headerSlug = req.headers['x-institute-slug'];
    if (headerSlug && typeof headerSlug === 'string') {
      return headerSlug;
    }

    // 3. Extract from subdomain
    const host = req.get('host') || '';
    const subdomainTenant = this.extractSubdomainTenant(host);
    if (subdomainTenant) {
      return subdomainTenant;
    }

    return null;
  }

  /**
   * Extract tenant from subdomain
   *
   * Examples:
   * - pw-live.example.com -> 'pw-live'
   * - adda247.localhost:3000 -> 'adda247'
   * - api.example.com -> null (excluded)
   * - www.example.com -> null (excluded)
   * - example.com -> null (no subdomain)
   */
  private extractSubdomainTenant(host: string): string | null {
    if (!host) return null;

    // Remove port if present
    const hostOnly = host.split(':')[0];

    // Split by dots
    const parts = hostOnly.split('.');

    // Single part (localhost, single domain) - not a subdomain
    if (parts.length < 2) {
      // Exception: localhost or single word is treated as tenant
      if (parts[0] && !['localhost'].includes(parts[0])) {
        return parts[0];
      }
      return null;
    }

    const subdomain = parts[0];

    // Exclude common subdomains
    const excludedSubdomains = [
      'api',
      'www',
      'mail',
      'admin',
      'app',
      'server',
      'localhost',
    ];

    if (excludedSubdomains.includes(subdomain.toLowerCase())) {
      return null;
    }

    return subdomain;
  }

  /**
   * Check if request path should skip tenant resolution
   * Some endpoints don't require tenant context
   */
  private shouldSkipTenantResolution(path: string): boolean {
    const skipPaths = [
      '/health',
      '/healthz',
      '/metrics',
      '/docs',
      '/swagger',
      '/api-docs',
      '/public',
      '/favicon.ico',
      '/robots.txt',
    ];

    return skipPaths.some((skipPath) => path.startsWith(skipPath));
  }
}
