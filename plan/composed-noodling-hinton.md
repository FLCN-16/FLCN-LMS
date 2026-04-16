# Entity Plan: Dedicated LMS Codebase

## Context

FLCN's business model (per README): customers **self-host a dedicated LMS instance** and verify their license with FLCN every 24h. Each deployment is single-tenant — one database, one organization, one customer.

The current entity model was written as if it might become multi-tenant. Several entities are missing entirely, two have orphaned `batch_id` FK columns pointing at a non-existent `batches` table, and `license_config` stores hardcoded placeholder data (`OrganizationName = "Organization"`, `MaxUsers = 0`). These gaps block the dashboard features listed in PLAN.md (batches, institute management, timetable, attendance, coupons, notifications).

This plan adds the missing entities and corrects the incomplete ones to match the dedicated-instance model.

---

## Critical Files

| File | Role |
|------|------|
| `apps/lms-backend/internal/models/models.go` | All Go entity structs — primary file to modify |
| `apps/lms-backend/migrations/001_initial_schema.up.sql` | Initial SQL migration |
| `apps/lms-backend/internal/database/db.go` | AutoMigrate list |
| `apps/lms-backend/internal/database/migrations.go` | Embedded SQL migration runner |
| `apps/lms-backend/internal/service/license_service.go` | `responseToModel()` hardcodes org name + max users |
| `apps/saas-backend/src/licenses/licenses.service.ts` | SaaS verify endpoint — needs to send `organizationName` + `maxUsers` |

---

## Entity Changes

### Fix: `LicenseConfig`

The `responseToModel` function in `license_service.go` hardcodes `OrganizationName = "Organization"` and `MaxUsers = 0`. Fix this by:
1. Updating the SaaS `VerifyLicenseResponseDto` to include `organizationName` and `maxUsers`
2. Reading them in `responseToModel` instead of hardcoding
3. Fixing the table name mismatch: `TableName()` returns `"license_config"` but the SQL creates `license_configs` — standardize to `license_configs`
4. Fixing the `features` column type: model declares `type:jsonb` but SQL creates `TEXT` — standardize to `jsonb`

---

### New Entity 1: `Institute`

**Purpose:** Stores this deployment's organization profile — branding, contact, settings. Exactly **one row** per deployment. Created on first boot / license activation.

```go
type Institute struct {
    ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Name         string     `gorm:"not null"`
    Slug         string     `gorm:"uniqueIndex;not null"`
    LogoURL      *string
    FaviconURL   *string
    Domain       *string    `gorm:"uniqueIndex"` // custom domain
    Tagline      *string
    Description  *string
    ContactEmail *string
    ContactPhone *string
    Address      *string
    City         *string
    Country      string     `gorm:"default:'IN'"`
    Website      *string
    SocialLinks  datatypes.JSON // { twitter, youtube, instagram, linkedin }
    BrandColor   *string        // primary hex for theming
    IsSetup      bool           `gorm:"default:false"` // false until onboarding complete
    CreatedAt    time.Time
    UpdatedAt    time.Time
}
```

**Table:** `institute`
**Rationale:** Replaces the hardcoded `organization_name` in `license_config`. Feeds the dashboard's branding/settings screen. Single row, never multi-tenant.

---

### New Entity 2: `Batch`

**Purpose:** Student cohorts. A batch can span multiple courses. Students join a batch; DPPs and announcements target batches. This entity makes the existing `batch_id` FK columns real.

```go
type Batch struct {
    ID           uuid.UUID   `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Name         string      `gorm:"not null"`
    Description  *string
    Code         *string     `gorm:"uniqueIndex"` // student join code
    InstructorID *uuid.UUID  `gorm:"type:uuid;index"`
    MaxStudents  *int
    StartDate    *time.Time
    EndDate      *time.Time
    Status       string      `gorm:"type:varchar(20);default:'active'"` // active | completed | archived
    IsActive     bool        `gorm:"default:true"`
    CreatedAt    time.Time
    UpdatedAt    time.Time

    Instructor *User
    Courses    []Course          `gorm:"many2many:batch_courses;"`
    Students   []BatchEnrollment `gorm:"foreignKey:BatchID"`
}

