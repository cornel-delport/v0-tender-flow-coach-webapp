'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

const stats = [
  {
    label: 'Actieve Projecten',
    value: '3',
    change: '+1 deze maand',
    icon: FolderKanban,
    color: 'text-accent'
  },
  {
    label: 'Naderende Deadlines',
    value: '2',
    change: 'Binnen 14 dagen',
    icon: Clock,
    color: 'text-warning'
  },
  {
    label: 'Voltooide Secties',
    value: '12',
    change: 'Van 28 totaal',
    icon: CheckCircle2,
    color: 'text-success'
  },
  {
    label: 'Review Nodig',
    value: '5',
    change: 'Wachtend op feedback',
    icon: AlertTriangle,
    color: 'text-destructive'
  }
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
