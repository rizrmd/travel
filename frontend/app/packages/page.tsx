"use client"

import { useMemo, useState } from "react"
import { Search, Plus, Eye, Edit, Power, PowerOff, UserPlus } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { mockPackages, getPackageStats, PackageStatus } from "@/lib/data/mock-packages"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { toast } from "sonner"
import { adminMenuItems } from "@/lib/navigation/menu-items"

function PackageStatusBadge({ status }: { status: PackageStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'
      )}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  )
}

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'all'>('all')

  const stats = useMemo(() => getPackageStats(), [])

  const filteredPackages = useMemo(() => {
    let result = mockPackages

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [statusFilter, searchQuery])

  const handleNotificationClick = () => { } // console.log('Navigate to /notifications')
  const handleProfileClick = () => { } // console.log('Navigate to /profile')
  const handleSettingsClick = () => toast.info('Navigasi ke Settings')
  const handleLogoutClick = () => {
    // console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  const handleAddPackage = () => {
    window.location.href = '/packages/create'
  }

  const handleViewPackage = (id: string) => {
    // console.log('View package:', id)
    toast.info('Fitur detail paket segera hadir')
  }

  const handleEditPackage = (id: string) => {
    window.location.href = `/packages/${id}/edit`
  }

  const handleAssignAgents = (id: string) => {
    window.location.href = `/packages/${id}/assign-agents`
  }

  const handleToggleStatus = (id: string, currentStatus: PackageStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    // console.log(`Toggle package ${id} to ${newStatus}`)
    toast.success(`Paket berhasil di${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}`)
  }

  return (
    <AppLayout
      notificationCount={3}
      breadcrumbs={[
        { label: "Paket Umroh", href: "/packages", isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Manajemen Paket Umroh
            </h1>
            <p className="mt-8 text-slate-600">
              Kelola paket-paket umroh yang tersedia
            </p>
          </div>
          <Button onClick={handleAddPackage} className="flex items-center gap-2 h-[40px]">
            <Plus className="h-[16px] w-[16px]" />
            Tambah Paket Baru
          </Button>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Paket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-700">Paket Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-700">Paket Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">{stats.inactive}</div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
          <div className="relative flex-1">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-36"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: PackageStatus | 'all') => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Package Table */}
        <section>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead className="text-right">Harga Retail</TableHead>
                  <TableHead className="text-right">Harga Wholesale</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg, index) => (
                    <TableRow
                      key={pkg.id}
                      className={cn(
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                        'hover:bg-slate-100 transition-colors'
                      )}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{pkg.name}</div>
                          <div className="text-sm text-slate-500 mt-2">{pkg.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{pkg.duration}</TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        {formatCurrency(pkg.priceRetail)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-700">
                        {formatCurrency(pkg.priceWholesale)}
                      </TableCell>
                      <TableCell>
                        <PackageStatusBadge status={pkg.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPackage(pkg.id)}
                            className="h-[32px]"
                          >
                            <Eye className="h-[16px] w-[16px]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPackage(pkg.id)}
                            className="h-[32px]"
                          >
                            <Edit className="h-[16px] w-[16px]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignAgents(pkg.id)}
                            className="h-[32px] text-blue-600"
                          >
                            <UserPlus className="h-[16px] w-[16px]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(pkg.id, pkg.status)}
                            className={cn(
                              "h-[32px]",
                              pkg.status === 'active' ? 'text-red-600' : 'text-green-600'
                            )}
                          >
                            {pkg.status === 'active' ? (
                              <PowerOff className="h-[16px] w-[16px]" />
                            ) : (
                              <Power className="h-[16px] w-[16px]" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Tidak ada paket ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
