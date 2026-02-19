"use client"

import * as React from "react"
import { Maximize2, Minimize2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useDensity, DensityMode } from "@/lib/hooks/use-density"
import { cn } from "@/lib/utils"

interface DensityToggleProps {
  variant?: "icon" | "labeled"
  className?: string
}

const densityConfig: Record<DensityMode, { label: string; description: string; icon: React.ElementType }> = {
  compact: {
    label: "Padat",
    description: "Tampilan padat, maksimalkan informasi",
    icon: Minimize2,
  },
  comfortable: {
    label: "Nyaman",
    description: "Tampilan seimbang (default)",
    icon: Circle,
  },
  spacious: {
    label: "Lapang",
    description: "Tampilan lapang, mudah dibaca",
    icon: Maximize2,
  },
}

export function DensityToggle({ variant = "icon", className }: DensityToggleProps) {
  const { density, setDensity } = useDensity()
  const config = densityConfig[density]
  const Icon = config.icon

  if (variant === "labeled") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("gap-8", className)}>
            <Icon className="h-[16px] w-[16px]" />
            <span className="hidden md:inline">{config.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>Kepadatan Tampilan</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={density} onValueChange={(value) => setDensity(value as DensityMode)}>
            {(Object.entries(densityConfig) as [DensityMode, typeof densityConfig[DensityMode]][]).map(
              ([mode, cfg]) => {
                const ModeIcon = cfg.icon
                return (
                  <DropdownMenuRadioItem key={mode} value={mode} className="gap-12">
                    <ModeIcon className="h-[16px] w-[16px]" />
                    <div className="flex-1">
                      <p className="font-medium">{cfg.label}</p>
                      <p className="text-caption text-slate-600">{cfg.description}</p>
                    </div>
                  </DropdownMenuRadioItem>
                )
              }
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Icon className="h-[20px] w-[20px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Kepadatan Tampilan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={density} onValueChange={(value) => setDensity(value as DensityMode)}>
          {(Object.entries(densityConfig) as [DensityMode, typeof densityConfig[DensityMode]][]).map(
            ([mode, cfg]) => {
              const ModeIcon = cfg.icon
              return (
                <DropdownMenuRadioItem key={mode} value={mode} className="gap-12">
                  <ModeIcon className="h-[16px] w-[16px]" />
                  <div className="flex-1">
                    <p className="font-medium">{cfg.label}</p>
                    <p className="text-caption text-slate-600">{cfg.description}</p>
                  </div>
                </DropdownMenuRadioItem>
              )
            }
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Simple toggle button that cycles through density modes
 */
export function DensityCycleButton({ className }: { className?: string }) {
  const { density, toggleDensity } = useDensity()
  const config = densityConfig[density]
  const Icon = config.icon

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDensity}
      className={className}
      title={`Kepadatan: ${config.label}`}
    >
      <Icon className="h-[20px] w-[20px]" />
    </Button>
  )
}
