'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { createProject } from '@/lib/actions/project.actions'

const sectors = ['Overheid', 'Utilities', 'Transport', 'Zorg', 'Onderwijs', 'Bouw', 'ICT', 'Anders']
const tenderTypes = [
  'Openbare aanbesteding',
  'Niet-openbare aanbesteding',
  'Onderhandse gunning',
  'Dynamisch aankoopsysteem',
  'Raamovereenkomst',
  'Anders',
]
const regions = [
  'Noord-Holland', 'Zuid-Holland', 'Utrecht', 'Noord-Brabant', 'Gelderland',
  'Overijssel', 'Limburg', 'Friesland', 'Groningen', 'Drenthe',
  'Zeeland', 'Flevoland', 'Landelijk',
]

export default function NieuwProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  // Controlled values for Select components (not captured by FormData by default)
  const [sector, setSector] = useState('')
  const [region, setRegion] = useState('')
  const [tenderType, setTenderType] = useState('')

  function handleSubmit() {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    // Inject Select values manually
    formData.set('sector', sector)
    formData.set('region', region)
    formData.set('tenderType', tenderType)

    setError(null)
    startTransition(async () => {
      const result = await createProject(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.redirect) {
        router.push(result.redirect)
      }
    })
  }

  // Read current form values for the summary display on step 3
  const getFieldValue = (name: string) => {
    if (!formRef.current) return ''
    return (formRef.current.elements.namedItem(name) as HTMLInputElement)?.value ?? ''
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
                {s < 3 && <div className={`w-24 h-0.5 mx-2 ${s < step ? 'bg-accent' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-8 px-4">
            <span className={`text-sm ${step >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Projectgegevens
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Overzicht
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Bevestigen
            </span>
          </div>

          {/* Single form wrapping all steps — all steps stay in DOM so FormData captures all inputs */}
          <form ref={formRef}>
            {/* Step 1: Project Details */}
            <div className={step !== 1 ? 'hidden' : ''}>
            <Card className="border-border">
                <CardHeader>
                  <CardTitle>Projectgegevens</CardTitle>
                  <CardDescription>Vul de basisgegevens van uw tenderproject in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Projectnaam *</Label>
                      <Input
                        id="projectName"
                        name="projectName"
                        placeholder="bijv. Gemeente Rotterdam - ICT Dienstverlening"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Klantnaam *</Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        placeholder="bijv. TechSolutions B.V."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenderTitle">Aanbestedingstitel</Label>
                    <Input
                      id="tenderTitle"
                      name="tenderTitle"
                      placeholder="Volledige titel van de aanbesteding"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="referenceNumber">Referentienummer</Label>
                      <Input
                        id="referenceNumber"
                        name="referenceNumber"
                        placeholder="bijv. ROT-2024-ICT-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Indieningsdeadline</Label>
                      <Input id="deadline" name="deadline" type="date" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Sector</Label>
                      <Select value={sector} onValueChange={setSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Regio</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer regio" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type aanbesteding</Label>
                      <Select value={tenderType} onValueChange={setTenderType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer type" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenderTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractValue">Geschatte contractwaarde</Label>
                    <Input
                      id="contractValue"
                      name="contractValue"
                      placeholder="bijv. € 500.000 - € 1.000.000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contactpersoon</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        placeholder="Naam van de contactpersoon"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalOwner">Interne eigenaar</Label>
                      <Input
                        id="internalOwner"
                        name="internalOwner"
                        placeholder="Verantwoordelijke consultant"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setStep(2)}>
                      Volgende
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Overview */}
            <div className={step !== 2 ? 'hidden' : ''}>
            <Card className="border-border">
                <CardHeader>
                  <CardTitle>Projectoverzicht</CardTitle>
                  <CardDescription>
                    Controleer de ingevoerde gegevens voordat u het project aanmaakt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Projectnaam</p>
                        <p className="font-medium text-foreground">{getFieldValue('projectName') || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Klant</p>
                        <p className="font-medium text-foreground">{getFieldValue('clientName') || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium text-foreground">{getFieldValue('deadline') || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sector</p>
                        <p className="font-medium text-foreground">{sector || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Regio</p>
                        <p className="font-medium text-foreground">{region || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium text-foreground">{tenderType || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Wat wordt aangemaakt
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span>Project met 4 standaard criteria (aanpak, ervaring, team, prijs)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span>Schrijfwerkruimte per criterium met begeleide vragen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span>U bent aangemeld als projectbeheerder</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Vorige
                    </Button>
                    <Button type="button" onClick={() => setStep(3)}>
                      Volgende
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 3: Confirm & Submit */}
            <div className={step !== 3 ? 'hidden' : ''}>
            <Card className="border-border">
                <CardHeader>
                  <CardTitle>Project Aanmaken</CardTitle>
                  <CardDescription>Klik op de knop om het project definitief aan te maken</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-5 rounded-lg bg-accent/10 border border-accent/20 text-center">
                    <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                    <p className="font-semibold text-foreground">{getFieldValue('projectName')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{getFieldValue('clientName')}</p>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      {error}
                    </p>
                  )}

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Vorige
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isPending}>
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Project Aanmaken
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
