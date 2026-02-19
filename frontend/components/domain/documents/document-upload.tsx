"use client"

import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react"
import Image from "next/image"
import { DocumentUploadZone } from "./document-upload-zone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { uploadFile, processOCR, OCRData, OCRResult } from "@/lib/ocr/process-ocr"
import { toast } from "sonner"

type UploadState =
  | 'idle'
  | 'uploading'
  | 'processing_ocr'
  | 'success'
  | 'low_confidence'
  | 'error'

interface DocumentUploadProps {
  onOCRComplete?: (data: OCRData, confidence: number) => void
  onError?: (error: string) => void
}

export function DocumentUpload({ onOCRComplete, onError }: DocumentUploadProps) {
  const [state, setState] = React.useState<UploadState>('idle')
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [fileUrl, setFileUrl] = React.useState<string>('')
  const [ocrResult, setOcrResult] = React.useState<OCRResult | null>(null)
  const [processingTime, setProcessingTime] = React.useState(0)

  // Timer for OCR processing time display
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (state === 'processing_ocr') {
      setProcessingTime(0)
      interval = setInterval(() => {
        setProcessingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state])

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setState('uploading')
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 500)

    try {
      // Upload file
      const uploadResult = await uploadFile(file)
      clearInterval(progressInterval)
      setUploadProgress(100)
      setFileUrl(uploadResult.fileUrl)

      // Start OCR processing
      setState('processing_ocr')
      const ocrResult = await processOCR(uploadResult.fileUrl)
      setOcrResult(ocrResult)

      if (ocrResult.success && ocrResult.data) {
        if (ocrResult.confidence >= 80) {
          setState('success')
          toast.success('KTP berhasil diproses', { duration: 4000 })
          onOCRComplete?.(ocrResult.data, ocrResult.confidence)
        } else {
          setState('low_confidence')
          toast.warning(
            `Data KTP ter-ekstrak, mohon verifikasi karena confidence rendah (${ocrResult.confidence}%)`,
            { duration: 8000 }
          )
          onOCRComplete?.(ocrResult.data, ocrResult.confidence)
        }
      } else {
        setState('error')
        const errorMsg = ocrResult.error || 'Gagal memproses KTP'
        toast.error(`Gagal memproses KTP: ${errorMsg}`, { duration: 8000 })
        onError?.(errorMsg)
      }
    } catch (error) {
      setState('error')
      const errorMsg = 'Terjadi kesalahan saat upload'
      toast.error(errorMsg, { duration: 8000 })
      onError?.(errorMsg)
    }
  }

  const handleCancel = () => {
    setState('idle')
    setUploadProgress(0)
    setSelectedFile(null)
    setFileUrl('')
    setOcrResult(null)
    toast.info('Upload dibatalkan', { duration: 4000 })
  }

  const handleRetry = () => {
    setState('idle')
    setUploadProgress(0)
    setSelectedFile(null)
    setFileUrl('')
    setOcrResult(null)
  }

  const handleManualEntry = () => {
    toast.info('Silakan isi data manual')
    // In production, this would enable manual form entry or navigate to manual form
  }

  // Idle state - show upload zone
  if (state === 'idle') {
    return <DocumentUploadZone onFileSelect={handleFileSelect} />
  }

  // Uploading state
  if (state === 'uploading') {
    return (
      <div className="rounded-lg border-2 border-slate-300 bg-white p-24 space-y-16">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-12 mb-8">
              <Loader2 className="h-20 w-20 text-blue-600 animate-spin" />
              <span className="text-body font-medium text-slate-900">
                Mengupload... {uploadProgress}%
              </span>
            </div>
            <p className="text-body-sm text-slate-600 truncate">
              {selectedFile?.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Batalkan
          </Button>
        </div>
        <Progress value={uploadProgress} className="h-8" />
      </div>
    )
  }

  // OCR Processing state
  if (state === 'processing_ocr') {
    return (
      <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-24 space-y-16">
        <div className="flex items-center gap-12">
          <Loader2 className="h-24 w-24 text-blue-600 animate-spin" />
          <div className="flex-1">
            <p className="text-body font-medium text-blue-900">
              Membaca data dari KTP...
            </p>
            <p className="text-body-sm text-blue-700">
              ~3-5 detik {processingTime > 3 && `(${processingTime} detik...)`}
            </p>
          </div>
        </div>
        <Progress value={undefined} className="h-8" />
      </div>
    )
  }

  // Success state
  if (state === 'success' && ocrResult?.data) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-24 space-y-16">
        <div className="flex items-center gap-12">
          <CheckCircle2 className="h-48 w-48 text-green-600" />
          <div className="flex-1">
            <p className="text-body font-semibold text-green-900">
              Berhasil diproses
            </p>
            <p className="text-body-sm text-green-700">
              Confidence: {ocrResult.confidence}%
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Upload Ulang
          </Button>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-12 text-body-sm text-green-700">
            <span className="truncate">{selectedFile.name}</span>
          </div>
        )}
      </div>
    )
  }

  // Low confidence warning state
  if (state === 'low_confidence' && ocrResult?.data) {
    return (
      <div className="rounded-lg border-2 border-amber-500 bg-amber-50 p-24 space-y-16">
        <div className="flex items-center gap-12">
          <AlertTriangle className="h-48 w-48 text-amber-600" />
          <div className="flex-1">
            <p className="text-body font-semibold text-amber-900">
              Confidence rendah, verifikasi data
            </p>
            <p className="text-body-sm text-amber-700">
              Confidence: {ocrResult.confidence}%. Mohon periksa data dengan teliti.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Upload Ulang
          </Button>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-12 text-body-sm text-amber-700">
            <span className="truncate">{selectedFile.name}</span>
          </div>
        )}
      </div>
    )
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="rounded-lg border-2 border-red-500 bg-red-50 p-24 space-y-16">
        <div className="flex items-start gap-12">
          <AlertCircle className="h-48 w-48 text-red-600 flex-shrink-0" />
          <div className="flex-1 space-y-8">
            <div>
              <p className="text-body font-semibold text-red-900">
                Gagal membaca KTP
              </p>
              <p className="text-body text-slate-600 mt-4">
                {ocrResult?.error || 'Terjadi kesalahan saat memproses'}
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <Button onClick={handleRetry}>Upload Ulang</Button>
              <Button variant="outline" onClick={handleManualEntry}>
                Isi Manual
              </Button>
            </div>
          </div>
        </div>
        {selectedFile && (
          <div className="flex items-center gap-12 text-body-sm text-red-700">
            <X className="h-16 w-16" />
            <span className="truncate">{selectedFile.name}</span>
          </div>
        )}
      </div>
    )
  }

  return null
}
