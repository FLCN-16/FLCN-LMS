-- Add CategoryID to courses table
ALTER TABLE courses ADD COLUMN category_id uuid;
CREATE INDEX idx_courses_category_id ON courses(category_id);

-- Create categories table
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    description text,
    thumbnail_url varchar(500),
    parent_id uuid,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- Add foreign key constraint for parent categories
ALTER TABLE categories
    ADD CONSTRAINT fk_categories_parent_id
    FOREIGN KEY (parent_id)
    REFERENCES categories(id)
    ON DELETE CASCADE;

-- Add foreign key constraint for category in courses
ALTER TABLE courses
    ADD CONSTRAINT fk_courses_category_id
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL;

-- Create institute table
CREATE TABLE institute (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    slug varchar(255) NOT NULL UNIQUE,
    logo_url varchar(500),
    favicon_url varchar(500),
    domain varchar(255) UNIQUE,
    tagline varchar(500),
    description text,
    contact_email varchar(255),
    contact_phone varchar(20),
    address text,
    city varchar(100),
    country varchar(100) DEFAULT 'IN',
    website varchar(500),
    social_links jsonb,
    brand_color varchar(7),
    is_setup boolean DEFAULT false,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institute_slug ON institute(slug);

-- Create batches table
CREATE TABLE batches (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    description text,
    code varchar(100) UNIQUE,
    instructor_id uuid,
    max_students integer,
    start_date timestamp,
    end_date timestamp,
    status varchar(20) DEFAULT 'active',
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_batches_instructor_id ON batches(instructor_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_code ON batches(code);

-- Add foreign key for instructor in batches
ALTER TABLE batches
    ADD CONSTRAINT fk_batches_instructor_id
    FOREIGN KEY (instructor_id)
    REFERENCES users(id)
    ON DELETE SET NULL;

-- Create batch_courses join table
CREATE TABLE batch_courses (
    batch_id uuid NOT NULL,
    course_id uuid NOT NULL,
    added_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (batch_id, course_id)
);

CREATE INDEX idx_batch_courses_course_id ON batch_courses(course_id);

-- Add foreign key constraints for batch_courses
ALTER TABLE batch_courses
    ADD CONSTRAINT fk_batch_courses_batch_id
    FOREIGN KEY (batch_id)
    REFERENCES batches(id)
    ON DELETE CASCADE;

ALTER TABLE batch_courses
    ADD CONSTRAINT fk_batch_courses_course_id
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE;

-- Create batch_enrollments table
CREATE TABLE batch_enrollments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status varchar(20) DEFAULT 'active',
    joined_at timestamp DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (batch_id, student_id)
);

CREATE INDEX idx_batch_enrollments_batch_id ON batch_enrollments(batch_id);
CREATE INDEX idx_batch_enrollments_student_id ON batch_enrollments(student_id);

-- Add foreign key constraints for batch_enrollments
ALTER TABLE batch_enrollments
    ADD CONSTRAINT fk_batch_enrollments_batch_id
    FOREIGN KEY (batch_id)
    REFERENCES batches(id)
    ON DELETE CASCADE;

ALTER TABLE batch_enrollments
    ADD CONSTRAINT fk_batch_enrollments_student_id
    FOREIGN KEY (student_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

-- Add foreign key constraint for batch_id in daily_practice_papers
ALTER TABLE daily_practice_papers
    ADD CONSTRAINT fk_daily_practice_papers_batch_id
    FOREIGN KEY (batch_id)
    REFERENCES batches(id)
    ON DELETE SET NULL;

-- Add foreign key constraint for batch_id in announcements
ALTER TABLE announcements
    ADD CONSTRAINT fk_announcements_batch_id
    FOREIGN KEY (batch_id)
    REFERENCES batches(id)
    ON DELETE SET NULL;

-- Create coupons table
CREATE TABLE coupons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code varchar(50) NOT NULL UNIQUE,
    description text,
    discount_type varchar(10) NOT NULL,
    discount_value numeric(10, 2) NOT NULL,
    max_discount numeric(10, 2),
    min_order_value numeric(10, 2),
    course_id uuid,
    usage_limit integer,
    used_count integer DEFAULT 0,
    valid_from timestamp NOT NULL,
    valid_until timestamp,
    is_active boolean DEFAULT true,
    created_by_id uuid NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_course_id ON coupons(course_id);
CREATE INDEX idx_coupons_created_by_id ON coupons(created_by_id);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- Add foreign key constraints for coupons
ALTER TABLE coupons
    ADD CONSTRAINT fk_coupons_course_id
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE SET NULL;

ALTER TABLE coupons
    ADD CONSTRAINT fk_coupons_created_by_id
    FOREIGN KEY (created_by_id)
    REFERENCES users(id)
    ON DELETE RESTRICT;

-- Create coupon_usages table
CREATE TABLE coupon_usages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id uuid NOT NULL,
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    discount_applied numeric(10, 2),
    used_at timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (coupon_id, student_id)
);

CREATE INDEX idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_student_id ON coupon_usages(student_id);
CREATE INDEX idx_coupon_usages_course_id ON coupon_usages(course_id);

-- Add foreign key constraints for coupon_usages
ALTER TABLE coupon_usages
    ADD CONSTRAINT fk_coupon_usages_coupon_id
    FOREIGN KEY (coupon_id)
    REFERENCES coupons(id)
    ON DELETE CASCADE;

ALTER TABLE coupon_usages
    ADD CONSTRAINT fk_coupon_usages_student_id
    FOREIGN KEY (student_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE coupon_usages
    ADD CONSTRAINT fk_coupon_usages_course_id
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE;

-- Create orders table
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    original_price numeric(10, 2),
    discount_amount numeric(10, 2) DEFAULT 0,
    final_amount numeric(10, 2),
    coupon_id uuid,
    status varchar(20) DEFAULT 'pending',
    payment_provider varchar(50),
    provider_order_id varchar(500),
    provider_payment_id varchar(500),
    paid_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_course_id ON orders(course_id);
CREATE INDEX idx_orders_coupon_id ON orders(coupon_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Add foreign key constraints for orders
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_student_id
    FOREIGN KEY (student_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_course_id
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE RESTRICT;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_coupon_id
    FOREIGN KEY (coupon_id)
    REFERENCES coupons(id)
    ON DELETE SET NULL;

-- Create notifications table
CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    type varchar(30) NOT NULL,
    title varchar(255) NOT NULL,
    message text,
    link varchar(500),
    read_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Add foreign key constraint for notifications
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

-- Create study_materials table
CREATE TABLE study_materials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255) NOT NULL,
    description text,
    course_id uuid NOT NULL,
    module_id uuid,
    file_url varchar(500) NOT NULL,
    file_type varchar(20),
    file_size_kb integer,
    order_index integer DEFAULT 0,
    is_published boolean DEFAULT false,
    uploaded_by_id uuid NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_materials_course_id ON study_materials(course_id);
CREATE INDEX idx_study_materials_module_id ON study_materials(module_id);
CREATE INDEX idx_study_materials_uploaded_by_id ON study_materials(uploaded_by_id);
CREATE INDEX idx_study_materials_is_published ON study_materials(is_published);

-- Add foreign key constraints for study_materials
ALTER TABLE study_materials
    ADD CONSTRAINT fk_study_materials_course_id
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE;

ALTER TABLE study_materials
    ADD CONSTRAINT fk_study_materials_module_id
    FOREIGN KEY (module_id)
    REFERENCES modules(id)
    ON DELETE SET NULL;

ALTER TABLE study_materials
    ADD CONSTRAINT fk_study_materials_uploaded_by_id
    FOREIGN KEY (uploaded_by_id)
    REFERENCES users(id)
    ON DELETE RESTRICT;

-- Fix license_configs table and column types if needed
ALTER TABLE license_configs
    ALTER COLUMN features TYPE jsonb USING features::jsonb;
