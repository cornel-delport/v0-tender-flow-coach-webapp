"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft, 
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  Clock,
  User,
  FileCheck,
  Target,
  TrendingUp,
  Eye
} from "lucide-react"
import { mockProjects, mockCriteria, mockTeamMembers } from "@/lib/mock-data"

export default function ReviewPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overzicht")
  const [newComment, setNewComment] = useState("")

  const project = mockProjects.find(p => p.id === params.id)
  const criteria = mockCriteria.filter(c => c.projectId === params.id)

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Project niet gevonden</p>
      </div>
    )
  }

  const qualityMetrics = [
    { label: "Specificiteit", score: 72, status: "good" },
    { label: "Bewijskracht", score: 58, status: "warning" },
    { label: "Klantgerichtheid", score: 81, status: "good" },
    { label: "Leesbaarheid", score: 89, status: "good" },
    { label: "Onderscheidendheid", score: 45, status: "poor" },
  ]

  const reviewItems = [
    { 
      id: 1, 
      type: "warning", 
      criterion: "SC1", 
      message: "De architectuurbeschrijving mist concrete voorbeelden van eerdere implementaties.",
      suggestion: "Voeg een referentie toe naar het Gemeente Amsterdam project."
    },
    { 
      id: 2, 
      type: "error", 
      criterion: "SC2", 
      message: "De transitieaanpak is nog niet ingevuld.",
      suggestion: "Start met het beschrijven van de gefaseerde aanpak."
    },
    { 
      id: 3, 
      type: "success", 
      criterion: "SC1", 
      message: "Goede SMART-formulering bij de SLA-afspraken.",
      suggestion: null
    },
    { 
      id: 4, 
      type: "warning", 
      criterion: "SC4", 
      message: "De innovatiesectie bevat buzzwords zonder concrete uitleg.",
      suggestion: "Vervang 'AI-gedreven' door specifieke AI-toepassingen met voorbeelden."
    },
  ]

  const comments = [
    {
      id: 1,
      author: mockTeamMembers[1],
      content: "De architectuurdiagrammen zijn heel duidelijk. Kunnen we ook een security-diagram toevoegen?",
      timestamp: new Date("2024-02-01T10:30:00"),
      criterion: "SC1"
    },
    {
      id: 2,
      author: mockTeamMembers[0],
      content: "Akkoord, ik zal het security-diagram laten maken door Thomas.",
      timestamp: new Date("2024-02-01T14:15:00"),
      criterion: "SC1"
    },
    {
      id: 3,
      author: mockTeamMembers[2],
      content: "De transitieaanpak moet concreter. Kunnen we een tijdlijn toevoegen?",
      timestamp: new Date("2024-02-02T09:00:00"),
      criterion: "SC2"
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getScoreColor = (status: string) => {
    switch (status) {
      case "good": return "text-emerald-600"
      case "warning": return "text-amber-600"
      case "poor": return "text-red-600"
      default: return "text-muted-foreground"
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "good": return "bg-emerald-500"
      case "warning": return "bg-amber-500"
      case "poor": return "bg-red-500"
      default: return "bg-muted"
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projecten/${project.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
            <p className="text-muted-foreground">{project.projectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview document
          </Button>
          <Button>
            <FileCheck className="h-4 w-4 mr-2" />
            Review afronden
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gereedheidscore</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold">{project.readinessScore}%</span>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% deze week
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-semibold">{criteria.filter(c => c.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">Afgerond</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{criteria.filter(c => c.status === "in_progress").length}</p>
                <p className="text-xs text-muted-foreground">In bewerking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{criteria.filter(c => c.status === "niet_gestart").length}</p>
                <p className="text-xs text-muted-foreground">Te doen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overzicht">Overzicht</TabsTrigger>
              <TabsTrigger value="aandachtspunten">
                Aandachtspunten
                <Badge variant="secondary" className="ml-2">
                  {reviewItems.filter(i => i.type !== "success").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="opmerkingen">
                Opmerkingen
                <Badge variant="secondary" className="ml-2">{comments.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overzicht" className="mt-4 space-y-4">
              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Kwaliteitsmetrieken
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{metric.label}</span>
                        <span className={`text-sm font-medium ${getScoreColor(metric.status)}`}>
                          {metric.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${getProgressColor(metric.status)}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Criteria Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voortgang per criterium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criteria.map((criterion) => (
                      <div key={criterion.id} className="flex items-center gap-4">
                        <div className="w-16 flex-shrink-0">
                          <Badge variant="outline">{criterion.code}</Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{criterion.title}</span>
                            <span className="text-sm text-muted-foreground">{criterion.progress}%</span>
                          </div>
                          <Progress value={criterion.progress} className="h-2" />
                        </div>
                        {criterion.progress >= 80 ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : criterion.progress > 0 ? (
                          <Clock className="h-5 w-5 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aandachtspunten" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {reviewItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-lg border ${
                          item.type === "error" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900" :
                          item.type === "warning" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900" :
                          "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getStatusIcon(item.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{item.criterion}</Badge>
                            </div>
                            <p className="text-sm font-medium">{item.message}</p>
                            {item.suggestion && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Suggestie: {item.suggestion}
                              </p>
                            )}
                          </div>
                          {item.type !== "success" && (
                            <Button variant="outline" size="sm">
                              Oplossen
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="opmerkingen" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{comment.author.name}</span>
                              <Badge variant="outline" className="text-xs">{comment.criterion}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {comment.timestamp.toLocaleString('nl-NL', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Textarea 
                      placeholder="Voeg een opmerking toe..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                    />
                    <Button size="icon" className="h-auto">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Review team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deadline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Deadline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {Math.ceil((project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-muted-foreground">dagen resterend</p>
                <p className="text-sm mt-2">
                  {project.deadline.toLocaleDateString('nl-NL', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/projecten/${project.id}/export`}>
                  Exporteren naar Word
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Verstuur naar reviewer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Genereer checklist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
