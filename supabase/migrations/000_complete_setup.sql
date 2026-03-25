-- ============================================================
-- TenderFlow Coach — COMPLETE COMMERCIAL DATABASE SETUP
-- ============================================================
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to run on a fresh Supabase project.
-- ============================================================


-- ============================================================
-- SECTION 1: SUBSCRIPTION PLANS (seed data)
-- ============================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  description         TEXT,
  price_monthly_eur   INTEGER NOT NULL DEFAULT 0,   -- in euro-cents
  price_yearly_eur    INTEGER NOT NULL DEFAULT 0,    -- in euro-cents
  max_projects        INTEGER,                       -- NULL = unlimited
  max_team_members    INTEGER,
  max_evidence_items  INTEGER,
  has_ai_features     BOOLEAN NOT NULL DEFAULT FALSE,
  has_export          BOOLEAN NOT NULL DEFAULT TRUE,
  has_api_access      BOOLEAN NOT NULL DEFAULT FALSE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO subscription_plans
  (id, name, description, price_monthly_eur, price_yearly_eur,
   max_projects, max_team_members, max_evidence_items,
   has_ai_features, has_export, has_api_access)
VALUES
  ('free',         'Gratis',       'Verken het platform gratis',              0,      0,       3,    2,    20,   FALSE, TRUE,  FALSE),
  ('starter',      'Starter',      'Voor kleine teams en zelfstandigen',      4900,   49000,   10,   5,    100,  TRUE,  TRUE,  FALSE),
  ('professional', 'Professional', 'Voor groeiende tenderteams',              9900,   99000,   NULL, 15,   500,  TRUE,  TRUE,  FALSE),
  ('enterprise',   'Enterprise',   'Onbeperkt, SSO en prioriteitssupport',    24900,  249000,  NULL, NULL, NULL, TRUE,  TRUE,  TRUE)
ON CONFLICT (id) DO UPDATE
  SET name               = EXCLUDED.name,
      description        = EXCLUDED.description,
      price_monthly_eur  = EXCLUDED.price_monthly_eur,
      price_yearly_eur   = EXCLUDED.price_yearly_eur,
      max_projects       = EXCLUDED.max_projects,
      max_team_members   = EXCLUDED.max_team_members,
      max_evidence_items = EXCLUDED.max_evidence_items,
      has_ai_features    = EXCLUDED.has_ai_features,
      has_export         = EXCLUDED.has_export,
      has_api_access     = EXCLUDED.has_api_access;


-- ============================================================
-- SECTION 2: CORE TABLES
-- ============================================================

-- ORGANISATIONS
CREATE TABLE IF NOT EXISTS organisations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  slug                 TEXT UNIQUE NOT NULL,
  website              TEXT,
  address              TEXT,
  kvk_number           TEXT,          -- Dutch Chamber of Commerce number
  logo_url             TEXT,
  subscription_plan_id TEXT REFERENCES subscription_plans(id) ON DELETE SET NULL DEFAULT 'free',
  stripe_customer_id   TEXT UNIQUE,   -- Stripe integration
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES (extends auth.users, auto-created via trigger)
CREATE TABLE IF NOT EXISTS profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id  UUID REFERENCES organisations(id) ON DELETE SET NULL,
  display_name     TEXT,
  avatar_url       TEXT,
  phone            TEXT,
  job_title        TEXT,
  role             TEXT NOT NULL DEFAULT 'klant'
                   CHECK (role IN ('klant','consultant','beheerder')),
  timezone         TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
  locale           TEXT NOT NULL DEFAULT 'nl',
  onboarded_at     TIMESTAMPTZ,    -- NULL = hasn't completed onboarding yet
  last_active_at   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBSCRIPTIONS (Stripe-ready, one active per org)
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id         UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  plan_id                 TEXT NOT NULL REFERENCES subscription_plans(id),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active','trialing','past_due','canceled','unpaid')),
  stripe_subscription_id  TEXT UNIQUE,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  trial_end               TIMESTAMPTZ,
  canceled_at             TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORGANISATION INVITATIONS
