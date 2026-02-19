"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Users, FileText, AlertTriangle, TrendingUp, UserPlus, Upload, DollarSign, Clock } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  mockDashboardKPIs,
  mockRecentActivities,
  formatCurrency,
  formatRelativeTime,
  Activity
} from "@/lib/data/mock-dashboard"
import { adminMenuItems } from "@/lib/navigation/menu-items"
import { toast } from "sonner"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

function ActivityIcon({ type }: { type: Activity['type'] }) {
  const iconClass = "h-[16px] w-[16px]"

  switch (type) {
    case 'jamaah_added':
      return <UserPlus className={cn(iconClass, "text-blue-600")} />
    case 'document_uploaded':
      return <Upload className={cn(iconClass, "text-purple-600")} />
    case 'payment_received':
      return <DollarSign className={cn(iconClass, "text-green-600")} />
    case 'jamaah_completed':
      return <Users className={cn(iconClass, "text-emerald-600")} />
    default:
      return <Clock className={cn(iconClass, "text-slate-600")} />
  }
}

export default function DashboardPage() {
  const kpis = useMemo(() => mockDashboardKPIs, [])
  const activities = useMemo(() => mockRecentActivities, [])

  const handleNotificationClick = () => {
    console.log('Navigate to /notifications')
  }

  const handleProfileClick = () => {
    console.log('Navigate to /profile')
  }

  const handleSettingsClick = () => {
    toast.info('Navigasi ke Settings')
  }

  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  return (
    <AppLayout
      userName="Mbak Rina"
      userRole="Admin Travel"
      notificationCount={3}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", isCurrentPage: true },
      ]}
      menuItems={adminMenuItems}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-32">
        {/* Header with Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            {getGreeting()}, Mbak Rina!
          </h1>
          <p className="mt-8 text-slate-600">
            Berikut ringkasan bisnis umroh Anda hari ini
          </p>
        </div>

        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
            {/* Total Jamaah */}
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Jamaah
                </CardTitle>
                <Users className="h-[20px] w-[20px] text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{kpis.totalJamaah}</div>
                <p className="text-xs text-slate-600 mt-4">Jamaah terdaftar</p>
              </CardContent>
            </Card>

            {/* Pending Documents */}
            <Card className={cn(
              "border-slate-200 hover:shadow-md transition-shadow",
              kpis.pendingDocuments > 0 && "border-red-300 bg-red-50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  kpis.pendingDocuments > 0 ? "text-red-700" : "text-slate-600"
                )}>
                  Dokumen Pending
                </CardTitle>
                <FileText className={cn(
                  "h-[20px] w-[20px]",
                  kpis.pendingDocuments > 0 ? "text-red-600" : "text-purple-600"
                )} />
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-3xl font-bold",
                  kpis.pendingDocuments > 0 ? "text-red-700" : "text-slate-900"
                )}>
                  {kpis.pendingDocuments}
                </div>
                <p className={cn(
                  "text-xs mt-4",
                  kpis.pendingDocuments > 0 ? "text-red-600" : "text-slate-600"
                )}>
                  {kpis.pendingDocuments > 0 ? "Perlu direview" : "Semua lengkap"}
                </p>
              </CardContent>
            </Card>

            {/* Overdue Payments */}
            <Card className={cn(
              "border-slate-200 hover:shadow-md transition-shadow",
              kpis.overduePayments > 0 && "border-red-300 bg-red-50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  kpis.overduePayments > 0 ? "text-red-700" : "text-slate-600"
                )}>
                  Pembayaran Tertunggak
                </CardTitle>
                <AlertTriangle className={cn(
                  "h-[20px] w-[20px]",
                  kpis.overduePayments > 0 ? "text-red-600" : "text-orange-600"
                )} />
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-3xl font-bold",
                  kpis.overduePayments > 0 ? "text-red-700" : "text-slate-900"
                )}>
                  {kpis.overduePayments}
                </div>
                <p className={cn(
                  "text-xs mt-4",
                  kpis.overduePayments > 0 ? "text-red-600" : "text-slate-600"
                )}>
                  {kpis.overduePayments > 0 ? "Perlu tindak lanjut" : "Semua lancar"}
                </p>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card className="border-slate-200 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle className="text-sm font-medium text-green-700">
                  Pendapatan Bulan Ini
                </CardTitle>
                <TrendingUp className="h-[20px] w-[20px] text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-green-700">
                  {formatCurrency(kpis.monthRevenue)}
                </div>
                <p className="text-xs text-green-600 mt-4">Desember 2025</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions & Recent Activities */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-12">
              <Link href="/jamaah">
                <Button
                  variant="outline"
                  className="w-full justify-start h-[48px] text-left"
                >
                  <UserPlus className="h-[20px] w-[20px] mr-12" />
                  <div className="flex-1">
                    <div className="font-medium">Tambah Jamaah Baru</div>
                    <div className="text-xs text-slate-500">Daftarkan jamaah baru</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dokumen">
                <Button
                  variant="outline"
                  className="w-full justify-start h-[48px] text-left"
                >
                  <Upload className="h-[20px] w-[20px] mr-12" />
                  <div className="flex-1">
                    <div className="font-medium">Upload Dokumen</div>
                    <div className="text-xs text-slate-500">Kelola dokumen jamaah</div>
                  </div>
                </Button>
              </Link>

              <Link href="/payments">
                <Button
                  variant="outline"
                  className="w-full justify-start h-[48px] text-left"
                >
                  <DollarSign className="h-[20px] w-[20px] mr-12" />
                  <div className="flex-1">
                    <div className="font-medium">Catat Pembayaran</div>
                    <div className="text-xs text-slate-500">Rekam pembayaran baru</div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Aktivitas Terkini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-12 pb-16 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-slate-100 flex items-center justify-center">
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-8">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-2">
                            {activity.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs text-slate-500 flex-shrink-0">
                          {formatRelativeTime(activity.timestamp)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activities.length === 0 && (
                <div className="text-center py-32 text-slate-500">
                  <Clock className="h-[48px] w-[48px] mx-auto mb-12 text-slate-300" />
                  <p>Belum ada aktivitas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  )
}
