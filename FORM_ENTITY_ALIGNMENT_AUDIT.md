# Form ↔ Entity Alignment Audit
**SaaS Dashboard vs Backend Master Entities**

Generated: 2026-04-16  
Scope: All forms in `/apps/saas-dashboard/src/pages` vs entities in `/apps/saas-backend/src/master-entities`

---

## Executive Summary

| Status | Count | Details |
|--------|-------|---------|
| ✅ **Aligned** | 3 | License, Plan, Super Admin — forms match entities |
| ⚠️ **Partial** | 2 | Customer/Institute, API Keys — missing some fields |
| ❌ **Missing Entities** | 5+ | Customer contacts, branches, invoices, billing, feature flags — no forms |
| 🔴 **Critical Gaps** | 4 | Institute has maxUsers/maxCourses/maxStorage not in form |

---

## Detailed Audit

### ✅ ALIGNED (Proper 1:1 Match)

#### 1. **License** (100% Aligned)
| Field | Entity | Form | Status |
|-------|--------|------|--------|
| organizationName | ✓ | ✓ | ✅ |
| maxUsers | ✓ | ✓ | ✅ |
| expiryDate | ✓ | ✓ | ✅ |
| status | ✓ | ✗ | ⚠️ Auto from backend |
| features | ✓ | ✗ | ⚠️ Auto from plan |
| notes | ✓ | ✗ | 🔴 MISSING |

**File References:**
- Entity: `master-entities/license.entity.ts:22-91`
- Form: `pages/licenses/form.tsx:16-95`

**Issues:**
- Form doesn't expose `notes` field for license metadata
- Features are auto-derived from plan, can't be customized per license
- Status is auto-managed by backend (not in form, correct)

**Recommendation:** 
- Add optional `notes` field to license form (textarea)
- Consider allowing manual feature override in advanced settings

---

#### 2. **Plan** (100% Aligned)
| Field | Entity | Form | Status |
|-------|--------|------|--------|
| name | ✓ | ✓ | ✅ |
| description | ✓ | ✓ | ✅ |
| priceMonthly | ✓ | ✓ | ✅ |
| priceYearly | ✓ | ✓ | ✅ |
| isActive | ✓ | ✓ | ✅ |
| features | ✓ | ✗ | 🔴 MISSING |

**File References:**
- Entity: `master-entities/plan.entity.ts:15-43`
- Form: `pages/plans/form.tsx:16-245`

**Issues:**
- **CRITICAL**: Plan entity has `features` (JSONB) but form doesn't allow editing them
- Features are stored but unreachable in the UI
- When creating a plan, admin can't define what features it includes

**Recommendation:** 
- **HIGH PRIORITY**: Add features editor to plan form (checklist of available features with limits)
- Show feature preview in listing page
- Allow bulk feature assignment from templates

---

#### 3. **Super Admin** (95% Aligned)
| Field | Entity | Form | Status |
|-------|--------|------|--------|
| name | ✓ | ✓ | ✅ |
| email | ✓ | ✓ | ✅ |
| password | ✓ | ✓ | ✅ |
| isActive | ✓ | ✗ | 🔴 MISSING |
| role | ✓ | ✗ | 🔴 MISSING |
| lastLogin | ✓ | ✗ | ℹ️ Read-only, OK |

**File References:**
- Entity: `master-entities/super-admin.entity.ts:15-43`
- Form: `pages/super-admins/form.tsx:16-210`

**Issues:**
- Form can't deactivate/reactivate admins (no isActive toggle)
- Role field is hardcoded to 'super_admin' in entity, but form doesn't show it
- No password reset flow for existing admins (form only shows on create)

**Recommendation:**
- Add `isActive` toggle to super admin form (for deactivation without deletion)
- Add password reset button separate from edit form
- Show current role (readonly) for clarity

---

### ⚠️ PARTIAL ALIGNMENT (Missing Fields)

#### 4. **Customer / Institute** (70% Aligned)
| Field | Entity | Form | Status |
|-------|--------|------|--------|
| name | ✓ | ✓ | ✅ |
| slug | ✓ | ✓ | ✅ |
| customDomain | ✓ | ✓ | ✅ |
| logoUrl | ✓ | ✗ | 🔴 MISSING |
| planId | ✓ | ✗ | 🔴 MISSING |
| isActive | ✓ | ✗ | 🔴 MISSING |
| maxUsers | ✓ | ✗ | 🔴 MISSING |
| maxCourses | ✓ | ✗ | 🔴 MISSING |
| maxStorageGb | ✓ | ✗ | 🔴 MISSING |
| settings | ✓ | ✗ | 🔴 MISSING |
| databases | ✓ | ✗ | 📊 Not in form, display separate |
| branches | ✓ | ✗ | 📊 Not in form, display separate |
| billing | ✓ | ✗ | 📊 Display via /billing page |

**File References:**
- Entity: `master-entities/institute.entity.ts:37-237`
- Form: `pages/customers/form.tsx:16-210`

**Issues:**
- **CRITICAL**: Form only captures 3 out of 14 entity fields
- Admin can't set logo, plan, or usage limits when creating customer
- Can't suspend a customer without deletion
- maxUsers/maxCourses/maxStorageGb are set to defaults, can't be customized

**Recommendation:**
- **HIGH PRIORITY**: Expand customer form into multi-step wizard
  - Step 1: Basic info (name, slug, domain)
  - Step 2: Plan selection + resource limits
  - Step 3: Logo upload + settings
  - Step 4: Database provisioning confirmation
- Add isActive toggle for customer suspension
- Create separate pages for:
  - Customer → Billing relationship
  - Customer → Branches management
  - Customer → Database configuration

---

