import { notFound } from 'next/navigation'
import { getProjectWithDetails } from '@/lib/services/project.service'
import { ExportClient } from './export-client'

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getProjectWithDetails(id)
  if (!result) notFound()

  const { project, criteria } = result

  return (
    <ExportClient
      projectId={id}
      projectName={project.project_name}
      tenderTitle={project.tender_title ?? ''}
      readinessScore={project.readiness_score}
      criteria={criteria.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        status: c.status,
        questionCount: c.questions.length,
      }))}
    />
  )
}
