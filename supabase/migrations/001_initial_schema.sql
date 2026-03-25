-- ============================================================
-- TenderFlow Coach — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ORGANISATIONS (multi-tenant root)
CREATE TABLE IF NOT EXISTS organisations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES (extends auth.users — auto-created via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id  UUID REFERENCES organisations(id) ON DELETE SET NULL,
  display_name     TEXT,
  avatar_url       TEXT,
  role             TEXT NOT NULL DEFAULT 'klant' CHECK (role IN ('klant','consultant','beheerder')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id  UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  project_name     TEXT NOT NULL,
  client_name      TEXT NOT NULL,
  tender_title     TEXT,
  reference_number TEXT,
  deadline         TIMESTAMPTZ,
  sector           TEXT,
  region           TEXT,
  tender_type      TEXT,
  contract_value   TEXT,
  contact_person   TEXT,
  internal_owner   TEXT,
  status           TEXT NOT NULL DEFAULT 'concept'
                   CHECK (status IN ('concept','in_progress','review','completed','submitted')),
  progress         INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  readiness_score  INTEGER NOT NULL DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROJECT TEAM MEMBERS
CREATE TABLE IF NOT EXISTS project_team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'klant' CHECK (role IN ('klant','consultant','beheerder')),
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- CRITERIA
CREATE TABLE IF NOT EXISTS criteria (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  code         TEXT NOT NULL,
  weight       INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'niet_gestart'
               CHECK (status IN ('niet_gestart','in_progress','review','voltooid')),
  content      TEXT,          -- Main text response for this criterion
  deadline     TIMESTAMPTZ,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-recalculate project.progress when a criterion status changes
CREATE OR REPLACE FUNCTION recalculate_project_progress(p_project_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_total INTEGER;
  v_done  INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total FROM criteria WHERE project_id = p_project_id;
  SELECT COUNT(*) INTO v_done  FROM criteria WHERE project_id = p_project_id AND status = 'voltooid';
  UPDATE projects
  SET progress   = CASE WHEN v_total = 0 THEN 0 ELSE ROUND((v_done::NUMERIC / v_total) * 100) END,
      updated_at = NOW()
  WHERE id = p_project_id;
END;
$$;

CREATE OR REPLACE FUNCTION trigger_progress_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  PERFORM recalculate_project_progress(NEW.project_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_criterion_status_change ON criteria;
CREATE TRIGGER after_criterion_status_change
  AFTER INSERT OR UPDATE OF status ON criteria
  FOR EACH ROW EXECUTE FUNCTION trigger_progress_update();

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_id    UUID NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  help_text       TEXT,
  bullet_content  TEXT[] DEFAULT '{}',
  text_content    TEXT,
  mode            TEXT NOT NULL DEFAULT 'bullets' CHECK (mode IN ('bullets','text')),
  quality_scores  JSONB DEFAULT '{"specificity":"zwak","evidence":"zwak","customerFocus":"zwak","readability":"zwak","distinctiveness":"zwak","smartLevel":"zwak"}',
  is_required     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROJECT DOCUMENTS (file attachments)
CREATE TABLE IF NOT EXISTS project_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  file_path     TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  mime_type     TEXT,
  file_size     INTEGER,
  uploaded_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVIDENCE BANK
CREATE TABLE IF NOT EXISTS evidence_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('referentie','certificaat','cv','document','kpi','aanbeveling','case')),
  description     TEXT,
  year            INTEGER,
  file_path       TEXT,
  file_name       TEXT,
  added_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_type   TEXT NOT NULL CHECK (entity_type IN ('project','criterion','question')),
  entity_id     UUID NOT NULL,
  content       TEXT NOT NULL,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_organisation_id ON projects(organisation_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_criteria_project_id ON criteria(project_id);
CREATE INDEX IF NOT EXISTS idx_questions_criterion_id ON questions(criterion_id);
CREATE INDEX IF NOT EXISTS idx_evidence_organisation_id ON evidence_items(organisation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_category ON evidence_items(category);
CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON project_team_members(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Helper: returns the current user's organisation_id
CREATE OR REPLACE FUNCTION user_organisation_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT organisation_id FROM profiles WHERE id = auth.uid()
$$;

-- PROFILES
DROP POLICY IF EXISTS "own profile" ON profiles;
CREATE POLICY "own profile" ON profiles FOR ALL USING (id = auth.uid());

-- ORGANISATIONS
DROP POLICY IF EXISTS "own organisation" ON organisations;
CREATE POLICY "own organisation" ON organisations FOR ALL
  USING (id = user_organisation_id());

-- PROJECTS
DROP POLICY IF EXISTS "org projects" ON projects;
CREATE POLICY "org projects" ON projects FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- PROJECT TEAM MEMBERS
DROP POLICY IF EXISTS "org team members" ON project_team_members;
CREATE POLICY "org team members" ON project_team_members FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE organisation_id = user_organisation_id()));

-- CRITERIA
DROP POLICY IF EXISTS "org criteria" ON criteria;
CREATE POLICY "org criteria" ON criteria FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE organisation_id = user_organisation_id()));

-- QUESTIONS
DROP POLICY IF EXISTS "org questions" ON questions;
CREATE POLICY "org questions" ON questions FOR ALL
  USING (criterion_id IN (
    SELECT c.id FROM criteria c
    JOIN projects p ON p.id = c.project_id
    WHERE p.organisation_id = user_organisation_id()
  ));

-- PROJECT DOCUMENTS
DROP POLICY IF EXISTS "org project documents" ON project_documents;
CREATE POLICY "org project documents" ON project_documents FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE organisation_id = user_organisation_id()));

-- EVIDENCE ITEMS
DROP POLICY IF EXISTS "org evidence" ON evidence_items;
CREATE POLICY "org evidence" ON evidence_items FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- COMMENTS
DROP POLICY IF EXISTS "org comments read" ON comments;
DROP POLICY IF EXISTS "org comments write" ON comments;
CREATE POLICY "org comments read" ON comments FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE organisation_id = user_organisation_id()));
CREATE POLICY "org comments write" ON comments FOR INSERT
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "org comments update" ON comments FOR UPDATE
  USING (author_id = auth.uid());
