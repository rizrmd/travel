"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, FileText, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockJamaah } from "@/lib/data/mock-jamaah"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mock documents for this jamaah
const mockJamaahDocuments = [
  { id: '1', type: 'KTP', status: 'complete' as const, uploadedAt: '2024-12-01' },
  { id: '2', type: 'Kartu Keluarga', status: 'complete' as const, uploadedAt: '2024-12-01' },
  { id: '3', type: 'Paspor', status: 'pending' as const, uploadedAt: '2024-12-15' },
  { id: '4', type: 'Sertifikat Vaksin', status: 'incomplete' as const },
]

// Mock payment history
const mockPaymentHistory = [
  { id: '1', date: '2024-11-15', amount: 10000000, method: 'Transfer Bank', status: 'Lunas' },
  { id: '2', date: '2024-12-01', amount: 5000000, method: 'Transfer Bank', status: 'Lunas' },
  { id: '3', date: '2024-12-15', amount: 5000000, method: 'Transfer Bank', status: 'Lunas' },
]

// Mock activity timeline
const mockActivityTimeline = [
  { id: '1', date: '2024-12-15', activity: 'Pembayaran cicilan ke-3 diterima', type: 'payment' },
  { id: '2', date: '2024-12-15', activity: 'Upload dokumen Paspor', type: 'document' },
  { id: '3', date: '2024-12-01', activity: 'Pembayaran cicilan ke-2 diterima', type: 'payment' },
  { id: '4', date: '2024-11-15', activity: 'Pembayaran DP diterima', type: 'payment' },
  { id: '5', date: '2024-11-01', activity: 'Jamaah terdaftar', type: 'registration' },
]

function DocumentStatusBadge({ status }: { status: 'complete' | 'pending' | 'incomplete' }) {
  const config = {
    complete: { label: 'Lengkap', className: 'bg-green-100 text-green-700 border-green-200' },
    incomplete: { label: 'Belum Upload', className: 'bg-red-100 text-red-700 border-red-200' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  }

  const { label, className } = config[status]

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {status === 'complete' && <CheckCircle className="mr-[4px] h-[12px] w-[12px]" />}
      {status === 'incomplete' && <XCircle className="mr-[4px] h-[12px] w-[12px]" />}
      {status === 'pending' && <Clock className="mr-[4px] h-[12px] w-[12px]" />}
      {label}
    </Badge>
  )
}

export default function JamaahDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const jamaah = mockJamaah.find((j) => j.id === id)

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

  const handleEdit = () => {
    router.push(`/jamaah/${id}/edit`)
  }

  if (!jamaah) {
    return (
      <AppLayout
        notificationCount={3}
        breadcrumbs={[
          { label: "Jamaah", href: "/jamaah" },
          { label: "Detail", href: `/jamaah/${id}`, isCurrentPage: true },
        ]}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
      >
        <div className="text-center py-32">
          <p className="text-slate-600">Jamaah tidak ditemukan</p>
          <Link href="/jamaah">
            <Button variant="link" className="mt-16">
              Kembali ke Daftar Jamaah
            </Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const totalPaid = mockPaymentHistory.reduce((sum, p) => sum + p.amount, 0)
  const packagePrice = 25000000 // Mock package price
  const remaining = packagePrice - totalPaid

  return (
    <AppLayout
      notificationCount={3}
      breadcrumbs={[
        { label: "Jamaah", href: "/jamaah" },
        { label: jamaah.name, href: `/jamaah/${id}`, isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Link href="/jamaah">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-[16px] w-[16px] mr-8" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                {jamaah.name}
              </h1>
              <p className="mt-4 text-slate-600">NIK: {jamaah.nik}</p>
            </div>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="h-[16px] w-[16px] mr-8" />
            Edit Jamaah
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <p className="text-sm text-slate-600">Nama Lengkap</p>
                <p className="font-medium text-slate-900 mt-4">{jamaah.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">NIK</p>
                <p className="font-medium text-slate-900 mt-4">{jamaah.nik}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Paket</p>
                <p className="font-medium text-slate-900 mt-4">{jamaah.package}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <div className="mt-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      jamaah.status === 'urgent' && 'bg-red-100 text-red-700 border-red-200',
                      jamaah.status === 'soon' && 'bg-yellow-100 text-yellow-700 border-yellow-200',
                      jamaah.status === 'ready' && 'bg-green-100 text-green-700 border-green-200'
                    )}
                  >
                    {jamaah.status === 'urgent' && 'Mendesak'}
                    {jamaah.status === 'soon' && 'Segera'}
                    {jamaah.status === 'ready' && 'Siap'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Payments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Documents List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-8">
                <FileText className="h-[20px] w-[20px]" />
                Dokumen
              </CardTitle>
              <Link href="/dokumen">
                <Button variant="outline" size="sm">
                  Kelola
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-12">
                {mockJamaahDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-8 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{doc.type}</p>
                      {doc.uploadedAt && (
                        <p className="text-xs text-slate-500 mt-2">
                          Upload: {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-8">
                <DollarSign className="h-[20px] w-[20px]" />
                Pembayaran
              </CardTitle>
              <Link href="/payments">
                <Button variant="outline" size="sm">
                  Catat Bayar
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-sm text-slate-600">Total Paket</p>
                    <p className="font-bold text-slate-900 mt-4">{formatCurrency(packagePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Terbayar</p>
                    <p className="font-bold text-green-700 mt-4">{formatCurrency(totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sisa</p>
                    <p className="font-bold text-orange-700 mt-4">{formatCurrency(remaining)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <div className="mt-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          remaining === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                        )}
                      >
                        {remaining === 0 ? 'Lunas' : 'Cicilan'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-16 border-t">
                  <p className="text-sm font-medium text-slate-900 mb-8">Riwayat Pembayaran</p>
                  <div className="space-y-8">
                    {mockPaymentHistory.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex justify-between text-sm">
                        <span className="text-slate-600">
                          {new Date(payment.date).toLocaleDateString('id-ID')}
                        </span>
                        <span className="font-medium text-slate-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-8">
              <Clock className="h-[20px] w-[20px]" />
              Timeline Aktivitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-16">
              {mockActivityTimeline.map((activity, index) => (
                <div key={activity.id} className="flex gap-16">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-[32px] h-[32px] rounded-full flex items-center justify-center",
                        activity.type === 'payment' && 'bg-green-100',
                        activity.type === 'document' && 'bg-blue-100',
                        activity.type === 'registration' && 'bg-purple-100'
                      )}
                    >
                      {activity.type === 'payment' && <DollarSign className="h-[16px] w-[16px] text-green-700" />}
                      {activity.type === 'document' && <FileText className="h-[16px] w-[16px] text-blue-700" />}
                      {activity.type === 'registration' && <CheckCircle className="h-[16px] w-[16px] text-purple-700" />}
                    </div>
                    {index < mockActivityTimeline.length - 1 && (
                      <div className="w-[2px] h-full bg-slate-200 mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-16">
                    <p className="font-medium text-slate-900">{activity.activity}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {new Date(activity.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
