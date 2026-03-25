'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mailadres en wachtwoord zijn verplicht' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (
      error.message.toLowerCase().includes('email not confirmed') ||
      error.message.toLowerCase().includes('email_not_confirmed')
    ) {
      return { error: 'E-mailadres nog niet bevestigd. Controleer uw inbox of schakel e-mailbevestiging uit in Supabase.' }
    }
    return { error: 'Onjuiste inloggegevens. Controleer uw e-mailadres en wachtwoord.' }
  }

  return { redirect: '/dashboard' }
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: 'Alle velden zijn verplicht' }
  }

  if (password.length < 8) {
    return { error: 'Wachtwoord moet minimaal 8 tekens bevatten' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('User already registered')) {
      return { error: 'Dit e-mailadres is al geregistreerd. Probeer in te loggen.' }
    }
    return { error: error.message }
  }

  // If Supabase requires email confirmation, the session will be null
  if (!data.session) {
    // Return a flag so the UI can show "check your email"
    return { needsConfirmation: true }
  }

  return { redirect: '/onboarding' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
