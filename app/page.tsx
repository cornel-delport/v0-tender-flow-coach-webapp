import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Target, FileText, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">TF</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">TenderFlow Coach</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link href="/onboarding">
              <Button>
                Start nu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Bouw sterkere tenders met begeleide schrijfondersteuning
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            TenderFlow Coach begeleidt u stap voor stap bij het structureren, schrijven en versterken van uw aanbestedingen. Van eerste idee tot professionele inschrijving.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/onboarding">
              <Button size="lg" className="h-12 px-8">
                Gratis Beginnen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/schrijfcoach">
              <Button variant="outline" size="lg" className="h-12 px-8">
                Bekijk Schrijfcoach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              De Versie 0.5 Methode
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Bouw eerst een sterke inhoudelijke opzet voordat u gaat uitschrijven
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Denken & Structureren',
                description: 'Begrijp de vraag, verzamel uw kernideeën en leg ze vast in bullets.',
                color: 'bg-accent'
              },
              {
                step: '2',
                title: 'Onderbouwen & Versterken',
                description: 'Voeg bewijs toe, maak claims SMART en koppel aan klantwaarde.',
                color: 'bg-accent'
              },
              {
                step: '3',
                title: 'Schrijven & Verfijnen',
                description: 'Werk bullets uit naar sterkere tekst en verbeter de leesbaarheid.',
                color: 'bg-accent'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
                  <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center mb-4`}>
                    <span className="text-lg font-bold text-accent-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Target,
              title: 'Begeleide Workflow',
              description: 'Stapsgewijze begeleiding door elk criterium met strategische vragen.'
            },
            {
              icon: CheckCircle2,
              title: 'Kwaliteitschecks',
              description: 'Real-time feedback op SMART-criteria, specificiteit en bewijsvoering.'
            },
            {
              icon: FileText,
              title: 'Evidence Bank',
              description: 'Herbruikbare bibliotheek voor cases, certificaten en referenties.'
            },
            {
              icon: Sparkles,
              title: 'Schrijfcoach',
              description: 'Praktische tips en voorbeelden voor sterkere tenderteksten.'
            }
          ].map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl border border-border bg-card">
              <feature.icon className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Start vandaag nog met het bouwen van sterkere tender content.
          </p>
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Start uw eerste project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>TenderFlow Coach - Begeleid platform voor tendervoorbereiding</p>
        </div>
      </footer>
    </div>
  )
}
