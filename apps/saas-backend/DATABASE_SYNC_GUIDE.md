# TypeORM Database Synchronization Guide

## Overview

The NestJS backend uses **TypeORM's `synchronize` feature** to automatically manage your database schema. Instead of writing and maintaining migration files, you simply define your entities and TypeORM handles the rest.

**No migration files. No migration commands. Just code and sync.**

---

## How It Works

### Development Mode

```typescript
// app.module.ts
synchronize: NODE_ENV !== 'production'  // true in development
```

**On every app start:**

1. TypeORM reads all entity definitions from `src/master-entities/`
2. Connects to the database
3. Compares entities to current schema
4. Auto-creates missing tables
5. Auto-alters columns to match entities
6. App starts ✅

**No extra steps. No migration files. Just restart the app.**

### Production Mode

```typescript
synchronize: NODE_ENV !== 'production'  // false in production
```

**On app start:**

1. TypeORM reads all entity definitions
2. Validates that database schema matches entities
3. If mismatch: Logs warning but continues (no auto-sync)
4. App runs ✅

**Safe by default. Schema changes come through code updates.**

---

## Development Workflow

### Adding a New Entity

**Step 1:** Create entity file

```typescript
// src/master-entities/email-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}
```

**Step 2:** Register in app.module.ts

```typescript
import { EmailLog } from './master-entities/email-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'master',
      // ... other config ...
      entities: [
        // ... existing entities ...
        EmailLog,  // ← Add here
      ],
    }),
    // ...
  ],
})
export class AppModule {}
```

**Step 3:** Restart dev server

```bash
pnpm dev
```

✅ **TypeORM automatically creates `email_logs` table**

That's it! No migration generation, no migration files, no migration commands.

### Modifying an Entity

**Add a new column:**

```typescript
@Entity('email_logs')
export class EmailLog {
  // ... existing columns ...

  @Column({ nullable: true })
  retryCount: number;  // ← New column
}
```

**Restart:**

```bash
pnpm dev
```

✅ **TypeORM automatically adds `retry_count` column**

**Change column type:**

```typescript
@Column({ type: 'jsonb', default: {} })
metadata: Record<string, any>;  // Changed from string
```

**Restart:**

```bash
pnpm dev
```

✅ **TypeORM automatically alters column type**

**Add relationship:**

```typescript
@Entity('email_logs')
export class EmailLog {
  // ...

  @ManyToOne(() => SuperAdmin)
  @JoinColumn({ name: 'createdById' })
  createdBy: SuperAdmin;

  @Column('uuid')
  createdById: string;
}
```

**Restart:**

```bash
pnpm dev
```

✅ **TypeORM automatically creates foreign key**

---

## What Gets Synced

### ✅ Automatically Handled

- Create new tables
- Add new columns
- Alter column types
- Add indexes
- Create foreign keys
- Add constraints (unique, not null, defaults)
- Update relationships

### ⚠️ Manual Needed (Data Transformation)

These operations might need manual SQL (data is at risk):

- Renaming columns (data mapping needed)
- Changing column constraints (validation needed)
- Complex data transformations
- Large data migrations

For these cases, you can:
1. Write custom SQL in a seed/migration script
2. Or drop and recreate tables in development (fresh start)

---

## Common Entity Patterns

### Basic Entity with Timestamps

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Entity with Relationships

