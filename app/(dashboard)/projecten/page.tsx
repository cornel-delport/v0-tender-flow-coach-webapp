import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  PlusCircle,
  Calendar,
  Clock,
  MoreHorizontal,
  FolderOpen,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getProjects, daysRemaining } from '@/lib/services/project.service'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  concept:     { label: 'Concept',       variant: 'secondary' },
  in_progress: { label: 'In Uitvoering', variant: 'default' },
  review:      { label: 'Review',        variant: 'outline' },
  completed:   { label: 'Voltooid',      variant: 'secondary' },
  submitted:   { label: 'Ingediend',     variant: 'secondary' },
  won:         { label: 'Gewonnen',      variant: 'default' },
  lost:        { label: 'Verloren',      variant: 'secondary' },
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_LABELS[status] ?? STATUS_LABELS.concept
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default async function ProjectenPage() {
  const projects = await getProjects()

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Mijn Projecten">
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/projecten/nieuw">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuw Project
            </Button>
          </Link>
        </div>
      </AppHeader>

      <div className="flex-1 p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Nog geen projecten</p>
            <Link href="/projecten/nieuw">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Eerste Project Aanmaken
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const days = daysRemaining(project.deadline)
              const deadlineFormatted = project.deadline
                ? format(new Date(project.deadline), 'd MMMM yyyy', { locale: nl })
                : '—'

              return (
                <Card
                  key={project.id}
                  className="border-border/50 hover:border-border transition-colors"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={project.status} />
                          {project.reference_number && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {project.reference_number}
                            </span>
                          )}
                          {project.sector && (
                            <Badge variant="outline" className="text-xs">
                              {project.sector}
                            </Badge>
                          )}
                        </div>
                        <Link
                          href={`/projecten/${project.id}`}
                          className="text-base font-semibold text-foreground hover:text-accent transition-colors"
                        >
                          {project.project_name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {project.client_name}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="w-32 shrink-0">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">Voortgang</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>

                      {/* Deadline */}
                      <div className="w-36 shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground mb-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{deadlineFormatted}</span>
                        </div>
                        {project.deadline && (
                          <div
                            className={`flex items-center justify-end gap-1.5 text-sm ${
                              days <= 14 ? 'text-destructive' : 'text-muted-foreground'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span>{days} dagen</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/projecten/${project.id}`}>Openen</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
