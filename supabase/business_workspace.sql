-- Voon Business AI workspace: company profile + saved AI documents.
-- Run once in the Supabase SQL editor (safe to re-run).

ALTER TABLE companies ADD COLUMN IF NOT EXISTS profile JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS ai_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tool TEXT NOT NULL,
    title TEXT NOT NULL,
    input JSONB NOT NULL DEFAULT '{}'::jsonb,
    output TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_documents_company_created ON ai_documents(company_id, created_at DESC);

-- The app reads and writes through the service role on the server; RLS keeps
-- direct client access limited to the user's own company.
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their company documents" ON ai_documents;
CREATE POLICY "Users can view their company documents"
    ON ai_documents FOR SELECT
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));
