'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  FileCheck, 
  Users, 
  Eye, 
  Sparkles,
  Gauge,
  AlertTriangle,
  Lightbulb
} from 'lucide-react'
import type { QualityScores } from '@/lib/types'

interface QualityPanelProps {
  scores: QualityScores
}

function getScoreColor(level: 'zwak' | 'redelijk' | 'sterk'): string {
  switch (level) {
    case 'sterk': return 'text-success'
    case 'redelijk': return 'text-warning'
    case 'zwak': return 'text-destructive'
  }
}

function getScoreProgress(level: 'zwak' | 'redelijk' | 'sterk'): number {
  switch (level) {
    case 'sterk': return 100
    case 'redelijk': return 60
    case 'zwak': return 25
  }
}

function getSmartProgress(level: 'laag' | 'gemiddeld' | 'hoog'): number {
  switch (level) {
    case 'hoog': return 100
    case 'gemiddeld': return 60
    case 'laag': return 25
  }
}

export function QualityPanel({ scores }: QualityPanelProps) {
  const qualityMetrics = [
    { 
      label: 'Specificiteit', 
      value: scores.specificity, 
      icon: Target,
      description: 'Concreet en specifiek'
    },
    { 
      label: 'Bewijsvoering', 
      value: scores.evidence, 
      icon: FileCheck,
      description: 'Onderbouwd met bewijs'
    },
    { 
      label: 'Klantgerichtheid', 
      value: scores.customerFocus, 
      icon: Users,
      description: 'Focus op klantwaarde'
    },
    { 
      label: 'Leesbaarheid', 
      value: scores.readability, 
      icon: Eye,
      description: 'Helder en leesbaar'
    },
    { 
      label: 'Onderscheidend', 
      value: scores.distinctiveness, 
      icon: Sparkles,
      description: 'Uniek en onderscheidend'
    },
  ]

  const suggestions = getSuggestions(scores)

  return (
    <div className="space-y-4">
      {/* Quality Scores */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Gauge className="h-4 w-4 text-accent" />
            Kwaliteitsindicatoren
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {qualityMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">{metric.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${getScoreColor(metric.value)}`}
                >
                  {metric.value}
                </Badge>
              </div>
              <Progress 
                value={getScoreProgress(metric.value)} 
                className="h-1"
              />
            </div>
          ))}

          {/* SMART Score */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-foreground font-medium">SMART-niveau</span>
              <Badge 
                variant="outline" 
                className={`text-xs capitalize ${
                  scores.smartLevel === 'hoog' ? 'text-success' : 
                  scores.smartLevel === 'gemiddeld' ? 'text-warning' : 'text-destructive'
                }`}
              >
                {scores.smartLevel}
              </Badge>
            </div>
            <Progress 
              value={getSmartProgress(scores.smartLevel)} 
              className="h-1.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              Suggesties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 text-xs"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{suggestion}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Motivational */}
      <div className="p-3 rounded-lg bg-secondary/50 text-center">
        <p className="text-xs text-muted-foreground italic">
          "Inhoud eerst, polish later"
        </p>
      </div>
    </div>
  )
}

function getSuggestions(scores: QualityScores): string[] {
  const suggestions: string[] = []

  if (scores.specificity === 'zwak') {
    suggestions.push('Voeg concrete cijfers, data of namen toe')
  }
  if (scores.evidence === 'zwak') {
    suggestions.push('Onderbouw met een voorbeeld of referentie')
  }
  if (scores.customerFocus === 'zwak') {
    suggestions.push('Benoem wat dit oplevert voor de opdrachtgever')
  }
  if (scores.distinctiveness === 'zwak') {
    suggestions.push('Laat zien waarom u de beste keuze bent')
  }
  if (scores.smartLevel === 'laag') {
    suggestions.push('Maak uitspraken meetbaar en tijdgebonden')
  }

  return suggestions.slice(0, 3)
}
