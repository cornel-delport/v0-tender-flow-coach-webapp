"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Save,
  Upload,
  Users
} from "lucide-react"

export default function InstellingenPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [deadlineReminders, setDeadlineReminders] = useState(true)
  const [commentNotifications, setCommentNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)

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
              <CardDescription>
                Uw persoonlijke informatie en accountinstellingen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">MJ</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Foto wijzigen
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG of GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input id="firstName" defaultValue="Mark" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input id="lastName" defaultValue="Jansen" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input id="email" type="email" defaultValue="mark@tenderflow.nl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input id="phone" type="tel" defaultValue="+31 6 12345678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Functie</Label>
                <Input id="role" defaultValue="Senior Tender Consultant" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Korte beschrijving over uzelf..."
                  rows={3}
                  defaultValue="Gespecialiseerd in complexe ICT-aanbestedingen voor de publieke sector."
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Beveiliging
              </CardTitle>
              <CardDescription>
                Wachtwoord en beveiligingsinstellingen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Wachtwoord wijzigen</p>
                  <p className="text-sm text-muted-foreground">
                    Laatst gewijzigd 3 maanden geleden
                  </p>
                </div>
                <Button variant="outline">Wijzigen</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Twee-factor authenticatie</p>
                  <p className="text-sm text-muted-foreground">
                    Extra beveiliging voor uw account
                  </p>
                </div>
                <Badge>Actief</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organisatie" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisatiegegevens</CardTitle>
              <CardDescription>
                Informatie over uw organisatie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organisatienaam</Label>
                <Input id="orgName" defaultValue="TenderFlow B.V." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kvk">KvK-nummer</Label>
                  <Input id="kvk" defaultValue="12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btw">BTW-nummer</Label>
                  <Input id="btw" defaultValue="NL123456789B01" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input id="address" defaultValue="Herengracht 100" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postcode</Label>
                  <Input id="postalCode" defaultValue="1015 BS" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="city">Plaats</Label>
                  <Input id="city" defaultValue="Amsterdam" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teamleden
              </CardTitle>
              <CardDescription>
                Beheer wie toegang heeft tot de organisatie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Anna de Vries", email: "anna@example.nl", role: "Klant" },
                  { name: "Mark Jansen", email: "mark@tenderflow.nl", role: "Consultant" },
                  { name: "Sophie van den Berg", email: "sophie@tenderflow.nl", role: "Beheerder" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Teamlid uitnodigen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notificaties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">E-mailnotificaties</CardTitle>
              <CardDescription>
                Kies welke e-mails u wilt ontvangen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-mailnotificaties</Label>
                  <p className="text-sm text-muted-foreground">
                    Ontvang algemene updates via e-mail
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline herinneringen</Label>
                  <p className="text-sm text-muted-foreground">
                    Ontvang herinneringen voor naderende deadlines
                  </p>
                </div>
                <Switch 
                  checked={deadlineReminders}
                  onCheckedChange={setDeadlineReminders}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Opmerkingen en reacties</Label>
                  <p className="text-sm text-muted-foreground">
                    Ontvang notificaties bij nieuwe opmerkingen
                  </p>
                </div>
                <Switch 
                  checked={commentNotifications}
                  onCheckedChange={setCommentNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Wekelijks rapport</Label>
                  <p className="text-sm text-muted-foreground">
                    Ontvang een wekelijkse samenvatting van activiteiten
                  </p>
                </div>
                <Switch 
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="weergave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weergave</CardTitle>
              <CardDescription>
                Pas het uiterlijk van de applicatie aan
              </CardDescription>
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

              <Separator />

              <div className="space-y-2">
                <Label>Datumnotatie</Label>
                <Select defaultValue="nl">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nl">DD-MM-JJJJ</SelectItem>
                    <SelectItem value="us">MM/DD/JJJJ</SelectItem>
                    <SelectItem value="iso">JJJJ-MM-DD</SelectItem>
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
