import { createClient } from '@/lib/supabase/server'

export interface ProfileData {
  id: string
  display_name: string | null
  avatar_url: string | null
  phone: string | null
  job_title: string | null
  role: string
  organisation_id: string | null
  onboarded_at: string | null
  last_active_at: string | null
}

export interface OrgData {
  id: string
  name: string
  slug: string
  website: string | null
  address: string | null
  kvk_number: string | null
  logo_url: string | null
  subscription_plan_id: string | null
}

export interface OrgMemberRow {
  user_id: string
  role: string
  profiles: { display_name: string | null; id: string } | null
}

export async function getProfileAndOrg(): Promise<{
  profile: ProfileData
  org: OrgData | null
  email: string | null
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, phone, job_title, role, organisation_id, onboarded_at, last_active_at')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  // Track last active
  await supabase
    .from('profiles')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', user.id)

  let org: OrgData | null = null
  if (profile.organisation_id) {
    const { data } = await supabase
      .from('organisations')
      .select('id, name, slug, website, address, kvk_number, logo_url, subscription_plan_id')
      .eq('id', profile.organisation_id)
      .single()
    org = data ?? null
  }

  return { profile, org, email: user.email ?? null }
}

export async function getOrgMembers(orgId: string): Promise<OrgMemberRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, role')
    .eq('organisation_id', orgId)

  return (data ?? []).map((p) => ({
    user_id: p.id as string,
    role: p.role as string,
    profiles: { display_name: p.display_name as string | null, id: p.id as string },
  }))
}
