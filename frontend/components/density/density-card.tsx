"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDensity } from "@/lib/hooks/use-density"
import { cn } from "@/lib/utils"

interface DensityCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Card component that adapts to density mode
 */
export function DensityCard({ title, description, children, footer, className }: DensityCardProps) {
  const { density } = useDensity()

  const padding = {
    compact: "p-12",
    comfortable: "p-24",
    spacious: "p-32",
  }[density]

  const headerSpacing = {
    compact: "space-y-4",
    comfortable: "space-y-8",
    spacious: "space-y-12",
  }[density]

  const titleSize = {
    compact: "text-base",
    comfortable: "text-lg",
    spacious: "text-xl",
  }[density]

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader className={cn(padding, headerSpacing)}>
          {title && <CardTitle className={titleSize}>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={padding}>{children}</CardContent>
      {footer && <CardFooter className={padding}>{footer}</CardFooter>}
    </Card>
  )
}

/**
 * Stat card with density support
 */
interface DensityStatCardProps {
  title: string
  value: string | number
  icon?: React.ElementType
  change?: number
  className?: string
}

export function DensityStatCard({ title, value, icon: Icon, change, className }: DensityStatCardProps) {
  const { density } = useDensity()

  const padding = {
    compact: "p-12",
    comfortable: "p-24",
    spacious: "p-32",
  }[density]

  const spacing = {
    compact: "space-y-4",
    comfortable: "space-y-8",
    spacious: "space-y-12",
  }[density]

  const valueSize = {
    compact: "text-xl",
    comfortable: "text-3xl",
    spacious: "text-4xl",
  }[density]

  const iconSize = {
    compact: "h-16 w-16",
    comfortable: "h-20 w-20",
    spacious: "h-24 w-24",
  }[density]

  return (
    <Card className={className}>
      <div className={cn(padding, spacing)}>
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-slate-600">{title}</p>
          {Icon && <Icon className={cn(iconSize, "text-slate-400")} />}
        </div>
        <p className={cn(valueSize, "font-display font-bold text-slate-900")}>{value}</p>
        {change !== undefined && (
          <p className={cn("text-body-sm", change >= 0 ? "text-green-600" : "text-red-600")}>
            {change >= 0 ? "+" : ""}
            {change}%
          </p>
        )}
      </div>
    </Card>
  )
}
