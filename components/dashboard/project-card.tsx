'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  Users,
  FileText
} from 'lucide-react'
import type { TenderProject, Criterion } from '@/lib/types'

interface ProjectCardProps {
  project: TenderProject
  criteria: Criterion[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function getDaysRemaining(deadline: Date): number {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadge(status: TenderProject['status']) {
  const variants: Record<TenderProject['status'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    concept:     { label: 'Concept',       variant: 'secondary' },
    in_progress: { label: 'In Uitvoering', variant: 'default' },
    review:      { label: 'Review',        variant: 'outline' },
    completed:   { label: 'Voltooid',      variant: 'secondary' },
    submitted:   { label: 'Ingediend',     variant: 'secondary' },
    won:         { label: 'Gewonnen',      variant: 'default' },
    lost:        { label: 'Verloren',      variant: 'secondary' },
  }
  const config = variants[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ProjectCard({ project, criteria }: ProjectCardProps) {
  const daysRemaining = getDaysRemaining(project.deadline)
  const isUrgent = daysRemaining <= 7

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              {getStatusBadge(project.status)}
              <span className="text-xs text-muted-foreground">
                {project.referenceNumber}
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">
              {project.projectName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {project.clientName}
            </p>
          </div>
          <Link href={`/projecten/${project.id}`}>
            <Button variant="outline" size="sm" className="shrink-0">
              Openen
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Voortgang</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(project.deadline)}</span>
          </div>
          <div className={`flex items-center gap-2 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Clock className="h-4 w-4" />
            <span>{daysRemaining} dagen resterend</span>
          </div>
        </div>

        {/* Criteria progress */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Criteria Status</p>
          <div className="grid grid-cols-2 gap-2">
            {criteria.map((criterion) => (
              <Link 
                key={criterion.id}
                href={`/projecten/${project.id}/criterium/${criterion.id}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    {criterion.code}
                  </span>
                  <span className="text-sm text-foreground truncate">
                    {criterion.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  {criterion.progress}%
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-7 w-7 border-2 border-card">
                  <AvatarFallback className="text-xs bg-secondary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers.length > 3 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                  +{project.teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>4 documenten</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
