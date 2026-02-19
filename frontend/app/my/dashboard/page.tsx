'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Stethoscope,
  BookOpen,
  Plane,
  AlertCircle,
  Phone,
  MessageCircle
} from 'lucide-react'
import { jamaahMenuItems } from '@/lib/navigation/menu-items'
import { mockJamaahProfile, getDaysUntilDeparture, getNextSteps } from '@/lib/data/mock-jamaah-profile'

export default function JamaahDashboardPage() {
  const [daysUntilDeparture, setDaysUntilDeparture] = useState(0)
  const profile = mockJamaahProfile
  const nextSteps = getNextSteps(profile)

  useEffect(() => {
    setDaysUntilDeparture(getDaysUntilDeparture(profile.package.departureDate))
  }, [profile.package.departureDate])

  // Calculate document completion
  const completedDocs = profile.documents.filter(d => d.status === 'complete').length
  const totalDocs = profile.documents.length

  return (
    <AppLayout
      userRole="jamaah"
      menuItems={jamaahMenuItems}
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-6 md:p-8 text-white mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Assalamu&apos;alaikum, Pak Budi!
        </h1>
        <p className="text-emerald-100 text-lg mb-4">
          {profile.package.name}
        </p>
        <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold">
          <Plane className="h-6 w-6" />
          <span>
            {daysUntilDeparture > 0
              ? `${daysUntilDeparture} hari lagi menuju tanah suci`
              : 'Hari keberangkatan telah tiba!'}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progress Persiapan Umroh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Documents */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${profile.progress.documents === 100
                  ? 'bg-emerald-100 text-emerald-600'
                  : profile.progress.documents > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">1. Dokumen</h3>
                  <Badge variant={
                    profile.progress.documents === 100
                      ? 'default'
                      : profile.progress.documents > 0
                        ? 'secondary'
                        : 'outline'
                  }>
                    {profile.progress.documents}%
                  </Badge>
                </div>
                <Progress value={profile.progress.documents} className="mb-1" />
                <p className="text-sm text-muted-foreground">
                  {completedDocs} dari {totalDocs} dokumen lengkap
                </p>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${profile.progress.payments === 100
                  ? 'bg-emerald-100 text-emerald-600'
                  : profile.progress.payments > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">2. Pembayaran</h3>
                  <Badge variant={
                    profile.progress.payments === 100
                      ? 'default'
                      : profile.progress.payments > 0
                        ? 'secondary'
                        : 'outline'
                  }>
                    {profile.progress.payments}%
                  </Badge>
                </div>
                <Progress value={profile.progress.payments} className="mb-1" />
                <p className="text-sm text-muted-foreground">
                  {profile.paymentStatus.status === 'lunas'
                    ? 'Pembayaran Lunas'
                    : `${profile.paymentStatus.installments.filter(i => i.status === 'lunas').length} dari ${profile.paymentStatus.installments.length} cicilan dibayar`}
                </p>
              </div>
            </div>

            {/* Step 3: Medical Check */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${profile.progress.medical === 100
                  ? 'bg-emerald-100 text-emerald-600'
                  : profile.progress.medical > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">3. Medical Check</h3>
                  <Badge variant={
                    profile.progress.medical === 100
                      ? 'default'
                      : profile.progress.medical > 0
                        ? 'secondary'
                        : 'outline'
                  }>
                    {profile.progress.medical}%
                  </Badge>
                </div>
                <Progress value={profile.progress.medical} className="mb-1" />
                <p className="text-sm text-muted-foreground">
                  {profile.progress.medical === 0 ? 'Belum dijadwalkan' : 'Selesai'}
                </p>
              </div>
            </div>

            {/* Step 4: Manasik */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${profile.progress.manasik === 100
                  ? 'bg-emerald-100 text-emerald-600'
                  : profile.progress.manasik > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">4. Manasik</h3>
                  <Badge variant={
                    profile.progress.manasik === 100
                      ? 'default'
                      : profile.progress.manasik > 0
                        ? 'secondary'
                        : 'outline'
                  }>
                    {profile.progress.manasik}%
                  </Badge>
                </div>
                <Progress value={profile.progress.manasik} className="mb-1" />
                <p className="text-sm text-muted-foreground">
                  {profile.progress.manasik === 0 ? 'Belum dijadwalkan' : 'Selesai'}
                </p>
              </div>
            </div>

            {/* Step 5: Departure */}
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${profile.progress.departure === 100
                  ? 'bg-emerald-100 text-emerald-600'
                  : profile.progress.departure > 0
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                <Plane className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">5. Keberangkatan</h3>
                  <Badge variant="outline">
                    {daysUntilDeparture > 0 ? `${daysUntilDeparture} hari lagi` : 'Hari ini'}
                  </Badge>
                </div>
                <Progress value={profile.progress.departure} className="mb-1" />
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.package.departureDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <Badge variant={completedDocs === totalDocs ? 'default' : 'secondary'}>
                {Math.round((completedDocs / totalDocs) * 100)}%
              </Badge>
            </div>
            <h3 className="font-semibold mb-1">Dokumen Lengkap</h3>
            <p className="text-2xl font-bold mb-1">{completedDocs} dari {totalDocs}</p>
            <p className="text-sm text-muted-foreground">
              {totalDocs - completedDocs} dokumen tersisa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="h-8 w-8 text-emerald-600" />
              <Badge variant={profile.paymentStatus.status === 'lunas' ? 'default' : 'secondary'}>
                {profile.paymentStatus.status === 'lunas' ? 'Lunas' : 'Cicilan'}
              </Badge>
            </div>
            <h3 className="font-semibold mb-1">Pembayaran</h3>
            <p className="text-2xl font-bold mb-1">
              Rp {(profile.paymentStatus.paid / 1000000).toFixed(1)}jt
            </p>
            <p className="text-sm text-muted-foreground">
              dari Rp {(profile.paymentStatus.total / 1000000).toFixed(1)}jt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Stethoscope className="h-8 w-8 text-amber-600" />
              <Badge variant="outline">
                {profile.progress.medical === 0 ? 'Pending' : 'Selesai'}
              </Badge>
            </div>
            <h3 className="font-semibold mb-1">Medical Check</h3>
            <p className="text-2xl font-bold mb-1">
              {profile.progress.medical === 0 ? 'Belum' : 'Sudah'}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.progress.medical === 0 ? 'Belum Dijadwalkan' : 'Selesai'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Langkah Selanjutnya
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextSteps.length > 0 ? (
              <div className="space-y-3">
                {nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="rounded-full p-1 bg-amber-100 text-amber-600 mt-0.5">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <p className="font-semibold text-emerald-600">
                  Semua langkah sudah selesai!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Anda siap untuk berangkat umroh
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              Hubungi Agent Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-3">
                  <span className="text-white font-bold text-xl">
                    {profile.agent.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{profile.agent.name}</p>
                  <p className="text-sm text-muted-foreground">Agent Pribadi Anda</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.agent.phone}</span>
                </div>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.open(`https://wa.me/${profile.agent.phone.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi via WhatsApp
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Butuh bantuan? Agent Anda siap membantu Anda 24/7 untuk pertanyaan seputar persiapan umroh.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
