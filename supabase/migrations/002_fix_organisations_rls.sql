-- ============================================================
-- TenderFlow Coach — Migration 002: Fix organisations RLS
--
-- Problem: The original "own organisation" FOR ALL policy uses
-- user_organisation_id() as the USING clause.  For INSERT the
-- USING clause is evaluated, and for a brand-new user whose
-- profile has no organisation_id yet, user_organisation_id()
-- returns NULL → the insert is blocked (NULL ≠ any id).
--
-- Fix: split into separate per-operation policies so that any
-- authenticated user can INSERT a new organisation row, while
-- SELECT / UPDATE / DELETE remain scoped to the user's own org.
-- ============================================================

-- Drop the old catch-all policy
DROP POLICY IF EXISTS "own organisation" ON organisations;

-- Any authenticated user can create an organisation
-- (they just registered and have no org yet)
DROP POLICY IF EXISTS "organisations insert" ON organisations;
CREATE POLICY "organisations insert" ON organisations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Users can only read their own organisation
DROP POLICY IF EXISTS "organisations select" ON organisations;
CREATE POLICY "organisations select" ON organisations
  FOR SELECT USING (id = user_organisation_id());

-- Users can only update their own organisation
DROP POLICY IF EXISTS "organisations update" ON organisations;
CREATE POLICY "organisations update" ON organisations
  FOR UPDATE
  USING (id = user_organisation_id())
  WITH CHECK (id = user_organisation_id());

-- Users can only delete their own organisation
DROP POLICY IF EXISTS "organisations delete" ON organisations;
CREATE POLICY "organisations delete" ON organisations
  FOR DELETE USING (id = user_organisation_id());

-- ============================================================
-- Also ensure profiles can be inserted by the trigger
-- (SECURITY DEFINER handles this, but let's be explicit)
-- ============================================================
DROP POLICY IF EXISTS "own profile" ON profiles;

-- Any authenticated user can read / update their own profile
CREATE POLICY "profiles select" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles update" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- The handle_new_user trigger runs as SECURITY DEFINER (bypasses RLS)
-- but add an insert policy as well so service-role clients work
CREATE POLICY "profiles insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());
