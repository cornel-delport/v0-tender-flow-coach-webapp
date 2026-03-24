'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  ListChecks,
  PenTool,
  Sparkles,
  FileCheck
} from 'lucide-react'

const steps = [
  {
    id: 1,
    icon: Lightbulb,
    title: 'Welkom bij TenderFlow Coach',
    subtitle: 'Uw begeleide platform voor tendervoorbereiding',
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          TenderFlow Coach helpt u bij het bouwen van sterke tenderinschrijvingen. 
          We begeleiden u stap voor stap door het proces: van eerste ideeën tot een 
          complete, professionele inschrijving.
        </p>
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm font-medium text-foreground mb-2">Belangrijk om te weten:</p>
          <p className="text-sm text-muted-foreground">
            U schrijft nog niet de definitieve inschrijving. U bouwt eerst aan een 
            sterke <span className="font-medium text-foreground">Versie 0.5</span> - 
            een scherpe inhoudelijke opzet die u later kunt uitwerken.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: ListChecks,
    title: 'De 3-Versiemethode',
    subtitle: 'Inhoud eerst, formulering later',
    content: (
      <div className="space-y-4">
        {[
          {
            version: 'Versie 1',
            title: 'Bullets en Kerninhoud',
            description: 'Leg uw ideeën vast in bullets. Focus op wat u wilt zeggen, niet hoe.'
          },
          {
            version: 'Versie 2',
            title: 'Onderbouwing en SMART',
            description: 'Voeg bewijs toe, maak claims concreet en meetbaar.'
          },
          {
            version: 'Versie 3',
            title: 'Leesbaarheid en Stijl',
            description: 'Verfijn de formulering en verbeter de leesbaarheid.'
          }
        ].map((item, index) => (
          <div 
            key={index}
            className="flex gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold shrink-0">
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-foreground">{item.version}: {item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 3,
    icon: PenTool,
    title: 'Hoe het werkt',
    subtitle: 'Een begeleide schrijfervaring',
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Lightbulb, label: 'Begrijp de vraag', desc: 'We leggen uit wat de opdrachtgever echt wil weten' },
            { icon: ListChecks, label: 'Structureer uw antwoord', desc: 'Strategische vragen helpen u de kern te pakken' },
            { icon: PenTool, label: 'Schrijf in bullets', desc: 'Leg eerst de inhoud vast, verfijn later' },
            { icon: Sparkles, label: 'Versterk en onderbouw', desc: 'Voeg bewijs en klantwaarde toe' },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-secondary/50 border border-border">
              <item.icon className="h-5 w-5 text-accent mb-2" />
              <p className="font-medium text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="text-sm text-muted-foreground italic">
            "Inhoud eerst, polish later. De formulering hoeft nog niet perfect te zijn."
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    icon: FileCheck,
    title: 'Kwaliteitsbegeleiding',
    subtitle: 'Real-time feedback op uw content',
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Tijdens het schrijven krijgt u direct feedback op de kwaliteit van uw content. 
          We helpen u met:
        </p>
        <div className="space-y-3">
          {[
            { label: 'Specificiteit', desc: 'Is uw antwoord concreet genoeg?' },
            { label: 'Bewijsvoering', desc: 'Onderbouwt u claims met voorbeelden?' },
            { label: 'Klantgerichtheid', desc: 'Beantwoordt u wat de opdrachtgever vraagt?' },
            { label: 'SMART-niveau', desc: 'Zijn uw uitspraken meetbaar en tijdgebonden?' },
            { label: 'Onderscheidend vermogen', desc: 'Laat u zien waarom u de beste keuze bent?' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground"> - {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 5,
    icon: Sparkles,
    title: 'Klaar om te beginnen?',
    subtitle: 'Start uw eerste tenderproject',
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          U bent klaar om te starten met TenderFlow Coach. Maak uw eerste project aan 
          en begin met het bouwen van een sterke tenderinschrijving.
        </p>
        <div className="p-5 rounded-lg bg-accent/10 border border-accent/20">
          <h4 className="font-medium text-foreground mb-3">Wat u nodig heeft:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Aanbestedingsdocumenten
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Basisinformatie over het project
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Circa 30-60 minuten voor de eerste sessie
            </li>
          </ul>
        </div>
        <div className="flex gap-4">
          <Link href="/projecten/nieuw" className="flex-1">
            <Button className="w-full h-12" size="lg">
              Nieuw Project Starten
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="h-12" size="lg">
              Naar Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-accent' 
                  : index < currentStep 
                    ? 'w-4 bg-accent/50' 
                    : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="border-border">
          <CardContent className="p-8">
            {/* Step header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <step.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stap {step.id} van {steps.length}</p>
                <h1 className="text-xl font-semibold text-foreground">{step.title}</h1>
              </div>
            </div>

            {step.subtitle && (
              <p className="text-muted-foreground mb-6">{step.subtitle}</p>
            )}

            {/* Step content */}
            <div className="mb-8">
              {step.content}
            </div>

            {/* Navigation */}
            {!isLastStep && (
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Vorige
                </Button>
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Volgende
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skip link */}
        <div className="text-center mt-4">
          <Link 
            href="/dashboard" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Overslaan en naar dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
