# Database Strategy: TypeORM Synchronize (No Migrations)

## Decision: Use TypeORM Synchronize Instead of Migrations

### Why?

Since we're now using a **single master database** (no more multi-tenant complexity), we don't need the overhead of migration files and migration infrastructure.

**Before:** Complex migrations system with separate datasource config
**After:** Entity-driven schema management with TypeORM synchronize

### Benefits

| Benefit | Description |
|---------|-------------|
| **Simplicity** | Just modify entities, restart app |
| **Speed** | No migration generation needed |
| **Clarity** | Entities are the single source of truth |
| **Maintenance** | No migration files to maintain |
| **Development** | Fast iteration cycle |
| **Safety** | Production never auto-syncs |

### Tradeoff

- ❌ No explicit migration history (use git for that)
- ❌ Complex data transformations need custom scripts
- ✅ For schema changes: Quick and simple

---

## What Was Removed

### Deleted Directories
```
❌ src/database/master/         (master datasource config - not needed)
❌ src/database/master/migrations/  (migration files - not needed)
```

### Deleted Files
```
❌ master.datasource.ts         (CLI datasource - not needed)
❌ InitialMasterSchema migration (now handled by synchronize)
❌ MIGRATIONS_GUIDE.md          (migrations not used)
```

### Deleted Infrastructure
- Migration generation commands
- Migration running infrastructure
- Separate database datasource
- Migration table management

---

## What Remains

### Database Configuration
**Single location:** `src/app.module.ts`

```typescript
TypeOrmModule.forRootAsync({
  name: 'master',
  // ... config ...
  entities: [
    Institute,
    License,
    Plan,
    SuperAdmin,
    // ... etc
  ],
  synchronize: NODE_ENV !== 'production',  // ← This is it
  logging: NODE_ENV === 'development',
})
```

### Entities
**All in one place:** `src/master-entities/`

```
src/master-entities/
├── institute.entity.ts
├── license.entity.ts
├── plan.entity.ts
├── super-admin.entity.ts
├── api-key.entity.ts
├── audit-log.entity.ts
├── branch.entity.ts
├── feature-flag.entity.ts
├── institute-billing.entity.ts
└── institute-database.entity.ts
```

---

## How Development Works

### Adding a New Entity

1. **Create file:** `src/master-entities/my-entity.entity.ts`
2. **Add to app.module.ts**
3. **Run:** `pnpm dev`
4. **Result:** Table auto-created ✅

**That's it. No migration generation. No migration commands.**

### Modifying an Entity

1. **Update entity file**
2. **Run:** `pnpm dev`
3. **Result:** Table auto-updated ✅

**No migration generation. No migration commands.**

---

## Production Deployment

### Initial Setup (One Time)

```bash
# Deploy with dev env first (to create schema)
NODE_ENV=development npm start
# Wait for schema creation
# Stop app

# Switch to production
NODE_ENV=production npm start
```

### Subsequent Deploys

```bash
npm run build
NODE_ENV=production npm start
```

**TypeORM validates schema matches entities. Done.**

---

## If You Need Real Migrations

For complex data transformations (rare), you can:

1. Write custom SQL in a seed script
2. Or create a one-off migration file manually

But 99% of the time, synchronize handles everything.

---

## Files Changed

### Deleted
- `src/database/` (entire directory)
- `MIGRATIONS_GUIDE.md`

### Updated  
- `src/app.module.ts` - Single DB config, synchronize enabled
- `src/seeding/*` - SaaS seeding only
- `src/common/auth/*` - Updated for SaaS

### Created
- `DATABASE_SYNC_GUIDE.md` - How synchronize works
- `CLEANUP_SUMMARY.md` - Full cleanup details
- `CLEANUP_CHECKLIST.md` - Verification checklist

---

## Key Points

✅ **Development:** `synchronize: true` - auto-syncs schema
✅ **Production:** `synchronize: false` - validates schema
✅ **No migration files** - entities are source of truth
✅ **No migration commands** - just restart app
✅ **Fast iteration** - modify entity, restart, done
✅ **Safe by default** - production never auto-modifies

---

## Next Steps

1. Just code! Modify entities, restart app
2. When deploying: Build → `NODE_ENV=production npm start`
3. Schema handled automatically ✅

---

**Status:** Simplified database strategy implemented. No migrations needed.
