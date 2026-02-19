"use client"

import * as React from "react"
import { Package, Plus, Trash2, GripVertical } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PackageData {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  isPopular?: boolean
}

interface PackageEditorProps {
  packages: PackageData[]
  onChange: (packages: PackageData[]) => void
}

export function PackageEditor({ packages, onChange }: PackageEditorProps) {
  const [editingPackage, setEditingPackage] = React.useState<string | null>(null)

  const addPackage = () => {
    const newPackage: PackageData = {
      id: `pkg-${Date.now()}`,
      name: "Paket Baru",
      price: 15000000,
      duration: "9 hari",
      features: ["Hotel bintang 4", "Makan 3x sehari", "Tour guide"],
      isPopular: false,
    }
    onChange([...packages, newPackage])
    setEditingPackage(newPackage.id)
  }

  const updatePackage = (id: string, updates: Partial<PackageData>) => {
    onChange(
      packages.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    )
  }

  const deletePackage = (id: string) => {
    onChange(packages.filter((pkg) => pkg.id !== id))
  }

  const addFeature = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId)
    if (pkg) {
      updatePackage(packageId, {
        features: [...pkg.features, "Fitur baru"],
      })
    }
  }

  const updateFeature = (packageId: string, featureIndex: number, value: string) => {
    const pkg = packages.find((p) => p.id === packageId)
    if (pkg) {
      const newFeatures = [...pkg.features]
      newFeatures[featureIndex] = value
      updatePackage(packageId, { features: newFeatures })
    }
  }

  const deleteFeature = (packageId: string, featureIndex: number) => {
    const pkg = packages.find((p) => p.id === packageId)
    if (pkg) {
      updatePackage(packageId, {
        features: pkg.features.filter((_, i) => i !== featureIndex),
      })
    }
  }

  return (
    <Card className="p-24">
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-12">
          <Package className="h-20 w-20 text-blue-600" />
          <h3 className="font-display font-semibold text-slate-900">Paket Umroh</h3>
        </div>
        <Button size="sm" onClick={addPackage}>
          <Plus className="h-16 w-16 mr-8" />
          Tambah Paket
        </Button>
      </div>

      <div className="space-y-16">
        {packages.map((pkg, index) => {
          const isEditing = editingPackage === pkg.id

          return (
            <Card
              key={pkg.id}
              className={cn(
                "p-16 border-2 transition-all",
                isEditing ? "border-blue-400 bg-blue-50/30" : "border-slate-200"
              )}
            >
              <div className="flex items-start gap-12 mb-12">
                <GripVertical className="h-20 w-20 text-slate-400 mt-8 cursor-move" />

                <div className="flex-1 space-y-12">
                  {/* Package Header */}
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 space-y-8">
                      <Input
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(pkg.id, { name: e.target.value })
                        }
                        className="font-medium"
                        placeholder="Nama paket"
                      />
                      <div className="flex items-center gap-8">
                        <label className="flex items-center gap-8 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pkg.isPopular}
                            onChange={(e) =>
                              updatePackage(pkg.id, {
                                isPopular: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          <span className="text-body-sm text-slate-700">
                            Tandai sebagai populer
                          </span>
                        </label>
                        {pkg.isPopular && (
                          <Badge variant="default">Paling Populer</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePackage(pkg.id)}
                    >
                      <Trash2 className="h-16 w-16 text-red-600" />
                    </Button>
                  </div>

                  {/* Price and Duration */}
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <Label className="text-caption">Harga (Rp)</Label>
                      <Input
                        type="number"
                        value={pkg.price}
                        onChange={(e) =>
                          updatePackage(pkg.id, {
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="15000000"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-caption">Durasi</Label>
                      <Input
                        value={pkg.duration}
                        onChange={(e) =>
                          updatePackage(pkg.id, { duration: e.target.value })
                        }
                        placeholder="9 hari"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <Label className="text-caption">Fitur Paket</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addFeature(pkg.id)}
                      >
                        <Plus className="h-14 w-14 mr-4" />
                        Tambah Fitur
                      </Button>
                    </div>
                    <div className="space-y-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-8">
                          <Input
                            value={feature}
                            onChange={(e) =>
                              updateFeature(pkg.id, featureIndex, e.target.value)
                            }
                            placeholder="Fitur paket"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFeature(pkg.id, featureIndex)}
                          >
                            <Trash2 className="h-14 w-14 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}

        {packages.length === 0 && (
          <div className="text-center py-32 text-slate-500">
            <Package className="h-48 w-48 mx-auto mb-8 opacity-50" />
            <p className="text-body-sm">Belum ada paket. Klik tombol Tambah Paket untuk memulai.</p>
          </div>
        )}
      </div>
    </Card>
  )
}
