"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Save } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { getPackageById } from "@/lib/data/mock-packages"
import { ItineraryBuilder, type ItineraryDay } from "@/components/packages/itinerary-builder"
import { InclusionsExclusionsEditor } from "@/components/packages/inclusions-exclusions-editor"
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

export default function EditPackagePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const packageId = params.id

  // Load package data
  const packageData = getPackageById(packageId)

  const [formData, setFormData] = useState({
    name: packageData?.name || '',
    slug: packageData?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
    duration: packageData?.duration || '',
    priceRetail: packageData?.priceRetail.toString() || '',
    priceWholesale: packageData?.priceWholesale.toString() || '',
    description: packageData?.description || '',
    status: (packageData?.status || 'draft') as 'active' | 'inactive' | 'draft',
  })

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(packageData?.itinerary || [])
  const [inclusions, setInclusions] = useState<string[]>(packageData?.inclusions || [])
  const [exclusions, setExclusions] = useState<string[]>(packageData?.exclusions || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Redirect if package not found
  useEffect(() => {
    if (!packageData) {
      toast.error('Paket tidak ditemukan')
      router.push('/packages')
    }
  }, [packageData, router])

  if (!packageData) {
    return null
  }

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
        setActiveTab('basic')
        return
      }

      if (margin < 0) {
        toast.error('Margin tidak boleh negatif')
        setActiveTab('basic')
        return
      }

      // TODO: Replace with actual API call
      console.log('Updating package:', {
        id: packageId,
        ...formData,
        priceRetail,
        priceWholesale,
        margin,
        itinerary,
        inclusions,
        exclusions,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Paket berhasil diupdate!')
      router.push('/packages')
    } catch (error) {
      toast.error('Gagal mengupdate paket. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/packages')
  }

  return (
    <AppLayout
      menuItems={adminMenuItems}
      userName="Mbak Rina"
      userRole="Admin Travel"
      breadcrumbs={[
        { label: "Paket Umroh", href: "/packages" },
        { label: packageData.name, href: `/packages/${packageId}`, isCurrentPage: true },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                Edit Paket: {packageData.name}
              </h1>
              <p className="mt-8 text-slate-600">
                Update informasi paket umroh
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-8"
          >
            <Save className="h-16 w-16" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-24 mt-24">
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
                <CardTitle>Penetapan Harga (Dual Pricing)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Retail Price */}
                  <div className="p-16 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-12">
                    <Label htmlFor="priceRetail" className="text-blue-900 font-semibold">
                      Harga Retail (Public) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="priceRetail"
                      type="number"
                      value={formData.priceRetail}
                      onChange={(e) => setFormData({ ...formData, priceRetail: e.target.value })}
                      className="text-lg font-semibold"
                      required
                    />
                    <p className="text-sm text-blue-700">
                      {priceRetail > 0 ? formatCurrency(priceRetail) : 'Rp 0'}
                    </p>
                  </div>

                  {/* Wholesale Price */}
                  <div className="p-16 bg-green-50 border-2 border-green-200 rounded-lg space-y-12">
                    <Label htmlFor="priceWholesale" className="text-green-900 font-semibold">
                      Harga Wholesale (Agent) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="priceWholesale"
                      type="number"
                      value={formData.priceWholesale}
                      onChange={(e) => setFormData({ ...formData, priceWholesale: e.target.value })}
                      className="text-lg font-semibold"
                      required
                    />
                    <p className="text-sm text-green-700">
                      {priceWholesale > 0 ? formatCurrency(priceWholesale) : 'Rp 0'}
                    </p>
                  </div>
                </div>

                {/* Margin */}
                {priceRetail > 0 && priceWholesale > 0 && (
                  <div className="mt-16 p-16 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Margin Agency:</span>
                      <span className={cn(
                        "text-xl font-bold",
                        margin >= 0 ? "text-green-700" : "text-red-700"
                      )}>
                        {formatCurrency(margin)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Commission Preview */}
            {priceRetail > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Komisi per Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-12">
                    {tierStructure.map((tier) => {
                      const commission = priceRetail * (tier.commissionRate / 100)
                      return (
                        <div
                          key={tier.tier}
                          className="flex items-center justify-between p-12 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{tier.tier} ({tier.commissionRate}%)</p>
                          </div>
                          <p className="text-lg font-bold">{formatCurrency(commission)}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-24 mt-24">
            <Card>
              <CardHeader>
                <CardTitle>Itinerary Perjalanan</CardTitle>
                <p className="text-sm text-slate-600 mt-8">
                  Susun jadwal perjalanan hari demi hari untuk paket ini
                </p>
              </CardHeader>
              <CardContent>
                <ItineraryBuilder
                  value={itinerary}
                  onChange={setItinerary}
                  maxDays={30}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-24 mt-24">
            <Card>
              <CardHeader>
                <CardTitle>Inclusions & Exclusions</CardTitle>
                <p className="text-sm text-slate-600 mt-8">
                  Atur fasilitas yang termasuk dan tidak termasuk dalam paket
                </p>
              </CardHeader>
              <CardContent>
                <InclusionsExclusionsEditor
                  inclusions={inclusions}
                  exclusions={exclusions}
                  onInclusionsChange={setInclusions}
                  onExclusionsChange={setExclusions}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-12 pt-24 border-t sticky bottom-0 bg-white py-16 -mx-16 px-16">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-8"
          >
            <Save className="h-16 w-16" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
