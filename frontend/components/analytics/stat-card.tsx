"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type TrendDirection = "up" | "down" | "neutral"

interface StatCardProps {
  /**
   * Card title/label
   */
  title: string
  /**
   * Main statistic value
   */
  value: string | number
  /**
   * Icon to display
   */
  icon?: LucideIcon
  /**
   * Change percentage (e.g., "+12.5" or "-5.3")
   */
  change?: number
  /**
   * Comparison period (e.g., "vs bulan lalu")
   */
  changePeriod?: string
  /**
   * Trend direction (auto-detected from change if not provided)
   */
  trend?: TrendDirection
  /**
   * Additional description
   */
  description?: string
  /**
   * Color scheme
   * @default "default"
   */
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  /**
   * Show trend icon
   * @default true
   */
  showTrendIcon?: boolean
  /**
   * Additional className
   */
  className?: string
  /**
   * Click handler
   */
  onClick?: () => void
}

const variantStyles = {
  default: {
    bg: "bg-white",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    valueColor: "text-slate-900",
  },
  primary: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-blue-900",
  },
  success: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    valueColor: "text-green-900",
  },
  warning: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-900",
  },
  danger: {
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    valueColor: "text-red-900",
  },
}

const trendStyles = {
  up: {
    color: "text-green-600",
    bg: "bg-green-50",
    icon: TrendingUp,
  },
  down: {
    color: "text-red-600",
    bg: "bg-red-50",
    icon: TrendingDown,
  },
  neutral: {
    color: "text-slate-600",
    bg: "bg-slate-50",
    icon: Minus,
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changePeriod = "vs bulan lalu",
  trend,
  description,
  variant = "default",
  showTrendIcon = true,
  className,
  onClick,
}: StatCardProps) {
  // Auto-detect trend from change value
  const detectedTrend: TrendDirection = React.useMemo(() => {
    if (trend) return trend
    if (change === undefined || change === 0) return "neutral"
    return change > 0 ? "up" : "down"
  }, [change, trend])

  const styles = variantStyles[variant]
  const trendConfig = trendStyles[detectedTrend]
  const TrendIcon = trendConfig.icon

  const Component = onClick ? "button" : "div"

  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full text-left",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
    >
      <Card className={cn("p-24", styles.bg)}>
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="flex-1 space-y-8">
            {/* Title */}
            <p className="text-body-sm font-medium text-slate-600">{title}</p>

            {/* Value */}
            <p className={cn("text-3xl font-display font-bold", styles.valueColor)}>
              {value}
            </p>

            {/* Change & Description */}
            <div className="space-y-4">
              {change !== undefined && (
                <div className="flex items-center gap-4">
                  {showTrendIcon && (
                    <div
                      className={cn(
                        "flex items-center justify-center h-20 w-20 rounded-full",
                        trendConfig.bg
                      )}
                    >
                      <TrendIcon className={cn("h-12 w-12", trendConfig.color)} />
                    </div>
                  )}
                  <span
                    className={cn("text-body-sm font-medium", trendConfig.color)}
                  >
                    {change > 0 ? "+" : ""}
                    {change}%
                  </span>
                  <span className="text-body-sm text-slate-500">
                    {changePeriod}
                  </span>
                </div>
              )}

              {description && (
                <p className="text-body-sm text-slate-600">{description}</p>
              )}
            </div>
          </div>

          {/* Icon */}
          {Icon && (
            <div
              className={cn(
                "flex items-center justify-center h-48 w-48 rounded-lg",
                styles.iconBg
              )}
            >
              <Icon className={cn("h-24 w-24", styles.iconColor)} />
            </div>
          )}
        </div>
      </Card>
    </Component>
  )
}

/**
 * Mini Stat Card - Compact version for smaller spaces
 */
interface MiniStatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  change?: number
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  className?: string
  onClick?: () => void
}

export function MiniStatCard({
  title,
  value,
  icon: Icon,
  change,
  variant = "default",
  className,
  onClick,
}: MiniStatCardProps) {
  const styles = variantStyles[variant]
  const Component = onClick ? "button" : "div"

  const trend: TrendDirection =
    change === undefined || change === 0
      ? "neutral"
      : change > 0
      ? "up"
      : "down"
  const trendConfig = trendStyles[trend]

  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full text-left",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
    >
      <Card className={cn("p-16", styles.bg)}>
        <div className="flex items-center justify-between gap-12">
          <div className="flex-1 min-w-0">
            <p className="text-caption text-slate-600 truncate">{title}</p>
            <div className="flex items-baseline gap-8 mt-4">
              <p className={cn("text-xl font-display font-bold", styles.valueColor)}>
                {value}
              </p>
              {change !== undefined && (
                <span className={cn("text-caption font-medium", trendConfig.color)}>
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
              )}
            </div>
          </div>

          {Icon && (
            <div
              className={cn(
                "flex items-center justify-center h-32 w-32 rounded-lg flex-shrink-0",
                styles.iconBg
              )}
            >
              <Icon className={cn("h-16 w-16", styles.iconColor)} />
            </div>
          )}
        </div>
      </Card>
    </Component>
  )
}

/**
 * Comparison Stat Card - Shows current vs previous period
 */
interface ComparisonStatCardProps {
  title: string
  currentValue: string | number
  previousValue: string | number
  currentLabel?: string
  previousLabel?: string
  icon?: LucideIcon
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  className?: string
}

export function ComparisonStatCard({
  title,
  currentValue,
  previousValue,
  currentLabel = "Saat ini",
  previousLabel = "Periode sebelumnya",
  icon: Icon,
  variant = "default",
  className,
}: ComparisonStatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn("p-24", styles.bg, className)}>
      <div className="flex items-start justify-between mb-16">
        <p className="text-body-sm font-medium text-slate-600">{title}</p>
        {Icon && (
          <div
            className={cn(
              "flex items-center justify-center h-40 w-40 rounded-lg",
              styles.iconBg
            )}
          >
            <Icon className={cn("h-20 w-20", styles.iconColor)} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-16">
        <div>
          <p className="text-caption text-slate-600 mb-4">{currentLabel}</p>
          <p className={cn("text-2xl font-display font-bold", styles.valueColor)}>
            {currentValue}
          </p>
        </div>
        <div>
          <p className="text-caption text-slate-600 mb-4">{previousLabel}</p>
          <p className="text-2xl font-display font-bold text-slate-500">
            {previousValue}
          </p>
        </div>
      </div>
    </Card>
  )
}