type BatchEnrollment struct {
    ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    BatchID    uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_batch_student;not null"`
    StudentID  uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_batch_student;not null"`
    Status     string    `gorm:"type:varchar(20);default:'active'"` // active | removed
    JoinedAt   time.Time
    CreatedAt  time.Time
    UpdatedAt  time.Time

    Batch   Batch
    Student User
}
```

**Tables:** `batches`, `batch_enrollments`, `batch_courses` (join)
**Rationale:** Makes `DailyPracticePaper.BatchID` and `Announcement.BatchID` referentially valid. PLAN.md "institute management > batches" is unblocked.

---

### New Entity 3: `Category`

**Purpose:** Hierarchical course categories (e.g. "Engineering > JEE", "Medical > NEET"). Enables course discovery on the student-facing storefront.

```go
type Category struct {
    ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Name         string     `gorm:"not null"`
    Slug         string     `gorm:"uniqueIndex;not null"`
    Description  *string
    ThumbnailURL *string
    ParentID     *uuid.UUID `gorm:"type:uuid;index"` // nil = root category
    OrderIndex   int        `gorm:"default:0"`
    IsActive     bool       `gorm:"default:true"`
    CreatedAt    time.Time
    UpdatedAt    time.Time

    Parent   *Category
    Children []Category `gorm:"foreignKey:ParentID"`
    Courses  []Course   `gorm:"foreignKey:CategoryID"`
}
```

**Add to `Course`:** `CategoryID *uuid.UUID \`gorm:"type:uuid;index"\``
**Table:** `categories`

---

### New Entity 4: `Coupon`

**Purpose:** Discount codes for course enrollment. Supports per-course and global coupons, percent/fixed discount, usage caps, and validity windows.

