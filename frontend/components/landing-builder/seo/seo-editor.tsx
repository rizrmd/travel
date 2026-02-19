"use client"

import * as React from "react"
import { Search, FileText, Image as ImageIcon, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadEditor } from "@/components/landing-builder/editor/content-editor"
import { cn } from "@/lib/utils"

export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}

interface SEOEditorProps {
  value: SEOData
  onChange: (value: SEOData) => void
  className?: string
}

export function SEOEditor({ value, onChange, className }: SEOEditorProps) {
  const [keywordInput, setKeywordInput] = React.useState("")

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault()
      if (!value.keywords.includes(keywordInput.trim())) {
        onChange({
          ...value,
          keywords: [...value.keywords, keywordInput.trim()],
        })
      }
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    onChange({
      ...value,
      keywords: value.keywords.filter((k) => k !== keyword),
    })
  }

  return (
    <Card className={cn("p-24", className)}>
      <div className="flex items-center gap-12 mb-24">
        <Search className="h-20 w-20 text-blue-600" />
        <div>
          <h3 className="font-display font-semibold text-slate-900">
            SEO & Meta Tags
          </h3>
          <p className="text-body-sm text-slate-600">
            Optimalkan landing page untuk mesin pencari
          </p>
        </div>
      </div>

      <div className="space-y-24">
        {/* Meta Title */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Label className="text-body-sm font-medium text-slate-900">
              Meta Title <span className="text-red-600">*</span>
            </Label>
            <span className="text-caption text-slate-500">
              {value.title.length} / 60
            </span>
          </div>
          <Input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="Umroh Terpercaya & Amanah | Nama Travel"
            maxLength={60}
          />
          <p className="text-caption text-slate-500">
            Judul yang muncul di hasil pencarian Google (optimal: 50-60 karakter)
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Label className="text-body-sm font-medium text-slate-900">
              Meta Description <span className="text-red-600">*</span>
            </Label>
            <span className="text-caption text-slate-500">
              {value.description.length} / 160
            </span>
          </div>
          <Textarea
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Wujudkan impian ibadah umroh Anda bersama kami. Paket lengkap, harga terjangkau, pelayanan terbaik. Daftar sekarang!"
            maxLength={160}
            rows={3}
          />
          <p className="text-caption text-slate-500">
            Deskripsi singkat yang muncul di hasil pencarian (optimal: 150-160 karakter)
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-8">
          <Label className="text-body-sm font-medium text-slate-900">
            Keywords (Kata Kunci)
          </Label>
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleAddKeyword}
            placeholder="Ketik kata kunci dan tekan Enter"
          />
          {value.keywords.length > 0 && (
            <div className="flex flex-wrap gap-8">
              {value.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-4 px-8 py-4 bg-blue-50 text-blue-700 rounded text-caption"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-caption text-slate-500">
            Contoh: umroh, paket umroh, travel umroh, haji umroh
          </p>
        </div>

        {/* OG Image */}
        <ImageUploadEditor
          label="Open Graph Image"
          currentImage={value.ogImage}
          onUpload={(file) => {
            const url = URL.createObjectURL(file)
            onChange({ ...value, ogImage: url })
          }}
          onRemove={() => onChange({ ...value, ogImage: undefined })}
        />
        <p className="text-caption text-slate-500">
          Gambar yang muncul saat link dibagikan di media sosial (rekomendasi: 1200x630px)
        </p>

        {/* Canonical URL */}
        <div className="space-y-8">
          <Label className="text-body-sm font-medium text-slate-900">
            Canonical URL (Opsional)
          </Label>
          <Input
            value={value.canonical || ""}
            onChange={(e) => onChange({ ...value, canonical: e.target.value })}
            placeholder="https://example.com/umroh"
            type="url"
          />
          <p className="text-caption text-slate-500">
            URL utama untuk halaman ini (untuk menghindari konten duplikat)
          </p>
        </div>

        {/* Preview */}
        <div className="pt-16 border-t space-y-12">
          <h4 className="text-body-sm font-medium text-slate-900">
            Preview Hasil Pencarian Google
          </h4>
          <div className="p-16 bg-slate-50 rounded-lg">
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {value.canonical || "https://example.umroh.id"}
              </p>
              <h5 className="text-lg text-blue-600 hover:underline cursor-pointer">
                {value.title || "Judul halaman akan muncul di sini"}
              </h5>
              <p className="text-body-sm text-slate-700">
                {value.description || "Deskripsi halaman akan muncul di sini..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
