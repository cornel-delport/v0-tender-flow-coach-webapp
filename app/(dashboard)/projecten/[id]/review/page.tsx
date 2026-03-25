import { notFound } from 'next/navigation'
import { getProjectWithDetails } from '@/lib/services/project.service'
import { createClient } from '@/lib/supabase/server'
import { ReviewClient } from './review-client'

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getProjectWithDetails(id)
  if (!result) notFound()

  const { project, criteria, teamMembers } = result

  // Fetch comments for this project
  const supabase = await createClient()
  const { data: commentsData } = await supabase
    .from('comments')
    .select('id, content, created_at, entity_id, profiles(display_name)')
    .eq('project_id', id)
    .eq('entity_type', 'project')
    .eq('resolved', false)
    .order('created_at', { ascending: true })

  const comments = (commentsData ?? []).map((c) => {
    const p = c.profiles
    const profiles = Array.isArray(p) ? (p[0] ?? null) : (p ?? null)
    return {
      id: c.id as string,
      content: c.content as string,
      created_at: c.created_at as string,
      entity_id: c.entity_id as string,
      profiles: profiles as { display_name: string | null } | null,
    }
  })

  return (
    <ReviewClient
      projectId={id}
      project={project}
      criteria={criteria}
      teamMembers={teamMembers}
      comments={comments}
    />
  )
}
