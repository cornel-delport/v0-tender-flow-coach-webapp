import { redirect } from 'next/navigation'
import { getProfileAndOrg, getOrgMembers } from '@/lib/services/user.service'
import { SettingsClient } from './settings-client'

export default async function InstellingenPage() {
  const data = await getProfileAndOrg()
  if (!data) redirect('/login')

  const { profile, org, email } = data
  const members = org ? await getOrgMembers(org.id) : []

  return (
    <SettingsClient
      profile={profile}
      org={org}
      email={email}
      members={members}
    />
  )
}
