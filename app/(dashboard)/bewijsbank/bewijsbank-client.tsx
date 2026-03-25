'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  FileText,
  Award,
  Users,
  Building2,
  MoreVertical,
  Trash2,
  Archive,
  Loader2,
} from 'lucide-react'
import { createEvidence, deleteEvidence } from '@/lib/actions/evidence.actions'
import type { EvidenceItem } from '@/lib/services/evidence.service'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  referentie: { label: 'Referentie', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', Icon: Building2 },
  certificaat: { label: 'Certificaat', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', Icon: Award },
  cv: { label: 'CV', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', Icon: Users },
  document: { label: 'Document', color: 'bg-muted text-muted-foreground', Icon: FileText },
  kpi: { label: 'KPI', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', Icon: FileText },
  aanbeveling: { label: 'Aanbeveling', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', Icon: FileText },
  case: { label: 'Case', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', Icon: FileText },
}

interface Props {
  initialItems: EvidenceItem[]
}

export function BewijsbankClient({ initialItems }: Props) {
  const [items, setItems] = useState<EvidenceItem[]>(initialItems)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState('')

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1
    return acc
  }, {})

  function handleAddSubmit(formData: FormData) {
    formData.set('category', newCategory)
    setFormError(null)
    startTransition(async () => {
      const result = await createEvidence(formData)
      if (result?.error) {
        setFormError(result.error)
      } else {
        setIsAddDialogOpen(false)
        setNewCategory('')
        // Optimistically add placeholder — page will revalidate with real data on next visit
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteEvidence(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    })
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bewijsbank</h1>
          <p className="text-muted-foreground mt-1">
            Beheer uw referenties, certificaten, CV&apos;s en andere bewijsstukken
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuw bewijs
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nieuw bewijsstuk toevoegen</DialogTitle>
              <DialogDescription>
                Voeg een referentie, certificaat, CV of ander document toe aan uw bewijsbank.
              </DialogDescription>
            </DialogHeader>
            <form action={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input id="title" name="title" placeholder="Bijv. Referentie Gemeente Amsterdam" required />
                </div>
                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <Select value={newCategory} onValueChange={setNewCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Korte beschrijving van het bewijsstuk..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Jaar</Label>
                  <Input id="year" name="year" placeholder="Bijv. 2024" type="number" />
                </div>
                {formError && (
                  <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                    {formError}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Toevoegen
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Alles ({items.length})
        </Button>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
          const count = categoryCounts[key] ?? 0
          if (count === 0) return null
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              <cfg.Icon className="h-3.5 w-3.5 mr-1.5" />
              {cfg.label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Zoek bewijsstukken..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Archive className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {items.length === 0
              ? 'Nog geen bewijsstukken. Voeg uw eerste toe.'
              : 'Geen resultaten gevonden.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.document
            return (
              <Card key={item.id} className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-secondary shrink-0">
                        <cfg.Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {item.year && (
                            <span className="text-xs text-muted-foreground">{item.year}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Verwijderen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
