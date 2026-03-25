'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { autoSaveQuestion } from '@/lib/actions/criterion.actions'
import { WritingEditor } from '@/components/writing/writing-editor'
import { QualityPanel } from '@/components/writing/quality-panel'
import { EvidenceSelector } from '@/components/writing/evidence-selector'
import type { EvidenceItem } from '@/components/writing/evidence-selector'
import { CoachingTips } from '@/components/writing/coaching-tips'
import type { Criterion, Question, QualityScores } from '@/lib/types'

interface DBQuestion {
  id: string
  text: string
  help_text: string | null
  sort_order: number
  text_content?: string | null
  bullet_content?: string[] | null
  mode?: string | null
  quality_scores?: Record<string, string> | null
  is_required?: boolean
}

interface Props {
  projectId: string
  projectName: string
  criterionId: string
  criterionTitle: string
  criterionCode: string
  criterionWeight: number
  criterionStatus: string
  questions: DBQuestion[]
  evidenceItems: EvidenceItem[]
  prevId: string | null
  nextId: string | null
  currentIndex: number
  total: number
}

const STATUS_COLORS: Record<string, string> = {
  voltooid: 'bg-emerald-500',
  in_progress: 'bg-amber-500',
  review: 'bg-blue-500',
  niet_gestart: 'bg-muted',
}

const STATUS_LABELS: Record<string, string> = {
  voltooid: 'Afgerond',
  in_progress: 'In bewerking',
  review: 'Review',
  niet_gestart: 'Niet gestart',
}

const DEFAULT_QUALITY: QualityScores = {
  specificity: 'zwak',
  evidence: 'zwak',
  customerFocus: 'zwak',
  readability: 'zwak',
  distinctiveness: 'zwak',
  smartLevel: 'zwak',
}

function mapDbQuestionToType(q: DBQuestion): Question {
  const raw = q.quality_scores ?? {}
  const mode: 'bullets' | 'text' = q.mode === 'text' ? 'text' : 'bullets'
  return {
    id: q.id,
    criterionId: '',
    text: q.text,
    helpText: q.help_text ?? '',
    bulletContent: q.bullet_content?.length ? q.bullet_content : [''],
    textContent: q.text_content ?? '',
    mode,
    qualityScores: {
      specificity: (raw.specificity as QualityScores['specificity']) ?? 'zwak',
      evidence: (raw.evidence as QualityScores['evidence']) ?? 'zwak',
      customerFocus: (raw.customerFocus as QualityScores['customerFocus']) ?? 'zwak',
      readability: (raw.readability as QualityScores['readability']) ?? 'zwak',
      distinctiveness: (raw.distinctiveness as QualityScores['distinctiveness']) ?? 'zwak',
      smartLevel: (raw.smartLevel as QualityScores['smartLevel']) ?? 'zwak',
    },
    comments: [],
    isRequired: q.is_required ?? true,
    order: q.sort_order,
  }
}

export function CriterionWorkspace({
  projectId,
  projectName,
  criterionId,
  criterionTitle,
  criterionCode,
  criterionWeight,
  criterionStatus,
  questions,
  evidenceItems,
  prevId,
  nextId,
  currentIndex,
  total,
}: Props) {
  const router = useRouter()
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [questionStates, setQuestionStates] = useState<Question[]>(() =>
    questions.map(mapDbQuestionToType)
  )
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState('schrijven')
  const [, startTransition] = useTransition()

  const activeQuestion = questionStates[activeQuestionIdx]

  // Build Criterion shape for CoachingTips
  const criterionShape: Criterion = {
    id: criterionId,
    projectId,
    title: criterionTitle,
    code: criterionCode,
    weight: criterionWeight,
    status: criterionStatus as Criterion['status'],
    progress: 0,
    questions: questionStates,
    reviewNotes: [],
  }

  // Reset when navigating to a different criterion
  useEffect(() => {
    setQuestionStates(questions.map(mapDbQuestionToType))
    setActiveQuestionIdx(0)
    setLastSaved(null)
  }, [criterionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save — fires 800ms after changes stop
  const debouncedSave = useDebouncedCallback((q: Question) => {
    setIsSaving(true)
    startTransition(async () => {
      const result = await autoSaveQuestion(
        q.id,
        projectId,
        criterionId,
        q.textContent,
        q.bulletContent,
        q.mode
      )
      setIsSaving(false)
      if (result.success) setLastSaved(new Date())
    })
  }, 800)

  function handleQuestionUpdate(updates: Partial<Question>) {
    setQuestionStates((prev) => {
      const next = [...prev]
      next[activeQuestionIdx] = { ...next[activeQuestionIdx], ...updates }
      debouncedSave(next[activeQuestionIdx])
      return next
    })
  }

  if (!activeQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Geen vragen gevonden voor dit criterium.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projecten/${projectId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar project
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{criterionCode}</span>
                <h1 className="font-semibold">{criterionTitle}</h1>
                <Badge variant="outline" className="text-xs">
                  {criterionWeight}%
                </Badge>
                <div
                  className={`w-2 h-2 rounded-full ${STATUS_COLORS[criterionStatus] ?? 'bg-muted'}`}
                  title={STATUS_LABELS[criterionStatus]}
                />
              </div>
              <p className="text-sm text-muted-foreground">{projectName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>Opslaan...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>
                    Opgeslagen om{' '}
                    {lastSaved.toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </>
              ) : null}
            </div>

            {/* Question navigator (within criterion) */}
            {questions.length > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx((i) => i - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Vraag {activeQuestionIdx + 1} / {questions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeQuestionIdx === questions.length - 1}
                  onClick={() => setActiveQuestionIdx((i) => i + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Criterion navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={!prevId}
                onClick={() =>
                  prevId && router.push(`/projecten/${projectId}/criterium/${prevId}`)
                }
              >
                <ChevronLeft className="h-4 w-4" />
                Vorige criterium
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentIndex}/{total}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={!nextId}
                onClick={() =>
                  nextId && router.push(`/projecten/${projectId}/criterium/${nextId}`)
                }
              >
                Volgende criterium
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Three-column workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: coaching tips + evidence */}
        <aside className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 py-0 h-12">
              <TabsTrigger
                value="schrijven"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Tips
              </TabsTrigger>
              <TabsTrigger
                value="bewijs"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Bewijs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schrijven" className="flex-1 m-0 overflow-y-auto">
              <CoachingTips criterion={criterionShape} />
            </TabsContent>

            <TabsContent value="bewijs" className="flex-1 m-0 overflow-y-auto">
              <EvidenceSelector projectId={projectId} items={evidenceItems} />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Center: writing editor */}
        <main className="flex-1 overflow-hidden">
          <WritingEditor
            question={activeQuestion}
            onUpdate={handleQuestionUpdate}
          />
        </main>

        {/* Right: quality panel */}
        <aside className="w-80 border-l bg-card overflow-y-auto">
          <QualityPanel scores={activeQuestion.qualityScores} />
        </aside>
      </div>
    </div>
  )
}
