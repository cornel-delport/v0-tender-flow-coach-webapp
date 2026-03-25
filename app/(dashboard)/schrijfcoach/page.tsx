'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp
} from 'lucide-react'

const categories = [
  { id: 'all', label: 'Alles', icon: BookOpen },
  { id: 'inleiding', label: 'Inleiding', icon: Sparkles },
  { id: 'smart', label: 'SMART', icon: Target },
  { id: 'bewijs', label: 'Bewijsvoering', icon: CheckCircle2 },
  { id: 'klantwaarde', label: 'Klantwaarde', icon: TrendingUp },
  { id: 'formulering', label: 'Formulering', icon: FileText },
]

const interactiveCards = [
  {
    id: 1,
    title: 'Een sterke inleiding schrijven',
    category: 'inleiding',
    steps: [
      'Begin met begrip tonen voor de vraag van de opdrachtgever',
      'Vat uw aanpak kort en krachtig samen',
      'Sluit af met het belangrijkste voordeel voor de klant'
    ],
    doExample: 'Wij begrijpen dat de gemeente Rotterdam een betrouwbare ICT-partner zoekt die niet alleen technisch sterk is, maar ook proactief meedenkt. Onze aanpak combineert bewezen expertise met een persoonlijke benadering, waardoor u verzekerd bent van stabiele dienstverlening en korte lijnen.',
    dontExample: 'In dit hoofdstuk beschrijven wij onze aanpak voor de ICT-dienstverlening. Wij zijn een ervaren partij met veel kennis van de sector.',
    tip: 'De eerste drie zinnen bepalen vaak de toon voor de rest van uw antwoord. Maak ze krachtig.'
  },
  {
    id: 2,
    title: 'Vaag taalgebruik herkennen',
    category: 'formulering',
    steps: [
      'Zoek naar woorden als "veel", "vaak", "regelmatig", "diverse"',
      'Vervang abstracte termen door concrete voorbeelden',
      'Voeg waar mogelijk getallen en tijdseenheden toe'
    ],
    doExample: 'Ons team van 12 certified engineers lost 95% van de incidenten binnen 4 uur op.',
    dontExample: 'Ons ervaren team lost de meeste incidenten snel op.',
    tip: 'Vraag jezelf af: "Kan ik hier een getal, datum of naam aan toevoegen?"'
  },
  {
    id: 3,
    title: 'Claims geloofwaardig maken',
    category: 'bewijs',
    steps: [
      'Onderbouw elke belangrijke claim met bewijs',
      'Verwijs naar concrete projecten of resultaten',
      'Gebruik cijfers en meetbare uitkomsten'
    ],
    doExample: 'Dit blijkt uit ons project bij Gemeente Amsterdam, waar wij de uptime verhoogden van 97% naar 99,8% en de gemiddelde responstijd halveerden.',
    dontExample: 'Wij hebben veel ervaring met vergelijkbare projecten en leveren altijd goede resultaten.',
    tip: 'Elke claim zonder bewijs is slechts een mening. Onderbouw, onderbouw, onderbouw.'
  },
  {
    id: 4,
    title: 'Impact en klantwaarde tonen',
    category: 'klantwaarde',
    steps: [
      'Vertaal features naar voordelen voor de opdrachtgever',
      'Kwantificeer de waarde waar mogelijk',
      'Benoem het probleem dat u oplost'
    ],
    doExample: 'Door onze geautomatiseerde monitoring bespaart uw beheerteam circa 20 uur per week aan handmatige controles, waardoor zij zich kunnen focussen op strategische taken.',
    dontExample: 'Ons monitoringsysteem heeft geavanceerde automatiseringsfuncties.',
    tip: 'De vraag "What\'s in it for them?" moet altijd beantwoord worden.'
  },
  {
    id: 5,
    title: 'SMART formuleren',
    category: 'smart',
    steps: [
      'Specifiek: Wat precies?',
      'Meetbaar: Hoeveel of hoe vaak?',
      'Acceptabel: Is het haalbaar?',
      'Realistisch: Past het bij de context?',
      'Tijdgebonden: Wanneer?'
    ],
    doExample: 'Binnen 30 dagen na contractstart leveren wij een volledig functionerend dashboard op waarmee uw team real-time inzicht heeft in alle KPIs.',
    dontExample: 'Wij zorgen voor goede rapportages over de prestaties.',
    tip: 'Een SMART uitspraak geeft zekerheid. Vage beloftes wekken wantrouwen.'
  },
  {
    id: 6,
    title: 'Actieve formulering',
    category: 'formulering',
    steps: [
      'Gebruik actieve werkwoorden in plaats van passieve',
      'Benoem wie verantwoordelijk is',
      'Vermijd hulpwerkwoorden als "worden", "zullen"'
    ],
    doExample: 'Onze projectmanager coördineert wekelijks de voortgang met uw team en escaleert knelpunten direct naar de stuurgroep.',
    dontExample: 'Er wordt wekelijks voortgang gecoördineerd en knelpunten worden geëscaleerd.',
    tip: 'Actieve zinnen zijn korter, krachtiger en makkelijker te lezen.'
  }
]

