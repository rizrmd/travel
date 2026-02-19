"use client"

import * as React from "react"
import { Search, Filter, Grid3x3, LayoutGrid } from "lucide-react"
import { TemplateCard, TemplateCardSkeleton, Template, TemplateCategory } from "./template-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/feedback/empty-states"

interface TemplateGalleryProps {
  templates: Template[]
  selectedTemplateId?: string
  onSelectTemplate?: (template: Template) => void
  onPreviewTemplate?: (template: Template) => void
  isLoading?: boolean
  className?: string
}

type ViewMode = "grid" | "compact"
type FilterCategory = "all" | TemplateCategory

export function TemplateGallery({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
  isLoading = false,
  className,
}: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<FilterCategory>("all")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")

  // Filter templates
  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" || template.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [templates, searchQuery, categoryFilter])

  // Count by category
  const categoryCounts = React.useMemo(() => {
    return templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1
      return acc
    }, {} as Record<TemplateCategory, number>)
  }, [templates])

  return (
    <div className={cn("space-y-24", className)}>
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-16">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-16 w-16 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-36"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as FilterCategory)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-16 w-16 mr-8" />
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              Semua Kategori ({templates.length})
            </SelectItem>
            <SelectItem value="modern">
              Modern {categoryCounts.modern ? `(${categoryCounts.modern})` : ""}
            </SelectItem>
            <SelectItem value="classic">
              Classic {categoryCounts.classic ? `(${categoryCounts.classic})` : ""}
            </SelectItem>
            <SelectItem value="minimal">
              Minimal {categoryCounts.minimal ? `(${categoryCounts.minimal})` : ""}
            </SelectItem>
            <SelectItem value="premium">
              Premium {categoryCounts.premium ? `(${categoryCounts.premium})` : ""}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="flex gap-8">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-16 w-16" />
          </Button>
          <Button
            variant={viewMode === "compact" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("compact")}
          >
            <Grid3x3 className="h-16 w-16" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-slate-600">
          Menampilkan {filteredTemplates.length} dari {templates.length} template
        </p>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("all")
            }}
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div
          className={cn(
            "grid gap-24",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {[...Array(6)].map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Tidak ada template ditemukan"
          description={
            searchQuery || categoryFilter !== "all"
              ? "Coba ubah filter atau kata kunci pencarian"
              : "Belum ada template tersedia"
          }
          actionLabel={
            searchQuery || categoryFilter !== "all" ? "Reset Filter" : undefined
          }
          onAction={
            searchQuery || categoryFilter !== "all"
              ? () => {
                  setSearchQuery("")
                  setCategoryFilter("all")
                }
              : undefined
          }
        />
      ) : (
        <div
          className={cn(
            "grid gap-24",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={template.id === selectedTemplateId}
              onSelect={onSelectTemplate}
              onPreview={onPreviewTemplate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