CREATE TABLE IF NOT EXISTS organisation_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'klant'
                  CHECK (role IN ('klant','consultant','beheerder')),
  token           TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organisation_id, email)
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id      UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  project_name         TEXT NOT NULL,
  client_name          TEXT NOT NULL,
  tender_title         TEXT,
  reference_number     TEXT,
  deadline             TIMESTAMPTZ,
  sector               TEXT,
  region               TEXT,
  tender_type          TEXT,
  contract_value       TEXT,
  contact_person       TEXT,
  internal_owner       TEXT,
  notes                TEXT,
  procurement_platform TEXT,   -- e.g. TenderNed, Negometrix, NEGOMETRIX3
  submission_method    TEXT,   -- e.g. online, paper, email
  status               TEXT NOT NULL DEFAULT 'concept'
                       CHECK (status IN ('concept','in_progress','review','completed','submitted','won','lost')),
  progress             INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  readiness_score      INTEGER NOT NULL DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  is_archived          BOOLEAN NOT NULL DEFAULT FALSE,
  created_by           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROJECT TEAM MEMBERS
CREATE TABLE IF NOT EXISTS project_team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'klant'
              CHECK (role IN ('klant','consultant','beheerder')),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- CRITERIA
CREATE TABLE IF NOT EXISTS criteria (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  code         TEXT NOT NULL,
  weight       INTEGER NOT NULL DEFAULT 0 CHECK (weight BETWEEN 0 AND 100),
  status       TEXT NOT NULL DEFAULT 'niet_gestart'
               CHECK (status IN ('niet_gestart','in_progress','review','voltooid')),
  content      TEXT,         -- final composed answer for this criterion
  deadline     TIMESTAMPTZ,
  assigned_to  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QUESTIONS (answers live here)
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

-- PROJECT DOCUMENTS (tender docs, attachments)
CREATE TABLE IF NOT EXISTS project_documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  file_path    TEXT NOT NULL,
  file_name    TEXT NOT NULL,
  mime_type    TEXT,
  file_size    INTEGER,
  uploaded_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVIDENCE BANK
CREATE TABLE IF NOT EXISTS evidence_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL
                  CHECK (category IN ('referentie','certificaat','cv','document','kpi','aanbeveling','case')),
  description     TEXT,
  year            INTEGER,
  tags            TEXT[] DEFAULT '{}',   -- free-form search tags
  file_path       TEXT,
  file_name       TEXT,
  file_size       INTEGER,
  mime_type       TEXT,
  added_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVIDENCE ↔ QUESTION LINKS (attach evidence to specific answers)
CREATE TABLE IF NOT EXISTS question_evidence_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
  added_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(question_id, evidence_id)
);

-- COMMENTS (on projects, criteria, or questions)
CREATE TABLE IF NOT EXISTS comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_type  TEXT NOT NULL CHECK (entity_type IN ('project','criterion','question')),
  entity_id    UUID NOT NULL,
  content      TEXT NOT NULL,
  resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS (in-app notification queue)
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN (
                 'deadline_reminder',
                 'criterion_assigned',
                 'comment_added',
                 'comment_resolved',
                 'project_status_changed',
                 'invitation_received',
                 'review_requested',
                 'review_completed',
                 'export_ready',
                 'subscription_updated'
               )),
  title        TEXT NOT NULL,
  body         TEXT,
  link         TEXT,          -- in-app route to navigate to
  entity_type  TEXT,
  entity_id    UUID,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATION PREFERENCES (per user)
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id                     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_deadline_reminders    BOOLEAN NOT NULL DEFAULT TRUE,
  email_comments              BOOLEAN NOT NULL DEFAULT TRUE,
  email_assignments           BOOLEAN NOT NULL DEFAULT TRUE,
  email_status_changes        BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_deadline_reminders   BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_comments             BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_assignments          BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_status_changes       BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACTIVITY LOG (full audit trail for compliance + UX)
