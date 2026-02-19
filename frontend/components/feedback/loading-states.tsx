"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Loading message
   */
  message?: string
  /**
   * Additional className
   */
  className?: string
}

const spinnerSizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-48 w-48",
}

export function LoadingSpinner({
  size = "md",
  message,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-12", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn(spinnerSizes[size], "text-primary animate-spin")}
        aria-hidden="true"
      />
      {message && (
        <p className="text-body-sm text-slate-600">{message}</p>
      )}
      <span className="sr-only">Memuat...</span>
    </div>
  )
}

interface PageLoadingProps {
  /**
   * Loading message
   * @default "Memuat halaman..."
   */
  message?: string
}

export function PageLoading({ message = "Memuat halaman..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}

interface TableSkeletonProps {
  /**
   * Number of rows to display
   * @default 5
   */
  rows?: number
  /**
   * Number of columns to display
   * @default 4
   */
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-12" role="status" aria-label="Memuat tabel">
      {/* Table Header */}
      <div className="flex gap-12">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-40 flex-1" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-12">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-48 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  /**
   * Number of cards to display
   * @default 3
   */
  count?: number
  /**
   * Show image placeholder
   * @default false
   */
  showImage?: boolean
}

export function CardSkeleton({ count = 3, showImage = false }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16" role="status" aria-label="Memuat kartu">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`card-${i}`}
          className="rounded-lg border border-slate-200 p-16 space-y-12"
        >
          {showImage && <Skeleton className="h-[200px] w-full" />}
          <Skeleton className="h-24 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-5/6" />
        </div>
      ))}
    </div>
  )
}

interface FormSkeletonProps {
  /**
   * Number of fields to display
   * @default 5
   */
  fields?: number
}

export function FormSkeleton({ fields = 5 }: FormSkeletonProps) {
  return (
    <div className="space-y-24" role="status" aria-label="Memuat formulir">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`field-${i}`} className="space-y-8">
          <Skeleton className="h-16 w-1/4" />
          <Skeleton className="h-40 w-full" />
        </div>
      ))}
      <Skeleton className="h-40 w-[120px]" />
    </div>
  )
}

interface JamaahCardSkeletonProps {
  /**
   * Number of cards to display
   * @default 3
   */
  count?: number
}

export function JamaahCardSkeleton({ count = 3 }: JamaahCardSkeletonProps) {
  return (
    <div className="space-y-16" role="status" aria-label="Memuat daftar jamaah">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`jamaah-${i}`}
          className="rounded-lg border border-slate-200 p-16 space-y-12"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-8 flex-1">
              <Skeleton className="h-20 w-1/3" />
              <Skeleton className="h-16 w-1/2" />
            </div>
            <Skeleton className="h-24 w-64 rounded-full" />
          </div>
          <div className="flex gap-16">
            <Skeleton className="h-16 w-1/4" />
            <Skeleton className="h-16 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface KPICardSkeletonProps {
  /**
   * Number of KPI cards
   * @default 3
   */
  count?: number
}

export function KPICardSkeleton({ count = 3 }: KPICardSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
      role="status"
      aria-label="Memuat KPI"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`kpi-${i}`}
          className="rounded-lg border border-slate-200 p-24 space-y-12"
        >
          <Skeleton className="h-16 w-1/2" />
          <Skeleton className="h-48 w-1/3" />
        </div>
      ))}
    </div>
  )
}
