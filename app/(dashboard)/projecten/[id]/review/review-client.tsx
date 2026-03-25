'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  Clock,
  User,
  FileCheck,
  Target,
  TrendingUp,
  Eye,
} from 'lucide-react'
import { addComment } from '@/lib/actions/comment.actions'
import type { ProjectRow, CriterionRow, TeamMemberRow } from '@/lib/services/project.service'

interface CommentRow {
  id: string
  content: string
  created_at: string
  entity_id: string
  profiles: { display_name: string | null } | null
  criteria_code?: string
}

interface Props {
  projectId: string
  project: ProjectRow
  criteria: CriterionRow[]
  teamMembers: TeamMemberRow[]
  comments: CommentRow[]
}

const qualityMetrics = [
  { label: 'Specificiteit', score: 72, status: 'good' },
  { label: 'Bewijskracht', score: 58, status: 'warning' },
  { label: 'Klantgerichtheid', score: 81, status: 'good' },
  { label: 'Leesbaarheid', score: 89, status: 'good' },
  { label: 'Onderscheidendheid', score: 45, status: 'poor' },
]

function getScoreColor(status: string) {
  if (status === 'good') return 'text-emerald-600'
  if (status === 'warning') return 'text-amber-600'
  return 'text-red-600'
}

function getProgressColor(status: string) {
  if (status === 'good') return 'bg-emerald-500'
  if (status === 'warning') return 'bg-amber-500'
  return 'bg-red-500'
}

function getStatusIcon(type: string) {
  if (type === 'success') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-500" />
  return <AlertCircle className="h-4 w-4 text-red-500" />
}

function criterionProgressValue(questions: { text_content: string | null }[]): number {
  if (!questions.length) return 0
  const answered = questions.filter((q) => q.text_content && q.text_content.trim().length > 0).length
  return Math.round((answered / questions.length) * 100)
}

export function ReviewClient({ projectId, project, criteria, teamMembers, comments: initialComments }: Props) {
  const [activeTab, setActiveTab] = useState('overzicht')
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(initialComments)
  const [, startTransition] = useTransition()

  const completedCount = criteria.filter((c) => c.status === 'voltooid').length
  const inProgressCount = criteria.filter((c) => c.status === 'in_progress').length
  const todoCount = criteria.filter((c) => c.status === 'niet_gestart').length

  const daysLeft = project.deadline
    ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const incompleteCount = criteria.filter((c) => c.status !== 'voltooid').length

  function handleSendComment() {
    if (!newComment.trim()) return
    const optimistic: CommentRow = {
      id: crypto.randomUUID(),
      content: newComment,
      created_at: new Date().toISOString(),
      entity_id: projectId,
      profiles: null,
    }
    setComments((prev) => [...prev, optimistic])
    const content = newComment
    setNewComment('')
    startTransition(async () => {
      await addComment(projectId, 'project', projectId, content)
    })
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projecten/${projectId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="text-muted-foreground">{project.project_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/projecten/${projectId}/export`}>
              <Eye className="h-4 w-4 mr-2" />
              Exporteren
            </Link>
          </Button>
          <Button>
            <FileCheck className="h-4 w-4 mr-2" />
            Review afronden
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gereedheidscore</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold">{project.readiness_score}%</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-semibold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Afgerond</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{inProgressCount}</p>
                <p className="text-xs text-muted-foreground">In bewerking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{todoCount}</p>
                <p className="text-xs text-muted-foreground">Te doen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
              <TabsTrigger value="aandachtspunten">
                Aandachtspunten
                {incompleteCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{incompleteCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="opmerkingen">
                Opmerkingen
                {comments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{comments.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overzicht tab */}
            <TabsContent value="overzicht" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Kwaliteitsmetrieken
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{metric.label}</span>
                        <span className={`text-sm font-medium ${getScoreColor(metric.status)}`}>
                          {metric.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressColor(metric.status)}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voortgang per criterium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criteria.map((criterion) => {
                      const pct = criterionProgressValue(criterion.questions)
                      return (
                        <div key={criterion.id} className="flex items-center gap-4">
                          <div className="w-16 flex-shrink-0">
                            <Badge variant="outline">{criterion.code}</Badge>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{criterion.title}</span>
                              <span className="text-sm text-muted-foreground">{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                          {pct >= 80 ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : pct > 0 ? (
                            <Clock className="h-5 w-5 text-amber-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aandachtspunten tab */}
            <TabsContent value="aandachtspunten" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {incompleteCount === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                      <p className="font-medium">Alle criteria zijn afgerond</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Er zijn geen openstaande aandachtspunten.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {criteria
                        .filter((c) => c.status !== 'voltooid')
                        .map((c) => (
                          <div
                            key={c.id}
                            className={`p-4 rounded-lg border ${
                              c.status === 'niet_gestart'
                                ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                                : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {c.status === 'niet_gestart' ? (
                                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">{c.code}</Badge>
                                  <span className="text-sm font-medium">{c.title}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {c.status === 'niet_gestart'
                                    ? 'Dit criterium is nog niet gestart.'
                                    : 'Dit criterium is nog in bewerking.'}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projecten/${projectId}/criterium/${c.id}`}>
                                  Bewerken
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Opmerkingen tab */}
            <TabsContent value="opmerkingen" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Nog geen opmerkingen</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment) => {
                          const name = comment.profiles?.display_name ?? 'Onbekend'
                          const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                          return (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleString('nl-NL', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm mt-1 text-muted-foreground">{comment.content}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Textarea
                      placeholder="Voeg een opmerking toe..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                    />
                    <Button
                      size="icon"
                      className="h-auto"
                      onClick={handleSendComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Review team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen teamleden</p>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => {
                    const name = member.profiles?.display_name ?? 'Onbekend'
                    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    return (
                      <div key={member.user_id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deadline */}
          {daysLeft !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold">{daysLeft}</p>
                  <p className="text-sm text-muted-foreground">dagen resterend</p>
                  <p className="text-sm mt-2">
                    {new Date(project.deadline!).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/projecten/${projectId}/export`}>
                  Exporteren naar Word
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Verstuur naar reviewer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Genereer checklist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
