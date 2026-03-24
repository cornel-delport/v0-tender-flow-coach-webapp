'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2
} from 'lucide-react'

const sectors = [
  'Overheid',
  'Utilities',
  'Transport',
  'Zorg',
  'Onderwijs',
  'Bouw',
  'ICT',
  'Anders'
]

const tenderTypes = [
  'Openbare aanbesteding',
  'Niet-openbare aanbesteding',
  'Onderhandse gunning',
  'Dynamisch aankoopsysteem',
  'Raamovereenkomst',
  'Anders'
]

const regions = [
  'Noord-Holland',
  'Zuid-Holland',
  'Utrecht',
  'Noord-Brabant',
  'Gelderland',
  'Overijssel',
  'Limburg',
  'Friesland',
  'Groningen',
  'Drenthe',
  'Zeeland',
  'Flevoland',
  'Landelijk'
]

export default function NieuwProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileUpload = () => {
    // Simulated file upload
    setUploadedFiles([...uploadedFiles, `Document_${uploadedFiles.length + 1}.pdf`])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Navigate to the new project
    router.push('/projecten/proj-001')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projecten" className="hover:text-foreground transition-colors">
            Projecten
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Nieuw Project</span>
        </div>
      </AppHeader>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    s < step 
                      ? 'bg-accent text-accent-foreground' 
                      : s === step 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-0.5 mx-2 ${s < step ? 'bg-accent' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-8 px-4">
            <span className={`text-sm ${step >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Projectgegevens
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Documenten
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Bevestigen
            </span>
          </div>

          {/* Step 1: Project Details */}
          {step === 1 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Projectgegevens</CardTitle>
                <CardDescription>
                  Vul de basisgegevens van uw tenderproject in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Projectnaam *</Label>
                    <Input 
                      id="projectName" 
                      placeholder="bijv. Gemeente Rotterdam - ICT Dienstverlening"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Klantnaam *</Label>
                    <Input 
                      id="clientName" 
                      placeholder="bijv. TechSolutions B.V."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenderTitle">Aanbestedingstitel *</Label>
                  <Input 
                    id="tenderTitle" 
                    placeholder="Volledige titel van de aanbesteding"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceNumber">Referentienummer</Label>
                    <Input 
                      id="referenceNumber" 
                      placeholder="bijv. ROT-2024-ICT-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Indieningsdeadline *</Label>
                    <Input 
                      id="deadline" 
                      type="date"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector.toLowerCase()}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Regio</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer regio" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region.toLowerCase()}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenderType">Type aanbesteding</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenderTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractValue">Geschatte contractwaarde</Label>
                  <Input 
                    id="contractValue" 
                    placeholder="bijv. € 500.000 - € 1.000.000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contactpersoon</Label>
                    <Input 
                      id="contactPerson" 
                      placeholder="Naam van de contactpersoon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internalOwner">Interne eigenaar</Label>
                    <Input 
                      id="internalOwner" 
                      placeholder="Verantwoordelijke consultant"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Documenten Uploaden</CardTitle>
                <CardDescription>
                  Upload de relevante aanbestedingsdocumenten voor dit project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={handleFileUpload}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Klik om bestanden te uploaden
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of sleep bestanden hierheen
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, Word, Excel tot 50MB
                  </p>
                </div>

                {/* Document Categories */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Aanbestedingsdocumenten', desc: 'Hoofddocument, bijlagen' },
                    { label: 'Programma van Eisen', desc: 'Technische specificaties' },
                    { label: 'Compliance documenten', desc: 'Verklaringen, certificaten' },
                    { label: 'Eerdere voorstellen', desc: 'Referentiemateriaal' },
                  ].map((category, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                      onClick={handleFileUpload}
                    >
                      <FileText className="h-5 w-5 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">{category.label}</p>
                      <p className="text-xs text-muted-foreground">{category.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Geüploade bestanden</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">{file}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vorige
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Project Aanmaken</CardTitle>
                <CardDescription>
                  Controleer de gegevens en maak het project aan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Projectnaam</p>
                      <p className="font-medium text-foreground">Gemeente Rotterdam - ICT Dienstverlening</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Klant</p>
                      <p className="font-medium text-foreground">TechSolutions B.V.</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium text-foreground">15 maart 2024</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sector</p>
                      <p className="font-medium text-foreground">Overheid</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Geüploade documenten</p>
                      <p className="font-medium text-foreground">{uploadedFiles.length} bestanden</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium text-foreground">Openbare aanbesteding</p>
                    </div>
                  </div>
                </div>

                {/* What happens next */}
                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-3">Wat gebeurt er na het aanmaken?</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span>Het project wordt aangemaakt met standaard criteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span>U kunt direct beginnen met de intake en het schrijven</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span>Teamleden kunnen later worden uitgenodigd</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vorige
                  </Button>
                  <Button onClick={handleSubmit}>
                    Project Aanmaken
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
