import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChevronRight,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ArrowRight
} from 'lucide-react'
import { mockProject, mockCriteria } from '@/lib/mock-data'

function getStatusIcon(status: string) {
  switch (status) {
    case 'voltooid':
      return <CheckCircle2 className="h-4 w-4 text-success" />
    case 'review':
      return <AlertTriangle className="h-4 w-4 text-warning" />
    case 'in_progress':
      return <Circle className="h-4 w-4 text-accent fill-accent" />
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const project = mockProject
  const criteria = mockCriteria

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projecten" className="hover:text-foreground transition-colors">
            Projecten
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate max-w-[300px]">
            {project.projectName}
          </span>
        </div>
      </AppHeader>

      <div className="flex-1 p-6 space-y-6">
        {/* Project Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge>In Uitvoering</Badge>
              <span className="text-sm text-muted-foreground font-mono">
                {project.referenceNumber}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {project.projectName}
            </h1>
            <p className="text-muted-foreground">{project.clientName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Instellingen
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporteren
            </Button>
            <Link href={`/projecten/${id}/criterium/${criteria[0].id}`}>
              <Button size="sm">
                Verder schrijven
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Clock className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">42</p>
                  <p className="text-xs text-muted-foreground">Dagen resterend</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
                  <p className="text-xs text-muted-foreground">Voortgang</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{criteria.length}</p>
                  <p className="text-xs text-muted-foreground">Criteria</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Users className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{project.teamMembers.length}</p>
                  <p className="text-xs text-muted-foreground">Teamleden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="criteria" className="space-y-4">
          <TabsList>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="documenten">Documenten</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activiteit">Activiteit</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria" className="space-y-4">
            {/* Criteria List */}
            <div className="space-y-3">
              {criteria.map((criterion) => (
                <Link 
                  key={criterion.id} 
                  href={`/projecten/${id}/criterium/${criterion.id}`}
                >
                  <Card className="border-border/50 hover:border-border hover:shadow-sm transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Status Icon */}
                        {getStatusIcon(criterion.status)}

                        {/* Code */}
                        <div className="w-12 shrink-0">
                          <span className="text-sm font-mono font-semibold text-muted-foreground">
                            {criterion.code}
                          </span>
                        </div>

                        {/* Title & Weight */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {criterion.title}
                          </p>
                          {criterion.weight && (
                            <p className="text-xs text-muted-foreground">
                              Weging: {criterion.weight}%
                            </p>
                          )}
                        </div>

                        {/* Progress */}
                        <div className="w-32 shrink-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Voortgang</span>
                            <span className="font-medium">{criterion.progress}%</span>
                          </div>
                          <Progress value={criterion.progress} className="h-1.5" />
                        </div>

                        {/* Questions count */}
                        <div className="w-20 text-right shrink-0">
                          <p className="text-sm text-muted-foreground">
                            {criterion.questions.length} vragen
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documenten">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Geüploade Documenten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Aanbestedingsdocument.pdf', size: '2.4 MB', date: '10 jan 2024' },
                    { name: 'Programma van Eisen.pdf', size: '1.8 MB', date: '10 jan 2024' },
                    { name: 'Bijlage A - Technische Specificaties.pdf', size: '3.2 MB', date: '12 jan 2024' },
                    { name: 'Concept Overeenkomst.pdf', size: '890 KB', date: '12 jan 2024' }
                  ].map((doc, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} - Geüpload op {doc.date}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Projectteam</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.teamMembers.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activiteit">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Recente Activiteit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'Mark Jansen', action: 'heeft opmerking geplaatst bij SC1', time: '2 uur geleden' },
                    { user: 'Anna de Vries', action: 'heeft SC1 - Vraag 1 bijgewerkt', time: '4 uur geleden' },
                    { user: 'Sophie van den Berg', action: 'heeft document geüpload', time: 'Gisteren' },
                    { user: 'Mark Jansen', action: 'heeft SC2 gemarkeerd voor review', time: 'Gisteren' },
                  ].map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs bg-secondary">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
