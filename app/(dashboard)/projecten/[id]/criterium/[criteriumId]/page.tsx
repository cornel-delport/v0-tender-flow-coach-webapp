import { notFound } from 'next/navigation'
import { getCriterionWorkspace } from '@/lib/services/criterion.service'
import { getEvidenceItems } from '@/lib/services/evidence.service'
import { CriterionWorkspace } from './criterion-workspace'

export default async function CriteriumWorkspacePage({
  params,
}: {
  params: Promise<{ id: string; criteriumId: string }>
}) {
  const { id, criteriumId } = await params
  const [data, evidenceItems] = await Promise.all([
    getCriterionWorkspace(id, criteriumId) as Promise<any>,
    getEvidenceItems(),
  ])
  if (!data) notFound()

  return (
    <CriterionWorkspace
      projectId={id}
      projectName={data.project.project_name}
      criterionId={data.id}
      criterionTitle={data.title}
      criterionCode={data.code}
      criterionWeight={data.weight}
      criterionStatus={data.status}
      questions={data.questions}
      evidenceItems={evidenceItems.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        description: e.description,
        year: e.year,
      }))}
      prevId={data.prev_id ?? null}
      nextId={data.next_id ?? null}
      currentIndex={data.currentIndex ?? 1}
      total={data.total ?? 1}
    />
  )
}