CREATE TABLE IF NOT EXISTS activity_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name      TEXT,                -- snapshot of display_name at time of action
  action          TEXT NOT NULL,       -- e.g. 'project.created', 'criterion.status_changed'
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  entity_label    TEXT,                -- snapshot of name at time of action
  old_value       JSONB,
  new_value       JSONB,
  metadata        JSONB,               -- extra context (IP, browser, etc.)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI USAGE LOG (track per org for billing and rate limits)
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feature         TEXT NOT NULL CHECK (feature IN (
                    'quality_score',
                    'text_suggestion',
                    'bullet_expansion',
                    'criterion_summary',
                    'project_review'
                  )),
  input_tokens    INTEGER NOT NULL DEFAULT 0,
  output_tokens   INTEGER NOT NULL DEFAULT 0,
  model           TEXT,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
  criterion_id    UUID REFERENCES criteria(id) ON DELETE SET NULL,
  question_id     UUID REFERENCES questions(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROJECT TEMPLATES (reusable tender structures, per org or system-wide)
CREATE TABLE IF NOT EXISTS project_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,  -- NULL = system template
  name            TEXT NOT NULL,
  description     TEXT,
  sector          TEXT,
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,  -- available to all orgs when TRUE
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CRITERION TEMPLATES
CREATE TABLE IF NOT EXISTS criterion_templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_template_id UUID NOT NULL REFERENCES project_templates(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  code                TEXT NOT NULL,
  weight              INTEGER NOT NULL DEFAULT 0,
  sort_order          INTEGER NOT NULL DEFAULT 0
);

-- QUESTION TEMPLATES
CREATE TABLE IF NOT EXISTS question_templates (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_template_id UUID NOT NULL REFERENCES criterion_templates(id) ON DELETE CASCADE,
  text                  TEXT NOT NULL,
  help_text             TEXT,
  is_required           BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order            INTEGER NOT NULL DEFAULT 0
);

-- EXPORTS (track generated export files)
CREATE TABLE IF NOT EXISTS exports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  format        TEXT NOT NULL CHECK (format IN ('docx','pdf','xlsx')),
  file_path     TEXT,
  file_name     TEXT,
  file_size     INTEGER,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','processing','completed','failed')),
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CAPABILITY PROFILES (organisation's credentials and competences)
CREATE TABLE IF NOT EXISTS capability_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id     UUID NOT NULL UNIQUE REFERENCES organisations(id) ON DELETE CASCADE,
  company_size        TEXT,                    -- e.g. '1-10', '11-50', '51-200', '200+'
  founded_year        INTEGER,
  certifications      TEXT[] DEFAULT '{}',     -- e.g. ISO 9001, ISO 27001
  core_capabilities   TEXT[] DEFAULT '{}',
  sectors             TEXT[] DEFAULT '{}',
  regions             TEXT[] DEFAULT '{}',
  usp                 TEXT,                    -- unique selling proposition
  compliance_notes    TEXT,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DEADLINE REMINDERS (scheduled reminders for project deadlines)
CREATE TABLE IF NOT EXISTS deadline_reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  remind_at       TIMESTAMPTZ NOT NULL,        -- when to send the reminder
  reminder_type   TEXT NOT NULL DEFAULT 'email'
                  CHECK (reminder_type IN ('email','in_app','both')),
  days_before     INTEGER NOT NULL,            -- e.g. 7, 3, 1
  sent_at         TIMESTAMPTZ,                 -- NULL = not sent yet
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, days_before)
);


-- ============================================================
-- SECTION 3: TRIGGERS AND FUNCTIONS
-- ============================================================

-- Auto-update updated_at on any table that has it
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply set_updated_at to all relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organisations','projects','criteria','questions',
    'evidence_items','comments','subscriptions',
    'project_templates','capability_profiles'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t
    );
  END LOOP;
END;
$$;

-- Auto-create profile + notification preferences when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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

-- Mark notification.read_at when is_read is set to TRUE
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_notification_read ON notifications;
CREATE TRIGGER on_notification_read
  BEFORE UPDATE OF is_read ON notifications
  FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- Set comment.resolved_at when resolved is set to TRUE
CREATE OR REPLACE FUNCTION mark_comment_resolved()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.resolved = TRUE AND OLD.resolved = FALSE THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_comment_resolved ON comments;
CREATE TRIGGER on_comment_resolved
  BEFORE UPDATE OF resolved ON comments
  FOR EACH ROW EXECUTE FUNCTION mark_comment_resolved();

