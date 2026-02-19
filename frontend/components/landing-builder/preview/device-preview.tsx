"use client"

import * as React from "react"
import { Monitor, Tablet, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type DeviceType = "desktop" | "tablet" | "mobile"

interface DevicePreviewProps {
  children: React.ReactNode
  selectedDevice?: DeviceType
  onDeviceChange?: (device: DeviceType) => void
  className?: string
}

const deviceSizes: Record<DeviceType, { width: string; label: string; icon: React.ElementType }> = {
  desktop: { width: "100%", label: "Desktop", icon: Monitor },
  tablet: { width: "768px", label: "Tablet", icon: Tablet },
  mobile: { width: "375px", label: "Mobile", icon: Smartphone },
}

export function DevicePreview({
  children,
  selectedDevice = "desktop",
  onDeviceChange,
  className,
}: DevicePreviewProps) {
  return (
    <div className={cn("space-y-16", className)}>
      {/* Device Selector */}
      {onDeviceChange && (
        <div className="flex justify-center gap-8">
          {(Object.keys(deviceSizes) as DeviceType[]).map((device) => {
            const { label, icon: Icon } = deviceSizes[device]
            const isSelected = selectedDevice === device

            return (
              <Button
                key={device}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onDeviceChange(device)}
                className="min-w-[100px]"
              >
                <Icon className="h-16 w-16 mr-8" />
                {label}
              </Button>
            )
          })}
        </div>
      )}

      {/* Preview Container */}
      <div className="flex justify-center bg-slate-100 p-24 rounded-lg min-h-[600px]">
        <div
          className={cn(
            "transition-all duration-300 bg-white rounded-lg shadow-lg overflow-hidden",
            selectedDevice === "mobile" && "max-w-[375px]",
            selectedDevice === "tablet" && "max-w-[768px]",
            selectedDevice === "desktop" && "w-full"
          )}
          style={{ width: deviceSizes[selectedDevice].width }}
        >
          {children}
        </div>
      </div>

      {/* Device Info */}
      <div className="text-center text-body-sm text-slate-600">
        Tampilan: {deviceSizes[selectedDevice].label} ({deviceSizes[selectedDevice].width})
      </div>
    </div>
  )
}

interface ResponsivePreviewProps {
  children: React.ReactNode
  className?: string
}

export function ResponsivePreview({ children, className }: ResponsivePreviewProps) {
  return (
    <div className={cn("space-y-32", className)}>
      <h3 className="font-display font-semibold text-slate-900">Preview Responsif</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        {/* Mobile */}
        <Card className="p-16">
          <div className="flex items-center gap-8 mb-12">
            <Smartphone className="h-16 w-16 text-blue-600" />
            <span className="text-body-sm font-medium">Mobile (375px)</span>
          </div>
          <div className="bg-slate-100 rounded-lg p-8 overflow-hidden">
            <div className="max-w-[375px] mx-auto bg-white rounded shadow-sm overflow-auto max-h-[400px] scale-75 origin-top">
              {children}
            </div>
          </div>
        </Card>

        {/* Tablet */}
        <Card className="p-16">
          <div className="flex items-center gap-8 mb-12">
            <Tablet className="h-16 w-16 text-blue-600" />
            <span className="text-body-sm font-medium">Tablet (768px)</span>
          </div>
          <div className="bg-slate-100 rounded-lg p-8 overflow-hidden">
            <div className="max-w-[768px] mx-auto bg-white rounded shadow-sm overflow-auto max-h-[400px] scale-50 origin-top">
              {children}
            </div>
          </div>
        </Card>

        {/* Desktop */}
        <Card className="p-16">
          <div className="flex items-center gap-8 mb-12">
            <Monitor className="h-16 w-16 text-blue-600" />
            <span className="text-body-sm font-medium">Desktop (100%)</span>
          </div>
          <div className="bg-slate-100 rounded-lg p-8 overflow-hidden">
            <div className="bg-white rounded shadow-sm overflow-auto max-h-[400px] scale-[0.35] origin-top">
              {children}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
