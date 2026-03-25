import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronRight,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { getProjectWithDetails, daysRemaining, criterionProgress } from '@/lib/services/project.service'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

function getStatusIcon(status: string) {
  switch (status) {
    case 'voltooid':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'review':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case 'in_progress':
      return <Circle className="h-4 w-4 text-accent fill-accent" />
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

const STATUS_LABELS: Record<string, string> = {
  concept:     'Concept',
  in_progress: 'In Uitvoering',
  review:      'Review',
  completed:   'Voltooid',
  submitted:   'Ingediend',
  won:         'Gewonnen',
  lost:        'Verloren',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getProjectWithDetails(id)
  if (!result) notFound()

  const { project, criteria, teamMembers } = result
  const days = daysRemaining(project.deadline)
  const firstCriterionId = criteria[0]?.id

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projecten" className="hover:text-foreground transition-colors">
            Projecten
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-[300px]">
            {project.project_name}
          </span>
        </div>
      </AppHeader>

      <div className="flex-1 p-6 space-y-6">
        {/* Project Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge>{STATUS_LABELS[project.status] ?? project.status}</Badge>
              {project.reference_number && (
                <span className="text-sm text-muted-foreground font-mono">
                  {project.reference_number}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{project.project_name}</h1>
            <p className="text-muted-foreground">{project.client_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/projecten/${id}/export`}>
                <Download className="h-4 w-4 mr-2" />
                Exporteren
              </Link>
            </Button>
            {firstCriterionId && (
              <Button size="sm" asChild>
                <Link href={`/projecten/${id}/criterium/${firstCriterionId}`}>
                  Verder schrijven
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Clock className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${days <= 14 && project.deadline ? 'text-destructive' : 'text-foreground'}`}>
                    {project.deadline ? days : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">Dagen resterend</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
                  <p className="text-xs text-muted-foreground">Voortgang</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{criteria.length}</p>
                  <p className="text-xs text-muted-foreground">Criteria</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Users className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                  <p className="text-xs text-muted-foreground">Teamleden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="criteria" className="space-y-4">
          <TabsList>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="documenten">Documenten</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria" className="space-y-4">
            {criteria.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nog geen criteria aangemaakt.</p>
            ) : (
              <div className="space-y-3">
                {criteria.map((criterion) => {
                  const progress = criterionProgress(criterion.questions)
                  return (
                    <Link
                      key={criterion.id}
                      href={`/projecten/${id}/criterium/${criterion.id}`}
                    >
                      <Card className="border-border/50 hover:border-border hover:shadow-sm transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(criterion.status)}
                            <div className="w-12 shrink-0">
                              <span className="text-sm font-mono font-semibold text-muted-foreground">
                                {criterion.code}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {criterion.title}
                              </p>
                              {criterion.weight > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Weging: {criterion.weight}%
                                </p>
                              )}
                            </div>
                            <div className="w-32 shrink-0">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Voortgang</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                            <div className="w-20 text-right shrink-0">
                              <p className="text-sm text-muted-foreground">
                                {criterion.questions.length} vragen
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="documenten">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Geüploade Documenten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Documenten uploaden is beschikbaar na het aanmaken van het project.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Projectteam</CardTitle>
              </CardHeader>
              <CardContent>
                {teamMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nog geen teamleden.</p>
                ) : (
                  <div className="space-y-3">
                    {teamMembers.map((member) => {
                      const name = member.profiles?.display_name ?? 'Onbekend'
                      const initials = name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                      return (
                        <div
                          key={member.user_id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{name}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {member.role}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
