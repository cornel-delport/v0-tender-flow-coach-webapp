'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Niet ingelogd' }

  const displayName = (formData.get('displayName') as string)?.trim() ?? ''
  const phone = (formData.get('phone') as string)?.trim() || null
  const jobTitle = (formData.get('jobTitle') as string)?.trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName, phone, job_title: jobTitle })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/instellingen')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateOrganisation(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Niet ingelogd' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id) return { success: false, error: 'Geen organisatie gevonden' }

  const name = (formData.get('orgName') as string)?.trim() ?? ''
  const website = (formData.get('website') as string)?.trim() || null
  const address = (formData.get('address') as string)?.trim() || null
  const kvkNumber = (formData.get('kvkNumber') as string)?.trim() || null

  const { error } = await supabase
    .from('organisations')
    .update({ name, website, address, kvk_number: kvkNumber })
    .eq('id', profile.organisation_id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/instellingen')
  revalidatePath('/', 'layout')
  return { success: true }
}
