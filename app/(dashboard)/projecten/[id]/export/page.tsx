"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  FileText, 
  Download,
  FileSpreadsheet,
  FileType,
  Eye,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { mockProjects, mockCriteria } from "@/lib/mock-data"

export default function ExportPage() {
  const params = useParams()
  const [selectedFormat, setSelectedFormat] = useState("docx")
  const [selectedSections, setSelectedSections] = useState<string[]>(["all"])
  const [includeEvidence, setIncludeEvidence] = useState(true)
  const [includeComments, setIncludeComments] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const project = mockProjects.find(p => p.id === params.id)
  const criteria = mockCriteria.filter(c => c.projectId === params.id)

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Project niet gevonden</p>
      </div>
    )
  }

  const exportFormats = [
    { id: "docx", label: "Word Document", icon: FileText, description: "Microsoft Word (.docx)" },
    { id: "pdf", label: "PDF Document", icon: FileType, description: "Portable Document Format (.pdf)" },
    { id: "xlsx", label: "Excel Spreadsheet", icon: FileSpreadsheet, description: "Microsoft Excel (.xlsx)" },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    
    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setExportProgress(i)
    }
    
    setIsExporting(false)
  }

  const toggleSection = (sectionId: string) => {
    if (sectionId === "all") {
      setSelectedSections(["all"])
    } else {
      setSelectedSections(prev => {
        const newSections = prev.filter(s => s !== "all")
        if (newSections.includes(sectionId)) {
          return newSections.filter(s => s !== sectionId)
        }
        return [...newSections, sectionId]
      })
    }
  }

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projecten/${project.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar project
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Exporteren</h1>
        <p className="text-muted-foreground mt-1">
          Exporteer uw inschrijving naar het gewenste formaat
        </p>
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{project.projectName}</CardTitle>
              <CardDescription>{project.tenderTitle}</CardDescription>
            </div>
            <Badge variant={project.readinessScore >= 70 ? "default" : "secondary"}>
              {project.readinessScore}% gereed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              {criteria.filter(c => c.status === "completed" || c.progress >= 80).length === criteria.length ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>
                {criteria.filter(c => c.status === "completed" || c.progress >= 80).length} van {criteria.length} criteria afgerond
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Format Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export formaat
            </CardTitle>
            <CardDescription>
              Kies het gewenste bestandsformaat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFormat === format.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <RadioGroupItem value={format.id} id={format.id} />
                  <format.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Label htmlFor={format.id} className="cursor-pointer font-medium">
                      {format.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Section Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Secties
            </CardTitle>
            <CardDescription>
              Selecteer welke onderdelen u wilt exporteren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="all" 
                checked={selectedSections.includes("all")}
                onCheckedChange={() => toggleSection("all")}
              />
              <Label htmlFor="all" className="cursor-pointer font-medium">
                Alle secties
              </Label>
            </div>
            <Separator />
            {criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={criterion.id}
                  checked={selectedSections.includes("all") || selectedSections.includes(criterion.id)}
                  onCheckedChange={() => toggleSection(criterion.id)}
                  disabled={selectedSections.includes("all")}
                />
                <Label 
                  htmlFor={criterion.id} 
                  className={`cursor-pointer flex-1 ${selectedSections.includes("all") ? "text-muted-foreground" : ""}`}
                >
                  {criterion.code}: {criterion.title}
                </Label>
                <Badge variant="outline" className="text-xs">
                  {criterion.progress}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Extra opties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="evidence">Bewijsstukken bijvoegen</Label>
              <p className="text-xs text-muted-foreground">
                Voeg referenties en certificaten toe als bijlagen
              </p>
            </div>
            <Checkbox 
              id="evidence" 
              checked={includeEvidence}
              onCheckedChange={(checked) => setIncludeEvidence(checked as boolean)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="comments">Interne opmerkingen meenemen</Label>
              <p className="text-xs text-muted-foreground">
                Inclusief review commentaar en notities (alleen voor intern gebruik)
              </p>
            </div>
            <Checkbox 
              id="comments" 
              checked={includeComments}
              onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardContent className="pt-6">
          {isExporting ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Document wordt gegenereerd...
                </span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporteren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
