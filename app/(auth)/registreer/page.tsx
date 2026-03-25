'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { signUp } from '@/lib/actions/auth.actions'
import { Loader2, MailCheck } from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.needsConfirmation) {
        setNeedsConfirmation(true)
      }
    })
  }

  if (needsConfirmation) {
    return (
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <MailCheck className="h-12 w-12 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-lg font-semibold">Controleer uw e-mail</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We hebben een bevestigingslink gestuurd. Klik op de link in uw inbox om uw account te activeren.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Geen e-mail ontvangen? Controleer uw spam of{' '}
              <button
                className="underline underline-offset-4"
                onClick={() => setNeedsConfirmation(false)}
              >
                probeer opnieuw
              </button>
              .
            </p>
            <Link href="/login" className="block text-sm text-foreground underline underline-offset-4">
              Terug naar inloggen
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">TenderFlow Coach</h1>
        <p className="text-sm text-muted-foreground mt-1">Maak een nieuw account aan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account aanmaken</CardTitle>
          <CardDescription>Vul uw gegevens in om te registreren</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Volledige naam</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jan de Vries"
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="naam@bedrijf.nl"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimaal 8 tekens"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Account aanmaken
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Al een account?{' '}
            <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-accent">
              Inloggen
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
