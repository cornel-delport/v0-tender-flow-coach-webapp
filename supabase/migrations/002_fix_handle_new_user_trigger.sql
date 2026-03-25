-- ============================================================
-- TenderFlow Coach — Fix handle_new_user trigger
-- Run in Supabase SQL Editor after 001_rls_and_trigger_fixes.sql
-- ============================================================
--
-- Root cause: GoTrue (Supabase Auth) connects as supabase_auth_admin
-- whose session search_path does NOT include "public". Even with
-- SECURITY DEFINER SET search_path = public, PostgreSQL's internal
-- trigger dispatch could not resolve the unqualified table name
-- "profiles" → "public.profiles".
--
-- Fix: use fully-qualified table names (public.profiles,
-- public.notification_preferences) inside the function body,
-- AND recreate the trigger so it explicitly calls public.handle_new_user().

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Recreate trigger so it explicitly resolves to public.handle_new_user()
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
