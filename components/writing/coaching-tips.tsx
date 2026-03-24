"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  Sparkles,
  BookOpen,
  Zap
} from "lucide-react"
import type { Criterion } from "@/lib/types"

interface CoachingTipsProps {
  criterion: Criterion
}

const coachingContent = {
  strategic: [
    {
      title: "Focus op onderscheidend vermogen",
      content: "Benadruk wat uw organisatie uniek maakt. Vermijd algemene claims en wees specifiek over uw aanpak, methodologie of ervaring die u onderscheidt van concurrenten.",
      priority: "high"
    },
    {
      title: "STAR-methode",
      content: "Structureer uw voorbeelden met Situatie, Taak, Actie en Resultaat. Dit maakt uw bewijs concreet en meetbaar.",
      priority: "high"
    },
    {
      title: "Link naar de vraag",
      content: "Begin elke paragraaf met een directe verwijzing naar het beoordelingscriterium. Dit toont dat u de vraag begrijpt.",
      priority: "medium"
    }
  ],
  warnings: [
    {
      title: "Vermijd passieve zinnen",
      content: "Gebruik actieve taal: 'Wij implementeerden' in plaats van 'Er werd geïmplementeerd'."
    },
    {
      title: "Geen onbewezen claims",
      content: "Onderbouw elke claim met concrete voorbeelden, cijfers of referenties."
    }
  ],
  examples: [
    {
      title: "Sterke openingszin",
      content: "\"Met 15 jaar ervaring in vergelijkbare projecten en een bewezen track record van 98% klanttevredenheid, zijn wij bij uitstek geschikt om...\"",
    },
    {
      title: "Meetbaar resultaat",
      content: "\"Dit resulteerde in een kostenbesparing van 23% en een verkorting van de doorlooptijd met 6 weken.\"",
    }
  ]
}

export function CoachingTips({ criterion }: CoachingTipsProps) {
  const [openSections, setOpenSections] = useState<string[]>(["strategic", "question"])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Criterion Analysis */}
        <Collapsible 
          open={openSections.includes("question")}
          onOpenChange={() => toggleSection("question")}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Vraaganalyse</CardTitle>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("question") ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Criterium</p>
                  <p className="text-sm">{criterion.name}</p>
                </div>
                {criterion.description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Beschrijving</p>
                    <p className="text-sm text-muted-foreground">{criterion.description}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Weging</p>
                    <p className="font-semibold">{criterion.weight}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max woorden</p>
                    <p className="font-semibold">{criterion.maxWords}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Strategic Tips */}
        <Collapsible 
          open={openSections.includes("strategic")}
          onOpenChange={() => toggleSection("strategic")}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-sm">Strategische tips</CardTitle>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("strategic") ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {coachingContent.strategic.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`w-1.5 rounded-full flex-shrink-0 ${
                      tip.priority === "high" ? "bg-amber-500" : "bg-muted"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tip.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Warnings */}
        <Collapsible 
          open={openSections.includes("warnings")}
          onOpenChange={() => toggleSection("warnings")}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm">Let op</CardTitle>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("warnings") ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {coachingContent.warnings.map((warning, index) => (
                  <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <p className="text-sm font-medium">{warning.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{warning.content}</p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Examples */}
        <Collapsible 
          open={openSections.includes("examples")}
          onOpenChange={() => toggleSection("examples")}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    <CardTitle className="text-sm">Voorbeelden</CardTitle>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.includes("examples") ? "rotate-180" : ""}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {coachingContent.examples.map((example, index) => (
                  <div key={index} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-sm font-medium">{example.title}</p>
                    <p className="text-xs italic text-muted-foreground mt-1">"{example.content}"</p>
                    <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Kopieer naar editor
                    </Button>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* AI Suggestion */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">AI Suggestie</CardTitle>
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Laat de AI een concept genereren op basis van uw bewijsbank en de criteria.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Genereer concept
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
