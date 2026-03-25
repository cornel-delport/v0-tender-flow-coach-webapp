import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/app-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  // Fetch profile + org in one query
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, organisation_id, organisations(name)')
    .eq('id', user.id)
    .single()

  // If the profiles table doesn't exist yet (migration not run),
  // redirect to onboarding with a flag — don't crash
  if (profileError) {
    // Tables may not exist yet (migration not run) — send to onboarding
    redirect('/onboarding')
  }

  // New user with no org → must complete onboarding first
  if (!profile?.organisation_id) {
    redirect('/onboarding')
  }

  const orgs = profile?.organisations as { name: string } | { name: string }[] | null
  const orgName = Array.isArray(orgs) ? (orgs[0]?.name ?? '') : (orgs?.name ?? '')
  const displayName = profile?.display_name ?? user.email ?? ''

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar userDisplayName={displayName} orgName={orgName} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
