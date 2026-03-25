'use server'

import { createClient } from '@/lib/supabase/server'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50)
}

export async function createOrganisation(
  formData: FormData
): Promise<{ error?: string; redirect?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Niet ingelogd. Ververs de pagina en probeer opnieuw.' }

  const name = (formData.get('orgName') as string)?.trim()
  if (!name) return { error: 'Organisatienaam is verplicht' }
  if (name.length < 2) return { error: 'Organisatienaam moet minimaal 2 tekens bevatten' }

  // Check if user already has an org — just redirect if so
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  if (existingProfile?.organisation_id) {
    return { redirect: '/dashboard' }
  }

  // Generate a unique slug
  const baseSlug = slugify(name) || 'org'
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

  // Pre-generate the org ID so we don't need .select('id') after INSERT.
  // PostgREST filters RETURNING via the SELECT RLS policy; new users have no
  // organisation_id yet, so user_organisation_id() returns NULL and the row
  // would be invisible — causing a "no rows" error even on a successful INSERT.
  const orgId = crypto.randomUUID()

  // Create the organisation row
  const { error: orgError } = await supabase
    .from('organisations')
    .insert({ id: orgId, name, slug })

  if (orgError) {
    // PostgREST: table not found in schema cache
    if (orgError.code === 'PGRST205' || orgError.code === '42P01' || orgError.message?.includes('schema cache') || orgError.message?.includes('does not exist')) {
      return {
        error:
          '⚠️ Database tabellen bestaan nog niet. Ga naar Supabase Dashboard → SQL Editor → New query → plak de inhoud van supabase/migrations/000_complete_setup.sql → klik Run.',
      }
    }
    // RLS policy blocked the insert
    if (orgError.code === '42501' || orgError.message?.includes('policy') || orgError.message?.includes('permission denied')) {
      return {
        error:
          '⚠️ Geen toegang (RLS). Voer supabase/migrations/001_rls_and_trigger_fixes.sql uit in Supabase SQL Editor.',
      }
    }
    return { error: `Fout bij aanmaken organisatie: ${orgError.message}` }
  }

  // Link the user's profile to the new organisation and set role to beheerder
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ organisation_id: orgId, role: 'beheerder' })
    .eq('id', user.id)

  if (profileError) {
    // Org was created but profile not linked — still redirect, layout will handle
    if (profileError.code === '42P01') {
      return {
        error:
          'Database is nog niet ingericht. Voer de SQL-migratie uit in uw Supabase dashboard.',
      }
    }
    return { error: `Profiel koppelen mislukt: ${profileError.message}` }
  }

  return { redirect: '/dashboard' }
}
