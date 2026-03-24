"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Plus, 
  FileText, 
  Image, 
  Award, 
  Users, 
  Building2,
  ExternalLink,
  GripVertical
} from "lucide-react"
import { mockEvidenceItems } from "@/lib/mock-data"

interface EvidenceSelectorProps {
  projectId: string
}

export function EvidenceSelector({ projectId }: EvidenceSelectorProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "referentie", label: "Referenties", icon: Building2, count: 12 },
    { id: "certificaat", label: "Certificaten", icon: Award, count: 8 },
    { id: "cv", label: "CV's", icon: Users, count: 24 },
    { id: "document", label: "Documenten", icon: FileText, count: 15 },
    { id: "afbeelding", label: "Afbeeldingen", icon: Image, count: 6 },
  ]

  const filteredEvidence = mockEvidenceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                         item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "referentie": return Building2
      case "certificaat": return Award
      case "cv": return Users
      case "afbeelding": return Image
      default: return FileText
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek bewijs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Alles
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="h-3 w-3 mr-1" />
              {cat.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Evidence List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredEvidence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Geen bewijs gevonden</p>
            </div>
          ) : (
            filteredEvidence.map((item) => {
              const Icon = getTypeIcon(item.category)
              return (
                <Card 
                  key={item.id}
                  className="p-3 cursor-grab hover:bg-accent/50 transition-colors group"
                  draggable
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.year && (
                          <span className="text-xs text-muted-foreground">{item.year}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Add new */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Nieuw bewijs toevoegen
        </Button>
      </div>
    </div>
  )
}
