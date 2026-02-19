"use client"

import * as React from "react"
import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  whatsappTemplates,
  templateCategories,
  getTemplatesByCategory,
  WhatsAppTemplate,
} from "@/lib/data/whatsapp-templates"

interface TemplatePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onSend: (message: string) => void
  mergeFields?: Record<string, string>
}

const WHATSAPP_CHAR_LIMIT = 4096

export function TemplatePicker({
  open,
  onOpenChange,
  selectedCount,
  onSend,
  mergeFields = {},
}: TemplatePickerProps) {
  const [activeCategory, setActiveCategory] = React.useState<'dokumen' | 'cicilan' | 'update'>('dokumen')
  const [selectedTemplate, setSelectedTemplate] = React.useState<WhatsAppTemplate | null>(null)
  const [customMessage, setCustomMessage] = React.useState('')

  const templates = getTemplatesByCategory(activeCategory)
  const charCount = customMessage.length
  const isOverLimit = charCount > WHATSAPP_CHAR_LIMIT
  const messageChunks = Math.ceil(charCount / WHATSAPP_CHAR_LIMIT)

  // Substitute merge fields in template
  const substituteMergeFields = (text: string) => {
    let result = text
    Object.entries(mergeFields).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value)
    })
    return result
  }

  // Handle template selection
  const handleSelectTemplate = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
    const substituted = substituteMergeFields(template.content)
    setCustomMessage(substituted)
  }

  // Handle send
  const handleSend = () => {
    if (customMessage.trim()) {
      onSend(customMessage)
      onOpenChange(false)
      // Reset state
      setSelectedTemplate(null)
      setCustomMessage('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Template Pesan</DialogTitle>
          <DialogDescription>
            Pilih template dan sesuaikan pesan WhatsApp untuk {selectedCount} jamaah
          </DialogDescription>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="flex gap-8 border-b overflow-x-auto">
          {templateCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-16 py-12 font-medium text-sm whitespace-nowrap transition-colors border-b-2",
                activeCategory === category.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-16 overflow-hidden">
          {/* Template List */}
          <div className="space-y-8 overflow-y-auto pr-8 max-h-[400px]">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={cn(
                  "w-full text-left p-16 rounded-lg border-2 transition-all hover:border-slate-300",
                  selectedTemplate?.id === template.id
                    ? "border-primary bg-blue-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-12">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body font-display font-semibold text-slate-900 mb-4">
                      {template.title}
                    </h4>
                    <p className="text-body-sm text-slate-600 line-clamp-2">
                      {template.preview}
                    </p>
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <Check className="h-20 w-20 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Preview Pane */}
          <div className="flex flex-col gap-12">
            <div className="flex-1 min-h-0">
              <label htmlFor="message-preview" className="block text-sm font-medium text-slate-700 mb-8">
                Pratinjau & Edit Pesan
              </label>
              <Textarea
                id="message-preview"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Pilih template untuk melihat pratinjau..."
                className="h-[300px] resize-none font-sans text-body-sm"
              />
            </div>

            {/* Character Counter */}
            <div className="space-y-8">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-slate-600">Jumlah karakter</span>
                <span className={cn(
                  "font-medium",
                  isOverLimit ? "text-destructive" : "text-slate-900"
                )}>
                  {charCount} / {WHATSAPP_CHAR_LIMIT}
                </span>
              </div>

              {/* Warning if over limit */}
              {isOverLimit && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-12">
                  <p className="text-body-sm text-amber-800">
                    ⚠️ Pesan akan dipecah jadi {messageChunks} bagian
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex-row gap-8 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            onClick={handleSend}
            disabled={!customMessage.trim()}
            className="bg-whatsapp hover:bg-whatsapp/90 text-white"
          >
            Kirim ke {selectedCount} Jamaah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
