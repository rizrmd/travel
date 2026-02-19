"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type TemplateCategory = "modern" | "classic" | "minimal" | "premium"

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  thumbnail: string
  isPremium?: boolean
  features: string[]
  previewUrl?: string
}

interface TemplateCardProps {
  template: Template
  isSelected?: boolean
  onSelect?: (template: Template) => void
  onPreview?: (template: Template) => void
  className?: string
}

export function TemplateCard({
  template,
  isSelected = false,
  onSelect,
  onPreview,
  className,
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all",
        "hover:shadow-lg hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary shadow-lg",
        className
      )}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-12 right-12 z-10 h-32 w-32 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-20 w-20 text-white" />
        </div>
      )}

      {/* Premium Badge */}
      {template.isPremium && (
        <div className="absolute top-12 left-12 z-10">
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            Premium
          </Badge>
        </div>
      )}

      {/* Template Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <p className="text-body-sm">Preview</p>
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8">
          {onPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPreview(template)
              }}
            >
              <Eye className="h-16 w-16 mr-8" />
              Preview
            </Button>
          )}
        </div>
      </div>

      {/* Template Info */}
      <div className="p-16 space-y-12">
        <div>
          <h3 className="font-display font-semibold text-slate-900 mb-4">
            {template.name}
          </h3>
          <p className="text-body-sm text-slate-600 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {template.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-8">
              <Check className="h-14 w-14 text-green-600 mt-2 flex-shrink-0" />
              <p className="text-caption text-slate-600">{feature}</p>
            </div>
          ))}
          {template.features.length > 3 && (
            <p className="text-caption text-slate-500">
              +{template.features.length - 3} fitur lainnya
            </p>
          )}
        </div>

        {/* Select Button */}
        {onSelect && (
          <Button
            onClick={() => onSelect(template)}
            className="w-full"
            variant={isSelected ? "default" : "outline"}
          >
            {isSelected ? "Terpilih" : "Pilih Template"}
          </Button>
        )}
      </div>
    </Card>
  )
}

export function TemplateCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
      <div className="p-16 space-y-12">
        <div className="space-y-8">
          <div className="h-20 bg-slate-200 rounded animate-pulse w-3/4" />
          <div className="h-16 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="h-12 bg-slate-200 rounded animate-pulse w-full" />
          <div className="h-12 bg-slate-200 rounded animate-pulse w-5/6" />
        </div>
        <div className="h-40 bg-slate-200 rounded animate-pulse" />
      </div>
    </Card>
  )
}
