"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Save, 
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react"
import { mockProjects, mockCriteria } from "@/lib/mock-data"
import { WritingEditor } from "@/components/writing/writing-editor"
import { QualityPanel } from "@/components/writing/quality-panel"
import { EvidenceSelector } from "@/components/writing/evidence-selector"
import { CoachingTips } from "@/components/writing/coaching-tips"

export default function CriteriumWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("schrijven")

  const project = mockProjects.find(p => p.id === params.id)
  const criterion = mockCriteria.find(c => c.id === params.criteriumId)
  
  // Find adjacent criteria for navigation
  const criteriaList = mockCriteria.filter(c => c.projectId === params.id)
  const currentIndex = criteriaList.findIndex(c => c.id === params.criteriumId)
  const prevCriterion = currentIndex > 0 ? criteriaList[currentIndex - 1] : null
  const nextCriterion = currentIndex < criteriaList.length - 1 ? criteriaList[currentIndex + 1] : null

  useEffect(() => {
    if (criterion) {
      setContent(criterion.content || "")
    }
  }, [criterion])

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && content !== criterion?.content) {
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
          setLastSaved(new Date())
        }, 500)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [content, criterion?.content])

  if (!project || !criterion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Criterium niet gevonden</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500"
      case "in_progress": return "bg-amber-500"
      case "review": return "bg-blue-500"
      default: return "bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Afgerond"
      case "in_progress": return "In bewerking"
      case "review": return "Review"
      default: return "Niet gestart"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projecten/${project.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar project
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{criterion.name}</h1>
                <Badge variant="outline" className="text-xs">
                  {criterion.weight}%
                </Badge>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(criterion.status)}`} />
              </div>
              <p className="text-sm text-muted-foreground">{project.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Save status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span>Opslaan...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Opgeslagen om {lastSaved.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                </>
              ) : null}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm"
                disabled={!prevCriterion}
                onClick={() => prevCriterion && router.push(`/projecten/${project.id}/criterium/${prevCriterion.id}`)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {currentIndex + 1} / {criteriaList.length}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!nextCriterion}
                onClick={() => nextCriterion && router.push(`/projecten/${project.id}/criterium/${nextCriterion.id}`)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Opslaan
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Coaching */}
        <aside className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 py-0 h-12">
              <TabsTrigger 
                value="schrijven" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Tips
              </TabsTrigger>
              <TabsTrigger 
                value="bewijs"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Bewijs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="schrijven" className="flex-1 m-0 overflow-y-auto">
              <CoachingTips criterion={criterion} />
            </TabsContent>
            
            <TabsContent value="bewijs" className="flex-1 m-0 overflow-y-auto">
              <EvidenceSelector projectId={project.id} />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Center - Editor */}
        <main className="flex-1 overflow-hidden">
          <WritingEditor
            content={content}
            onChange={setContent}
            criterion={criterion}
            maxWords={criterion.maxWords}
          />
        </main>

        {/* Right sidebar - Quality */}
        <aside className="w-80 border-l bg-card overflow-y-auto">
          <QualityPanel content={content} criterion={criterion} />
        </aside>
      </div>
    </div>
  )
}
