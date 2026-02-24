"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MessageCircle,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  StickyNote,
  Activity,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/domain/dashboard/status-badge"
import { agentProfile, getAgentJamaahById } from "@/lib/data/mock-agent-jamaah"
import {
  getJamaahDocuments,
  getJamaahPayment,
  getAgentNotes,
  getActivityLogs,
  formatCurrency,
} from "@/lib/data/mock-jamaah-details"
import { cn } from "@/lib/utils"

export default function JamaahDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jamaahId = params.id as string

  const [newNote, setNewNote] = React.useState("")
  const [isSavingNote, setIsSavingNote] = React.useState(false)

  const jamaah = getAgentJamaahById(jamaahId)
  const documents = getJamaahDocuments(jamaahId)
  const payment = getJamaahPayment(jamaahId)
  const notes = getAgentNotes(jamaahId)
  const activities = getActivityLogs(jamaahId)

  if (!jamaah) {
    return (
      <AppLayout
      >
        <div className="text-center py-48">
          <p className="text-body text-slate-500">Jamaah tidak ditemukan</p>
          <Button
            variant="outline"
            onClick={() => router.push('/agent/my-jamaah')}
            className="mt-24"
          >
            Kembali ke My Jamaah
          </Button>
        </div>
      </AppLayout>
    )
  }

  const handleWhatsApp = () => {
    // Mock WhatsApp integration
    const message = `Assalamualaikum ${jamaah.name}, ini Ibu Siti dari Travel Umroh. Ada update terkait pendaftaran Anda untuk ${jamaah.package}.`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/6281234567890?text=${encodedMessage}`, '_blank')
  }

  const handleUploadDocument = () => {
    router.push('/agent/upload-dokumen')
  }

  const handleSaveNote = async () => {
    if (!newNote.trim()) return

    setIsSavingNote(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSavingNote(false)
    setNewNote("")
    // In real app, would refresh notes
  }

  const documentStats = {
    complete: documents.filter(d => d.status === 'complete').length,
    pending: documents.filter(d => d.status === 'pending').length,
    missing: documents.filter(d => d.status === 'missing').length,
    total: documents.length,
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'My Jamaah', href: '/agent/my-jamaah' },
        { label: jamaah.name, href: `/agent/jamaah/${jamaahId}` },
      ]}
      maxWidth="6xl"
    >
      {/* Back Button */}
      <div className="mb-24">
        <Button
          variant="ghost"
          onClick={() => router.push('/agent/my-jamaah')}
          className="h-40 gap-8"
        >
          <ArrowLeft className="h-20 w-20" />
          Kembali ke My Jamaah
        </Button>
      </div>

      {/* Profile Summary */}
      <Card className="p-32 mb-32">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-24">
          <div className="flex-1">
            <div className="flex items-center gap-12 mb-12">
              <h1 className="text-h2 font-display font-bold text-slate-900">
                {jamaah.name}
              </h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Ditugaskan ke Saya
              </Badge>
            </div>
            <div className="space-y-8 text-body text-slate-600">
              <p><span className="font-semibold">NIK:</span> {jamaah.nik}</p>
              <p><span className="font-semibold">Paket:</span> {jamaah.package}</p>
              <div className="flex items-center gap-8">
                <span className="font-semibold">Status:</span>
                <StatusBadge status={jamaah.status} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-12">
            <Button
              onClick={handleWhatsApp}
              className="h-48 gap-8 bg-whatsapp hover:bg-whatsapp/90 text-white"
            >
              <MessageCircle className="h-20 w-20" />
              WhatsApp Chat
            </Button>
            <Button
              onClick={handleUploadDocument}
              variant="outline"
              className="h-48 gap-8"
            >
              <Upload className="h-20 w-20" />
              Upload Dokumen
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-32">
          {/* Documents Status */}
          <Card className="p-32">
            <div className="flex items-center gap-12 mb-24">
              <FileText className="h-24 w-24 text-primary" />
              <h2 className="text-h4 font-display font-bold text-slate-900">
                Status Dokumen
              </h2>
            </div>

            {/* Document Stats */}
            <div className="grid grid-cols-4 gap-16 mb-24 p-16 bg-slate-50 rounded-lg">
              <div className="text-center">
                <p className="text-h4 font-bold text-green-600">{documentStats.complete}</p>
                <p className="text-body-sm text-slate-600">Lengkap</p>
              </div>
              <div className="text-center">
                <p className="text-h4 font-bold text-amber-600">{documentStats.pending}</p>
                <p className="text-body-sm text-slate-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-h4 font-bold text-red-600">{documentStats.missing}</p>
                <p className="text-body-sm text-slate-600">Kurang</p>
              </div>
              <div className="text-center">
                <p className="text-h4 font-bold text-slate-900">{documentStats.total}</p>
                <p className="text-body-sm text-slate-600">Total</p>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-12">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-16 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-12 flex-1">
                    {doc.status === 'complete' && (
                      <CheckCircle className="h-20 w-20 text-green-500 flex-shrink-0" />
                    )}
                    {doc.status === 'pending' && (
                      <Clock className="h-20 w-20 text-amber-500 flex-shrink-0" />
                    )}
                    {doc.status === 'missing' && (
                      <XCircle className="h-20 w-20 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-slate-900">
                        {doc.label}
                      </p>
                      {doc.uploadedAt && (
                        <p className="text-body-sm text-slate-500">
                          Upload: {doc.uploadedAt} oleh {doc.uploadedBy}
                        </p>
                      )}
                    </div>
                  </div>
                  {doc.status !== 'complete' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUploadDocument}
                      className="h-36"
                    >
                      <Upload className="h-16 w-16 mr-8" />
                      Upload
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Status (Read-Only) */}
          {payment && (
            <Card className="p-32">
              <div className="flex items-center gap-12 mb-24">
                <CreditCard className="h-24 w-24 text-primary" />
                <h2 className="text-h4 font-display font-bold text-slate-900">
                  Status Pembayaran
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  Read-Only
                </Badge>
              </div>

              <div className="p-16 bg-amber-50 rounded-lg border border-amber-200 mb-24">
                <p className="text-body-sm text-amber-900">
                  Pembayaran dikelola oleh admin. Anda hanya dapat melihat informasi pembayaran.
                </p>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-2 gap-16 mb-24">
                <div className="p-16 bg-slate-50 rounded-lg">
                  <p className="text-body-sm text-slate-600 mb-4">Total Paket</p>
                  <p className="text-h4 font-bold text-slate-900">
                    {formatCurrency(payment.packagePrice)}
                  </p>
                </div>
                <div className="p-16 bg-slate-50 rounded-lg">
                  <p className="text-body-sm text-slate-600 mb-4">Sudah Dibayar</p>
                  <p className="text-h4 font-bold text-green-600">
                    {formatCurrency(payment.totalPaid)}
                  </p>
                </div>
                <div className="p-16 bg-slate-50 rounded-lg">
                  <p className="text-body-sm text-slate-600 mb-4">Sisa</p>
                  <p className="text-h4 font-bold text-red-600">
                    {formatCurrency(payment.remainingBalance)}
                  </p>
                </div>
                <div className="p-16 bg-slate-50 rounded-lg">
                  <p className="text-body-sm text-slate-600 mb-4">Status</p>
                  <Badge
                    variant={payment.status === 'lunas' ? 'default' : 'secondary'}
                    className={cn(
                      payment.status === 'lunas' && 'bg-green-500',
                      payment.status === 'cicilan' && 'bg-amber-500',
                      payment.status === 'nunggak' && 'bg-red-500'
                    )}
                  >
                    {payment.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Installment Schedule */}
              <div>
                <h3 className="text-body font-semibold text-slate-900 mb-12">
                  Jadwal Cicilan
                </h3>
                <div className="space-y-8">
                  {payment.installments.map((installment) => (
                    <div
                      key={installment.id}
                      className="flex items-center justify-between p-12 rounded-lg border"
                    >
                      <div>
                        <p className="text-body font-semibold text-slate-900">
                          Cicilan {installment.installmentNumber}
                        </p>
                        <p className="text-body-sm text-slate-600">
                          Jatuh tempo: {installment.dueDate}
                          {installment.paidDate && ` • Dibayar: ${installment.paidDate}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-body font-semibold text-slate-900">
                          {formatCurrency(installment.amount)}
                        </p>
                        <Badge
                          variant={installment.status === 'paid' ? 'default' : 'secondary'}
                          className={cn(
                            'text-xs',
                            installment.status === 'paid' && 'bg-green-500',
                            installment.status === 'pending' && 'bg-amber-500',
                            installment.status === 'overdue' && 'bg-red-500'
                          )}
                        >
                          {installment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-32">
          {/* My Notes */}
          <Card className="p-24">
            <div className="flex items-center gap-12 mb-20">
              <StickyNote className="h-20 w-20 text-primary" />
              <h3 className="text-body font-display font-bold text-slate-900">
                Catatan Saya
              </h3>
            </div>

            {/* Add New Note */}
            <div className="mb-20">
              <Textarea
                placeholder="Tambah catatan pribadi..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="h-80 text-body-sm mb-12"
              />
              <Button
                size="sm"
                onClick={handleSaveNote}
                disabled={!newNote.trim() || isSavingNote}
                className="w-full h-36"
              >
                {isSavingNote ? 'Menyimpan...' : 'Simpan Catatan'}
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-12 max-h-[400px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-body-sm text-slate-500 text-center py-24">
                  Belum ada catatan
                </p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-12 bg-slate-50 rounded-lg border"
                  >
                    <p className="text-body-sm text-slate-900 mb-8">
                      {note.note}
                    </p>
                    <p className="text-xs text-slate-500">
                      {note.createdAt} • {note.agentName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="p-24">
            <div className="flex items-center gap-12 mb-20">
              <Activity className="h-20 w-20 text-primary" />
              <h3 className="text-body font-display font-bold text-slate-900">
                Aktivitas Terakhir
              </h3>
            </div>

            <div className="space-y-16 max-h-[500px] overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-body-sm text-slate-500 text-center py-24">
                  Belum ada aktivitas
                </p>
              ) : (
                activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-12">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full",
                        activity.type === 'document' && 'bg-blue-500',
                        activity.type === 'payment' && 'bg-green-500',
                        activity.type === 'note' && 'bg-amber-500',
                        activity.type === 'status_change' && 'bg-purple-500'
                      )} />
                      {index < activities.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 mt-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-16">
                      <p className="text-body-sm text-slate-900 font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-4">
                        {activity.timestamp} • {activity.performedBy}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
