package database

import (
	"fmt"
	"log"

	"gorm.io/gorm"
)

// Migration represents a single database migration
type Migration struct {
	Version string
	Name    string
	Up      string
	Down    string
}

// RunMigrations executes all pending migrations
func RunMigrations(db *gorm.DB) error {
	log.Println("[Database] Running migrations...")

	// Execute all migrations
	migrations := getAllMigrations()

	for _, migration := range migrations {
		if err := db.Exec(migration.Up).Error; err != nil {
			return fmt.Errorf("failed to run migration %s: %w", migration.Name, err)
		}
		log.Printf("[Database] ✓ Migration %s applied successfully", migration.Name)
	}

	log.Println("[Database] ✓ All migrations completed successfully")
	return nil
}

// RollbackMigrations rolls back migrations in reverse order
func RollbackMigrations(db *gorm.DB) error {
	log.Println("[Database] Rolling back migrations...")

	migrations := getAllMigrations()

	// Execute in reverse order
	for i := len(migrations) - 1; i >= 0; i-- {
		migration := migrations[i]
		if err := db.Exec(migration.Down).Error; err != nil {
			return fmt.Errorf("failed to rollback migration %s: %w", migration.Name, err)
		}
		log.Printf("[Database] ✓ Migration %s rolled back successfully", migration.Name)
	}

	log.Println("[Database] ✓ All migrations rolled back successfully")
	return nil
}

