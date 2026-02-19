"use client"

import * as React from "react"
import {
  Inbox,
  Search,
  UserPlus,
  FileText,
  Package,
  Calendar,
  Bell,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  /**
   * Icon component to display
   */
  icon?: LucideIcon
  /**
   * Title text
   */
  title: string
  /**
   * Description text
   */
  description?: string
  /**
   * Action button label
   */
  actionLabel?: string
  /**
   * Action button callback
   */
  onAction?: () => void
  /**
   * Secondary action button label
   */
  secondaryActionLabel?: string
  /**
   * Secondary action button callback
   */
  onSecondaryAction?: () => void
  /**
   * Additional className
   */
  className?: string
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: {
    icon: "h-48 w-48",
    title: "text-lg",
    description: "text-body-sm",
    padding: "p-24",
  },
  md: {
    icon: "h-64 w-64",
    title: "text-xl",
    description: "text-body",
    padding: "p-32",
  },
  lg: {
    icon: "h-96 w-96",
    title: "text-2xl md:text-3xl",
    description: "text-body md:text-lg",
    padding: "p-48",
  },
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.padding,
        className
      )}
    >
      {/* Icon */}
      <div className="mb-16 text-slate-400">
        <Icon className={config.icon} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className={cn("font-display font-semibold text-slate-900 mb-8", config.title)}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn("text-slate-600 max-w-md mb-24", config.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-12">
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="outline">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Pre-configured empty state variants for common scenarios
 */

export function NoJamaahEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={UserPlus}
      title="Belum ada jamaah"
      description="Mulai dengan menambahkan jamaah pertama Anda untuk memulai perjalanan umroh mereka"
      actionLabel="Tambah Jamaah Baru"
      onAction={onAction}
    />
  )
}

export function NoSearchResultsEmptyState({
  query,
  onClear,
}: {
  query?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      icon={Search}
      title="Tidak ada hasil"
      description={
        query
          ? `Pencarian "${query}" tidak ditemukan. Coba kata kunci lain.`
          : "Tidak ada hasil yang sesuai dengan kriteria pencarian Anda."
      }
      actionLabel={onClear ? "Hapus Filter" : undefined}
      onAction={onClear}
      size="sm"
    />
  )
}

export function NoDocumentsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="Belum ada dokumen"
      description="Upload dokumen KTP, paspor, dan dokumen penting lainnya untuk melengkapi persyaratan umroh"
      actionLabel="Upload Dokumen"
      onAction={onAction}
    />
  )
}

export function NoPackagesEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Package}
      title="Belum ada paket"
      description="Buat paket umroh pertama Anda dengan harga, jadwal, dan fasilitas yang menarik"
      actionLabel="Buat Paket Baru"
      onAction={onAction}
    />
  )
}

export function NoScheduleEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="Tidak ada jadwal"
      description="Belum ada jadwal keberangkatan untuk periode ini"
      actionLabel="Lihat Jadwal Lain"
      onAction={onAction}
      size="sm"
    />
  )
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon={Bell}
      title="Tidak ada notifikasi"
      description="Anda sudah membaca semua notifikasi"
      size="sm"
    />
  )
}

interface FilteredEmptyStateProps {
  /**
   * The filter type (e.g., "status", "date", "category")
   */
  filterType: string
  /**
   * The current filter value
   */
  filterValue: string
  /**
   * Callback to clear filters
   */
  onClearFilter: () => void
}

export function FilteredEmptyState({
  filterType,
  filterValue,
  onClearFilter,
}: FilteredEmptyStateProps) {
  return (
    <EmptyState
      icon={Search}
      title="Tidak ada hasil"
      description={`Tidak ada data dengan ${filterType} "${filterValue}". Coba ubah filter Anda.`}
      actionLabel="Hapus Filter"
      onAction={onClearFilter}
      size="sm"
    />
  )
}
