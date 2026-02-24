"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { KPICard } from "@/components/domain/dashboard/kpi-card"
import { JamaahTable } from "@/components/domain/dashboard/jamaah-table"
import { FloatingActionBar } from "@/components/domain/whatsapp/floating-action-bar"
import { TemplatePicker } from "@/components/domain/whatsapp/template-picker"
import { SendProgressModal } from "@/components/domain/whatsapp/send-progress-modal"
import { Input } from "@/components/ui/input"
import { agentJamaah, getAgentJamaahCount, agentProfile } from "@/lib/data/mock-agent-jamaah"
import { Jamaah } from "@/lib/types/jamaah"
import { sendBulkWhatsApp, SendProgress } from "@/lib/whatsapp/bulk-send"
import { agentMenuItems } from "@/lib/navigation/menu-items"
import { toast } from "sonner"

export default function MyJamaahPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'urgent' | 'soon' | 'ready'>('all')
  const [showTemplatePicker, setShowTemplatePicker] = React.useState(false)
  const [showProgressModal, setShowProgressModal] = React.useState(false)
  const [sendProgress, setSendProgress] = React.useState<SendProgress>({
    current: 0,
    total: 0,
    status: 'sending',
    failed: 0,
  })

  const counts = getAgentJamaahCount()

  // Filter jamaah based on search and status
  const filteredJamaah = React.useMemo(() => {
    let filtered = agentJamaah

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(j => j.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        j =>
          j.name.toLowerCase().includes(query) ||
          j.nik.toLowerCase().includes(query) ||
          j.package.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, statusFilter])

  const handleToggleJamaah = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (ids: string[]) => {
    const allSelected = ids.every(id => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
    } else {
      const newIds = ids.filter(id => !selectedIds.includes(id))
      setSelectedIds(prev => [...prev, ...newIds])
    }
  }

  const handleKPIClick = (status: 'urgent' | 'soon' | 'ready') => {
    setStatusFilter(prev => prev === status ? 'all' : status)
  }

  const handleSendReminder = () => {
    setShowTemplatePicker(true)
  }

  const handleSendProgress = () => {
    setShowTemplatePicker(true)
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleSendMessage = async (message: string) => {
    setShowTemplatePicker(false)
    setShowProgressModal(true)
    setSendProgress({
      current: 0,
      total: selectedIds.length,
      status: 'sending',
      failed: 0,
    })

    // Get selected jamaah data
    const selectedJamaah = agentJamaah.filter(j => selectedIds.includes(j.id))

    // Send bulk WhatsApp messages
    const result = await sendBulkWhatsApp(
      selectedJamaah,
      message,
      (progress) => {
        setSendProgress(progress)
      }
    )

    // Show toast based on result
    if (result.failed === 0) {
      toast.success(`Pesan terkirim ke ${result.success} jamaah via WhatsApp`, {
        duration: 4000,
      })
    } else if (result.success === 0) {
      toast.error(`Gagal mengirim ke ${result.failed} jamaah`, {
        duration: 8000,
      })
    } else {
      toast.warning(`Berhasil ${result.success} dari ${selectedJamaah.length}, ${result.failed} gagal`, {
        duration: 8000,
      })
    }

    // Clear selection and close modals after 2 seconds
    setTimeout(() => {
      setSelectedIds([])
      setShowProgressModal(false)
      setShowTemplatePicker(false)
    }, 2000)
  }

  // Get selected jamaah data for merge fields
  const selectedJamaah = agentJamaah.filter(j => selectedIds.includes(j.id))
  const mergeFields: Record<string, string> = selectedJamaah.length > 0 ? {
    nama: selectedJamaah[0].name,
    paket: selectedJamaah[0].package,
    status_dokumen: selectedJamaah[0].status,
    tanggal: new Date().toLocaleDateString('id-ID'),
  } : {}

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'My Jamaah', href: '/agent/my-jamaah' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-h2 font-display font-bold text-slate-900 mb-8">
          My Jamaah
        </h1>
        <p className="text-body text-slate-600">
          Kelola jamaah yang ditugaskan kepada Anda ({counts.total} dari {agentProfile.totalAgencyJamaah} total jamaah)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <KPICard
          title="Total My Jamaah"
          value={counts.total}
          status="ready"
          onClick={() => setStatusFilter('all')}
          isActive={statusFilter === 'all'}
        />
        <KPICard
          title="Urgent"
          value={counts.urgent}
          status="urgent"
          onClick={() => handleKPIClick('urgent')}
          isActive={statusFilter === 'urgent'}
        />
        <KPICard
          title="Soon"
          value={counts.soon}
          status="soon"
          onClick={() => handleKPIClick('soon')}
          isActive={statusFilter === 'soon'}
        />
        <KPICard
          title="Ready"
          value={counts.ready}
          status="ready"
          onClick={() => handleKPIClick('ready')}
          isActive={statusFilter === 'ready'}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-24">
        <div className="relative max-w-md">
          <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-20 w-20 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari nama, NIK, atau paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-40 h-44"
          />
        </div>
      </div>

      {/* Results Count */}
      {statusFilter !== 'all' && (
        <div className="mb-16">
          <p className="text-body-sm text-slate-600">
            Menampilkan {filteredJamaah.length} jamaah dengan status{' '}
            <span className="font-semibold">
              {statusFilter === 'urgent' && 'Urgent'}
              {statusFilter === 'soon' && 'Soon'}
              {statusFilter === 'ready' && 'Ready'}
            </span>
          </p>
        </div>
      )}

      {/* Jamaah Table */}
      <JamaahTable
        data={filteredJamaah}
        selectedIds={selectedIds}
        onToggleJamaah={handleToggleJamaah}
        onSelectAll={handleSelectAll}
      />

      {/* Empty State */}
      {filteredJamaah.length === 0 && (
        <div className="text-center py-48">
          <p className="text-body text-slate-500 mb-8">
            Tidak ada jamaah yang ditemukan
          </p>
          {searchQuery && (
            <p className="text-body-sm text-slate-400">
              Coba ubah kata kunci pencarian Anda
            </p>
          )}
        </div>
      )}

      {/* Floating Action Bar */}
      <FloatingActionBar
        selectedCount={selectedIds.length}
        onSendReminder={handleSendReminder}
        onMarkComplete={handleSendProgress}
        onClearSelection={handleClearSelection}
      />

      {/* Template Picker Modal */}
      <TemplatePicker
        open={showTemplatePicker}
        onOpenChange={setShowTemplatePicker}
        selectedCount={selectedIds.length}
        onSend={handleSendMessage}
        mergeFields={mergeFields}
      />

      {/* Send Progress Modal */}
      <SendProgressModal
        open={showProgressModal}
        progress={sendProgress}
      />
    </AppLayout>
  )
}
