"use client"

import * as React from "react"
import { FileUp, CheckCircle, Upload, ArrowLeft } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { agentJamaah } from "@/lib/data/mock-agent-jamaah"
import { agentProfile } from "@/lib/data/mock-agent-jamaah"
import { useRouter } from "next/navigation"

type DocumentType = 'ktp' | 'kk' | 'passport' | 'vaksin' | 'akta' | 'foto'

const documentTypes = [
  { value: 'ktp', label: 'KTP' },
  { value: 'kk', label: 'Kartu Keluarga' },
  { value: 'passport', label: 'Paspor' },
  { value: 'vaksin', label: 'Sertifikat Vaksin' },
  { value: 'akta', label: 'Akta Kelahiran' },
  { value: 'foto', label: 'Foto 4x6' },
]

export default function UploadDokumenPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [selectedJamaahId, setSelectedJamaahId] = React.useState<string>("")
  const [selectedDocType, setSelectedDocType] = React.useState<DocumentType | "">("")
  const [file, setFile] = React.useState<File | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const selectedJamaah = agentJamaah.find(j => j.id === selectedJamaahId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsUploading(false)

    // Simulate OCR processing
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)

    // Show success
    setIsSuccess(true)
  }

  const handleUploadAnother = () => {
    setStep(2)
    setSelectedDocType("")
    setFile(null)
    setUploadProgress(0)
    setIsSuccess(false)
  }

  const handleBackToJamaah = () => {
    router.push(`/agent/jamaah/${selectedJamaahId}`)
  }

  const getDocumentTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'My Jamaah', href: '/agent/my-jamaah' },
        { label: 'Upload Dokumen', href: '/agent/upload-dokumen' },
      ]}
      userName={agentProfile.name}
      userRole={agentProfile.role}
      maxWidth="4xl"
    >
      {/* Page Header */}
      <div className="mb-32">
        <h1 className="text-h2 font-display font-bold text-slate-900 mb-8">
          Upload Dokumen Jamaah
        </h1>
        <p className="text-body text-slate-600">
          Upload dokumen atas nama jamaah yang Anda kelola
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-40 gap-16">
        <div className="flex items-center">
          <div className={cn(
            "flex items-center justify-center w-40 h-40 rounded-full font-semibold text-body-sm",
            step >= 1 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
          )}>
            1
          </div>
          <span className={cn("ml-8 text-body-sm", step >= 1 ? "text-slate-900" : "text-slate-500")}>
            Pilih Jamaah
          </span>
        </div>

        <div className={cn("h-2 w-80", step >= 2 ? "bg-primary" : "bg-slate-200")} />

        <div className="flex items-center">
          <div className={cn(
            "flex items-center justify-center w-40 h-40 rounded-full font-semibold text-body-sm",
            step >= 2 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
          )}>
            2
          </div>
          <span className={cn("ml-8 text-body-sm", step >= 2 ? "text-slate-900" : "text-slate-500")}>
            Pilih Jenis Dokumen
          </span>
        </div>

        <div className={cn("h-2 w-80", step >= 3 ? "bg-primary" : "bg-slate-200")} />

        <div className="flex items-center">
          <div className={cn(
            "flex items-center justify-center w-40 h-40 rounded-full font-semibold text-body-sm",
            step >= 3 ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
          )}>
            3
          </div>
          <span className={cn("ml-8 text-body-sm", step >= 3 ? "text-slate-900" : "text-slate-500")}>
            Upload File
          </span>
        </div>
      </div>

      {/* Step 1: Select Jamaah */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-32 shadow-sm">
            <Label htmlFor="jamaah-select" className="text-body font-semibold mb-12 block">
              Pilih Jamaah
            </Label>
            <Select value={selectedJamaahId} onValueChange={setSelectedJamaahId}>
              <SelectTrigger id="jamaah-select" className="h-48">
                <SelectValue placeholder="Pilih jamaah..." />
              </SelectTrigger>
              <SelectContent>
                {agentJamaah.map((jamaah) => (
                  <SelectItem key={jamaah.id} value={jamaah.id}>
                    {jamaah.name} - {jamaah.package}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedJamaah && (
              <div className="mt-24 p-16 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-body-sm text-blue-900">
                  <span className="font-semibold">Anda akan mengunggah atas nama:</span>
                  <br />
                  {selectedJamaah.name} ({selectedJamaah.nik})
                </p>
              </div>
            )}

            <div className="mt-32 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedJamaahId}
                className="h-48"
              >
                Lanjut ke Pilih Dokumen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Document Type */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-32 shadow-sm">
            <div className="mb-24 p-16 bg-slate-50 rounded-lg">
              <p className="text-body-sm text-slate-700">
                <span className="font-semibold">Mengunggah untuk:</span> {selectedJamaah?.name}
              </p>
            </div>

            <Label htmlFor="doc-type-select" className="text-body font-semibold mb-12 block">
              Pilih Jenis Dokumen
            </Label>
            <Select value={selectedDocType} onValueChange={(value) => setSelectedDocType(value as DocumentType)}>
              <SelectTrigger id="doc-type-select" className="h-48">
                <SelectValue placeholder="Pilih jenis dokumen..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-32 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-48"
              >
                <ArrowLeft className="h-20 w-20 mr-8" />
                Kembali
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDocType}
                className="h-48"
              >
                Lanjut ke Upload
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Upload File */}
      {step === 3 && !isSuccess && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-32 shadow-sm">
            <div className="mb-24 p-16 bg-slate-50 rounded-lg space-y-4">
              <p className="text-body-sm text-slate-700">
                <span className="font-semibold">Mengunggah untuk:</span> {selectedJamaah?.name}
              </p>
              <p className="text-body-sm text-slate-700">
                <span className="font-semibold">Jenis Dokumen:</span> {getDocumentTypeLabel(selectedDocType)}
              </p>
            </div>

            {/* Helper Text */}
            <div className="mb-24 p-16 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-body-sm text-amber-900">
                {selectedDocType === 'ktp' && "Pastikan foto KTP jelas dan tidak blur"}
                {selectedDocType === 'passport' && "Pastikan halaman identitas paspor terlihat jelas"}
                {selectedDocType === 'kk' && "Pastikan semua text di Kartu Keluarga terbaca"}
                {selectedDocType === 'vaksin' && "Pastikan QR code dan teks sertifikat terlihat jelas"}
                {selectedDocType === 'akta' && "Pastikan seluruh dokumen akta terlihat jelas"}
                {selectedDocType === 'foto' && "Pastikan foto berlatar belakang putih ukuran 4x6"}
              </p>
            </div>

            {/* Drag & Drop Zone */}
            {!file && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-48 text-center transition-colors cursor-pointer",
                  isDragging
                    ? "border-primary bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-primary hover:bg-blue-50"
                )}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileUp className="h-48 w-48 mx-auto mb-16 text-slate-400" />
                  <p className="text-body font-semibold text-slate-900 mb-8">
                    Drag & drop file di sini atau klik untuk browse
                  </p>
                  <p className="text-body-sm text-slate-500">
                    Format: JPG, PNG, PDF (Maks. 5MB)
                  </p>
                </label>
              </div>
            )}

            {/* File Selected */}
            {file && !isUploading && !isProcessing && (
              <div className="border rounded-lg p-24 bg-slate-50">
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-12">
                    <FileUp className="h-24 w-24 text-slate-600" />
                    <div>
                      <p className="text-body font-semibold text-slate-900">{file.name}</p>
                      <p className="text-body-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Ganti
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="border rounded-lg p-24 bg-slate-50">
                <p className="text-body font-semibold text-slate-900 mb-12">
                  Mengupload...
                </p>
                <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-body-sm text-slate-600 mt-8 text-right">
                  {uploadProgress}%
                </p>
              </div>
            )}

            {/* OCR Processing */}
            {isProcessing && (
              <div className="border rounded-lg p-24 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-12">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
                  <div>
                    <p className="text-body font-semibold text-blue-900 mb-4">
                      Memproses dokumen...
                    </p>
                    <p className="text-body-sm text-blue-700">
                      OCR sedang mengekstrak data (3-5 detik)
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-32 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(2)
                  setFile(null)
                }}
                disabled={isUploading || isProcessing}
                className="h-48"
              >
                <ArrowLeft className="h-20 w-20 mr-8" />
                Kembali
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || isProcessing}
                className="h-48 gap-8"
              >
                <Upload className="h-20 w-20" />
                Upload Dokumen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccess && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border p-48 shadow-sm text-center">
            <CheckCircle className="h-64 w-64 mx-auto mb-24 text-green-500" />
            <h2 className="text-h3 font-display font-bold text-slate-900 mb-12">
              Upload Berhasil!
            </h2>
            <p className="text-body text-slate-600 mb-32">
              Dokumen {getDocumentTypeLabel(selectedDocType)} untuk {selectedJamaah?.name} berhasil diupload dan diproses.
            </p>

            <div className="flex flex-col sm:flex-row gap-12 justify-center">
              <Button
                variant="outline"
                onClick={handleUploadAnother}
                className="h-48"
              >
                Upload Dokumen Lain
              </Button>
              <Button
                onClick={handleBackToJamaah}
                className="h-48"
              >
                Lihat Detail Jamaah
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
