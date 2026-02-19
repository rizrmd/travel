"use client"

import * as React from "react"

export type DensityMode = "compact" | "comfortable" | "spacious"

interface DensityContextValue {
  density: DensityMode
  setDensity: (density: DensityMode) => void
  toggleDensity: () => void
}

const DensityContext = React.createContext<DensityContextValue | undefined>(undefined)

const DENSITY_STORAGE_KEY = "travel-umroh-density-mode"

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensityState] = React.useState<DensityMode>("comfortable")

  // Load density from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(DENSITY_STORAGE_KEY)
    if (stored && ["compact", "comfortable", "spacious"].includes(stored)) {
      setDensityState(stored as DensityMode)
    }
  }, [])

  const setDensity = React.useCallback((newDensity: DensityMode) => {
    setDensityState(newDensity)
    localStorage.setItem(DENSITY_STORAGE_KEY, newDensity)
  }, [])

  const toggleDensity = React.useCallback(() => {
    setDensityState((prev) => {
      const modes: DensityMode[] = ["compact", "comfortable", "spacious"]
      const currentIndex = modes.indexOf(prev)
      const nextIndex = (currentIndex + 1) % modes.length
      const next = modes[nextIndex]
      localStorage.setItem(DENSITY_STORAGE_KEY, next)
      return next
    })
  }, [])

  const contextValue = React.useMemo(
    () => ({ density, setDensity, toggleDensity }),
    [density, setDensity, toggleDensity]
  )

  return (
    <DensityContext.Provider value={contextValue}>
      {children}
    </DensityContext.Provider>
  )
}

export function useDensity() {
  const context = React.useContext(DensityContext)
  if (!context) {
    throw new Error("useDensity must be used within DensityProvider")
  }
  return context
}

/**
 * Get density-aware spacing values
 */
export function useDensitySpacing() {
  const { density } = useDensity()

  return React.useMemo(() => {
    const spacing = {
      compact: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      comfortable: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      spacious: {
        xs: "12px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
        "2xl": "64px",
      },
    }

    return spacing[density]
  }, [density])
}

/**
 * Get density-aware class names
 */
export function useDensityClasses() {
  const { density } = useDensity()

  return React.useMemo(() => {
    return {
      // Card padding
      cardPadding: {
        compact: "p-12",
        comfortable: "p-24",
        spacious: "p-32",
      }[density],

      // Gap between elements
      gap: {
        compact: "gap-8",
        comfortable: "gap-16",
        spacious: "gap-24",
      }[density],

      // Vertical spacing
      spaceY: {
        compact: "space-y-8",
        comfortable: "space-y-16",
        spacious: "space-y-24",
      }[density],

      // Text size
      textSize: {
        compact: "text-sm",
        comfortable: "text-base",
        spacious: "text-lg",
      }[density],

      // Button padding
      buttonPadding: {
        compact: "px-12 py-6",
        comfortable: "px-16 py-8",
        spacious: "px-20 py-10",
      }[density],

      // Table row height
      tableRow: {
        compact: "h-40",
        comfortable: "h-56",
        spacious: "h-72",
      }[density],

      // List item height
      listItem: {
        compact: "min-h-[40px]",
        comfortable: "min-h-[56px]",
        spacious: "min-h-[72px]",
      }[density],
    }
  }, [density])
}