```typescript
@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  licenseKey: string;

  // Many-to-One relationship
  @ManyToOne(() => Plan, plan => plan.licenses)
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column('uuid')
  planId: string;

  // Many-to-One relationship
  @ManyToOne(() => Institute, institute => institute.licenses)
  @JoinColumn({ name: 'instituteId' })
  institute: Institute;

  @Column('uuid')
  instituteId: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Entity with JSON Column

```typescript
@Entity('licenses')
export class License {
  @Column({ type: 'jsonb', default: {} })
  features: {
    courses: boolean;
    testSeries: boolean;
    liveClasses: boolean;
    analytics: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
```

### Entity with Enums

```typescript
enum LicenseStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

@Entity('licenses')
export class License {
  @Column({
    type: 'enum',
    enum: LicenseStatus,
    default: LicenseStatus.ACTIVE,
  })
  status: LicenseStatus;
}
```

---

## Using Entities in Services

### Injecting a Repository

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from '../master-entities/license.entity';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License, 'master')
    private licenseRepository: Repository<License>,
  ) {}

  async findByKey(licenseKey: string): Promise<License | null> {
    return this.licenseRepository.findOne({
      where: { licenseKey },
    });
  }

  async create(data: Partial<License>): Promise<License> {
    const license = this.licenseRepository.create(data);
    return this.licenseRepository.save(license);
  }

  async update(id: string, data: Partial<License>): Promise<License> {
    await this.licenseRepository.update(id, data);
    return this.licenseRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.licenseRepository.delete(id);
  }
}
```

### Module Setup

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from '../master-entities/license.entity';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([License], 'master'),  // ← Register entity
  ],
  providers: [LicenseService],
  controllers: [LicenseController],
})
export class LicensesModule {}
```

---

## Environment Setup

### Development (.env)

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flcn_master
JWT_SECRET=dev-secret-key

# Optional for local development:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASS=postgres
# DB_NAME=flcn_master
```

### Production (.env)

```bash
NODE_ENV=production
DATABASE_URL=postgresql://produser:prodpass@prod-db.example.com:5432/flcn_master
JWT_SECRET=your-secure-jwt-secret

# Never commit sensitive values!
# Use environment variables or secrets management
```

---

## Production Deployment

### Initial Setup (One Time)

**Option 1: Enable sync temporarily on first deploy**

```bash
# Deploy with synchronize: true for initial schema creation
NODE_ENV=development npm start

# Wait for schema to be created
# Verify database is set up
# Stop the app
# Change NODE_ENV=production
NODE_ENV=production npm start

# Now keep NODE_ENV=production always
```

**Option 2: Create database manually or use script**

```bash
# Create database
createdb flcn_master

# Install dependencies
npm install

# Build
npm run build

# Run migrations or setup script if needed
npm run seed

# Start with production env
NODE_ENV=production npm start
```

### Subsequent Deployments

```bash
# Build updated code
npm run build

# Deploy
NODE_ENV=production npm start

# Database schema validated automatically
# If entities don't match: Logs warning but continues
```

**Key point:** Schema changes travel with your code via entity definitions.

---

## Troubleshooting

### Tables Not Created on Startup

**Symptoms:**
- "relation X does not exist" error
- Logs show no table creation

**Check:**

```bash
# 1. Verify DATABASE_URL is set
echo $DATABASE_URL

# 2. Verify database exists
psql $DATABASE_URL -c "\dt"  # List tables

# 3. Verify entities are registered
# grep "entities:" apps/backend/src/app.module.ts

# 4. Verify entity has @Entity decorator
# cat apps/backend/src/master-entities/your.entity.ts
```

**Fix:**

```bash
# Create database if missing
createdb flcn_master

# Start dev server
pnpm dev

# Check database
psql $DATABASE_URL -c "\dt"
```

### Column Not Updated

**Symptoms:**
- Entity has new column but database doesn't
- Column type mismatch

**Cause:**
- App is still running old code
- NODE_ENV is not development

**Fix:**

```bash
# Stop the app
Ctrl+C

# Verify NODE_ENV
echo $NODE_ENV  # Should be "development"

# Start again
pnpm dev

# Check column was added
psql $DATABASE_URL -c "\d table_name"
```

### Foreign Key Error

**Symptoms:**
- "FK constraint error" or "relation X not found"

**Cause:**
- Related entity not in entities array
- Related entity doesn't exist

**Fix:**

