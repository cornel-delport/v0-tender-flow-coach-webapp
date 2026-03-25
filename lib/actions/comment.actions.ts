'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addComment(
  projectId: string,
  entityType: 'project' | 'criterion' | 'question',
  entityId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  if (!content.trim()) return { success: false, error: 'Inhoud is verplicht' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Niet ingelogd' }

  const { error } = await supabase.from('comments').insert({
    author_id: user.id,
    project_id: projectId,
    entity_type: entityType,
    entity_id: entityId,
    content: content.trim(),
  })

  if (error) {
    console.error('addComment error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/projecten/${projectId}/review`)
  return { success: true }
}

export async function resolveComment(
  commentId: string,
  projectId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('comments')
    .update({ resolved: true })
    .eq('id', commentId)

  if (error) return { success: false }
  revalidatePath(`/projecten/${projectId}/review`)
  return { success: true }
}
