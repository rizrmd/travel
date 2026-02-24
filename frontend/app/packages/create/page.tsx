"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Info } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { adminMenuItems } from "@/lib/navigation/menu-items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { cn } from "@/lib/utils"

interface CommissionTier {
  tier: string
  commissionRate: number
  minJamaah: number
  maxJamaah?: number
}

const tierStructure: CommissionTier[] = [
  { tier: 'Silver', commissionRate: 4, minJamaah: 0, maxJamaah: 19 },
  { tier: 'Gold', commissionRate: 6, minJamaah: 20, maxJamaah: 49 },
  { tier: 'Platinum', commissionRate: 8, minJamaah: 50 },
]

export default function CreatePackagePage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    duration: '',
    priceRetail: '',
    priceWholesale: '',
    description: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }))
  }

  // Calculate margin and commissions
  const priceRetail = parseFloat(formData.priceRetail) || 0
  const priceWholesale = parseFloat(formData.priceWholesale) || 0
  const margin = priceRetail - priceWholesale

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate pricing
      if (priceWholesale >= priceRetail) {
        toast.error('Harga wholesale harus lebih kecil dari harga retail')
        return
      }

      if (margin < 0) {
        toast.error('Margin tidak boleh negatif')
        return
      }

      // TODO: Replace with actual API call
      console.log('Creating package:', {
        ...formData,
        priceRetail,
        priceWholesale,
        margin,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Paket berhasil dibuat!')
      router.push('/packages')
    } catch (error) {
      toast.error('Gagal membuat paket. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/packages')
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Paket Umroh", href: "/packages" },
        { label: "Buat Paket Baru", href: "/packages/create", isCurrentPage: true },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Header */}
        <div className="flex items-center gap-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-8"
          >
            <ArrowLeft className="h-16 w-16" />
            Kembali
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Buat Paket Umroh Baru
            </h1>
            <p className="mt-8 text-slate-600">
              Isi informasi paket umroh yang akan ditawarkan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-24">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-8">
                <Package className="h-20 w-20" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-20">
              {/* Name */}
              <div className="space-y-8">
                <Label htmlFor="name">
                  Nama Paket <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Umroh Reguler 9 Hari"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-8">
                <Label htmlFor="slug">
                  URL Slug
                  <span className="text-xs text-slate-500 ml-8">(Auto-generated)</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="umroh-reguler-9-hari"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-slate-500">
                  Preview URL: /lp/[agent-name]/{formData.slug || 'package-slug'}
                </p>
              </div>

              {/* Duration */}
              <div className="space-y-8">
                <Label htmlFor="duration">
                  Durasi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 9 Hari 7 Malam"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-8">
                <Label htmlFor="description">
                  Deskripsi Paket <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang paket umroh ini..."
                  rows={4}
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-8">
                <Label htmlFor="status">
                  Status Paket <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'draft') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dual Pricing */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-8">
                  Penetapan Harga (Dual Pricing)
                </CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  Critical
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mt-8">
                <Info className="inline h-14 w-14 mr-4" />
                Harga retail untuk customer, harga wholesale untuk agent
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Retail Price */}
                <div className="p-16 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-12">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="priceRetail" className="text-blue-900 font-semibold">
                      Harga Retail (Public) <span className="text-red-500">*</span>
                    </Label>
                    <Badge className="bg-blue-600">Customer</Badge>
                  </div>
                  <Input
                    id="priceRetail"
                    type="number"
                    value={formData.priceRetail}
                    onChange={(e) => setFormData({ ...formData, priceRetail: e.target.value })}
                    placeholder="35000000"
                    className="text-lg font-semibold"
                    required
                  />
                  <p className="text-sm text-blue-700">
                    {priceRetail > 0 ? formatCurrency(priceRetail) : 'Rp 0'}
                  </p>
                  <p className="text-xs text-blue-600">
                    💡 Harga ini yang akan tampil di landing page public
                  </p>
                </div>

                {/* Wholesale Price */}
                <div className="p-16 bg-green-50 border-2 border-green-200 rounded-lg space-y-12">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="priceWholesale" className="text-green-900 font-semibold">
                      Harga Wholesale (Agent) <span className="text-red-500">*</span>
                    </Label>
                    <Badge className="bg-green-600">Agent Only</Badge>
                  </div>
                  <Input
                    id="priceWholesale"
                    type="number"
                    value={formData.priceWholesale}
                    onChange={(e) => setFormData({ ...formData, priceWholesale: e.target.value })}
                    placeholder="32000000"
                    className="text-lg font-semibold"
                    required
                  />
                  <p className="text-sm text-green-700">
                    {priceWholesale > 0 ? formatCurrency(priceWholesale) : 'Rp 0'}
                  </p>
                  <p className="text-xs text-green-600">
                    🔒 Harga ini hanya tampil untuk agent (tidak public)
                  </p>
                </div>
              </div>

              {/* Margin Calculation */}
              {priceRetail > 0 && priceWholesale > 0 && (
                <div className="mt-16 p-16 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-semibold text-slate-700">Margin Agency:</span>
                    <span className={cn(
                      "text-xl font-bold",
                      margin >= 0 ? "text-green-700" : "text-red-700"
                    )}>
                      {formatCurrency(margin)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Margin = Retail - Wholesale (profit agency sebelum komisi agent)
                  </p>
                  {margin < 0 && (
                    <p className="text-xs text-red-600 mt-8">
                      ⚠️ Warning: Margin negatif! Harga wholesale tidak boleh lebih tinggi dari retail.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Preview */}
          {priceRetail > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Komisi per Tier</CardTitle>
                <p className="text-sm text-slate-600 mt-8">
                  Komisi dihitung dari harga retail (bukan wholesale)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-12">
                  {tierStructure.map((tier) => {
                    const commission = priceRetail * (tier.commissionRate / 100)
                    return (
                      <div
                        key={tier.tier}
                        className="flex items-center justify-between p-12 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-12">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-semibold",
                              tier.tier === 'Silver' && "bg-slate-200 text-slate-800",
                              tier.tier === 'Gold' && "bg-yellow-200 text-yellow-900",
                              tier.tier === 'Platinum' && "bg-purple-200 text-purple-900"
                            )}
                          >
                            {tier.tier}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {tier.commissionRate}% commission
                            </p>
                            <p className="text-xs text-slate-500">
                              {tier.minJamaah} - {tier.maxJamaah ? tier.maxJamaah : '∞'} jamaah
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            {formatCurrency(commission)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(priceRetail)} × {tier.commissionRate}%
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-16 p-12 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Catatan:</strong> Komisi agent dihitung dari harga retail (Rp {formatCurrency(priceRetail)}),
                    bukan dari wholesale. Ini memastikan agent mendapat komisi yang adil dari harga jual ke customer.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-12 pt-24 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.priceRetail || !formData.priceWholesale}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Paket'}
            </Button>
          </div>
        </form>

        {/* Info Card */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-16">
            <div className="flex gap-12">
              <Info className="h-20 w-20 text-amber-600 flex-shrink-0 mt-2" />
              <div className="text-sm text-amber-900 space-y-8">
                <p className="font-semibold">Langkah Selanjutnya:</p>
                <ol className="list-decimal list-inside space-y-4 text-amber-800">
                  <li>Setelah menyimpan paket dasar, Anda bisa menambahkan itinerary detail</li>
                  <li>Atur inclusions & exclusions paket</li>
                  <li>Assign paket ini ke agent-agent tertentu</li>
                  <li>Agent akan otomatis menerima notifikasi paket baru</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
