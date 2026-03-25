'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createEvidence(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id) return { error: 'Geen organisatie gevonden' }

  const title = (formData.get('title') as string)?.trim()
  const category = formData.get('category') as string
  if (!title || !category) return { error: 'Titel en categorie zijn verplicht' }

  const yearValue = formData.get('year') as string
  const year = yearValue ? parseInt(yearValue, 10) : null

  const { error } = await supabase.from('evidence_items').insert({
    organisation_id: profile.organisation_id,
    title,
    category,
    description: (formData.get('description') as string) || null,
    year: isNaN(year!) ? null : year,
    added_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/bewijsbank')
  return { success: true }
}

export async function deleteEvidence(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('evidence_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/bewijsbank')
  return { success: true }
}

export async function updateEvidence(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = (formData.get('title') as string)?.trim()
  const category = formData.get('category') as string
  if (!title || !category) return { error: 'Titel en categorie zijn verplicht' }

  const yearValue = formData.get('year') as string
  const year = yearValue ? parseInt(yearValue, 10) : null

  const { error } = await supabase
    .from('evidence_items')
    .update({
      title,
      category,
      description: (formData.get('description') as string) || null,
      year: isNaN(year!) ? null : year,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/bewijsbank')
  return { success: true }
}