-- Auto-create deadline reminders when a project deadline is set
CREATE OR REPLACE FUNCTION create_deadline_reminders()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Only run when deadline changes and is not null
  IF NEW.deadline IS NOT NULL AND (OLD.deadline IS NULL OR OLD.deadline != NEW.deadline) THEN
    -- Remove old unsent reminders
    DELETE FROM deadline_reminders
    WHERE project_id = NEW.id AND sent_at IS NULL;

    -- Create reminders at 14, 7, 3, and 1 days before deadline
    INSERT INTO deadline_reminders (project_id, remind_at, reminder_type, days_before)
    SELECT NEW.id, NEW.deadline - (days || ' days')::INTERVAL, 'both', days
    FROM unnest(ARRAY[14, 7, 3, 1]) AS days
    WHERE NEW.deadline - (days || ' days')::INTERVAL > NOW()
    ON CONFLICT (project_id, days_before) DO UPDATE
      SET remind_at = EXCLUDED.remind_at,
          sent_at   = NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_project_deadline_set ON projects;
CREATE TRIGGER after_project_deadline_set
  AFTER INSERT OR UPDATE OF deadline ON projects
  FOR EACH ROW EXECUTE FUNCTION create_deadline_reminders();


-- ============================================================
-- SECTION 4: INDEXES
-- ============================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_organisation_id ON profiles(organisation_id);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_organisation_id ON projects(organisation_id);
CREATE INDEX IF NOT EXISTS idx_projects_status           ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_deadline         ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_projects_is_archived      ON projects(is_archived);
CREATE INDEX IF NOT EXISTS idx_projects_created_at       ON projects(created_at DESC);

-- Criteria
CREATE INDEX IF NOT EXISTS idx_criteria_project_id   ON criteria(project_id);
CREATE INDEX IF NOT EXISTS idx_criteria_assigned_to  ON criteria(assigned_to);
CREATE INDEX IF NOT EXISTS idx_criteria_status       ON criteria(status);

-- Questions
CREATE INDEX IF NOT EXISTS idx_questions_criterion_id ON questions(criterion_id);

-- Team members
CREATE INDEX IF NOT EXISTS idx_team_members_project ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user    ON project_team_members(user_id);

