"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  presetColors?: string[]
  className?: string
}

export function ColorPicker({
  label,
  value,
  onChange,
  presetColors = [
    "#2563eb", // blue-600
    "#3b82f6", // blue-500
    "#10b981", // green-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // purple-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
  ],
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <Label className="text-body-sm font-medium text-slate-900">{label}</Label>

      {/* Color Input */}
      <div className="flex items-center gap-8">
        <div className="relative flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="pl-40"
          />
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-24 w-24 rounded border-2 border-slate-200"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-40 w-40 rounded cursor-pointer"
        />
      </div>

      {/* Preset Colors */}
      <div className="flex flex-wrap gap-8">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "h-32 w-32 rounded-md border-2 transition-all",
              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === color ? "border-primary ring-2 ring-primary" : "border-slate-200"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}

interface ThemeColorsEditorProps {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  onChange: (colors: { primary: string; secondary: string; accent: string }) => void
}

export function ThemeColorsEditor({ colors, onChange }: ThemeColorsEditorProps) {
  return (
    <Card className="p-24">
      <div className="flex items-center gap-12 mb-16">
        <Palette className="h-20 w-20 text-blue-600" />
        <h3 className="font-display font-semibold text-slate-900">Warna Tema</h3>
      </div>

      <div className="space-y-24">
        <ColorPicker
          label="Warna Utama"
          value={colors.primary}
          onChange={(primary) => onChange({ ...colors, primary })}
        />
        <ColorPicker
          label="Warna Sekunder"
          value={colors.secondary}
          onChange={(secondary) => onChange({ ...colors, secondary })}
        />
        <ColorPicker
          label="Warna Aksen"
          value={colors.accent}
          onChange={(accent) => onChange({ ...colors, accent })}
        />
      </div>
    </Card>
  )
}
