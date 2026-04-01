import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMasterSchema1775052726000 implements MigrationInterface {
    name = 'InitialMasterSchema1775052726000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ========== PLANS TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "plans" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "slug" character varying(50) NOT NULL,
                "description" text,
                "price" integer NOT NULL DEFAULT '0',
                "currency" character varying(10) NOT NULL DEFAULT 'INR',
                "interval" character varying(50) NOT NULL DEFAULT 'monthly',
                "features" jsonb,
                "maxStudents" integer NOT NULL DEFAULT '100',
                "maxCourses" integer NOT NULL DEFAULT '50',
                "maxStorageGb" integer NOT NULL DEFAULT '10',
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_plans_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_plans" PRIMARY KEY ("id")
            )
        `);

        // ========== SUPER_ADMINS TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "super_admins" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "firstName" character varying(100) NOT NULL,
                "lastName" character varying(100) NOT NULL,
                "role" character varying(50) NOT NULL DEFAULT 'admin',
                "isActive" boolean NOT NULL DEFAULT true,
                "lastLogin" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_super_admins_email" UNIQUE ("email"),
                CONSTRAINT "PK_super_admins" PRIMARY KEY ("id")
            )
        `);

        // ========== INSTITUTES TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "institutes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "logoUrl" character varying(500),
                "customDomain" character varying(255),
                "planId" uuid,
                "isActive" boolean NOT NULL DEFAULT true,
                "settings" jsonb,
                "maxUsers" integer NOT NULL DEFAULT '100',
                "maxCourses" integer NOT NULL DEFAULT '50',
                "maxStorageGb" integer NOT NULL DEFAULT '10',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_institutes_slug" UNIQUE ("slug"),
                CONSTRAINT "UQ_institutes_customDomain" UNIQUE ("customDomain"),
                CONSTRAINT "PK_institutes" PRIMARY KEY ("id")
            )
        `);

        // ========== OTHER MASTER TABLES STUBS ==========
        // (These should be added for completeness if flcn_master is blank)
        
        await queryRunner.query(`
            ALTER TABLE "institutes" ADD CONSTRAINT "FK_institutes_plans" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        // Indices
        await queryRunner.query(`CREATE INDEX "idx_institutes_slug" ON "institutes" ("slug") `);
        await queryRunner.query(`CREATE INDEX "idx_institutes_domain" ON "institutes" ("customDomain") `);
        await queryRunner.query(`CREATE INDEX "idx_institutes_active" ON "institutes" ("isActive") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "institutes" DROP CONSTRAINT "FK_institutes_plans"`);
        await queryRunner.query(`DROP INDEX "idx_institutes_active"`);
        await queryRunner.query(`DROP INDEX "idx_institutes_domain"`);
        await queryRunner.query(`DROP INDEX "idx_institutes_slug"`);
        await queryRunner.query(`DROP TABLE "institutes"`);
        await queryRunner.query(`DROP TABLE "super_admins"`);
        await queryRunner.query(`DROP TABLE "plans"`);
    }
}
