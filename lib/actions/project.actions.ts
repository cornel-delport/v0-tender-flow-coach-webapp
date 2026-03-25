'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity.actions'

/** Default criteria added to every new project */
const DEFAULT_CRITERIA = [
  { code: 'C1', title: 'Aanpak en Methodologie', weight: 30 },
  { code: 'C2', title: 'Ervaring en Referenties', weight: 25 },
  { code: 'C3', title: 'Team en Capaciteit', weight: 25 },
  { code: 'C4', title: 'Prijs en Waarde', weight: 20 },
]

/** Default questions per criterion */
const DEFAULT_QUESTIONS: Record<string, string[]> = {
  C1: [
    'Beschrijf uw voorgestelde aanpak en methodologie',
    'Hoe waarborgt u de kwaliteit tijdens de uitvoering?',
    'Welke risico\'s ziet u en hoe beheerst u deze?',
  ],
  C2: [
    'Beschrijf minimaal twee relevante referentieprojecten',
    'Wat zijn de meetbare resultaten van uw eerdere projecten?',
  ],
  C3: [
    'Beschrijf de samenstelling van het projectteam',
    'Welke specifieke expertise brengt elk teamlid mee?',
  ],
  C4: [
    'Onderbouw uw prijsopbouw en de geboden meerwaarde',
    'Hoe optimaliseert u kosten zonder kwaliteit te verliezen?',
  ],
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, display_name')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id) return { error: 'Geen organisatie gevonden' }

  const projectName = formData.get('projectName') as string
  const clientName = formData.get('clientName') as string

  if (!projectName?.trim() || !clientName?.trim()) {
    return { error: 'Projectnaam en klantnaam zijn verplicht' }
  }

  const deadlineValue = (formData.get('deadline') as string)?.trim()
  // Store at noon UTC to avoid off-by-one day issues across timezones
  const deadline = deadlineValue ? `${deadlineValue}T12:00:00.000Z` : null

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      organisation_id: profile.organisation_id,
      project_name: projectName.trim(),
      client_name: clientName.trim(),
      tender_title: (formData.get('tenderTitle') as string) || null,
      reference_number: (formData.get('referenceNumber') as string) || null,
      deadline,
      sector: (formData.get('sector') as string) || null,
      region: (formData.get('region') as string) || null,
      tender_type: (formData.get('tenderType') as string) || null,
      contract_value: (formData.get('contractValue') as string) || null,
      contact_person: (formData.get('contactPerson') as string) || null,
      internal_owner: (formData.get('internalOwner') as string) || null,
      notes: (formData.get('notes') as string) || null,
      procurement_platform: (formData.get('procurementPlatform') as string) || null,
      submission_method: (formData.get('submissionMethod') as string) || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (projectError || !project) {
    return { error: 'Fout bij aanmaken project. Controleer of de database migraties zijn uitgevoerd.' }
  }

  // Add creator as team member (beheerder)
  await supabase.from('project_team_members').insert({
    project_id: project.id,
    user_id: user.id,
    role: 'beheerder',
  })

  // Log activity
  await logActivity({
    organisationId: profile.organisation_id,
    actorId: user.id,
    actorName: (profile as { display_name?: string | null }).display_name ?? null,
    action: 'project.created',
    entityType: 'project',
    entityId: project.id,
    entityLabel: projectName.trim(),
  })

  // Create default criteria + questions
  for (let i = 0; i < DEFAULT_CRITERIA.length; i++) {
    const c = DEFAULT_CRITERIA[i]

    const { data: criterion } = await supabase
      .from('criteria')
      .insert({
        project_id: project.id,
        code: c.code,
        title: c.title,
        weight: c.weight,
        sort_order: i,
      })
      .select('id')
      .single()

    if (criterion) {
      const questions = (DEFAULT_QUESTIONS[c.code] ?? []).map((text, j) => ({
        criterion_id: criterion.id,
        text,
        sort_order: j,
      }))
      if (questions.length) {
        await supabase.from('questions').insert(questions)
      }
    }
  }

  revalidatePath('/projecten')
  redirect(`/projecten/${project.id}`)
}

export async function updateProjectStatus(
  projectId: string,
  status: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch current status for logging
  const { data: current } = await supabase
    .from('projects')
    .select('status, project_name, organisation_id')
    .eq('id', projectId)
    .single()

  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) return { error: error.message }

  if (user && current) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
    await logActivity({
      organisationId: (current as { organisation_id: string }).organisation_id,
      actorId: user.id,
      actorName: (profile as { display_name?: string | null } | null)?.display_name ?? null,
      action: 'project.status_changed',
      entityType: 'project',
      entityId: projectId,
      entityLabel: (current as { project_name: string }).project_name,
      oldValue: { status: (current as { status: string }).status },
      newValue: { status },
    })
  }

  revalidatePath(`/projecten/${projectId}`)
  revalidatePath('/projecten')
  return { success: true }
}

export async function archiveProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) return { error: error.message }
  revalidatePath('/projecten')
  redirect('/projecten')
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) return { error: error.message }
  revalidatePath('/projecten')
  redirect('/projecten')
}