-- Evidence
CREATE INDEX IF NOT EXISTS idx_evidence_organisation_id ON evidence_items(organisation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_category        ON evidence_items(category);
CREATE INDEX IF NOT EXISTS idx_evidence_tags            ON evidence_items USING GIN(tags);

-- Question evidence links
CREATE INDEX IF NOT EXISTS idx_qel_question  ON question_evidence_links(question_id);
CREATE INDEX IF NOT EXISTS idx_qel_evidence  ON question_evidence_links(evidence_id);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_entity     ON comments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_comments_author     ON comments(author_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread     ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Activity log
CREATE INDEX IF NOT EXISTS idx_activity_organisation ON activity_log(organisation_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity       ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_actor        ON activity_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at   ON activity_log(created_at DESC);

-- AI usage
CREATE INDEX IF NOT EXISTS idx_ai_usage_organisation ON ai_usage_log(organisation_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user         ON ai_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at   ON ai_usage_log(created_at DESC);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_organisation ON subscriptions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status       ON subscriptions(status);

-- Invitations
CREATE INDEX IF NOT EXISTS idx_invitations_token   ON organisation_invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email   ON organisation_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_org     ON organisation_invitations(organisation_id);

-- Exports
CREATE INDEX IF NOT EXISTS idx_exports_project ON exports(project_id);
CREATE INDEX IF NOT EXISTS idx_exports_status  ON exports(status);

-- Deadline reminders
CREATE INDEX IF NOT EXISTS idx_reminders_project  ON deadline_reminders(project_id);
CREATE INDEX IF NOT EXISTS idx_reminders_remind_at ON deadline_reminders(remind_at) WHERE sent_at IS NULL;

-- Project templates
CREATE INDEX IF NOT EXISTS idx_templates_org    ON project_templates(organisation_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON project_templates(is_public) WHERE is_public = TRUE;


-- ============================================================
-- SECTION 5: ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE subscription_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations              ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_invitations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_evidence_links    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log               ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_templates          ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterion_templates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_templates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadline_reminders         ENABLE ROW LEVEL SECURITY;

-- ── Helper Functions ──────────────────────────────────────────

-- Returns the current user's organisation_id
CREATE OR REPLACE FUNCTION user_organisation_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT organisation_id FROM profiles WHERE id = auth.uid()
$$;

-- Returns TRUE if the current user is a beheerder of their org
CREATE OR REPLACE FUNCTION is_org_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role = 'beheerder' FROM profiles WHERE id = auth.uid()
$$;

-- ── SUBSCRIPTION PLANS — public read (pricing page) ──────────
DROP POLICY IF EXISTS "plans public read" ON subscription_plans;
CREATE POLICY "plans public read" ON subscription_plans
  FOR SELECT USING (true);

-- ── PROFILES ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles select own"    ON profiles;
DROP POLICY IF EXISTS "profiles select org"    ON profiles;
DROP POLICY IF EXISTS "profiles update"        ON profiles;
DROP POLICY IF EXISTS "profiles insert"        ON profiles;
-- Own profile
CREATE POLICY "profiles select own" ON profiles
  FOR SELECT USING (id = auth.uid());
-- See teammates (same org)
CREATE POLICY "profiles select org" ON profiles
  FOR SELECT USING (organisation_id IS NOT NULL AND organisation_id = user_organisation_id());
CREATE POLICY "profiles update" ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ── ORGANISATIONS ─────────────────────────────────────────────
DROP POLICY IF EXISTS "organisations insert" ON organisations;
DROP POLICY IF EXISTS "organisations select" ON organisations;
DROP POLICY IF EXISTS "organisations update" ON organisations;
DROP POLICY IF EXISTS "organisations delete" ON organisations;
-- New users can insert (no org_id yet — chicken-and-egg)
CREATE POLICY "organisations insert" ON organisations
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "organisations select" ON organisations
  FOR SELECT USING (id = user_organisation_id());
-- Only beheerder can update/delete
CREATE POLICY "organisations update" ON organisations
  FOR UPDATE USING (id = user_organisation_id() AND is_org_admin())
  WITH CHECK (id = user_organisation_id());
CREATE POLICY "organisations delete" ON organisations
  FOR DELETE USING (id = user_organisation_id() AND is_org_admin());

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────
DROP POLICY IF EXISTS "org subscriptions" ON subscriptions;
CREATE POLICY "org subscriptions" ON subscriptions
  FOR SELECT USING (organisation_id = user_organisation_id());

-- ── INVITATIONS ───────────────────────────────────────────────
DROP POLICY IF EXISTS "org invitations select" ON organisation_invitations;
DROP POLICY IF EXISTS "org invitations insert" ON organisation_invitations;
DROP POLICY IF EXISTS "org invitations update" ON organisation_invitations;
DROP POLICY IF EXISTS "org invitations delete" ON organisation_invitations;
-- Org members can view pending invites
CREATE POLICY "org invitations select" ON organisation_invitations
  FOR SELECT USING (organisation_id = user_organisation_id());
-- Only beheerder can send invites
CREATE POLICY "org invitations insert" ON organisation_invitations
  FOR INSERT WITH CHECK (organisation_id = user_organisation_id() AND is_org_admin());
-- Acceptance is done via service-role server action
CREATE POLICY "org invitations update" ON organisation_invitations
  FOR UPDATE USING (organisation_id = user_organisation_id());
CREATE POLICY "org invitations delete" ON organisation_invitations
  FOR DELETE USING (organisation_id = user_organisation_id() AND is_org_admin());

-- ── PROJECTS ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "org projects" ON projects;
CREATE POLICY "org projects" ON projects FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── PROJECT TEAM MEMBERS ─────────────────────────────────────
DROP POLICY IF EXISTS "org team members" ON project_team_members;
CREATE POLICY "org team members" ON project_team_members FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));

-- ── CRITERIA ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "org criteria" ON criteria;
CREATE POLICY "org criteria" ON criteria FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));

-- ── QUESTIONS ────────────────────────────────────────────────
DROP POLICY IF EXISTS "org questions" ON questions;
CREATE POLICY "org questions" ON questions FOR ALL
  USING (criterion_id IN (
    SELECT c.id FROM criteria c
    JOIN projects p ON p.id = c.project_id
    WHERE p.organisation_id = user_organisation_id()
  ));

-- ── PROJECT DOCUMENTS ────────────────────────────────────────
DROP POLICY IF EXISTS "org project documents" ON project_documents;
CREATE POLICY "org project documents" ON project_documents FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));

