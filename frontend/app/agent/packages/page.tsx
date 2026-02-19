"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Eye, Plus } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { agentMenuItems } from "@/lib/navigation/menu-items"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockPackages, type PackageStatus } from "@/lib/data/mock-packages"
import { getAssignedPackages } from "@/lib/data/mock-package-assignments"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mock current agent data
const CURRENT_AGENT_ID = 'agent-1' // Ibu Siti
const CURRENT_AGENT_TIER = {
  tier: 'Silver',
  commissionRate: 4,
  minJamaah: 0,
  maxJamaah: 19,
  jamaahCount: 12,
}

export default function AgentPackagesPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'all'>('all')

  // Get packages assigned to current agent
  const assignedPackageIds = getAssignedPackages(CURRENT_AGENT_ID)

  const assignedPackages = useMemo(() => {
    let result = mockPackages.filter(pkg => assignedPackageIds.includes(pkg.id))

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    return result
  }, [assignedPackageIds, statusFilter])

  const handleViewDetails = (packageId: string) => {
    toast.info('Fitur detail paket segera hadir')
    // console.log('View package:', packageId)
  }

  const handleCreateLandingPage = (packageId: string) => {
    router.push(`/agent/landing-builder/create?packageId=${packageId}`)
  }

  return (
    <AppLayout
      menuItems={agentMenuItems}
      userName="Ibu Siti"
      userRole="Agent"
      breadcrumbs={[
        { label: "Paket Tersedia", href: "/agent/packages", isCurrentPage: true },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Paket yang Dapat Anda Jual
          </h1>
          <p className="mt-8 text-slate-600">
            Paket yang sudah di-assign oleh agency untuk Anda promosikan
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <Card>
            <CardHeader className="pb-12">
              <p className="text-sm font-medium text-slate-600">Paket Tersedia</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{assignedPackages.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-12">
              <p className="text-sm font-medium text-blue-700">Tier Anda</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">{CURRENT_AGENT_TIER.tier}</p>
              <p className="text-sm text-blue-600 mt-4">
                Komisi {CURRENT_AGENT_TIER.commissionRate}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-12">
              <p className="text-sm font-medium text-green-700">Total Jamaah</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{CURRENT_AGENT_TIER.jamaahCount}</p>
              <p className="text-sm text-green-600 mt-4">
                {CURRENT_AGENT_TIER.maxJamaah - CURRENT_AGENT_TIER.jamaahCount} lagi untuk Gold
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-12">
          <Select
            value={statusFilter}
            onValueChange={(value: PackageStatus | 'all') => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Package Grid */}
        {assignedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {assignedPackages.map(pkg => {
              const commission = pkg.priceRetail * (CURRENT_AGENT_TIER.commissionRate / 100)
              const margin = pkg.priceRetail - pkg.priceWholesale

              return (
                <Card key={pkg.id} className="flex flex-col">
                  <CardHeader className="space-y-12">
                    <div className="flex items-start justify-between gap-8">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          pkg.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        {pkg.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      <Package className="h-20 w-20 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
                      <p className="text-sm text-slate-600 mt-4">{pkg.duration}</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-12">
                    {/* Wholesale Price - Agent sees this */}
                    <div className="p-12 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-medium text-green-700">
                        Harga Wholesale (Anda)
                      </p>
                      <p className="text-xl font-bold text-green-900 mt-4">
                        {formatCurrency(pkg.priceWholesale)}
                      </p>
                      <div className="mt-8 pt-8 border-t border-green-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600">
                            Komisi {CURRENT_AGENT_TIER.commissionRate}%:
                          </span>
                          <span className="font-semibold text-green-700">
                            {formatCurrency(commission)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Harga Public:</span>
                        <span className="font-medium text-slate-700">
                          {formatCurrency(pkg.priceRetail)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margin Agency:</span>
                        <span className="font-medium text-slate-700">
                          {formatCurrency(margin)}
                        </span>
                      </div>
                    </div>

                    {/* Package Description */}
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {pkg.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex gap-8 pt-12 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(pkg.id)}
                      className="flex-1"
                    >
                      <Eye className="h-14 w-14 mr-6" />
                      Detail
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCreateLandingPage(pkg.id)}
                      className="flex-1"
                      disabled={pkg.status !== 'active'}
                    >
                      <Plus className="h-14 w-14 mr-6" />
                      Buat Landing Page
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-48 text-center">
            <Package className="h-64 w-64 text-slate-300 mx-auto mb-16" />
            <h3 className="text-lg font-semibold text-slate-900 mb-8">
              Belum Ada Paket Tersedia
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Belum ada paket yang di-assign untuk Anda.
              Hubungi admin untuk mendapatkan akses paket.
            </p>
          </Card>
        )}

        {/* Info Card */}
        {assignedPackages.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-16">
              <div className="flex gap-12">
                <Package className="h-20 w-20 text-blue-600 flex-shrink-0 mt-2" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-8">Cara Menggunakan:</p>
                  <ol className="list-decimal list-inside space-y-4 text-blue-800">
                    <li>Pilih paket yang ingin Anda promosikan</li>
                    <li>Klik &quot;Buat Landing Page&quot; untuk membuat halaman promo</li>
                    <li>Bagikan link landing page ke calon jamaah</li>
                    <li>Terima komisi {CURRENT_AGENT_TIER.commissionRate}% dari setiap penjualan</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
