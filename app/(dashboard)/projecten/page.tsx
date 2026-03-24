import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  PlusCircle, 
  Search, 
  Calendar,
  Clock,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const projects = [
  {
    id: 'proj-001',
    name: 'Gemeente Rotterdam - ICT Dienstverlening',
    client: 'TechSolutions B.V.',
    reference: 'ROT-2024-ICT-001',
    deadline: '15 maart 2024',
    daysRemaining: 42,
    progress: 45,
    status: 'in_progress' as const,
    sector: 'Overheid'
  },
  {
    id: 'proj-002',
    name: 'Waternet - Monitoring Systeem',
    client: 'TechSolutions B.V.',
    reference: 'WAT-2024-MON-002',
    deadline: '28 februari 2024',
    daysRemaining: 27,
    progress: 72,
    status: 'review' as const,
    sector: 'Utilities'
  },
  {
    id: 'proj-003',
    name: 'ProRail - Veiligheidsanalyse',
    client: 'TechSolutions B.V.',
    reference: 'PRO-2024-VEI-003',
    deadline: '10 april 2024',
    daysRemaining: 68,
    progress: 15,
    status: 'concept' as const,
    sector: 'Transport'
  }
]

function getStatusBadge(status: string) {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    concept: { label: 'Concept', variant: 'secondary' },
    in_progress: { label: 'In Uitvoering', variant: 'default' },
    review: { label: 'Review', variant: 'outline' },
    completed: { label: 'Voltooid', variant: 'secondary' },
    submitted: { label: 'Ingediend', variant: 'secondary' }
  }
  const config = variants[status] || variants.concept
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export default function ProjectenPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Mijn Projecten">
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek projecten..."
              className="h-9 w-64 pl-9 bg-secondary border-0"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link href="/projecten/nieuw">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuw Project
            </Button>
          </Link>
        </div>
      </AppHeader>

      <div className="flex-1 p-6">
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(project.status)}
                      <span className="text-xs text-muted-foreground font-mono">
                        {project.reference}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {project.sector}
                      </Badge>
                    </div>
                    <Link 
                      href={`/projecten/${project.id}`}
                      className="text-base font-semibold text-foreground hover:text-accent transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {project.client}
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
                      <span>{project.deadline}</span>
                    </div>
                    <div className={`flex items-center justify-end gap-1.5 text-sm ${project.daysRemaining <= 14 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{project.daysRemaining} dagen</span>
                    </div>
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
                      <DropdownMenuItem>Dupliceren</DropdownMenuItem>
                      <DropdownMenuItem>Exporteren</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Archiveren
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
