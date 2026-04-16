-- Drop study_materials table
DROP TABLE IF EXISTS study_materials CASCADE;

-- Drop notifications table
DROP TABLE IF EXISTS notifications CASCADE;

-- Drop orders table
DROP TABLE IF EXISTS orders CASCADE;

-- Drop coupon_usages table
DROP TABLE IF EXISTS coupon_usages CASCADE;

-- Drop coupons table
DROP TABLE IF EXISTS coupons CASCADE;

-- Drop batch_enrollments table
DROP TABLE IF EXISTS batch_enrollments CASCADE;

-- Drop batch_courses join table
DROP TABLE IF EXISTS batch_courses CASCADE;

-- Drop batches table
DROP TABLE IF EXISTS batches CASCADE;

-- Drop institute table
DROP TABLE IF EXISTS institute CASCADE;

-- Drop categories table
DROP TABLE IF EXISTS categories CASCADE;

-- Remove FK constraints from daily_practice_papers and announcements if they exist
ALTER TABLE daily_practice_papers DROP CONSTRAINT IF EXISTS fk_daily_practice_papers_batch_id;
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS fk_announcements_batch_id;

-- Remove category_id from courses
ALTER TABLE courses DROP CONSTRAINT IF EXISTS fk_courses_category_id;
ALTER TABLE courses DROP COLUMN IF EXISTS category_id;