-- ── EVIDENCE ITEMS ───────────────────────────────────────────
DROP POLICY IF EXISTS "org evidence" ON evidence_items;
CREATE POLICY "org evidence" ON evidence_items FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── QUESTION EVIDENCE LINKS ──────────────────────────────────
DROP POLICY IF EXISTS "org question evidence links" ON question_evidence_links;
CREATE POLICY "org question evidence links" ON question_evidence_links FOR ALL
  USING (question_id IN (
    SELECT q.id FROM questions q
    JOIN criteria c  ON c.id = q.criterion_id
    JOIN projects p  ON p.id = c.project_id
    WHERE p.organisation_id = user_organisation_id()
  ));

-- ── COMMENTS ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "org comments read"   ON comments;
DROP POLICY IF EXISTS "org comments write"  ON comments;
DROP POLICY IF EXISTS "org comments update" ON comments;
DROP POLICY IF EXISTS "org comments delete" ON comments;
CREATE POLICY "org comments read" ON comments
  FOR SELECT USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));
CREATE POLICY "org comments write" ON comments
  FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "org comments update" ON comments
  FOR UPDATE USING (author_id = auth.uid() OR is_org_admin());
CREATE POLICY "org comments delete" ON comments
  FOR DELETE USING (author_id = auth.uid() OR is_org_admin());

-- ── NOTIFICATIONS ────────────────────────────────────────────
DROP POLICY IF EXISTS "own notifications" ON notifications;
CREATE POLICY "own notifications" ON notifications FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── NOTIFICATION PREFERENCES ─────────────────────────────────
DROP POLICY IF EXISTS "own notification preferences" ON notification_preferences;
CREATE POLICY "own notification preferences" ON notification_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── ACTIVITY LOG ─────────────────────────────────────────────
-- Read: org members only. Write: service role only (server actions).
DROP POLICY IF EXISTS "org activity log read" ON activity_log;
CREATE POLICY "org activity log read" ON activity_log
  FOR SELECT USING (organisation_id = user_organisation_id());

-- ── AI USAGE LOG ─────────────────────────────────────────────
DROP POLICY IF EXISTS "org ai usage" ON ai_usage_log;
CREATE POLICY "org ai usage" ON ai_usage_log
  FOR SELECT USING (organisation_id = user_organisation_id());

-- ── PROJECT TEMPLATES ────────────────────────────────────────
DROP POLICY IF EXISTS "templates select"    ON project_templates;
DROP POLICY IF EXISTS "templates manage"    ON project_templates;
-- Public templates visible to all; own-org templates visible to members
CREATE POLICY "templates select" ON project_templates
  FOR SELECT USING (is_public = TRUE OR organisation_id = user_organisation_id());
CREATE POLICY "templates manage" ON project_templates FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── CRITERION TEMPLATES ──────────────────────────────────────
DROP POLICY IF EXISTS "criterion templates select" ON criterion_templates;
CREATE POLICY "criterion templates select" ON criterion_templates
  FOR SELECT USING (
    project_template_id IN (
      SELECT id FROM project_templates
      WHERE is_public = TRUE OR organisation_id = user_organisation_id()
    )
  );

-- ── QUESTION TEMPLATES ───────────────────────────────────────
DROP POLICY IF EXISTS "question templates select" ON question_templates;
CREATE POLICY "question templates select" ON question_templates
  FOR SELECT USING (
    criterion_template_id IN (
      SELECT ct.id FROM criterion_templates ct
      JOIN project_templates pt ON pt.id = ct.project_template_id
      WHERE pt.is_public = TRUE OR pt.organisation_id = user_organisation_id()
    )
  );

