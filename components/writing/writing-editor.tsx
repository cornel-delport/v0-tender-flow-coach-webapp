'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  List, 
  AlignLeft, 
  Plus, 
  X, 
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Save
} from 'lucide-react'
import type { Question, ContentMode } from '@/lib/types'

interface WritingEditorProps {
  question: Question
  onUpdate?: (updates: Partial<Question>) => void
}

export function WritingEditor({ question, onUpdate }: WritingEditorProps) {
  const [mode, setMode] = useState<ContentMode>(question.mode)
  const [bullets, setBullets] = useState<string[]>(question.bulletContent)
  const [text, setText] = useState(question.textContent)
  const [newBullet, setNewBullet] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddBullet = () => {
    if (newBullet.trim()) {
      setBullets([...bullets, newBullet.trim()])
      setNewBullet('')
    }
  }

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {question.isRequired ? 'Verplicht' : 'Optioneel'}
              </Badge>
              {question.comments.length > 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {question.comments.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-medium leading-snug">
              {question.text}
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className={`h-4 w-4 ${showHelp ? 'text-accent' : 'text-muted-foreground'}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toon hulptekst</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Help text */}
        {showHelp && (
          <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{question.helpText}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as ContentMode)}>
          <div className="flex items-center justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="bullets" className="text-xs gap-1.5 px-3">
                <List className="h-3.5 w-3.5" />
                Bullets
              </TabsTrigger>
              <TabsTrigger value="text" className="text-xs gap-1.5 px-3">
                <AlignLeft className="h-3.5 w-3.5" />
                Tekst
              </TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground">
              {mode === 'bullets' ? 'Begin met bullets, verfijn later' : 'Werk uit naar lopende tekst'}
            </p>
          </div>

          {/* Bullet Mode */}
          <TabsContent value="bullets" className="mt-4 space-y-3">
            {/* Existing bullets */}
            {bullets.length > 0 && (
              <div className="space-y-2">
                {bullets.map((bullet, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/50 group"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground flex-1">{bullet}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBullet(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new bullet */}
            <div className="flex items-start gap-2">
              <Textarea
                placeholder="Voeg een bullet toe... (bijv. 'Onze aanpak bestaat uit drie fasen')"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddBullet()
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Druk op Enter om toe te voegen
              </p>
              <Button size="sm" variant="outline" onClick={handleAddBullet}>
                <Plus className="h-4 w-4 mr-1" />
                Toevoegen
              </Button>
            </div>

            {/* Tips */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Tip:</span> Denk hierbij aan: 
                Wat is uw aanpak? Wie is verantwoordelijk? Wat maakt u onderscheidend? 
                Welk bewijs kunt u geven?
              </p>
            </div>
          </TabsContent>

          {/* Text Mode */}
          <TabsContent value="text" className="mt-4 space-y-3">
            <Textarea
              placeholder="Werk uw bullets uit naar lopende tekst..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {text.length} karakters
              </p>
              {bullets.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setText(bullets.map(b => `- ${b}`).join('\n\n'))}
                >
                  Vul in vanuit bullets
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save indicator */}
        <div className="flex items-center justify-end pt-2 border-t border-border">
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-1.5" />
            {isSaving ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
