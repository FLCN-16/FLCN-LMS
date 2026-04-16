import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY
 *
 * Audit log for tracking all important actions across the system.
 * Used for compliance, debugging, and security monitoring.
 */
export declare class AuditLog {
    id: string;
    /**
     * Reference to institute (can be null for system-level logs)
     */
    instituteId?: string;
    /**
     * User who performed the action (optional)
     */
    userId?: string;
    /**
     * Type of action performed
     * Examples: 'CREATE_COURSE', 'UPDATE_USER', 'DELETE_TEST', etc.
     */
    action: string;
    /**
     * Type of resource affected
     * Examples: 'COURSE', 'USER', 'TEST_SERIES', 'QUESTION'
     */
    resourceType?: string;
    /**
     * ID of the resource affected
     */
    resourceId?: string;
    /**
     * Previous values before the change (JSON)
     * Only populated for UPDATE actions
     */
    oldValues?: Record<string, unknown>;
    /**
     * New values after the change (JSON)
     * Only populated for UPDATE actions
     */
    newValues?: Record<string, unknown>;
    /**
     * Summary of changes (JSON)
     * Field-level diff of what changed
     */
    changes?: Record<string, unknown>;
    /**
     * IP address of the client
     */
    ipAddress?: string;
    /**
     * User agent of the client
     */
    userAgent?: string;
    /**
     * HTTP request method
     * Examples: GET, POST, PUT, DELETE, PATCH
     */
    requestMethod?: string;
    /**
     * HTTP request path
     * Example: /api/courses/uuid-123
     */
    requestPath?: string;
    /**
     * HTTP response status code
     * Examples: 200, 201, 400, 404, 500
     */
    statusCode?: number;
    /**
     * How long the request took in milliseconds
     */
    responseTimeMs?: number;
    /**
     * When this action was logged
     */
    createdAt: Date;
    /**
     * Relation to Institute (if instituteId is set)
     */
    institute?: Institute;
}
//# sourceMappingURL=audit-log.entity.d.ts.map