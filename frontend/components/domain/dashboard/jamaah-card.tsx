"use client"

import { Eye, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import { Jamaah } from "@/lib/types/jamaah"
import { cn } from "@/lib/utils"

interface JamaahCardProps {
  jamaah: Jamaah
  isSelected: boolean
  onToggle: () => void
  onView?: () => void
  onEdit?: () => void
}

export function JamaahCard({
  jamaah,
  isSelected,
  onToggle,
  onView,
  onEdit,
}: JamaahCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border p-16 bg-white transition-colors",
        isSelected && "bg-blue-50 border-blue-200"
      )}
      aria-label={`Jamaah ${jamaah.name}, status ${jamaah.status}, ${jamaah.package}`}
    >
      {/* Top Row: Status Badge and Checkbox */}
      <div className="flex items-start justify-between mb-12">
        <StatusBadge status={jamaah.status} size="lg" />
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          aria-label={`Select ${jamaah.name}`}
          className="h-24 w-24"
        />
      </div>

      {/* Jamaah Info */}
      <div className="space-y-8 mb-16">
        <h3 className="text-large font-display font-semibold text-slate-900">
          {jamaah.name}
        </h3>
        <p className="text-body-sm text-slate-600">NIK: {jamaah.nik}</p>
        <p className="text-body-sm text-slate-500">{jamaah.package}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={onView}
          aria-label={`View ${jamaah.name}`}
          className="h-9 w-9"
        >
          <Eye className="h-[16px] w-[16px]" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          aria-label={`Edit ${jamaah.name}`}
          className="h-9 w-9"
        >
          <Pencil className="h-[16px] w-[16px]" />
        </Button>
      </div>
    </div>
  )
}
