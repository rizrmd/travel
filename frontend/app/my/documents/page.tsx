'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  File
} from 'lucide-react'
import { mockJamaahProfile } from '@/lib/data/mock-jamaah-profile'
import { useToast } from '@/hooks/use-toast'

export default function DocumentsPage() {
  const profile = mockJamaahProfile
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const completedDocs = profile.documents.filter(d => d.status === 'complete').length
  const pendingDocs = profile.documents.filter(d => d.status === 'pending').length
  const rejectedDocs = profile.documents.filter(d => d.status === 'rejected').length
  const missingDocs = profile.documents.filter(d => d.status === 'missing').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'missing':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default">Disetujui</Badge>
      case 'pending':
        return <Badge variant="secondary">Menunggu Review</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
      case 'missing':
        return <Badge variant="outline">Belum Upload</Badge>
      default:
        return null
    }
  }

  const getDocumentTips = (docName: string) => {
    const tips: Record<string, string> = {
      'KTP': 'Pastikan foto KTP jelas, tidak blur, dan seluruh bagian KTP terlihat. Ambil foto dengan pencahayaan yang baik.',
      'Kartu Keluarga': 'Pastikan semua tulisan pada KK dapat terbaca dengan jelas. Hindari bayangan saat mengambil foto.',
      'Paspor': 'Upload halaman biodata paspor. Pastikan masa berlaku paspor minimal 6 bulan dari tanggal keberangkatan.',
      'Sertifikat Vaksin': 'Upload sertifikat vaksin meningitis dan vaksin lain yang diperlukan. Pastikan sertifikat asli dan tidak kadaluarsa.',
      'Buku Nikah': 'Upload halaman biodata pada Buku Nikah. Pastikan foto jelas dan tidak blur.',
      'Akta Kelahiran': 'Upload Akta Kelahiran asli. Pastikan semua tulisan dapat terbaca dengan jelas.',
    }
    return tips[docName] || 'Pastikan dokumen yang diupload jelas dan dapat terbaca.'
  }

  const handleUploadClick = (doc: any) => {
    setSelectedDocument(doc)
    setUploadDialog(true)
    setUploadProgress(0)
  }

  const handleFileUpload = () => {
    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploading(false)
            setUploadDialog(false)
            toast({
              title: 'Upload Berhasil',
              description: `Dokumen ${selectedDocument.name} berhasil diupload dan sedang menunggu review.`,
            })
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <AppLayout
      userRole="jamaah"
    >
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">Lengkap</span>
            </div>
            <p className="text-2xl font-bold">{completedDocs}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium">Review</span>
            </div>
            <p className="text-2xl font-bold">{pendingDocs}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Ditolak</span>
            </div>
            <p className="text-2xl font-bold">{rejectedDocs}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">Belum Upload</span>
            </div>
            <p className="text-2xl font-bold">{missingDocs}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progress Dokumen</span>
            <span className="font-bold">{Math.round((completedDocs / profile.documents.length) * 100)}%</span>
          </div>
          <Progress value={(completedDocs / profile.documents.length) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {completedDocs} dari {profile.documents.length} dokumen sudah lengkap
          </p>
        </CardContent>
      </Card>

      {/* Helper Tips */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Tips Upload Dokumen</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pastikan foto jelas, tidak blur, dan seluruh dokumen terlihat</li>
                <li>• Format yang diterima: JPG, PNG, PDF (maksimal 5MB)</li>
                <li>• Ambil foto dengan pencahayaan yang baik</li>
                <li>• Dokumen akan direview dalam 1-2 hari kerja</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="space-y-4">
        {profile.documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-gray-100 p-3">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{doc.name}</h3>
                      {getStatusBadge(doc.status)}
                    </div>
                    {getStatusIcon(doc.status)}
                  </div>

                  {/* Status Messages */}
                  {doc.status === 'complete' && doc.uploadedDate && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Diupload pada {new Date(doc.uploadedDate).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}

                  {doc.status === 'pending' && doc.uploadedDate && (
                    <p className="text-sm text-amber-600 mb-2">
                      Sedang dalam proses review. Diupload pada {new Date(doc.uploadedDate).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}

                  {doc.status === 'rejected' && doc.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-red-900 mb-1">Alasan Penolakan:</p>
                      <p className="text-sm text-red-700">{doc.rejectionReason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    {(doc.status === 'missing' || doc.status === 'rejected') && (
                      <Button
                        onClick={() => handleUploadClick(doc)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {doc.status === 'rejected' ? 'Upload Ulang' : 'Upload Dokumen'}
                      </Button>
                    )}

                    {doc.fileUrl && (
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Lihat Dokumen
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload {selectedDocument?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
              <p className="text-sm text-blue-700">
                {selectedDocument && getDocumentTips(selectedDocument.name)}
              </p>
            </div>

            {/* Upload Area */}
            {!uploading ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium mb-1">Klik untuk pilih file</p>
                <p className="text-sm text-muted-foreground">atau drag & drop file di sini</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: JPG, PNG, PDF (max 5MB)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">document.jpg</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
                {uploadProgress === 100 && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Memproses dokumen dengan OCR...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialog(false)}
              disabled={uploading}
            >
              Batal
            </Button>
            <Button
              onClick={handleFileUpload}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
