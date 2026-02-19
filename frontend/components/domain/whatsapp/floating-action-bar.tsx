"use client"

import { CheckCircle, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingActionBarProps {
  selectedCount: number
  onSendReminder: () => void
  onMarkComplete: () => void
  onClearSelection: () => void
}

export function FloatingActionBar({
  selectedCount,
  onSendReminder,
  onMarkComplete,
  onClearSelection,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed z-50 bg-white shadow-lg transition-all duration-300 ease-in-out",
        // Mobile: full-width at bottom, no border radius
        "bottom-0 left-0 right-0 border-t border-slate-200 p-16",
        // Desktop: bottom-right, auto-width with max, rounded
        "lg:bottom-24 lg:right-24 lg:left-auto lg:max-w-[600px] lg:rounded-lg lg:border"
      )}
      role="toolbar"
      aria-label="Bulk actions for selected jamaah"
    >
      <div className="flex flex-col gap-12 sm:flex-row sm:items-center sm:justify-between">
        {/* Selection Count */}
        <div className="text-body font-display font-semibold text-slate-900">
          {selectedCount} jamaah dipilih
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-8">
          {/* Send WhatsApp Reminder */}
          <Button
            onClick={onSendReminder}
            className="flex-1 sm:flex-none bg-whatsapp hover:bg-whatsapp/90 text-white h-44 gap-8"
            aria-label={`Send WhatsApp reminder to ${selectedCount} jamaah`}
          >
            <MessageCircle className="h-20 w-20" />
            <span>Kirim Pengingat</span>
          </Button>

          {/* Mark Complete */}
          <Button
            onClick={onMarkComplete}
            variant="default"
            className="flex-1 sm:flex-none h-44 gap-8"
            aria-label={`Mark ${selectedCount} jamaah as complete`}
          >
            <CheckCircle className="h-20 w-20" />
            <span>Tandai Selesai</span>
          </Button>

          {/* Clear Selection */}
          <Button
            onClick={onClearSelection}
            variant="outline"
            className="h-44 gap-8"
            aria-label="Clear selection"
          >
            <X className="h-20 w-20" />
            <span className="hidden sm:inline">Hapus Pilihan</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
