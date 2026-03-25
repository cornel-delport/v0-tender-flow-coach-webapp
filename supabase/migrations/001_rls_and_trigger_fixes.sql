-- ============================================================
-- TenderFlow Coach — RLS + TRIGGER FIXES
-- Run in Supabase SQL Editor after 000_complete_setup.sql
-- ============================================================

-- ── Fix 1: organisations INSERT ───────────────────────────────
-- Problem: `TO authenticated` clause can silently fail.
-- Fix: use auth.uid() IS NOT NULL — more reliable for all auth flows.
DROP POLICY IF EXISTS "organisations insert" ON organisations;
CREATE POLICY "organisations insert" ON organisations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ── Fix 2: activity_log INSERT ────────────────────────────────
-- Problem: no INSERT policy exists — server actions silently fail to log.
DROP POLICY IF EXISTS "org activity log insert" ON activity_log;
CREATE POLICY "org activity log insert" ON activity_log
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND organisation_id = user_organisation_id()
  );

-- ── Fix 3: projects — explicit WITH CHECK ─────────────────────
DROP POLICY IF EXISTS "org projects" ON projects;
CREATE POLICY "org projects" ON projects FOR ALL
  USING     (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── Fix 4: project_team_members — explicit WITH CHECK ─────────
DROP POLICY IF EXISTS "org team members" ON project_team_members;
CREATE POLICY "org team members" ON project_team_members FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 5: criteria — explicit WITH CHECK ─────────────────────
DROP POLICY IF EXISTS "org criteria" ON criteria;
CREATE POLICY "org criteria" ON criteria FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 6: questions — explicit WITH CHECK ────────────────────
DROP POLICY IF EXISTS "org questions" ON questions;
CREATE POLICY "org questions" ON questions FOR ALL
  USING (
    criterion_id IN (
      SELECT c.id FROM criteria c
      JOIN projects p ON p.id = c.project_id
      WHERE p.organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    criterion_id IN (
      SELECT c.id FROM criteria c
      JOIN projects p ON p.id = c.project_id
      WHERE p.organisation_id = user_organisation_id()
    )
  );

-- ── Fix 7: project_documents — explicit WITH CHECK ────────────
DROP POLICY IF EXISTS "org project documents" ON project_documents;
CREATE POLICY "org project documents" ON project_documents FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 8: deadline_reminders — SECURITY DEFINER on trigger fn ─
-- Problem: trigger fires as calling user, subject to RLS on INSERT.
-- Fix: SECURITY DEFINER lets the trigger bypass RLS safely.
CREATE OR REPLACE FUNCTION create_deadline_reminders()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.deadline IS NOT NULL AND (OLD.deadline IS NULL OR OLD.deadline != NEW.deadline) THEN
    DELETE FROM deadline_reminders
    WHERE project_id = NEW.id AND sent_at IS NULL;

    INSERT INTO deadline_reminders (project_id, remind_at, reminder_type, days_before)
    SELECT NEW.id,
           NEW.deadline - (days || ' days')::INTERVAL,
           'both',
           days
    FROM unnest(ARRAY[14, 7, 3, 1]) AS days
    WHERE NEW.deadline - (days || ' days')::INTERVAL > NOW()
    ON CONFLICT (project_id, days_before) DO UPDATE
      SET remind_at = EXCLUDED.remind_at,
          sent_at   = NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- ── Fix 9: recalculate_project_progress — SECURITY DEFINER ────
-- Problem: trigger fn UPDATE on projects is subject to RLS.
-- Fix: SECURITY DEFINER lets the DB function bypass RLS safely.
CREATE OR REPLACE FUNCTION recalculate_project_progress(p_project_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
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

-- ── Fix 10: comments INSERT WITH CHECK ────────────────────────
-- Ensure author_id is always the current user
DROP POLICY IF EXISTS "org comments write" ON comments;
CREATE POLICY "org comments write" ON comments
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 11: evidence INSERT WITH CHECK ────────────────────────
DROP POLICY IF EXISTS "org evidence" ON evidence_items;
CREATE POLICY "org evidence" ON evidence_items FOR ALL
  USING     (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id());

-- ── Fix 12: exports INSERT WITH CHECK ─────────────────────────
DROP POLICY IF EXISTS "org exports" ON exports;
CREATE POLICY "org exports" ON exports FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 13: deadline_reminders INSERT WITH CHECK ──────────────
DROP POLICY IF EXISTS "org deadline reminders" ON deadline_reminders;
CREATE POLICY "org deadline reminders" ON deadline_reminders FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE organisation_id = user_organisation_id()
    )
  );

-- ── Fix 14: subscriptions INSERT for org admin ────────────────
DROP POLICY IF EXISTS "org subscriptions" ON subscriptions;
CREATE POLICY "org subscriptions" ON subscriptions FOR ALL
  USING (organisation_id = user_organisation_id())
  WITH CHECK (organisation_id = user_organisation_id() AND is_org_admin());

-- ── Done ─────────────────────────────────────────────────────
-- Changes applied:
--   organisations:         INSERT policy no longer uses TO authenticated
--   activity_log:          INSERT policy added (was missing)
--   projects:              explicit WITH CHECK added
--   project_team_members:  explicit WITH CHECK added
--   criteria:              explicit WITH CHECK added
--   questions:             explicit WITH CHECK added
--   project_documents:     explicit WITH CHECK added
--   comments:              INSERT scoped to same-org projects
--   evidence_items:        explicit WITH CHECK added
--   exports:               explicit WITH CHECK added
--   deadline_reminders:    explicit WITH CHECK + trigger is SECURITY DEFINER
--   subscriptions:         INSERT scoped to org admin
--   recalculate_project_progress: SECURITY DEFINER (safe trigger UPDATE)
--   create_deadline_reminders:    SECURITY DEFINER (safe trigger INSERT)
