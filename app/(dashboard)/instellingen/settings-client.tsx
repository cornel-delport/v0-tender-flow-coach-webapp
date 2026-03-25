'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  Building2,
  Bell,
  Palette,
  Globe,
  Mail,
  Save,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { updateProfile, updateOrganisation } from '@/lib/actions/settings.actions'
import type { ProfileData, OrgData, OrgMemberRow } from '@/lib/services/user.service'

interface Props {
  profile: ProfileData
  org: OrgData | null
  email: string | null
  members: OrgMemberRow[]
}

export function SettingsClient({ profile, org, email, members }: Props) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [deadlineReminders, setDeadlineReminders] = useState(true)
  const [commentNotifications, setCommentNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [orgSaved, setOrgSaved] = useState(false)
  const [, startTransition] = useTransition()

  const initials = (profile.display_name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(fd)
      if (result.success) {
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 3000)
      }
    })
  }

  function handleOrgSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateOrganisation(fd)
      if (result.success) {
        setOrgSaved(true)
        setTimeout(() => setOrgSaved(false), 3000)
      }
    })
  }

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Instellingen</h1>
        <p className="text-muted-foreground mt-1">
          Beheer uw account en organisatie-instellingen
        </p>
      </div>

      <Tabs defaultValue="profiel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiel">
            <User className="h-4 w-4 mr-2" />
            Profiel
          </TabsTrigger>
          <TabsTrigger value="organisatie">
            <Building2 className="h-4 w-4 mr-2" />
            Organisatie
          </TabsTrigger>
          <TabsTrigger value="notificaties">
            <Bell className="h-4 w-4 mr-2" />
            Notificaties
          </TabsTrigger>
          <TabsTrigger value="weergave">
            <Palette className="h-4 w-4 mr-2" />
            Weergave
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profiel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profielgegevens</CardTitle>
              <CardDescription>Uw persoonlijke informatie en accountinstellingen</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{profile.display_name ?? 'Naam niet ingesteld'}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <Badge variant="outline" className="mt-1 capitalize">{profile.role}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="displayName">Weergavenaam</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    defaultValue={profile.display_name ?? ''}
                    placeholder="Uw naam"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email ?? ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    E-mailadres kan niet worden gewijzigd via instellingen.
                  </p>
                </div>

                <div className="flex justify-end items-center gap-3">
                  {profileSaved && (
                    <span className="text-sm text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Opgeslagen
                    </span>
                  )}
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Opslaan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organisation Tab */}
        <TabsContent value="organisatie" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisatiegegevens</CardTitle>
              <CardDescription>Informatie over uw organisatie</CardDescription>
            </CardHeader>
            <CardContent>
              {org ? (
                <form onSubmit={handleOrgSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organisatienaam</Label>
                    <Input
                      id="orgName"
                      name="orgName"
                      defaultValue={org.name}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={org.slug} disabled className="bg-muted font-mono text-sm" />
                    <p className="text-xs text-muted-foreground">
                      De URL-identificatie van uw organisatie kan niet worden gewijzigd.
                    </p>
                  </div>

                  <div className="flex justify-end items-center gap-3">
                    {orgSaved && (
                      <span className="text-sm text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Opgeslagen
                      </span>
                    )}
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Opslaan
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Geen organisatie gekoppeld. Ga naar{' '}
                  <a href="/onboarding" className="underline">onboarding</a> om er een aan te maken.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teamleden
              </CardTitle>
              <CardDescription>Leden van uw organisatie</CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen teamleden gevonden.</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => {
                    const name = member.profiles?.display_name ?? 'Onbekend'
                    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <div key={member.user_id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{name}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">{member.role}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" disabled>
                <Mail className="h-4 w-4 mr-2" />
                Teamlid uitnodigen (binnenkort)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notificaties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">E-mailnotificaties</CardTitle>
              <CardDescription>Kies welke e-mails u wilt ontvangen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-mailnotificaties</Label>
                  <p className="text-sm text-muted-foreground">Ontvang algemene updates via e-mail</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline herinneringen</Label>
                  <p className="text-sm text-muted-foreground">Ontvang herinneringen voor naderende deadlines</p>
                </div>
                <Switch checked={deadlineReminders} onCheckedChange={setDeadlineReminders} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Opmerkingen en reacties</Label>
                  <p className="text-sm text-muted-foreground">Ontvang notificaties bij nieuwe opmerkingen</p>
                </div>
                <Switch checked={commentNotifications} onCheckedChange={setCommentNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Wekelijks rapport</Label>
                  <p className="text-sm text-muted-foreground">Ontvang een wekelijkse samenvatting van activiteiten</p>
                </div>
                <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="weergave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weergave</CardTitle>
              <CardDescription>Pas het uiterlijk van de applicatie aan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thema</Label>
                <Select defaultValue="system">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Licht</SelectItem>
                    <SelectItem value="dark">Donker</SelectItem>
                    <SelectItem value="system">Systeemvoorkeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Taal
                </Label>
                <Select defaultValue="nl">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nl">Nederlands</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