```go
type Coupon struct {
    ID             uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Code           string     `gorm:"uniqueIndex;not null"`
    Description    *string
    DiscountType   string     `gorm:"type:varchar(10);not null"` // percent | fixed
    DiscountValue  float64    `gorm:"not null"`
    MaxDiscount    *float64   // cap for percent discounts
    MinOrderValue  *float64
    CourseID       *uuid.UUID `gorm:"type:uuid;index"` // nil = all courses
    UsageLimit     *int       // nil = unlimited
    UsedCount      int        `gorm:"default:0"`
    ValidFrom      time.Time
    ValidUntil     *time.Time
    IsActive       bool       `gorm:"default:true"`
    CreatedByID    uuid.UUID  `gorm:"type:uuid;index;not null"`
    CreatedAt      time.Time
    UpdatedAt      time.Time

    Course     *Course
    CreatedBy  User
    Usages     []CouponUsage `gorm:"foreignKey:CouponID"`
}

type CouponUsage struct {
    ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    CouponID        uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_coupon_student;not null"`
    StudentID       uuid.UUID `gorm:"type:uuid;uniqueIndex:idx_coupon_student;not null"`
    CourseID        uuid.UUID `gorm:"type:uuid;index;not null"`
    DiscountApplied float64
    UsedAt          time.Time

    Coupon  Coupon
    Student User
    Course  Course
}
```

**Tables:** `coupons`, `coupon_usages`

---

### New Entity 5: `Order`

**Purpose:** Tracks student course purchases made on the LMS itself (Razorpay / Stripe / manual). Ties coupon usage and enrollment together.

```go
type Order struct {
    ID              uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    StudentID       uuid.UUID  `gorm:"type:uuid;index;not null"`
    CourseID        uuid.UUID  `gorm:"type:uuid;index;not null"`
    OriginalPrice   float64
    DiscountAmount  float64    `gorm:"default:0"`
    FinalAmount     float64
    CouponID        *uuid.UUID `gorm:"type:uuid;index"`
    Status          string     `gorm:"type:varchar(20);default:'pending'"` // pending | paid | failed | refunded
    PaymentProvider *string    // razorpay | stripe | manual
    ProviderOrderID *string    // external order/session ID
    ProviderPaymentID *string  // external payment confirmation ID
    PaidAt          *time.Time
    CreatedAt       time.Time
    UpdatedAt       time.Time

    Student User
    Course  Course
    Coupon  *Coupon
}
```

**Table:** `orders`
**Rationale:** Currently enrollment is free / no payment record exists. PLAN.md lists checkout/cart — this entity supports it.

---

### New Entity 6: `Notification`

**Purpose:** In-app notification feed per user. Events: enrollment confirmed, certificate issued, new announcement, live session starting, DPP published, test result ready.

```go
type Notification struct {
    ID        uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    UserID    uuid.UUID  `gorm:"type:uuid;index;not null"`
    Type      string     `gorm:"type:varchar(30);not null"` // enrollment | certificate | announcement | session | dpp | result
    Title     string     `gorm:"not null"`
    Message   string
    Link      *string    // deep link e.g. /panel/courses/:id
    ReadAt    *time.Time
    CreatedAt time.Time

    User User
}
```

**Table:** `notifications`

---

### New Entity 7: `StudyMaterial`

**Purpose:** Supplementary resources attached to a course or module (PDFs, slides, links). Distinct from `Lesson` content — these are downloadable attachments, not sequential lesson items.

```go
type StudyMaterial struct {
    ID          uuid.UUID  `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
    Title       string     `gorm:"not null"`
    Description *string
    CourseID    uuid.UUID  `gorm:"type:uuid;index;not null"`
    ModuleID    *uuid.UUID `gorm:"type:uuid;index"` // nil = course-level
    FileURL     string     `gorm:"not null"`
    FileType    string     `gorm:"type:varchar(20)"` // pdf | doc | ppt | link | zip
    FileSizeKB  *int
    OrderIndex  int        `gorm:"default:0"`
    IsPublished bool       `gorm:"default:false"`
    UploadedByID uuid.UUID `gorm:"type:uuid;index;not null"`
    CreatedAt   time.Time
    UpdatedAt   time.Time

    Course     Course
    Module     *Module
    UploadedBy User
}
```

**Table:** `study_materials`

---

## Summary of All Entity Changes

| Change | Type | Tables Affected |
|--------|------|-----------------|
| Fix `LicenseConfig` table name, column type, populate org/maxUsers from SaaS | Fix | `license_configs` |
| Add `Institute` | New | `institute` |
| Add `Batch` + `BatchEnrollment` + `batch_courses` join | New | `batches`, `batch_enrollments`, `batch_courses` |
| Add FK constraint for existing `batch_id` in `daily_practice_papers` + `announcements` | Fix | existing tables |
| Add `CategoryID` to `Course` | Fix | `courses` |
| Add `Category` | New | `categories` |
| Add `Coupon` + `CouponUsage` | New | `coupons`, `coupon_usages` |
| Add `Order` | New | `orders` |
| Add `Notification` | New | `notifications` |
| Add `StudyMaterial` | New | `study_materials` |

**New tables: 9** | **Fixed tables: 4** | **Total tables after: ~26**

---

## Implementation Steps

1. **`apps/lms-backend/internal/models/models.go`**
   - Add `Institute`, `Batch`, `BatchEnrollment`, `Category`, `Coupon`, `CouponUsage`, `Order`, `Notification`, `StudyMaterial` structs
   - Add `CategoryID *uuid.UUID` to `Course`
   - Fix `LicenseConfig.TableName()` → `"license_configs"`
   - Fix `LicenseConfig` fields: replace `gorm:"type:text"` with `gorm:"type:jsonb"` on features

2. **`apps/lms-backend/internal/database/db.go`**
   - Add all new structs to the AutoMigrate call

3. **`apps/lms-backend/migrations/002_add_entities.up.sql`**
   - Write SQL for all new tables with proper FK constraints, indexes, and UNIQUE constraints
   - Add migration to fix existing `batch_id` columns with proper FK to `batches.id`
   - Fix `license_configs.features` column type from TEXT → jsonb

4. **`apps/lms-backend/internal/service/license_service.go`** (`responseToModel`)
   - Read `OrganizationName` and `MaxUsers` from verify response instead of hardcoding

5. **`apps/saas-backend/src/licenses/licenses.service.ts`** (verify endpoint)
   - Add `organizationName` and `maxUsers` to `VerifyLicenseResponseDto` and the verify response payload

---

## Verification

- Run `go build ./...` in `apps/lms-backend` — no compile errors
- Run AutoMigrate against a local Postgres — all new tables created, no FK violations
- `GET /api/v1/license/info` should return real `organization_name` (not hardcoded `"Organization"`)
- Query `SELECT * FROM batches` after creating a batch — `daily_practice_papers.batch_id` FK resolves
- `pnpm typecheck` in `apps/saas-backend` — VerifyLicenseResponseDto compiles with new fields
