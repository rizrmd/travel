"use client"

import { useState } from "react"
import { Plus, X, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InclusionsExclusionsEditorProps {
  inclusions: string[]
  exclusions: string[]
  onInclusionsChange: (inclusions: string[]) => void
  onExclusionsChange: (exclusions: string[]) => void
}

// Common templates for quick start
const templates = {
  standard: {
    name: 'Standard Umroh',
    inclusions: [
      'Tiket pesawat PP Jakarta-Jeddah',
      'Hotel bintang 4 di Madinah (walking distance)',
      'Hotel bintang 4 di Makkah (walking distance)',
      'Makan 3x sehari',
      'Transportasi AC',
      'Perlengkapan umroh',
      'Manasik umroh',
      'Tour leader berpengalaman',
      'Air Zam-zam 5 liter',
    ],
    exclusions: [
      'Biaya passport dan visa',
      'Pengeluaran pribadi',
      'Asuransi perjalanan',
      'Tips guide lokal',
      'Excess baggage',
    ],
  },
  vip: {
    name: 'VIP Umroh',
    inclusions: [
      'Tiket pesawat business class PP Jakarta-Jeddah',
      'Hotel bintang 5 di Madinah (view Masjid Nabawi)',
      'Hotel bintang 5 di Makkah (view Masjidil Haram)',
      'Makan 4x sehari di restoran premium',
      'Transportasi VIP',
      'Perlengkapan umroh premium',
      'Manasik umroh private',
      'Tour leader dan mutawif berpengalaman',
      'Air Zam-zam 10 liter',
      'Asuransi perjalanan',
      'Tas dan koper berkualitas',
    ],
    exclusions: [
      'Biaya passport dan visa',
      'Pengeluaran pribadi',
      'Tips guide lokal',
    ],
  },
  plus: {
    name: 'Umroh Plus',
    inclusions: [
      'Tiket pesawat PP via transit',
      'Hotel bintang 4 di negara transit',
      'Hotel bintang 4 di Madinah & Makkah',
      'Makan 3x sehari',
      'Tour wisata di negara transit',
      'Transportasi AC',
      'Perlengkapan umroh',
      'Air Zam-zam 5 liter',
    ],
    exclusions: [
      'Biaya passport dan visa negara transit',
      'Pengeluaran pribadi',
      'Asuransi perjalanan',
      'Tips guide',
    ],
  },
}

export function InclusionsExclusionsEditor({
  inclusions,
  exclusions,
  onInclusionsChange,
  onExclusionsChange,
}: InclusionsExclusionsEditorProps) {
  const [newInclusion, setNewInclusion] = useState('')
  const [newExclusion, setNewExclusion] = useState('')

  const addInclusion = () => {
    if (newInclusion.trim()) {
      onInclusionsChange([...inclusions, newInclusion.trim()])
      setNewInclusion('')
    }
  }

  const removeInclusion = (index: number) => {
    onInclusionsChange(inclusions.filter((_, i) => i !== index))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      onExclusionsChange([...exclusions, newExclusion.trim()])
      setNewExclusion('')
    }
  }

  const removeExclusion = (index: number) => {
    onExclusionsChange(exclusions.filter((_, i) => i !== index))
  }

  const applyTemplate = (templateKey: keyof typeof templates) => {
    const template = templates[templateKey]
    onInclusionsChange(template.inclusions)
    onExclusionsChange(template.exclusions)
  }

  const handleInclusionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addInclusion()
    }
  }

  const handleExclusionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addExclusion()
    }
  }

  return (
    <div className="space-y-20">
      {/* Template Selector */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12">
            <div className="flex-1">
              <Label className="text-sm font-semibold text-amber-900">
                Mulai Cepat dengan Template
              </Label>
              <p className="text-xs text-amber-700 mt-4">
                Pilih template untuk mengisi inclusions & exclusions secara otomatis
              </p>
            </div>
            <Select onValueChange={(value) => applyTemplate(value as keyof typeof templates)}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <SelectValue placeholder="Pilih Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Umroh</SelectItem>
                <SelectItem value="vip">VIP Umroh</SelectItem>
                <SelectItem value="plus">Umroh Plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Inclusions */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-8">
                <Check className="h-20 w-20 text-green-600" />
                Inclusions (Termasuk)
              </CardTitle>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                {inclusions.length} item
              </Badge>
            </div>
            <p className="text-sm text-green-700 mt-8">
              Fasilitas yang sudah termasuk dalam paket
            </p>
          </CardHeader>
          <CardContent className="pt-20 space-y-16">
            {/* Add New Inclusion */}
            <div className="space-y-8">
              <Label htmlFor="new-inclusion" className="text-sm">
                Tambah Item Baru
              </Label>
              <div className="flex gap-8">
                <Input
                  id="new-inclusion"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  onKeyPress={handleInclusionKeyPress}
                  placeholder="e.g., Tiket pesawat PP Jakarta-Jeddah"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addInclusion}
                  disabled={!newInclusion.trim()}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-16 w-16" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Tekan Enter atau klik tombol + untuk menambah
              </p>
            </div>

            {/* Inclusions List */}
            <div className="space-y-8">
              {inclusions.length > 0 ? (
                <div className="space-y-8">
                  {inclusions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-8 p-12 bg-green-50 rounded-lg border border-green-100 hover:border-green-300 transition-colors group"
                    >
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-20 h-20 rounded-full bg-green-200 text-green-700 flex items-center justify-center">
                          <Check className="h-12 w-12" />
                        </div>
                      </div>
                      <p className="flex-1 text-sm text-slate-900 py-2">{item}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInclusion(index)}
                        className="h-28 w-28 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-14 w-14" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-32 text-center border-2 border-dashed border-green-200 rounded-lg bg-green-50/50">
                  <Check className="h-32 w-32 text-green-300 mx-auto mb-8" />
                  <p className="text-sm text-green-600">
                    Belum ada inclusions
                  </p>
                  <p className="text-xs text-green-500 mt-4">
                    Tambahkan item yang termasuk dalam paket
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-8">
                <X className="h-20 w-20 text-red-600" />
                Exclusions (Tidak Termasuk)
              </CardTitle>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                {exclusions.length} item
              </Badge>
            </div>
            <p className="text-sm text-red-700 mt-8">
              Fasilitas yang tidak termasuk dalam paket
            </p>
          </CardHeader>
          <CardContent className="pt-20 space-y-16">
            {/* Add New Exclusion */}
            <div className="space-y-8">
              <Label htmlFor="new-exclusion" className="text-sm">
                Tambah Item Baru
              </Label>
              <div className="flex gap-8">
                <Input
                  id="new-exclusion"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  onKeyPress={handleExclusionKeyPress}
                  placeholder="e.g., Biaya passport dan visa"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addExclusion}
                  disabled={!newExclusion.trim()}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-16 w-16" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Tekan Enter atau klik tombol + untuk menambah
              </p>
            </div>

            {/* Exclusions List */}
            <div className="space-y-8">
              {exclusions.length > 0 ? (
                <div className="space-y-8">
                  {exclusions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-8 p-12 bg-red-50 rounded-lg border border-red-100 hover:border-red-300 transition-colors group"
                    >
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-20 h-20 rounded-full bg-red-200 text-red-700 flex items-center justify-center">
                          <X className="h-12 w-12" />
                        </div>
                      </div>
                      <p className="flex-1 text-sm text-slate-900 py-2">{item}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExclusion(index)}
                        className="h-28 w-28 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-14 w-14" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-32 text-center border-2 border-dashed border-red-200 rounded-lg bg-red-50/50">
                  <X className="h-32 w-32 text-red-300 mx-auto mb-8" />
                  <p className="text-sm text-red-600">
                    Belum ada exclusions
                  </p>
                  <p className="text-xs text-red-500 mt-4">
                    Tambahkan item yang tidak termasuk dalam paket
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {(inclusions.length > 0 || exclusions.length > 0) && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-16">
            <div className="text-sm text-slate-700">
              <p className="font-semibold mb-8">Ringkasan:</p>
              <div className="flex gap-24">
                <div>
                  <span className="text-green-600 font-medium">✓ {inclusions.length}</span>
                  <span className="text-slate-600 ml-4">Termasuk</span>
                </div>
                <div>
                  <span className="text-red-600 font-medium">✗ {exclusions.length}</span>
                  <span className="text-slate-600 ml-4">Tidak Termasuk</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
