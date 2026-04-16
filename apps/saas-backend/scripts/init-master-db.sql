-- ============================================================================
-- FLCN-LMS Master Database Schema
-- Database: flcn_master
--
-- This script initializes the master database that contains SaaS metadata.
-- It should be run ONCE during initial setup.
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TENANTS TABLE
-- Core table that registers all tenants in the system
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Unique identifier for tenant
  -- Used in subdomain routing: pw-live.example.com
  slug VARCHAR(50) UNIQUE NOT NULL,

  -- Human-readable name
  name VARCHAR(255) NOT NULL,

  -- Logo URL (CDN)
  logo_url VARCHAR(500),

  -- Custom domain for white-label access
  custom_domain VARCHAR(255) UNIQUE,

  -- Subscription plan tier
  plan VARCHAR(50) DEFAULT 'free',

  -- Tenant status
  is_active BOOLEAN DEFAULT true,

  -- Custom settings (JSON)
  settings JSONB,

  -- Usage limits based on plan
  max_users INTEGER DEFAULT 100,
  max_courses INTEGER DEFAULT 50,
  max_storage_gb INTEGER DEFAULT 10,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT plan_valid CHECK (plan IN ('free', 'pro', 'enterprise'))
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(custom_domain);
CREATE INDEX idx_tenants_active ON tenants(is_active);

-- ============================================================================
-- TENANT DATABASES TABLE
-- Stores database connection configuration for each tenant
-- ============================================================================
CREATE TABLE IF NOT EXISTS tenant_databases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to tenant
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,

  -- Database connection details
  db_host VARCHAR(255) NOT NULL DEFAULT 'localhost',
  db_port INTEGER NOT NULL DEFAULT 5432,
  db_name VARCHAR(100) UNIQUE NOT NULL,
  db_user VARCHAR(100) NOT NULL,

  -- Password (should be encrypted in production)
  -- TODO: Implement encryption service
  db_password VARCHAR(500) NOT NULL,

  -- Pre-computed connection string (optional)
  connection_string TEXT,

  -- Configuration status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT db_name_format CHECK (db_name ~ '^[a-z0-9_]+$'),
  CONSTRAINT port_valid CHECK (db_port > 0 AND db_port < 65536)
);

CREATE INDEX idx_tenant_databases_tenant_id ON tenant_databases(tenant_id);
CREATE INDEX idx_tenant_databases_active ON tenant_databases(is_active);

-- ============================================================================
-- INSTITUTES TABLE
-- Organizations/institutes within each tenant
-- A tenant can have multiple institutes
-- ============================================================================
CREATE TABLE IF NOT EXISTS institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to tenant
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Institute details
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),

  -- Is this the primary institute for the tenant?
  is_primary BOOLEAN DEFAULT false,

  -- Institute-specific settings
  settings JSONB,

  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutes_tenant ON institutes(tenant_id);
CREATE INDEX idx_institutes_primary ON institutes(tenant_id, is_primary);

-- ============================================================================
-- BILLING TABLE
-- Subscription and billing information per tenant
-- ============================================================================
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to tenant
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,

  -- Stripe integration
  stripe_customer_id VARCHAR(255),
  subscription_id VARCHAR(255),

  -- Plan and status
  plan VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',

  -- Billing period
  current_period_start DATE,
  current_period_end DATE,
  next_billing_date DATE,

  -- Payment info
  amount_due NUMERIC(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method JSONB,

  -- Invoice history
  invoices JSONB[] DEFAULT ARRAY[]::JSONB[],

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT status_valid CHECK (status IN ('active', 'past_due', 'unpaid', 'canceled'))
);

CREATE INDEX idx_billing_tenant ON billing(tenant_id);
CREATE INDEX idx_billing_status ON billing(status);

-- ============================================================================
-- API KEYS TABLE
-- API key management for tenant integrations
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to tenant
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- API key (hashed)
  key_hash VARCHAR(255) NOT NULL UNIQUE,

  -- Display name for the key
  name VARCHAR(100),

  -- Permissions/scopes
  scopes TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Rate limiting
  rate_limit INTEGER DEFAULT 1000,

  -- Usage tracking
  last_used_at TIMESTAMP,
  total_requests INTEGER DEFAULT 0,

  -- Key status
  is_active BOOLEAN DEFAULT true,

  -- Expiration (optional)
  expires_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- ============================================================================
-- AUDIT LOGS TABLE
-- Comprehensive audit trail for compliance and debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to tenant (allows null for system-level logs)
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,

  -- User who performed the action (optional)
  user_id UUID,

  -- Action details
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),

  -- Change tracking
  old_values JSONB,
  new_values JSONB,
  changes JSONB,

  -- Request context
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_method VARCHAR(10),
  request_path VARCHAR(500),

  -- Response
  status_code INTEGER,
  response_time_ms INTEGER,

  -- Timestamp
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- FEATURE FLAGS TABLE
-- Per-tenant feature toggle configuration
-- ============================================================================
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Null tenant_id means global flag, otherwise tenant-specific
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Flag name
  flag_name VARCHAR(100) NOT NULL,

  -- Enabled status
  is_enabled BOOLEAN DEFAULT false,

  -- Configuration
  config JSONB,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint per tenant (allows global + per-tenant)
  CONSTRAINT unique_flag_per_tenant UNIQUE (tenant_id, flag_name)
);

CREATE INDEX idx_feature_flags_tenant ON feature_flags(tenant_id);
CREATE INDEX idx_feature_flags_name ON feature_flags(flag_name);

-- ============================================================================
-- CREATE FUNCTION: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CREATE TRIGGERS: Auto-update updated_at column
-- ============================================================================
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_databases_updated_at
  BEFORE UPDATE ON tenant_databases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutes_updated_at
  BEFORE UPDATE ON institutes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_updated_at
  BEFORE UPDATE ON billing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for development/testing)
-- Uncomment to seed test data
-- ============================================================================

-- INSERT INTO tenants (slug, name, plan, is_active)
-- VALUES
--   ('pw-live', 'Physics Wallah', 'pro', true),
--   ('adda247', 'ADDA247', 'pro', true),
--   ('flcn-org', 'FLCN', 'free', true);

-- INSERT INTO tenant_databases (tenant_id, db_host, db_port, db_name, db_user, db_password, is_active)
-- SELECT id, 'localhost', 5432, 'db_' || slug, 'tenant_user', 'secure_password', true
-- FROM tenants;

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the schema was created correctly
-- ============================================================================

-- SELECT COUNT(*) as table_count FROM information_schema.tables
-- WHERE table_schema = 'public';

-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- ============================================================================
-- END OF MASTER DATABASE INITIALIZATION
-- ============================================================================