```bash
# 1. Verify all entities are in app.module.ts
# grep -A 20 "entities: \[" apps/backend/src/app.module.ts

# 2. Check relationship decorator:
# @ManyToOne(() => Plan)  // Plan must exist!

# 3. Verify both entities are created:
# psql $DATABASE_URL -c "\dt"
```

### Type Mismatch

**Symptoms:**
- Column type in DB doesn't match entity
- Query returns unexpected type

**Cause:**
- TypeORM inferred wrong type
- Entity type definition changed

**Fix:**

Explicitly specify column type:

```typescript
// Instead of:
@Column()
count: number;  // TypeORM might infer as int

// Use:
@Column({ type: 'bigint' })
count: number;  // Explicitly bigint
```

Then restart:

```bash
pnpm dev
```

---

## Best Practices

### ✅ DO

- ✅ Keep entity definitions current with your database
- ✅ Use explicit column types when needed: `@Column({ type: 'text' })`
- ✅ Always add new entities to app.module.ts
- ✅ Test entity changes locally before deploying
- ✅ Use relationships properly: `@ManyToOne`, `@OneToMany`
- ✅ Document complex entities with comments
- ✅ Use decorators for common patterns: `@CreateDateColumn`, `@UpdateDateColumn`

### ❌ DON'T

- ❌ Never use `synchronize: true` in production
- ❌ Don't manually write SQL (use entities instead)
- ❌ Don't forget to register new entities in app.module.ts
- ❌ Don't mix camelCase and snake_case in column names
- ❌ Don't skip testing entity changes locally
- ❌ Don't create relationships that don't match data structure
- ❌ Don't drop columns without backup strategy

---

## Entity Lifecycle

```
Create Entity File
       ↓
Add to app.module.ts
       ↓
Restart Dev Server (pnpm dev)
       ↓
TypeORM Syncs Schema
       ↓
Table Created ✅
       ↓
Use in Service/Controller
       ↓
Inject Repository
       ↓
Query Database
```

---

## Comparison: Migrations vs Synchronize

| Aspect | Migrations | Synchronize |
|--------|-----------|------------|
| **Setup** | Complex | Simple |
| **Files** | Migration files | Entity files |
| **Commands** | `migration:generate` | None |
| **Testing** | Run migrations | Restart app |
| **Dev Speed** | Slower | Faster |
| **Production** | Safe | Safe |
| **Rollback** | `migration:revert` | Code revert |
| **Audit Trail** | Migration files | Git history |
| **Learning Curve** | Steep | Shallow |

**For SaaS single-database:** Synchronize is perfect.

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Start dev (auto-sync)** | `pnpm dev` |
| **Build for production** | `pnpm build` |
| **Deploy to production** | `NODE_ENV=production npm start` |
| **View database tables** | `psql $DATABASE_URL -c "\dt"` |
| **View table schema** | `psql $DATABASE_URL -c "\d table_name"` |
| **Run seeding** | `ts-node -r tsconfig-paths/register src/seeding/seed-super-admin.ts` |

---

## Next Steps

1. **Understand current entities**
   ```bash
   ls -la apps/backend/src/master-entities/
   ```

2. **Check app.module.ts**
   ```bash
   grep "entities: \[" apps/backend/src/app.module.ts -A 15
   ```

3. **Start development**
   ```bash
   cd apps/backend
   pnpm dev
   ```

4. **Verify schema**
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```

5. **Add new entity** (if needed)
   - Create file in `src/master-entities/`
   - Add to `app.module.ts`
   - Restart app

---

## Summary

**With TypeORM Synchronize:**

- ✅ Zero migration files
- ✅ Zero migration commands
- ✅ Fast development iteration
- ✅ Simple production deployment
- ✅ Entities are source of truth
- ✅ Schema always matches code

**Workflow:**
1. Define entity
2. Add to app.module.ts
3. Restart app
4. Done! ✅

No migration complexity. Just code and sync.
