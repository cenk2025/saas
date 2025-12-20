-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    stripe_current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role user_role DEFAULT 'EMPLOYEE',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnostic reports table
CREATE TABLE diagnostic_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    score INTEGER NOT NULL,
    summary TEXT NOT NULL,
    weaknesses TEXT[] NOT NULL DEFAULT '{}',
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    raw_answers JSONB,
    ai_response JSONB,
    category_scores JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_diagnostic_reports_company_id ON diagnostic_reports(company_id);
CREATE INDEX idx_diagnostic_reports_user_id ON diagnostic_reports(user_id);
CREATE INDEX idx_diagnostic_reports_created_at ON diagnostic_reports(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
    ON companies FOR SELECT
    USING (id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can update their company"
    ON companies FOR UPDATE
    USING (id IN (
        SELECT company_id FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- RLS Policies for users
CREATE POLICY "Users can view users in their company"
    ON users FOR SELECT
    USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ) OR id = auth.uid());

CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- RLS Policies for diagnostic_reports
CREATE POLICY "Users can view reports from their company"
    ON diagnostic_reports FOR SELECT
    USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can create reports for their company"
    ON diagnostic_reports FOR INSERT
    WITH CHECK (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Admins can delete reports from their company"
    ON diagnostic_reports FOR DELETE
    USING (company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- Insert demo data
INSERT INTO companies (id, name, country) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Acme Corporation', 'FI'),
    ('550e8400-e29b-41d4-a716-446655440001', 'TechStart Oy', 'FI');

INSERT INTO users (id, email, name, role, company_id) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', 'admin@acme.com', 'Admin User', 'ADMIN', '550e8400-e29b-41d4-a716-446655440000'),
    ('650e8400-e29b-41d4-a716-446655440001', 'manager@acme.com', 'Manager User', 'MANAGER', '550e8400-e29b-41d4-a716-446655440000'),
    ('650e8400-e29b-41d4-a716-446655440002', 'employee@acme.com', 'Employee User', 'EMPLOYEE', '550e8400-e29b-41d4-a716-446655440000');
