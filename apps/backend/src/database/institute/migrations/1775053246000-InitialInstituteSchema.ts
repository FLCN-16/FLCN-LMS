import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialInstituteSchema1775053246000 implements MigrationInterface {
    name = 'InitialInstituteSchema1775053246000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ========== USERS TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "instituteId" character varying,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying,
                "avatarUrl" character varying,
                "role" character varying NOT NULL DEFAULT 'student',
                "hashedPassword" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_institute_email" ON "users" ("instituteId", "email") `);

        // ========== COURSES TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "courses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "description" text,
                "thumbnailUrl" character varying,
                "price" integer NOT NULL DEFAULT '0',
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_courses_slug" UNIQUE ("slug")
            )
        `);

        // ========== CATEGORIES TABLE ==========
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_categories_slug" UNIQUE ("slug")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP INDEX "idx_users_institute_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
