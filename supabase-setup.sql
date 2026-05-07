-- ============================================================
-- Content Matrix · Supabase Setup
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Create the documents table
CREATE TABLE IF NOT EXISTS documents (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL,       -- html | gif | poster | video | text
  domain       TEXT NOT NULL,       -- iso | gestion | transfo | cyber | dev | data | app
  tags         TEXT[] DEFAULT '{}',
  status       TEXT DEFAULT 'draft', -- draft | published | archived
  input_mode   TEXT,                -- text | url | file
  content      TEXT,               -- raw text / HTML content
  url          TEXT,               -- public URL (storage or external)
  file_name    TEXT,
  file_mime    TEXT,
  storage_path TEXT,               -- Supabase storage path
  created_at   BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
  updated_at   BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- 2. Row-level security (open policy for single-team use)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON documents FOR ALL USING (true) WITH CHECK (true);

-- 3. Index for common queries
CREATE INDEX IF NOT EXISTS idx_docs_type   ON documents (type);
CREATE INDEX IF NOT EXISTS idx_docs_domain ON documents (domain);
CREATE INDEX IF NOT EXISTS idx_docs_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_docs_updated ON documents (updated_at DESC);

-- ============================================================
-- Storage bucket: run these steps in Supabase Dashboard UI
--
-- 1. Go to Storage → New bucket
-- 2. Name: content-matrix
-- 3. ✅ Public bucket (so files have public URLs)
-- 4. Save
-- ============================================================
