"use client"

import * as React from "react"
import { Check, Loader2, AlertCircle, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatLastSaved } from "@/lib/hooks/use-auto-save"

interface AutoSaveIndicatorProps {
  /**
   * Whether a save operation is in progress
   */
  isSaving: boolean
  /**
   * Timestamp of last successful save
   */
  lastSaved: Date | null
  /**
   * Whether there was an error
   */
  hasError?: boolean
  /**
   * Additional className
   */
  className?: string
  /**
   * Show icon
   * @default true
   */
  showIcon?: boolean
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  hasError = false,
  className,
  showIcon = true,
}: AutoSaveIndicatorProps) {
  const [formattedTime, setFormattedTime] = React.useState("")

  // Update formatted time every 10 seconds
  React.useEffect(() => {
    const updateTime = () => {
      setFormattedTime(formatLastSaved(lastSaved))
    }

    updateTime()
    const interval = setInterval(updateTime, 10000)

    return () => clearInterval(interval)
  }, [lastSaved])

  if (!isSaving && !lastSaved && !hasError) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center gap-8 text-body-sm transition-all",
        isSaving && "text-blue-600",
        hasError && "text-red-600",
        !isSaving && !hasError && lastSaved && "text-green-600",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {showIcon && (
        <>
          {isSaving && (
            <Loader2 className="h-16 w-16 animate-spin" aria-hidden="true" />
          )}
          {hasError && (
            <AlertCircle className="h-16 w-16" aria-hidden="true" />
          )}
          {!isSaving && !hasError && lastSaved && (
            <Check className="h-16 w-16" aria-hidden="true" />
          )}
        </>
      )}

      <span>
        {isSaving && "Menyimpan..."}
        {hasError && "Gagal menyimpan"}
        {!isSaving && !hasError && lastSaved && (
          <>
            Tersimpan {formattedTime}
          </>
        )}
      </span>
    </div>
  )
}

interface FloatingAutoSaveIndicatorProps extends AutoSaveIndicatorProps {
  /**
   * Position of the floating indicator
   * @default "bottom-right"
   */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function FloatingAutoSaveIndicator({
  position = "bottom-right",
  ...props
}: FloatingAutoSaveIndicatorProps) {
  const positionClasses = {
    "top-left": "top-24 left-24",
    "top-right": "top-24 right-24",
    "bottom-left": "bottom-24 left-24",
    "bottom-right": "bottom-24 right-24",
  }

  return (
    <div
      className={cn(
        "fixed z-40 px-16 py-12 rounded-lg shadow-lg bg-white border border-slate-200",
        "transition-all duration-200",
        props.isSaving || props.hasError || props.lastSaved
          ? "opacity-100"
          : "opacity-0 pointer-events-none",
        positionClasses[position]
      )}
    >
      <AutoSaveIndicator {...props} />
    </div>
  )
}
