"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDensity } from "@/lib/hooks/use-density"
import { cn } from "@/lib/utils"

interface DensityTableProps {
  children: React.ReactNode
  className?: string
}

/**
 * Table wrapper with density context
 */
export function DensityTable({ children, className }: DensityTableProps) {
  return (
    <div className={cn("rounded-lg border border-slate-200 bg-white overflow-hidden", className)}>
      <Table>{children}</Table>
    </div>
  )
}

export function DensityTableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <TableHeader className={className}>{children}</TableHeader>
}

export function DensityTableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <TableBody className={className}>{children}</TableBody>
}

interface DensityTableRowProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * Table row with density-aware height
 */
export function DensityTableRow({ children, onClick, className }: DensityTableRowProps) {
  const { density } = useDensity()

  const height = {
    compact: "h-40",
    comfortable: "h-56",
    spacious: "h-72",
  }[density]

  return (
    <TableRow onClick={onClick} className={cn(height, onClick && "cursor-pointer", className)}>
      {children}
    </TableRow>
  )
}

interface DensityTableCellProps {
  children: React.ReactNode
  className?: string
  header?: boolean
}

/**
 * Table cell with density-aware padding
 */
export function DensityTableCell({ children, className, header = false }: DensityTableCellProps) {
  const { density } = useDensity()

  const padding = {
    compact: "px-12 py-8",
    comfortable: "px-16 py-12",
    spacious: "px-24 py-16",
  }[density]

  const textSize = {
    compact: "text-sm",
    comfortable: "text-base",
    spacious: "text-lg",
  }[density]

  const Component = header ? TableHead : TableCell

  return <Component className={cn(padding, textSize, className)}>{children}</Component>
}

/**
 * Convenient export for table head cell
 */
export function DensityTableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DensityTableCell header className={className}>
      {children}
    </DensityTableCell>
  )
}