-- ── EXPORTS ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "org exports" ON exports;
CREATE POLICY "org exports" ON exports FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));

-- ── CAPABILITY PROFILES ──────────────────────────────────────
DROP POLICY IF EXISTS "org capability profile" ON capability_profiles;
CREATE POLICY "org capability profile" ON capability_profiles FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── DEADLINE REMINDERS ───────────────────────────────────────
DROP POLICY IF EXISTS "org deadline reminders" ON deadline_reminders;
CREATE POLICY "org deadline reminders" ON deadline_reminders FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE organisation_id = user_organisation_id()
  ));


-- ============================================================
-- SECTION 6: SYSTEM PROJECT TEMPLATES (seed data)
-- ============================================================

INSERT INTO project_templates (id, organisation_id, name, description, sector, is_public)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Standaard Dienstverlening', 'Generieke template voor dienstverleningsopdrachten', NULL, TRUE),
  ('00000000-0000-0000-0000-000000000002', NULL, 'ICT & Digitalisering',      'Template voor ICT-aanbestedingen en digitaliseringsprojecten', 'ICT', TRUE),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Bouw & Infrastructuur',     'Template voor bouw- en infrastructuurprojecten', 'Bouw', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Default criteria for "Standaard Dienstverlening"
INSERT INTO criterion_templates (id, project_template_id, title, code, weight, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Aanpak en Methodologie',  'C1', 30, 0),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ervaring en Referenties', 'C2', 25, 1),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Team en Capaciteit',      'C3', 25, 2),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Prijs en Waarde',         'C4', 20, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_templates (criterion_template_id, text, help_text, sort_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Beschrijf uw voorgestelde aanpak en methodologie', 'Wees specifiek over uw werkwijze, fasering en planning', 0),
  ('10000000-0000-0000-0000-000000000001', 'Hoe waarborgt u de kwaliteit tijdens de uitvoering?', 'Denk aan kwaliteitsborging, checks en escalatieprocedures', 1),
  ('10000000-0000-0000-0000-000000000001', 'Welke risico''s ziet u en hoe beheerst u deze?', 'Benoem minimaal 3 risico''s met concrete beheersmaatregelen', 2),
  ('10000000-0000-0000-0000-000000000002', 'Beschrijf minimaal twee relevante referentieprojecten', 'Vermeld opdrachtgever, scope, waarde en resultaten', 0),
  ('10000000-0000-0000-0000-000000000002', 'Wat zijn de meetbare resultaten van uw eerdere projecten?', 'Gebruik concrete KPIs en percentages', 1),
  ('10000000-0000-0000-0000-000000000003', 'Beschrijf de samenstelling van het projectteam', 'Vermeld naam, rol en relevante ervaring per teamlid', 0),
  ('10000000-0000-0000-0000-000000000003', 'Welke specifieke expertise brengt elk teamlid mee?', 'Koppel expertise aan de eisen uit de aanbesteding', 1),
  ('10000000-0000-0000-0000-000000000004', 'Onderbouw uw prijsopbouw en de geboden meerwaarde', 'Leg de relatie tussen prijs en kwaliteit uit', 0),
  ('10000000-0000-0000-0000-000000000004', 'Hoe optimaliseert u kosten zonder kwaliteit te verliezen?', 'Beschrijf concrete efficiëntieverbeteringen', 1)
ON CONFLICT DO NOTHING;

-- Default criteria for "ICT & Digitalisering"
INSERT INTO criterion_templates (id, project_template_id, title, code, weight, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Technische Aanpak',         'C1', 30, 0),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Beveiliging en Compliance', 'C2', 25, 1),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Implementatie en Migratie', 'C3', 25, 2),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Beheer en Support',         'C4', 20, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- END OF SETUP
-- ============================================================
-- Tables created: 24
-- Triggers:       8
-- RLS policies:   30+
-- Seed data:      subscription plans, system templates
-- ============================================================
