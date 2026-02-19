"use client"

import * as React from "react"
import { useDensity } from "@/lib/hooks/use-density"
import { cn } from "@/lib/utils"

interface DensityListProps {
  children: React.ReactNode
  className?: string
}

/**
 * List container with density-aware spacing
 */
export function DensityList({ children, className }: DensityListProps) {
  const { density } = useDensity()

  const spacing = {
    compact: "space-y-4",
    comfortable: "space-y-8",
    spacious: "space-y-12",
  }[density]

  return <div className={cn(spacing, className)}>{children}</div>
}

interface DensityListItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * List item with density-aware height and padding
 */
export function DensityListItem({ children, onClick, className }: DensityListItemProps) {
  const { density } = useDensity()

  const padding = {
    compact: "p-8",
    comfortable: "p-16",
    spacious: "p-24",
  }[density]

  const minHeight = {
    compact: "min-h-[40px]",
    comfortable: "min-h-[56px]",
    spacious: "min-h-[72px]",
  }[density]

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg border border-slate-200 bg-white",
        padding,
        minHeight,
        onClick && "cursor-pointer hover:bg-slate-50",
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Grid with density-aware gap
 */
interface DensityGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

export function DensityGrid({ children, cols = 2, className }: DensityGridProps) {
  const { density } = useDensity()

  const gap = {
    compact: "gap-8",
    comfortable: "gap-16",
    spacious: "gap-24",
  }[density]

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols]

  return <div className={cn("grid", gridCols, gap, className)}>{children}</div>
}

/**
 * Section with density-aware spacing
 */
interface DensitySectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function DensitySection({ title, children, className }: DensitySectionProps) {
  const { density } = useDensity()

  const spacing = {
    compact: "space-y-12",
    comfortable: "space-y-24",
    spacious: "space-y-32",
  }[density]

  const titleSize = {
    compact: "text-lg",
    comfortable: "text-xl",
    spacious: "text-2xl",
  }[density]

  return (
    <section className={cn(spacing, className)}>
      {title && <h2 className={cn(titleSize, "font-display font-semibold text-slate-900")}>{title}</h2>}
      {children}
    </section>
  )
}
