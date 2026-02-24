"use client"

import { useMemo, useState } from "react"
import { Search, Upload, Filter, FileText, CheckCircle, XCircle, Clock, Eye, Check, Download } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type DocumentStatus = 'complete' | 'incomplete' | 'pending'
type DocumentType = 'ktp' | 'kk' | 'passport' | 'vaksin' | 'buku-nikah' | 'akta'

interface Document {
  id: string
  jamaahId: string
  jamaahName: string
  type: DocumentType
  status: DocumentStatus
  uploadedAt?: string
  fileName?: string
}

const documentTypes: Record<DocumentType, string> = {
  'ktp': 'KTP',
  'kk': 'Kartu Keluarga',
  'passport': 'Paspor',
  'vaksin': 'Sertifikat Vaksin',
  'buku-nikah': 'Buku Nikah',
  'akta': 'Akta Kelahiran',
}

// Mock data
const mockDocuments: Document[] = [
  { id: '1', jamaahId: 'j1', jamaahName: 'Ahmad Hidayat', type: 'ktp', status: 'complete', uploadedAt: '2024-01-15', fileName: 'ktp_ahmad.pdf' },
  { id: '2', jamaahId: 'j1', jamaahName: 'Ahmad Hidayat', type: 'kk', status: 'complete', uploadedAt: '2024-01-15', fileName: 'kk_ahmad.pdf' },
  { id: '3', jamaahId: 'j1', jamaahName: 'Ahmad Hidayat', type: 'passport', status: 'incomplete' },
  { id: '4', jamaahId: 'j1', jamaahName: 'Ahmad Hidayat', type: 'vaksin', status: 'pending', uploadedAt: '2024-01-20', fileName: 'vaksin_ahmad.pdf' },
  { id: '5', jamaahId: 'j2', jamaahName: 'Budi Santoso', type: 'ktp', status: 'complete', uploadedAt: '2024-01-10', fileName: 'ktp_budi.pdf' },
  { id: '6', jamaahId: 'j2', jamaahName: 'Budi Santoso', type: 'passport', status: 'incomplete' },
  { id: '7', jamaahId: 'j3', jamaahName: 'Dewi Lestari', type: 'ktp', status: 'complete', uploadedAt: '2024-01-12', fileName: 'ktp_dewi.pdf' },
  { id: '8', jamaahId: 'j3', jamaahName: 'Dewi Lestari', type: 'kk', status: 'incomplete' },
]

