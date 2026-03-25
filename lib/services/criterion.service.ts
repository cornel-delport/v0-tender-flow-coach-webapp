import { createClient } from '@/lib/supabase/server'

export interface CriterionQuestion {
  id: string
  text: string
  help_text: string | null
  sort_order: number
  text_content: string | null
  bullet_content: string[] | null
  mode: string
  quality_scores: Record<string, string> | null
  is_required: boolean
}

export interface CriterionWithProject {
  id: string
  project_id: string
  title: string
  code: string
  weight: number
  status: string
  content: string | null
  sort_order: number
  project: {
    id: string
    project_name: string
  }
  questions: CriterionQuestion[]
  // Adjacent criteria for prev/next navigation
  prev_id?: string | null
  next_id?: string | null
}

export async function getCriterionWorkspace(
  projectId: string,
  criterionId: string
): Promise<CriterionWithProject | null> {
  const supabase = await createClient()

  // Fetch the target criterion with project info and questions
  const { data: criterion, error } = await supabase
    .from('criteria')
    .select(`
      id, project_id, title, code, weight, status, content, sort_order,
      projects ( id, project_name ),
      questions ( id, text, help_text, sort_order, text_content, bullet_content, mode, quality_scores, is_required )
    `)
    .eq('id', criterionId)
    .eq('project_id', projectId)
    .single()

  if (error || !criterion) return null

  // Fetch all sibling criteria for prev/next navigation
  const { data: siblings } = await supabase
    .from('criteria')
    .select('id, sort_order')
    .eq('project_id', projectId)
    .order('sort_order')

  const currentIdx = (siblings ?? []).findIndex((c) => c.id === criterionId)
  const prevId = currentIdx > 0 ? siblings![currentIdx - 1].id : null
  const nextId = currentIdx < (siblings?.length ?? 0) - 1 ? siblings![currentIdx + 1].id : null

  const projectData = criterion.projects as unknown as { id: string; project_name: string }
  const questionsData = (criterion.questions as unknown as CriterionQuestion[]) ?? []

  return {
    ...criterion,
    project: projectData,
    questions: questionsData.sort((a, b) => a.sort_order - b.sort_order),
    prev_id: prevId,
    next_id: nextId,
    total: siblings?.length ?? 0,
    currentIndex: currentIdx + 1,
  } as CriterionWithProject & { total: number; currentIndex: number }
}
