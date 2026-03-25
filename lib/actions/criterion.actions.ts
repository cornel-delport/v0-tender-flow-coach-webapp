'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity.actions'

export async function autoSaveQuestion(
  questionId: string,
  projectId: string,
  criterionId: string,
  textContent: string,
  bulletContent: string[],
  mode: 'bullets' | 'text' = 'bullets'
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const { error } = await supabase
    .from('questions')
    .update({
      text_content: textContent,
      bullet_content: bulletContent,
      mode,
      updated_at: new Date().toISOString(),
    })
    .eq('id', questionId)

  if (error) return { error: error.message }

  revalidatePath(`/projecten/${projectId}/criterium/${criterionId}`)
  return { success: true }
}

export async function updateCriterionStatus(
  criterionId: string,
  projectId: string,
  status: 'niet_gestart' | 'in_progress' | 'review' | 'voltooid'
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  // Fetch current state for logging
  const { data: current } = await supabase
    .from('criteria')
    .select('status, title, project_id')
    .eq('id', criterionId)
    .single()

  const { error } = await supabase
    .from('criteria')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', criterionId)

  if (error) return { error: error.message }

  // Log activity (fire-and-forget)
  if (current) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, organisation_id')
      .eq('id', user.id)
      .single()
    if (profile?.organisation_id) {
      await logActivity({
        organisationId: profile.organisation_id,
        actorId: user.id,
        actorName: (profile as { display_name?: string | null }).display_name ?? null,
        action: 'criterion.status_changed',
        entityType: 'criterion',
        entityId: criterionId,
        entityLabel: (current as { title: string }).title,
        oldValue: { status: (current as { status: string }).status },
        newValue: { status },
        metadata: { projectId },
      })
    }
  }

  revalidatePath(`/projecten/${projectId}`)
  revalidatePath(`/projecten/${projectId}/criterium/${criterionId}`)
  return { success: true }
}
