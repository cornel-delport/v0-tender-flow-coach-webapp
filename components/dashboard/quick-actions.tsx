'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  PlusCircle, 
  BookOpen, 
  Upload, 
  FileSearch,
  ChevronRight
} from 'lucide-react'

const actions = [
  {
    label: 'Nieuw Project',
    description: 'Start een nieuwe tender',
    href: '/projecten/nieuw',
    icon: PlusCircle
  },
  {
    label: 'Schrijfcoach',
    description: 'Tips en begeleiding',
    href: '/schrijfcoach',
    icon: BookOpen
  },
  {
    label: 'Bewijs Toevoegen',
    description: 'Upload naar Evidence Bank',
    href: '/evidence',
    icon: Upload
  },
  {
    label: 'Review Inbox',
    description: 'Bekijk openstaande reviews',
    href: '/projecten?filter=review',
    icon: FileSearch
  }
]

export function QuickActions() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Snelle Acties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary group-hover:bg-background transition-colors">
              <action.icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground truncate">{action.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
