import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  activeProjects: number
  upcomingDeadlines: number
  completedCriteria: number
  reviewNeeded: number
  wonProjects: number
  lostProjects: number
}

export interface RecentProject {
  id: string
  project_name: string
  client_name: string
  status: string
  progress: number
  deadline: string | null
}

export interface ActivityEntry {
  id: string
  action: string
  actor_name: string | null
  entity_type: string
  entity_label: string | null
  new_value: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: string
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

export async function getDashboardData(): Promise<{
  stats: DashboardStats
  recentProjects: RecentProject[]
  recentActivity: ActivityEntry[]
  userName: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const orgId = await getOrgId()
  const userName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Gebruiker'

  if (!orgId) {
    return {
      stats: { activeProjects: 0, upcomingDeadlines: 0, completedCriteria: 0, reviewNeeded: 0, wonProjects: 0, lostProjects: 0 },
      recentProjects: [],
      recentActivity: [],
      userName,
    }
  }

  // Fetch projects + activity in parallel
  const [projectsResult, activityResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_name, client_name, status, progress, deadline')
      .eq('organisation_id', orgId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false }),
    supabase
      .from('activity_log')
      .select('id, action, actor_name, entity_type, entity_label, new_value, metadata, created_at')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const allProjects = projectsResult.data ?? []
  const now = new Date()
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

  const activeProjects = allProjects.filter((p) =>
    ['concept', 'in_progress', 'review'].includes(p.status)
  ).length
  const wonProjects  = allProjects.filter((p) => p.status === 'won').length
  const lostProjects = allProjects.filter((p) => p.status === 'lost').length

  const upcomingDeadlines = allProjects.filter((p) => {
    if (!p.deadline) return false
    const d = new Date(p.deadline)
    return d >= now && d <= twoWeeksLater
  }).length

  // Count criteria by status across all active projects
  const projectIds = allProjects.map((p) => p.id)
  let completedCriteria = 0
  let reviewNeeded = 0

  if (projectIds.length > 0) {
    const { data: criteriaStats } = await supabase
      .from('criteria')
      .select('status')
      .in('project_id', projectIds)

    completedCriteria = (criteriaStats ?? []).filter((c) => c.status === 'voltooid').length
    reviewNeeded      = (criteriaStats ?? []).filter((c) => c.status === 'review').length
  }

  return {
    stats: { activeProjects, upcomingDeadlines, completedCriteria, reviewNeeded, wonProjects, lostProjects },
    recentProjects: allProjects.slice(0, 5) as RecentProject[],
    recentActivity: (activityResult.data ?? []) as ActivityEntry[],
    userName,
  }
}
