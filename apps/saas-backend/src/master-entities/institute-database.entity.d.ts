import { Institute } from './institute.entity';
/**
 * MASTER DATABASE ENTITY: InstituteDatabase
 *
 * Maps each institute to their database connection configuration.
 * This entity ONLY exists in the MASTER database.
 *
 * When a request comes in for an institute, this entity is queried to get
 * the database credentials, and a connection to that institute's database is created.
 *
 * Example record:
 * {
 *   id: "uuid-x",
 *   instituteId: "uuid-1",
 *   dbHost: "db-server-1.aws.com",
 *   dbPort: 5432,
 *   dbName: "db_pw_live",
 *   dbUser: "institute_user",
 *   dbPassword: "encrypted_password_here",
 *   isActive: true
 * }
 */
export declare class InstituteDatabase {
    /**
     * Unique identifier for this database configuration
     */
    id: string;
    /**
     * Foreign key to the institute this database belongs to
     * Unique constraint ensures one database per institute
     */
    instituteId: string;
    /**
     * Database server hostname/IP
     * Examples: 'localhost', 'db.example.com', 'db-prod-1.aws.com'
     * Can point to different servers for scaling
     */
    dbHost: string;
    /**
     * Database server port
     * Default PostgreSQL port is 5432
     */
    dbPort: number;
    /**
     * Database name for this institute
     * Convention: db_{institute_slug}
     * Examples: 'db_pw_live', 'db_adda247', 'db_flcn_org'
     */
    dbName: string;
    /**
     * Database user for authentication
     * Can be shared user or unique per institute
     */
    dbUser: string;
    /**
     * Database password for authentication
     * IMPORTANT: Should be encrypted in production!
     * Use encryption/decryption service with vault
     */
    dbPassword: string;
    /**
     * Optional: Pre-constructed connection string
     * Can be useful for special connection configurations
     */
    connectionString?: string;
    /**
     * Whether this database configuration is active
     * Inactive configurations will be rejected during routing
     */
    isActive: boolean;
    /**
     * Timestamp when this configuration was created
     */
    createdAt: Date;
    /**
     * Timestamp when this configuration was last updated
     */
    updatedAt: Date;
    /**
     * Relation to Institute
     * Enables: instituteDatabase.institute.name, etc.
     */
    institute: Institute;
}
//# sourceMappingURL=institute-database.entity.d.ts.map