'use client'

import { Bell, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export function AppHeader({ title, subtitle, children }: AppHeaderProps) {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
        <div className="flex items-center gap-4">
          {title && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoeken..."
              className="h-9 w-64 pl-9 bg-secondary border-0"
            />
          </div>

          {/* Notifications */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge 
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground"
                >
                  3
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Meldingen</TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hulp</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
