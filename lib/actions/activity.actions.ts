'use server'

import { createClient } from '@/lib/supabase/server'

export async function logActivity(params: {
  organisationId: string
  actorId: string
  actorName: string | null
  action: string
  entityType: string
  entityId: string
  entityLabel?: string
  oldValue?: Record<string, unknown> | null
  newValue?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}) {
  const supabase = await createClient()
  await supabase.from('activity_log').insert({
    organisation_id: params.organisationId,
    actor_id:        params.actorId,
    actor_name:      params.actorName,
    action:          params.action,
    entity_type:     params.entityType,
    entity_id:       params.entityId,
    entity_label:    params.entityLabel ?? null,
    old_value:       params.oldValue ?? null,
    new_value:       params.newValue ?? null,
    metadata:        params.metadata ?? null,
  })
  // Failures are silent — logging should never break the main action
}