export default function SchrijfcoachPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const filteredCards = selectedCategory === 'all' 
    ? interactiveCards 
    : interactiveCards.filter(card => card.category === selectedCategory)

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader 
        title="Schrijfcoach"
        subtitle="Praktische begeleiding voor sterkere tenderteksten"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Introduction */}
        <Card className="border-border/50 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Word een betere tenderwriter
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  De Schrijfcoach bevat praktische tips, voorbeelden en oefeningen om uw 
                  tenderantwoorden te versterken. Leer hoe u overtuigend schrijft, claims 
                  onderbouwt en de opdrachtgever echt aanspreekt.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Interactive Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className={`border-border/50 cursor-pointer transition-all ${
                expandedCard === card.id ? 'ring-2 ring-accent' : 'hover:border-border'
              }`}
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.id === card.category)?.label}
                    </Badge>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </div>
                  <Lightbulb className={`h-5 w-5 transition-colors ${
                    expandedCard === card.id ? 'text-accent' : 'text-muted-foreground'
                  }`} />
                </div>
              </CardHeader>

              {expandedCard === card.id && (
                <CardContent className="pt-0 space-y-4">
                  {/* Steps */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Stappenplan:</p>
                    <ol className="space-y-1.5">
                      {card.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-medium shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Do vs Don't */}
                  <div className="grid gap-3">
                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">Doe dit</span>
                      </div>
                      <p className="text-sm text-foreground">{card.doExample}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Niet dit</span>
                      </div>
                      <p className="text-sm text-foreground">{card.dontExample}</p>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground italic">{card.tip}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Reference */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Snelle Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { question: 'Is mijn antwoord concreet?', sub: 'Bevat het getallen, namen, data?' },
                { question: 'Onderbouw ik mijn claims?', sub: 'Verwijs ik naar bewijs of voorbeelden?' },
                { question: 'Beantwoord ik de echte vraag?', sub: 'Wat wil de opdrachtgever weten?' },
                { question: 'Toon ik de klantwaarde?', sub: 'Wat levert het de opdrachtgever op?' },
                { question: 'Is het SMART geformuleerd?', sub: 'Specifiek, Meetbaar, Tijdgebonden?' },
                { question: 'Onderscheid ik mij?', sub: 'Waarom zijn wij de beste keuze?' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-secondary/50 border border-transparent hover:border-border transition-colors"
                >
                  <p className="text-sm font-medium text-foreground">{item.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational */}
        <div className="text-center py-6">
          <p className="text-muted-foreground italic">
            "Goede tenderantwoorden worden niet geschreven, ze worden herschreven."
          </p>
        </div>
      </div>
    </div>
  )
}
