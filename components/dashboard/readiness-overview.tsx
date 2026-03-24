'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  FileCheck, 
  AlertTriangle,
  CheckCircle2,
  Circle
} from 'lucide-react'
import type { TenderProject, Criterion } from '@/lib/types'

interface ReadinessOverviewProps {
  project: TenderProject
  criteria: Criterion[]
}

export function ReadinessOverview({ project, criteria }: ReadinessOverviewProps) {
  const completedCriteria = criteria.filter(c => c.status === 'voltooid').length
  const reviewCriteria = criteria.filter(c => c.status === 'review').length
  const inProgressCriteria = criteria.filter(c => c.status === 'in_progress').length
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Tender Readiness
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            Versie 0.5
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readiness Score */}
        <div className="flex items-center gap-6 p-4 rounded-lg bg-secondary/50">
          <div className="relative">
            <svg className="h-24 w-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${project.readinessScore * 2.51} 251`}
                className="text-accent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {project.readinessScore}%
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-medium text-foreground">Readiness Score</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uw concept is goed op weg. Focus nu op het toevoegen van concreet bewijs en het versterken van de onderscheidende factoren.
            </p>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <div>
              <p className="text-lg font-semibold text-foreground">{completedCriteria}</p>
              <p className="text-xs text-muted-foreground">Voltooid</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div>
              <p className="text-lg font-semibold text-foreground">{reviewCriteria}</p>
              <p className="text-xs text-muted-foreground">Review nodig</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-lg font-semibold text-foreground">{inProgressCriteria}</p>
              <p className="text-xs text-muted-foreground">In uitvoering</p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Ontbrekende Onderdelen</h4>
          <div className="space-y-2">
            {[
              { label: 'Concrete cijfers in SC1 - Architectuur', urgent: true },
              { label: 'Bewijsvoering voor ervaring claims', urgent: true },
              { label: 'Referentie projecten toevoegen', urgent: false },
              { label: 'Team CV\'s uploaden', urgent: false },
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30"
              >
                <div className={`h-2 w-2 rounded-full ${item.urgent ? 'bg-destructive' : 'bg-warning'}`} />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "De definitieve formulering hoeft nog niet perfect te zijn. Leg eerst de kern vast, verfijn later."
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
