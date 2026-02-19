"use client"

import * as React from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"
import { toast } from "sonner"

interface UseAutoSaveOptions<T extends FieldValues> {
  /**
   * React Hook Form instance
   */
  form: UseFormReturn<T>
  /**
   * Save function - should return a promise
   */
  onSave: (data: T) => Promise<void>
  /**
   * Debounce delay in milliseconds
   * @default 2000
   */
  delay?: number
  /**
   * Storage key for localStorage persistence
   */
  storageKey?: string
  /**
   * Whether auto-save is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Show toast notifications on save
   * @default true
   */
  showToast?: boolean
  /**
   * Callback when save succeeds
   */
  onSaveSuccess?: () => void
  /**
   * Callback when save fails
   */
  onSaveError?: (error: Error) => void
}

interface UseAutoSaveReturn {
  /**
   * Whether a save operation is currently in progress
   */
  isSaving: boolean
  /**
   * Timestamp of last successful save
   */
  lastSaved: Date | null
  /**
   * Manually trigger a save
   */
  saveNow: () => Promise<void>
  /**
   * Clear saved data from localStorage
   */
  clearSaved: () => void
  /**
   * Restore data from localStorage
   */
  restore: () => boolean
}

export function useAutoSave<T extends FieldValues>({
  form,
  onSave,
  delay = 2000,
  storageKey,
  enabled = true,
  showToast = true,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const isMountedRef = React.useRef(true)

  // Get form values
  const formValues = form.watch()

  // Save function
  const save = React.useCallback(
    async (data: T) => {
      if (!enabled) return

      setIsSaving(true)

      try {
        await onSave(data)

        if (isMountedRef.current) {
          setLastSaved(new Date())
          if (showToast) {
            toast.success("Data tersimpan otomatis", { duration: 2000 })
          }
          onSaveSuccess?.()
        }

        // Save to localStorage if key provided
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(data))
        }
      } catch (error) {
        if (isMountedRef.current) {
          const errorObj = error instanceof Error ? error : new Error("Save failed")
          if (showToast) {
            toast.error("Gagal menyimpan data", { duration: 4000 })
          }
          onSaveError?.(errorObj)
        }
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false)
        }
      }
    },
    [enabled, onSave, showToast, storageKey, onSaveSuccess, onSaveError]
  )

  // Manual save trigger
  const saveNow = React.useCallback(async () => {
    const data = form.getValues()
    await save(data as T)
  }, [form, save])

  // Clear saved data
  const clearSaved = React.useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  // Restore data from localStorage
  const restore = React.useCallback((): boolean => {
    if (!storageKey) return false

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        form.reset(data)
        return true
      }
    } catch (error) {
      console.error("Failed to restore saved data:", error)
    }

    return false
  }, [storageKey, form])

  // Auto-save on form value changes
  React.useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const data = form.getValues()
      save(data as T)
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formValues, enabled, delay, form, save])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isSaving,
    lastSaved,
    saveNow,
    clearSaved,
    restore,
  }
}

/**
 * Format last saved timestamp for display
 */
export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return ""

  const now = new Date()
  const diff = now.getTime() - lastSaved.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 10) return "Baru saja"
  if (seconds < 60) return `${seconds} detik yang lalu`
  if (minutes < 60) return `${minutes} menit yang lalu`
  if (hours < 24) return `${hours} jam yang lalu`

  return lastSaved.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