function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = {
    complete: { label: 'Lengkap', className: 'bg-green-100 text-green-700 border-green-200' },
    incomplete: { label: 'Belum Upload', className: 'bg-red-100 text-red-700 border-red-200' },
    pending: { label: 'Menunggu Review', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
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

export default function DokumenPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [approveRejectDoc, setApproveRejectDoc] = useState<{ doc: Document; action: 'approve' | 'reject' } | null>(null)
  const [notes, setNotes] = useState("")

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let result = mockDocuments

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((doc) => doc.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter((doc) => doc.type === typeFilter)
    }

    // Search by jamaah name or document type
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (doc) =>
          doc.jamaahName.toLowerCase().includes(query) ||
          documentTypes[doc.type].toLowerCase().includes(query)
      )
    }

    return result
  }, [statusFilter, typeFilter, searchQuery])

  const handleUpload = (docId: string) => {
    console.log('Upload document:', docId)
    toast.info('Fitur upload segera hadir')
  }

  const handleDownload = (doc: Document) => {
    if (doc.fileName) {
      console.log('Download:', doc.fileName)
      toast.success(`Mengunduh ${doc.fileName}`)
    }
  }

  const handlePreview = (doc: Document) => {
    if (doc.fileName) {
      setPreviewDoc(doc)
    }
  }

  const handleApproveClick = (doc: Document) => {
    setApproveRejectDoc({ doc, action: 'approve' })
    setNotes('')
  }

  const handleRejectClick = (doc: Document) => {
    setApproveRejectDoc({ doc, action: 'reject' })
    setNotes('')
  }

  const handleConfirmApproveReject = () => {
    if (!approveRejectDoc) return

    const { doc, action } = approveRejectDoc
    console.log(`${action} document:`, doc.id, 'notes:', notes)

    if (action === 'approve') {
      toast.success(`Dokumen ${documentTypes[doc.type]} disetujui`)
    } else {
      toast.error(`Dokumen ${documentTypes[doc.type]} ditolak`)
    }

    setApproveRejectDoc(null)
    setNotes('')
  }

  const handleBulkApprove = () => {
    if (selectedDocs.length === 0) return

    console.log('Bulk approve:', selectedDocs)
    toast.success(`${selectedDocs.length} dokumen disetujui`)
    setSelectedDocs([])
  }

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    )
  }

  const toggleAllDocs = () => {
    const pendingDocs = filteredDocuments.filter(doc => doc.status === 'pending')
    if (selectedDocs.length === pendingDocs.length) {
      setSelectedDocs([])
    } else {
      setSelectedDocs(pendingDocs.map(doc => doc.id))
    }
  }

  const handleClearFilter = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setSearchQuery('')
  }

  const handleNotificationClick = () => {
    console.log('Navigate to /notifications')
  }

  const handleProfileClick = () => {
    console.log('Navigate to /profile')
  }

  const handleSettingsClick = () => {
    console.log('Navigate to /settings')
  }

  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  // Count statistics
  const stats = useMemo(() => {
    return {
      total: mockDocuments.length,
      complete: mockDocuments.filter(d => d.status === 'complete').length,
      incomplete: mockDocuments.filter(d => d.status === 'incomplete').length,
      pending: mockDocuments.filter(d => d.status === 'pending').length,
    }
  }, [])

  return (
    <AppLayout
      notificationCount={3}
      breadcrumbs={[
        { label: "Dokumen", href: "/dokumen", isCurrentPage: true },
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
              Manajemen Dokumen
            </h1>
            <p className="mt-8 text-slate-600">
              Kelola dan monitor kelengkapan dokumen jamaah
            </p>
          </div>
          <div className="flex gap-8">
            {selectedDocs.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                variant="default"
                className="flex items-center gap-2 h-[40px] bg-green-600 hover:bg-green-700"
              >
                <Check className="h-[16px] w-[16px]" />
                Approve {selectedDocs.length} Dokumen
              </Button>
            )}
            <Button
              onClick={() => toast.info('Fitur upload batch segera hadir')}
              className="flex items-center gap-2 h-[40px]"
              size="default"
            >
              <Upload className="h-[16px] w-[16px]" />
              Upload Dokumen
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-16">
          <div className="bg-white rounded-lg border border-slate-200 p-16">
            <div className="flex items-center gap-8">
              <FileText className="h-[24px] w-[24px] text-slate-600" />
              <div>
                <p className="text-caption text-slate-600">Total Dokumen</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-16">
            <div className="flex items-center gap-8">
              <CheckCircle className="h-[24px] w-[24px] text-green-600" />
              <div>
                <p className="text-caption text-slate-600">Lengkap</p>
                <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-16">
            <div className="flex items-center gap-8">
              <Clock className="h-[24px] w-[24px] text-yellow-600" />
              <div>
                <p className="text-caption text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-16">
            <div className="flex items-center gap-8">
              <XCircle className="h-[24px] w-[24px] text-red-600" />
              <div>
                <p className="text-caption text-slate-600">Belum Upload</p>
                <p className="text-2xl font-bold text-red-600">{stats.incomplete}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama jamaah atau jenis dokumen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-36"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-8 w-full md:w-auto">
            <Filter className="h-[16px] w-[16px] text-slate-400" />
            <Select
              value={statusFilter}
              onValueChange={(value: DocumentStatus | 'all') => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter berdasarkan status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="complete">Lengkap</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="incomplete">Belum Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-8 w-full md:w-auto">
            <Select
              value={typeFilter}
              onValueChange={(value: DocumentType | 'all') => setTypeFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]" aria-label="Filter berdasarkan jenis">
                <SelectValue placeholder="Jenis Dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="ktp">KTP</SelectItem>
                <SelectItem value="kk">Kartu Keluarga</SelectItem>
                <SelectItem value="passport">Paspor</SelectItem>
                <SelectItem value="vaksin">Vaksin</SelectItem>
                <SelectItem value="buku-nikah">Buku Nikah</SelectItem>
                <SelectItem value="akta">Akta Kelahiran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Filter Info & Clear */}
        <section className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredDocuments.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{mockDocuments.length}</span> dokumen
            {searchQuery && (
              <span className="ml-4 text-slate-500">
                (hasil pencarian: &quot;{searchQuery}&quot;)
              </span>
            )}
          </div>
          {(statusFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
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

        {/* Table Section */}
        <section>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[48px]">
                    {filteredDocuments.some(doc => doc.status === 'pending') && (
                      <Checkbox
                        checked={
                          selectedDocs.length > 0 &&
                          selectedDocs.length === filteredDocuments.filter(d => d.status === 'pending').length
                        }
                        onCheckedChange={toggleAllDocs}
                        aria-label="Pilih semua dokumen pending"
                      />
                    )}
                  </TableHead>
                  <TableHead>Nama Jamaah</TableHead>
                  <TableHead>Jenis Dokumen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Upload</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc, index) => (
                    <TableRow
                      key={doc.id}
                      className={cn(
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                        'hover:bg-slate-100 transition-colors'
                      )}
                    >
                      <TableCell>
                        {doc.status === 'pending' && (
                          <Checkbox
                            checked={selectedDocs.includes(doc.id)}
                            onCheckedChange={() => toggleDocSelection(doc.id)}
                            aria-label={`Pilih ${documentTypes[doc.type]}`}
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {doc.jamaahName}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {documentTypes[doc.type]}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {doc.uploadedAt || '-'}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {doc.fileName ? (
                          <button
                            onClick={() => handlePreview(doc)}
                            className="text-blue-600 hover:underline text-sm flex items-center gap-4"
                          >
                            <Eye className="h-[12px] w-[12px]" />
                            {doc.fileName}
                          </button>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          {doc.status === 'incomplete' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpload(doc.id)}
                              className="h-[32px]"
                            >
                              Upload
                            </Button>
                          )}
                          {doc.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveClick(doc)}
                                className="h-[32px] text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Setuju
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectClick(doc)}
                                className="h-[32px] text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Tolak
                              </Button>
                            </>
                          )}
                          {doc.status === 'complete' && doc.fileName && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                              className="h-[32px]"
                            >
                              Lihat
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada dokumen ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Document Preview Modal */}
        <Dialog open={previewDoc !== null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Preview Dokumen</DialogTitle>
              <DialogDescription>
                {previewDoc && `${documentTypes[previewDoc.type]} - ${previewDoc.jamaahName}`}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-slate-100 rounded-lg p-32 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-slate-500">
                <FileText className="h-[64px] w-[64px] mx-auto mb-16 text-slate-400" />
                <p className="font-medium">Preview Dokumen</p>
                <p className="text-sm mt-4">{previewDoc?.fileName}</p>
                <p className="text-xs mt-8">
                  (Preview PDF/gambar akan ditampilkan di sini)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>
                Tutup
              </Button>
              {previewDoc && (
                <Button onClick={() => handleDownload(previewDoc)}>
                  <Download className="h-[16px] w-[16px] mr-8" />
                  Download
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve/Reject Modal */}
        <Dialog open={approveRejectDoc !== null} onOpenChange={(open) => !open && setApproveRejectDoc(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {approveRejectDoc?.action === 'approve' ? 'Setujui Dokumen' : 'Tolak Dokumen'}
              </DialogTitle>
              <DialogDescription>
                {approveRejectDoc && `${documentTypes[approveRejectDoc.doc.type]} - ${approveRejectDoc.doc.jamaahName}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-16">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Catatan {approveRejectDoc?.action === 'reject' && <span className="text-red-600">*</span>}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    approveRejectDoc?.action === 'approve'
                      ? 'Tambahkan catatan (opsional)'
                      : 'Jelaskan alasan penolakan dokumen'
                  }
                  rows={4}
                  className="mt-8"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveRejectDoc(null)}>
                Batal
              </Button>
              <Button
                onClick={handleConfirmApproveReject}
                className={cn(
                  approveRejectDoc?.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                )}
                disabled={approveRejectDoc?.action === 'reject' && !notes.trim()}
              >
                {approveRejectDoc?.action === 'approve' ? 'Setujui' : 'Tolak'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
