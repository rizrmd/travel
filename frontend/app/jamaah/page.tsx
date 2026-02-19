"use client"

import { useMemo, useState } from "react"
import { Search, UserPlus, Filter, Download, Trash2 } from "lucide-react"
import { JamaahTable } from "@/components/domain/dashboard/jamaah-table"
import { EmptyState } from "@/components/domain/dashboard/empty-state"
import { FloatingActionBar } from "@/components/domain/whatsapp/floating-action-bar"
import { TemplatePicker } from "@/components/domain/whatsapp/template-picker"
import { SendProgressModal } from "@/components/domain/whatsapp/send-progress-modal"
import { AppLayout } from "@/components/layout/app-layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDashboardStore, FilterStatus } from "@/lib/stores/dashboard-store"
import { mockJamaah, getJamaahCount } from "@/lib/data/mock-jamaah"
import { sendBulkWhatsApp, SendProgress, cancelBulkSend } from "@/lib/whatsapp/bulk-send"
import { toast } from "sonner"

export default function JamaahPage() {
  const {
    filterStatus,
    setFilterStatus,
    selectedJamaah,
    toggleJamaah,
    selectAllVisible,
    clearSelection,
  } = useDashboardStore()

  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // WhatsApp Template Picker state
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const [sendProgress, setSendProgress] = useState<SendProgress>({
    current: 0,
    total: 0,
    status: 'sending',
    failed: 0,
  })
  const [isSendingProgress, setIsSendingProgress] = useState(false)

  // Mark Complete confirmation dialog state
  const [isMarkCompleteDialogOpen, setIsMarkCompleteDialogOpen] = useState(false)

  // Get KPI counts
  const counts = useMemo(() => getJamaahCount(), [])

  // Filter and search jamaah
  const filteredJamaah = useMemo(() => {
    let result = mockJamaah

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((j) => j.status === filterStatus)
    }

    // Search by name, NIK, or package
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (j) =>
          j.name.toLowerCase().includes(query) ||
          j.nik.includes(query) ||
          j.package.toLowerCase().includes(query)
      )
    }

    return result
  }, [filterStatus, searchQuery])

  // Get selected jamaah details
  const selectedJamaahList = useMemo(() => {
    return mockJamaah.filter((j) => selectedJamaah.includes(j.id))
  }, [selectedJamaah])

  const handleAddJamaah = () => {
    // console.log('Navigate to /jamaah/new')
    toast.info('Fitur tambah jamaah segera hadir')
    // TODO: Navigate to add jamaah page
  }

  const handleClearFilter = () => {
    setFilterStatus('all')
    setSearchQuery('')
  }

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Nama', 'NIK', 'Paket', 'Status']
    const csvData = filteredJamaah.map(j => [
      j.name,
      j.nik,
      j.package,
      j.status === 'urgent' ? 'Mendesak' : j.status === 'soon' ? 'Segera' : 'Siap'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `jamaah-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`${filteredJamaah.length} data jamaah berhasil diexport`)
  }

  const handleBulkDelete = () => {
    if (selectedJamaah.length === 0) return

    // In a real app, this would call an API
    // console.log('Deleting jamaah:', selectedJamaah)
    toast.success(`${selectedJamaah.length} jamaah berhasil dihapus`)
    clearSelection()
  }

  // WhatsApp handlers
  const handleSendReminder = () => {
    setIsTemplatePickerOpen(true)
  }

  const handleSendWhatsApp = async (message: string) => {
    setIsSendingProgress(true)
    setSendProgress({
      current: 0,
      total: selectedJamaahList.length,
      status: 'sending',
      failed: 0,
    })

    const result = await sendBulkWhatsApp(
      selectedJamaahList,
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
      toast.warning(`Berhasil ${result.success} dari ${selectedJamaahList.length}, ${result.failed} gagal`, {
        duration: 8000,
      })
    }

    // Clear selection and close modals after 2 seconds
    setTimeout(() => {
      clearSelection()
      setIsSendingProgress(false)
      setIsTemplatePickerOpen(false)
    }, 2000)
  }

  const handleCancelSend = () => {
    cancelBulkSend()
    setIsSendingProgress(false)
    toast.info('Pengiriman dibatalkan')
  }

  const handleMarkComplete = () => {
    setIsMarkCompleteDialogOpen(true)
  }

  const handleConfirmMarkComplete = () => {
    // TODO: Call API to mark jamaah as complete
    // console.log('Mark complete:', selectedJamaahList.map(j => j.id))
    toast.success(`${selectedJamaahList.length} jamaah ditandai selesai`)
    clearSelection()
    setIsMarkCompleteDialogOpen(false)
  }

  const handleNotificationClick = () => {
    // console.log('Navigate to /notifications')
  }

  const handleProfileClick = () => {
    // console.log('Navigate to /profile')
  }

  const handleSettingsClick = () => {
    // console.log('Navigate to /settings')
  }

  const handleLogoutClick = () => {
    // console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  return (
    <AppLayout
      userName="Ahmad Fauzi"
      userRole="Agen Travel"
      notificationCount={3}
      breadcrumbs={[
        { label: "Jamaah", href: "/jamaah", isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Manajemen Jamaah
            </h1>
            <p className="mt-8 text-slate-600">
              Kelola data jamaah dan monitor status kelengkapan
            </p>
          </div>
          <div className="flex gap-8">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center gap-2 h-[40px]"
              disabled={filteredJamaah.length === 0}
            >
              <Download className="h-[16px] w-[16px]" />
              Export CSV
            </Button>
            <Button
              onClick={handleAddJamaah}
              className="flex items-center gap-2 h-[40px]"
              size="default"
            >
              <UserPlus className="h-[16px] w-[16px]" />
              Tambah Jamaah Baru
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama, NIK, atau paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-36"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-8 w-full md:w-auto">
            <Filter className="h-[16px] w-[16px] text-slate-400" />
            <Select
              value={filterStatus}
              onValueChange={(value: FilterStatus) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter jamaah berdasarkan status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="urgent">Mendesak</SelectItem>
                <SelectItem value="soon">Segera</SelectItem>
                <SelectItem value="ready">Siap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Filter Info & Clear */}
        <section className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredJamaah.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{counts.total}</span> jamaah
            {searchQuery && (
              <span className="ml-4 text-slate-500">
                (hasil pencarian: &quot;{searchQuery}&quot;)
              </span>
            )}
          </div>
          {(filterStatus !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="text-blue-600 hover:text-blue-800"
            >
              Reset Filter
            </Button>
          )}
        </section>

        {/* Selection Count Banner */}
        {selectedJamaah.length > 0 && (
          <section>
            <div className="bg-blue-600 text-white rounded-lg p-16 flex items-center justify-between">
              <span className="font-medium">
                {selectedJamaah.length} jamaah dipilih
              </span>
              <div className="flex gap-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-white hover:text-white hover:bg-red-700 flex items-center gap-4"
                >
                  <Trash2 className="h-[16px] w-[16px]" />
                  Hapus
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-white hover:text-white hover:bg-blue-700"
                >
                  Batalkan
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Table Section */}
        <section>
          {filteredJamaah.length > 0 ? (
            <JamaahTable
              data={filteredJamaah}
              selectedIds={selectedJamaah}
              onToggleJamaah={toggleJamaah}
              onSelectAll={selectAllVisible}
            />
          ) : searchQuery || filterStatus !== 'all' ? (
            // Empty state for filtered/searched results
            <EmptyState
              title="Tidak ada hasil"
              description={
                searchQuery
                  ? `Tidak ditemukan jamaah dengan kata kunci "${searchQuery}"`
                  : `Tidak ada jamaah dengan status "${filterStatus === 'urgent' ? 'Mendesak' : filterStatus === 'soon' ? 'Segera' : 'Siap'
                  }"`
              }
              actionLabel="Reset Filter"
              onAction={handleClearFilter}
            />
          ) : (
            // Empty state for no jamaah at all
            <EmptyState
              icon={UserPlus}
              title="Belum ada jamaah"
              description="Mulai dengan menambahkan jamaah pertama Anda"
              actionLabel="Tambah Jamaah Baru"
              onAction={handleAddJamaah}
            />
          )}
        </section>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        selectedCount={selectedJamaah.length}
        onSendReminder={handleSendReminder}
        onMarkComplete={handleMarkComplete}
        onClearSelection={clearSelection}
      />

      {/* Template Picker Modal */}
      <TemplatePicker
        open={isTemplatePickerOpen}
        onOpenChange={setIsTemplatePickerOpen}
        selectedCount={selectedJamaahList.length}
        onSend={handleSendWhatsApp}
        mergeFields={{
          nama: selectedJamaahList[0]?.name || 'Jamaah',
          paket: selectedJamaahList[0]?.package || 'Paket Umroh',
          tanggal: new Date().toLocaleDateString('id-ID'),
          jumlah: '5.000.000',
        }}
      />

      {/* Send Progress Modal */}
      <SendProgressModal
        open={isSendingProgress}
        progress={sendProgress}
        onCancel={handleCancelSend}
      />

      {/* Mark Complete Confirmation Dialog */}
      <AlertDialog open={isMarkCompleteDialogOpen} onOpenChange={setIsMarkCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tandai Selesai?</AlertDialogTitle>
            <AlertDialogDescription>
              Tandai {selectedJamaahList.length} jamaah sebagai selesai? Status mereka akan berubah menjadi &quot;Siap&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMarkComplete}>
              Ya, Tandai Selesai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
