'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, FileEdit, CheckCircle, AlertCircle } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'comment',
    user: 'Mark Jansen',
    action: 'heeft een opmerking geplaatst bij',
    target: 'SC1 - Architectuur',
    time: '2 uur geleden',
    icon: MessageSquare
  },
  {
    id: 2,
    type: 'edit',
    user: 'Anna de Vries',
    action: 'heeft wijzigingen opgeslagen in',
    target: 'SC2 - Implementatie',
    time: '4 uur geleden',
    icon: FileEdit
  },
  {
    id: 3,
    type: 'complete',
    user: 'Sophie van den Berg',
    action: 'heeft sectie voltooid',
    target: 'Bedrijfsprofiel',
    time: 'Gisteren',
    icon: CheckCircle
  },
  {
    id: 4,
    type: 'review',
    user: 'Mark Jansen',
    action: 'vraagt om review voor',
    target: 'SC1 - Vraag 2',
    time: 'Gisteren',
    icon: AlertCircle
  }
]

export function RecentActivity() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recente Activiteit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-secondary">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm text-foreground leading-snug">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-muted-foreground">{activity.action}</span>{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
