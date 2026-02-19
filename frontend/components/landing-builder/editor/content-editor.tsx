"use client"

import * as React from "react"
import Image from "next/image"
import { Type, Image as ImageIcon, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TextFieldEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  className?: string
}

export function TextFieldEditor({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  maxLength,
  className,
}: TextFieldEditorProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-body-sm font-medium text-slate-900">{label}</Label>
        {maxLength && (
          <span className="text-caption text-slate-500">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
    </div>
  )
}

interface ImageUploadEditorProps {
  label: string
  currentImage?: string
  onUpload: (file: File) => void
  onRemove?: () => void
  className?: string
}

export function ImageUploadEditor({
  label,
  currentImage,
  onUpload,
  onRemove,
  className,
}: ImageUploadEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      <Label className="text-body-sm font-medium text-slate-900">{label}</Label>

      {currentImage ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
          <Image src={currentImage} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-8">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-16 w-16 mr-8" />
              Ganti
            </Button>
            {onRemove && (
              <Button size="sm" variant="destructive" onClick={onRemove}>
                Hapus
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-8 text-slate-500 hover:text-blue-600"
        >
          <ImageIcon className="h-32 w-32" />
          <p className="text-body-sm font-medium">Klik untuk upload gambar</p>
          <p className="text-caption">PNG, JPG hingga 5MB</p>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

interface HeroContentEditorProps {
  content: {
    title: string
    subtitle: string
    ctaText: string
    backgroundImage?: string
  }
  onChange: (content: HeroContentEditorProps["content"]) => void
}

export function HeroContentEditor({ content, onChange }: HeroContentEditorProps) {
  return (
    <Card className="p-24">
      <div className="flex items-center gap-12 mb-16">
        <Type className="h-20 w-20 text-blue-600" />
        <h3 className="font-display font-semibold text-slate-900">Hero Section</h3>
      </div>

      <div className="space-y-24">
        <TextFieldEditor
          label="Judul Utama"
          value={content.title}
          onChange={(title) => onChange({ ...content, title })}
          placeholder="Contoh: Umroh Terpercaya & Amanah"
          maxLength={100}
        />

        <TextFieldEditor
          label="Sub Judul"
          value={content.subtitle}
          onChange={(subtitle) => onChange({ ...content, subtitle })}
          placeholder="Contoh: Wujudkan Impian Umroh Bersama Kami"
          multiline
          maxLength={200}
        />

        <TextFieldEditor
          label="Teks Tombol"
          value={content.ctaText}
          onChange={(ctaText) => onChange({ ...content, ctaText })}
          placeholder="Contoh: Daftar Sekarang"
          maxLength={30}
        />

        <ImageUploadEditor
          label="Gambar Background (Opsional)"
          currentImage={content.backgroundImage}
          onUpload={(file) => {
            // In real implementation, upload to server and get URL
            const url = URL.createObjectURL(file)
            onChange({ ...content, backgroundImage: url })
          }}
          onRemove={() => onChange({ ...content, backgroundImage: undefined })}
        />
      </div>
    </Card>
  )
}
