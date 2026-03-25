import { createClient } from '@/lib/supabase/server'

export interface EvidenceItem {
  id: string
  organisation_id: string
  title: string
  category: string
  description: string | null
  year: number | null
  file_path: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

async function getOrgId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()
  return data?.organisation_id ?? null
}

export async function getEvidenceItems(): Promise<EvidenceItem[]> {
  const orgId = await getOrgId()
  if (!orgId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('evidence_items')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getEvidenceItems error:', error)
    return []
  }
  return data ?? []
}
