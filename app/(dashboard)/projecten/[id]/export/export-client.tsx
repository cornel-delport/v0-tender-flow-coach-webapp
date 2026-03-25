'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  FileText,
  Download,
  FileSpreadsheet,
  FileType,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface CriterionSummary {
  id: string
  code: string
  title: string
  status: string
  questionCount: number
}

interface Props {
  projectId: string
  projectName: string
  tenderTitle: string
  readinessScore: number
  criteria: CriterionSummary[]
}

const exportFormats = [
  { id: 'docx', label: 'Word Document', icon: FileText, description: 'Microsoft Word (.docx)' },
  { id: 'pdf', label: 'PDF Document', icon: FileType, description: 'Portable Document Format (.pdf)' },
  { id: 'xlsx', label: 'Excel Overzicht', icon: FileSpreadsheet, description: 'Microsoft Excel (.xlsx)' },
]

export function ExportClient({
  projectId,
  projectName,
  tenderTitle,
  readinessScore,
  criteria,
}: Props) {
  const [selectedFormat, setSelectedFormat] = useState('docx')
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['all'])
  const [includeEvidence, setIncludeEvidence] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const completedCount = criteria.filter((c) => c.status === 'voltooid').length
  const allReady = completedCount === criteria.length

  function toggleCriterion(id: string) {
    if (id === 'all') {
      setSelectedCriteria(['all'])
    } else {
      setSelectedCriteria((prev) => {
        const without = prev.filter((s) => s !== 'all')
        return without.includes(id) ? without.filter((s) => s !== id) : [...without, id]
      })
    }
  }

  async function handleExport() {
    setIsExporting(true)
    setExportProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 150))
      setExportProgress(i)
    }
    setIsExporting(false)
    // TODO: call /api/export/[projectId] route for real file generation
  }

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projecten/${projectId}`}>
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

      {/* Project summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{projectName}</CardTitle>
              {tenderTitle && <CardDescription>{tenderTitle}</CardDescription>}
            </div>
            <Badge variant={readinessScore >= 70 ? 'default' : 'secondary'}>
              {readinessScore}% gereed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            {allReady ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
            <span>
              {completedCount} van {criteria.length} criteria afgerond
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Format selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exportformaat</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="space-y-3">
              {exportFormats.map((fmt) => (
                <div key={fmt.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 cursor-pointer">
                  <RadioGroupItem value={fmt.id} id={fmt.id} className="mt-0.5" />
                  <Label htmlFor={fmt.id} className="cursor-pointer flex items-center gap-2">
                    <fmt.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{fmt.label}</p>
                      <p className="text-xs text-muted-foreground">{fmt.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Criteria selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Te exporteren criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 p-2">
              <Checkbox
                id="all"
                checked={selectedCriteria.includes('all')}
                onCheckedChange={() => toggleCriterion('all')}
              />
              <Label htmlFor="all" className="font-medium cursor-pointer">Alle criteria</Label>
            </div>
            {criteria.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2 rounded hover:bg-accent/5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={c.id}
                    checked={selectedCriteria.includes('all') || selectedCriteria.includes(c.id)}
                    onCheckedChange={() => toggleCriterion(c.id)}
                    disabled={selectedCriteria.includes('all')}
                  />
                  <Label htmlFor={c.id} className="cursor-pointer text-sm">
                    <span className="font-mono text-muted-foreground mr-2">{c.code}</span>
                    {c.title}
                  </Label>
                </div>
                <Badge
                  variant={c.status === 'voltooid' ? 'default' : 'secondary'}
                  className="text-xs shrink-0"
                >
                  {c.status === 'voltooid' ? 'Klaar' : 'Incompleet'}
                </Badge>
              </div>
            ))}

            <div className="pt-3 border-t">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="evidence"
                  checked={includeEvidence}
                  onCheckedChange={(v) => setIncludeEvidence(!!v)}
                />
                <Label htmlFor="evidence" className="text-sm cursor-pointer">
                  Bewijsstukken meenemen
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export button */}
      <Card>
        <CardContent className="pt-6">
          {isExporting ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Exporteren... {exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          ) : (
            <Button className="w-full" size="lg" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporteren als {exportFormats.find((f) => f.id === selectedFormat)?.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