// getAllMigrations returns all database migrations
func getAllMigrations() []Migration {
	return []Migration{
		{
			Version: "001",
			Name:    "initial_schema",
			Up: `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_picture_url TEXT,
    role VARCHAR(50) DEFAULT 'student' NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_students INTEGER,
    price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id_order ON modules(course_id, order_index);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'text', 'pdf', 'document')),
    content_url TEXT,
    duration_seconds INTEGER,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id_order ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_is_published ON lessons(is_published);

-- Test Series table
CREATE TABLE IF NOT EXISTS test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    total_questions INTEGER,
    duration_minutes INTEGER,
    passing_percentage DECIMAL(5, 2),
    shuffle_questions BOOLEAN DEFAULT false NOT NULL,
    show_correct_answers BOOLEAN DEFAULT false NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_test_series_slug ON test_series(slug);
CREATE INDEX IF NOT EXISTS idx_test_series_is_published ON test_series(is_published);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_series_id UUID NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    marks DECIMAL(5, 2),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_test_series_id ON questions(test_series_id);
CREATE INDEX IF NOT EXISTS idx_questions_test_series_id_order ON questions(test_series_id, order_index);

-- Question Options table
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id_order ON question_options(question_id, order_index);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'completed', 'dropped')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(course_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Lesson Progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    watched_at TIMESTAMP,
    watch_time_seconds INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(lesson_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student_id ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_is_completed ON lesson_progress(is_completed);

-- Attempts table
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_series_id UUID NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    total_marks DECIMAL(8, 2),
    obtained_marks DECIMAL(8, 2),
    percentage DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL CHECK (status IN ('in_progress', 'submitted', 'evaluated')),
    time_spent_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_test_series_id ON attempts(test_series_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student_id ON attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_started_at ON attempts(started_at);

-- Attempt Answers table
CREATE TABLE IF NOT EXISTS attempt_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    written_answer TEXT,
    marks_obtained DECIMAL(5, 2),
    is_correct BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_id ON attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_question_id ON attempt_answers(question_id);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    test_series_id UUID REFERENCES test_series(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_test_series_id ON certificates(test_series_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON certificates(certificate_number);

-- Live Sessions table
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    livekit_room_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_instructor_id ON live_sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_sessions_scheduled_start ON live_sessions(scheduled_start);

-- Live Session Participants table
CREATE TABLE IF NOT EXISTS live_session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    left_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_live_session_participants_session_id ON live_session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_live_session_participants_user_id ON live_session_participants(user_id);

-- License Config table
CREATE TABLE IF NOT EXISTS license_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_key VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    max_users INTEGER,
    features TEXT,
    expiry_date TIMESTAMP,
    cached_at TIMESTAMP,
    is_valid BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_license_configs_license_key ON license_configs(license_key);
CREATE INDEX IF NOT EXISTS idx_license_configs_is_valid ON license_configs(is_valid);
			`,
			Down: `
-- Drop all tables in reverse order of creation (respecting foreign keys)
DROP TABLE IF EXISTS license_configs CASCADE;
DROP TABLE IF EXISTS live_session_participants CASCADE;
DROP TABLE IF EXISTS live_sessions CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS attempt_answers CASCADE;
DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS test_series CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop extension if it was created
DROP EXTENSION IF EXISTS "uuid-ossp";
			`,
		},
		{
			Version: "002",
			Name:    "course_packages_and_billing",
			Up: `
-- Course Packages table (pricing tiers per course)
CREATE TABLE IF NOT EXISTS course_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    validity_days INTEGER NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_course_packages_course_id ON course_packages(course_id);
CREATE INDEX IF NOT EXISTS idx_course_packages_is_active ON course_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_course_packages_sort_order ON course_packages(course_id, sort_order);

-- Add package_id to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES course_packages(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_package_id ON orders(package_id);

-- Transactions table (payment ledger)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    type VARCHAR(20) DEFAULT 'payment' NOT NULL CHECK (type IN ('payment', 'refund')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    line_items JSONB DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'issued' NOT NULL CHECK (status IN ('draft', 'issued', 'void')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    package_id UUID REFERENCES course_packages(id) ON DELETE SET NULL,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_course_id ON subscriptions(course_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
			`,
			Down: `
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
ALTER TABLE orders DROP COLUMN IF EXISTS package_id;
DROP TABLE IF EXISTS course_packages CASCADE;
			`,
		},
		{
			Version: "003",
			Name:    "course_bundles_and_lesson_notes",
			Up: `
-- Add parent/bundle columns to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS parent_course_id UUID REFERENCES courses(id) ON DELETE SET NULL;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_bundle BOOLEAN DEFAULT false NOT NULL;

CREATE INDEX IF NOT EXISTS idx_courses_parent_course_id ON courses(parent_course_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_bundle ON courses(is_bundle);

-- Lesson Notes table
CREATE TABLE IF NOT EXISTS lesson_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lesson_notes_student_id ON lesson_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_lesson_id ON lesson_notes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_student_lesson ON lesson_notes(student_id, lesson_id);
			`,
			Down: `
DROP TABLE IF EXISTS lesson_notes CASCADE;
ALTER TABLE courses DROP COLUMN IF EXISTS is_bundle;
ALTER TABLE courses DROP COLUMN IF EXISTS parent_course_id;
			`,
		},
		{
			Version: "004",
			Name:    "course_discovery_and_content_metadata",
			Up: `
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS short_description       varchar(300),
    ADD COLUMN IF NOT EXISTS language                varchar(50) DEFAULT 'English',
    ADD COLUMN IF NOT EXISTS level                   varchar(50) DEFAULT 'beginner',
    ADD COLUMN IF NOT EXISTS tags                    jsonb,
    ADD COLUMN IF NOT EXISTS what_you_learn          jsonb,
    ADD COLUMN IF NOT EXISTS requirements            jsonb,
    ADD COLUMN IF NOT EXISTS target_audience         jsonb,
    ADD COLUMN IF NOT EXISTS highlights              jsonb,
    ADD COLUMN IF NOT EXISTS career_outcomes         jsonb,
    ADD COLUMN IF NOT EXISTS companies               jsonb,
    ADD COLUMN IF NOT EXISTS faq                     jsonb,
    ADD COLUMN IF NOT EXISTS estimated_hours         int,
    ADD COLUMN IF NOT EXISTS preview_video_url       text,
    ADD COLUMN IF NOT EXISTS certificate_included    boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS last_content_updated_at timestamptz,
    ADD COLUMN IF NOT EXISTS total_enrolled          int DEFAULT 0,
    ADD COLUMN IF NOT EXISTS average_rating          decimal(3,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS review_count            int DEFAULT 0;
			`,
			Down: `
ALTER TABLE courses
    DROP COLUMN IF EXISTS short_description,
    DROP COLUMN IF EXISTS language,
    DROP COLUMN IF EXISTS level,
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS what_you_learn,
    DROP COLUMN IF EXISTS requirements,
    DROP COLUMN IF EXISTS target_audience,
    DROP COLUMN IF EXISTS highlights,
    DROP COLUMN IF EXISTS career_outcomes,
    DROP COLUMN IF EXISTS companies,
    DROP COLUMN IF EXISTS faq,
    DROP COLUMN IF EXISTS estimated_hours,
    DROP COLUMN IF EXISTS preview_video_url,
    DROP COLUMN IF EXISTS certificate_included,
    DROP COLUMN IF EXISTS last_content_updated_at,
    DROP COLUMN IF EXISTS total_enrolled,
    DROP COLUMN IF EXISTS average_rating,
    DROP COLUMN IF EXISTS review_count;
			`,
		},
		{
			Version: "005",
			Name:    "pricing_and_test_series_sections",
			Up: `
-- Add pricing columns to courses
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS pricing_type varchar(50) DEFAULT 'paid' NOT NULL;

CREATE INDEX IF NOT EXISTS idx_courses_pricing_type ON courses(pricing_type);

-- Add pricing columns to test_series and create sections table
ALTER TABLE test_series
    ADD COLUMN IF NOT EXISTS pricing_type varchar(50) DEFAULT 'free' NOT NULL,
    ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_test_series_pricing_type ON test_series(pricing_type);

-- Create test_series_sections table
CREATE TABLE IF NOT EXISTS test_series_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_series_id UUID NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_test_series_sections_test_series_id ON test_series_sections(test_series_id);
CREATE INDEX IF NOT EXISTS idx_test_series_sections_order ON test_series_sections(test_series_id, order_index);

-- Add test_series_section_id to questions table (nullable for existing data compatibility)
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS test_series_section_id UUID REFERENCES test_series_sections(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_questions_test_series_section_id ON questions(test_series_section_id);
CREATE INDEX IF NOT EXISTS idx_questions_section_order ON questions(test_series_section_id, order_index);
			`,
			Down: `
DROP TABLE IF EXISTS test_series_sections CASCADE;
ALTER TABLE test_series
    DROP COLUMN IF EXISTS pricing_type,
    DROP COLUMN IF EXISTS price;
ALTER TABLE courses
    DROP COLUMN IF EXISTS pricing_type;
ALTER TABLE questions
    DROP COLUMN IF EXISTS test_series_section_id;
			`,
		},
		{
			Version: "006",
			Name:    "create_coupons_and_usages",
			Up: `
-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_course_id ON coupons(course_id);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_created_by_id ON coupons(created_by_id);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_from_until ON coupons(valid_from, valid_until);

-- Create coupon_usages table
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    discount_applied DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_student_id ON coupon_usages(student_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_course_id ON coupon_usages(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_usages_unique ON coupon_usages(coupon_id, student_id);
			`,
			Down: `
DROP TABLE IF EXISTS coupon_usages CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
			`,
		},
	}
}