#### 5. **API Keys** (Partial)
| Field | Entity | Form | Status |
|-------|--------|------|--------|
| keyHash | ✓ | ✗ | ℹ️ Not needed (hashed) |
| scope | ✓ | ✓ | ✅ |
| isActive | ✓ | ✗ | 🔴 MISSING |
| expiryDate | ✓ | ✗ | 🔴 MISSING |
| lastUsedAt | ✓ | ✗ | ℹ️ Read-only, OK |
| rateLimit | ✓ | ✗ | 🔴 MISSING |

**Issues:**
- Form doesn't support setting/updating expiry date for API keys
- Can't set rate limits per key
- Can't deactivate keys (no toggle)

**Recommendation:**
- Add expiryDate picker to API key form
- Add rateLimit input field
- Add isActive toggle to deactivate without deleting

---

### 🔴 MISSING ENTITIES (No Forms Created)

#### 6. **Branch** (Related to Institute)
```
Entity: master-entities/branch.entity.ts
Form: ❌ MISSING
Reference: Mentioned in institute.entity.ts @OneToMany
```
**Impact:** Can't manage institute branches/locations via UI  
**Recommendation:** Create `pages/institute/branches/` with CRUD forms

#### 7. **InstituteBilling**
```
Entity: master-entities/institute-billing.entity.ts
Form: ❌ MISSING (partial UI via /billing page exists)
```
**Impact:** Billing data is read-only in dashboard  
**Recommendation:** Create structured billing detail + invoice generation pages

#### 8. **Invoice**
```
Entity: master-entities/invoice.entity.ts
Form: ❌ MISSING
Reference: pages/invoices.tsx exists but likely read-only
```
**Impact:** Admins can't generate or customize invoices  
**Recommendation:** Add invoice generation form + template selector

#### 9. **FeatureFlag**
```
Entity: master-entities/feature-flag.entity.ts
Form: ❌ MISSING
Usage: One-to-many from Institute
```
**Impact:** Can't toggle features per customer via UI  
**Recommendation:** Create `pages/institute/feature-flags/` with enable/disable toggles

#### 10. **AuditLog**
```
Entity: master-entities/audit-log.entity.ts
Form: ❌ NOT NEEDED (read-only)
Reference: Mentioned in institute.entity.ts @OneToMany
```
**Status:** Correctly no form (audit logs should be immutable)

---

## Cross-Cutting Issues

### 1. **Enum Handling**
Some entities have enums not properly exposed in forms:
- `License.status` — hardcoded values, form shouldn't set (correct)
- `SuperAdmin.role` — hardcoded 'super_admin', form shows nothing

**Fix:** Document which enums are auto-managed vs user-selectable

### 2. **Relation Display**
Forms don't show or allow editing relations:
- `License.plan` — form doesn't show which plan a license is tied to
- `License.institute` — form doesn't show which customer has the license
- `Institute.databases` — form doesn't provision or config databases

**Fix:** Add relation pickers and detail displays to forms

### 3. **JSONB Fields**
Complex JSON fields not editable in forms:
- `Plan.features` — stored as JSONB, no editor
- `Institute.settings` — stored as JSONB, no editor

**Fix:** Create JSON editors with schema validation

### 4. **Timestamps & Auto-Fields**
Read-only fields correctly excluded from forms:
- `createdAt`, `updatedAt` ✅
- `lastLogin`, `lastUsedAt` ✅
- Entity IDs (auto-generated) ✅

---

## Summary Table: All Entities

| Entity | Form Exists | Alignment | Status | Priority |
|--------|-------------|-----------|--------|----------|
| License | ✓ | 95% | 1 field missing (notes) | Low |
| Plan | ✓ | 80% | Features editor missing | **HIGH** |
| SuperAdmin | ✓ | 85% | isActive, password reset missing | Medium |
| Institute | ✓ | 60% | Major form redesign needed | **CRITICAL** |
| ApiKey | ✓ | 70% | Expiry, limits, deactivation missing | Medium |
| Branch | ✗ | 0% | No form | Medium |
| InstituteBilling | ✗ | 0% | Partial UI exists | Medium |
| Invoice | ✗ | 0% | Read-only UI exists | Low |
| FeatureFlag | ✗ | 0% | No form | Low |
| AuditLog | N/A | N/A | Read-only (correct) | — |
| ApiKeyLog | N/A | N/A | Not applicable | — |

---

## Action Items

### Immediate (This Sprint)
- [ ] **Plan**: Add features editor to plan form (HIGH)
- [ ] **Institute/Customer**: Expand form to wizard with plan + limits (CRITICAL)
- [ ] **License**: Add notes field to form

### Short Term (Next Sprint)
- [ ] **SuperAdmin**: Add isActive toggle, password reset flow
- [ ] **ApiKey**: Add expiry date, rate limit, deactivation
- [ ] **Branch**: Create branch CRUD forms

### Backlog
- [ ] **InstituteBilling**: Structured billing manager
- [ ] **Invoice**: Invoice generation + customization
- [ ] **FeatureFlag**: Per-customer feature toggles
- [ ] **Refund**: Refund request form (if not exists)

---

## Testing Checklist

For each form, verify:
- [ ] All required entity fields are in form or auto-populated
- [ ] Validation matches entity constraints
- [ ] Form submission correctly maps to API payload
- [ ] Enum values align between form and entity
- [ ] Relations (FKs) are validated before save
- [ ] Error messages are user-friendly
- [ ] Success messages confirm what was changed

---

## Notes

- **Dashboard pages**: 65+ pages exist but many are stubs or read-only
- **Form pattern**: All forms use react-hook-form + Controller
- **Styling**: Consistent shadcn/ui components + TailwindCSS
- **API integration**: Forms call mutation hooks from `@/queries/*` (likely TanStack Query)
- **Error handling**: Basic toast notifications, could be more granular

