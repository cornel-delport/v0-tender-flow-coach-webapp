import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getDashboardData } from '@/lib/services/dashboard.service'
import { daysRemaining } from '@/lib/services/project.service'
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  FolderOpen,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  concept:     { label: 'Concept',       variant: 'secondary' },
  in_progress: { label: 'In Uitvoering', variant: 'default' },
  review:      { label: 'Review',        variant: 'outline' },
  completed:   { label: 'Voltooid',      variant: 'secondary' },
  submitted:   { label: 'Ingediend',     variant: 'secondary' },
  won:         { label: 'Gewonnen',      variant: 'default' },
  lost:        { label: 'Verloren',      variant: 'secondary' },
}

export default async function DashboardPage() {
  const { stats, recentProjects, userName } = await getDashboardData()

  const firstName = userName.split(' ')[0]

  const statCards = [
    {
      label: 'Actieve Projecten',
      value: stats.activeProjects.toString(),
      sub: 'In uitvoering of review',
      icon: FolderKanban,
      color: 'text-accent',
    },
    {
      label: 'Naderende Deadlines',
      value: stats.upcomingDeadlines.toString(),
      sub: 'Binnen 14 dagen',
      icon: Clock,
      color: 'text-warning',
    },
    {
      label: 'Voltooide Criteria',
      value: stats.completedCriteria.toString(),
      sub: 'Status: voltooid',
      icon: CheckCircle2,
      color: 'text-success',
    },
    {
      label: 'Review Nodig',
      value: stats.reviewNeeded.toString(),
      sub: 'Wachtend op feedback',
      icon: AlertTriangle,
      color: 'text-destructive',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        title={`Welkom terug, ${firstName}`}
        subtitle="Hier is een overzicht van uw lopende projecten"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Recente Projecten</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projecten">Alle projecten</Link>
              </Button>
            </div>

            {recentProjects.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <FolderOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Nog geen projecten</p>
                  <Button asChild>
                    <Link href="/projecten/nieuw">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Eerste project aanmaken
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => {
                  const days = daysRemaining(project.deadline)
                  const cfg = STATUS_LABELS[project.status] ?? STATUS_LABELS.concept
                  const deadlineFmt = project.deadline
                    ? format(new Date(project.deadline), 'd MMM yyyy', { locale: nl })
                    : null

                  return (
                    <Link key={project.id} href={`/projecten/${project.id}`}>
                      <Card className="border-border/50 hover:border-border transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={cfg.variant} className="text-xs">
                                  {cfg.label}
                                </Badge>
                              </div>
                              <p className="font-medium text-foreground truncate">
                                {project.project_name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {project.client_name}
                              </p>
                            </div>
                            <div className="w-28 shrink-0">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Voortgang</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-1.5" />
                            </div>
                            {deadlineFmt && (
                              <div className="shrink-0 text-right">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{deadlineFmt}</span>
                                </div>
                                <p
                                  className={`text-xs mt-0.5 ${
                                    days <= 14 ? 'text-destructive' : 'text-muted-foreground'
                                  }`}
                                >
                                  {days}d
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
