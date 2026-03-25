import { createClient } from '@/lib/supabase/server'

export interface ProjectRow {
  id: string
  project_name: string
  client_name: string
  tender_title: string | null
  reference_number: string | null
  deadline: string | null
  sector: string | null
  region: string | null
  tender_type: string | null
  contract_value: string | null
  contact_person: string | null
  internal_owner: string | null
  notes: string | null
  procurement_platform: string | null
  submission_method: string | null
  status: string
  progress: number
  readiness_score: number
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface CriterionRow {
  id: string
  project_id: string
  title: string
  code: string
  weight: number
  status: string
  deadline: string | null
  sort_order: number
  questions: { id: string; text_content: string | null; bullet_content: string[] | null }[]
}

export interface TeamMemberRow {
  user_id: string
  role: string
  profiles: { display_name: string | null } | null
}

/** Get the current user's organisation_id from their profile */
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

/** List all projects for the current user's organisation */
export async function getProjects(filters?: {
  status?: string
  sector?: string
  search?: string
}): Promise<ProjectRow[]> {
  const orgId = await getOrgId()
  if (!orgId) return []

  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.sector) query = query.eq('sector', filters.sector)
  if (filters?.search) {
    query = query.or(
      `project_name.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) {
    console.error('getProjects error:', error)
    return []
  }
  return data ?? []
}

/** Get a single project with its criteria and team members */
export async function getProjectWithDetails(id: string): Promise<{
  project: ProjectRow
  criteria: CriterionRow[]
  teamMembers: TeamMemberRow[]
} | null> {
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) return null

  const { data: criteria } = await supabase
    .from('criteria')
    .select('*, questions(id, text_content, bullet_content)')
    .eq('project_id', id)
    .order('sort_order')

  const { data: teamMembers } = await supabase
    .from('project_team_members')
    .select('user_id, role, profiles(display_name)')
    .eq('project_id', id)

  return {
    project,
    criteria: (criteria ?? []) as unknown as CriterionRow[],
    teamMembers: (teamMembers ?? []) as unknown as TeamMemberRow[],
  }
}

/** Calculate days remaining until a deadline */
export function daysRemaining(deadline: string | null): number {
  if (!deadline) return 0
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/** Calculate criterion progress (% of questions with content in either text or bullets mode) */
export function criterionProgress(questions: { text_content: string | null; bullet_content?: string[] | null }[]): number {
  if (!questions.length) return 0
  const answered = questions.filter((q) => {
    const hasText = q.text_content && q.text_content.trim().length > 0
    const hasBullets = q.bullet_content && q.bullet_content.some((b) => b && b.trim().length > 0)
    return hasText || hasBullets
  }).length
  return Math.round((answered / questions.length) * 100)
}
