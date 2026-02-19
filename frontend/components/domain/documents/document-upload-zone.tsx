"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DocumentUploadZoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export function DocumentUploadZone({
  onFileSelect,
  accept = "image/jpeg,image/png",
  maxSize = MAX_FILE_SIZE,
  disabled = false,
  className,
}: DocumentUploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Validate file
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG atau PNG.', {
        duration: 5000,
      })
      return false
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      toast.error(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`, {
        duration: 5000,
      })
      return false
    }

    return true
  }

  // Handle file selection
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  // Click to upload handler
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={cn("relative", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Upload KTP document, drag and drop or click to select file"
        className={cn(
          "w-full rounded-lg border-2 border-dashed transition-all",
          "flex flex-col items-center justify-center gap-16 p-24",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
          "h-[200px] md:h-[300px]",
          isDragOver
            ? "border-primary bg-blue-50 border-solid"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100",
          disabled && "opacity-50 cursor-not-allowed hover:border-slate-300 hover:bg-slate-50"
        )}
      >
        {/* Upload Icon */}
        <Upload
          className={cn(
            "h-64 w-64 transition-colors",
            isDragOver ? "text-primary" : "text-slate-400"
          )}
          strokeWidth={1.5}
        />

        {/* Text Instructions */}
        <div className="space-y-8 text-center">
          <p className="text-body font-medium text-slate-700">
            Seret foto KTP ke sini atau klik untuk upload
          </p>
          <div className="space-y-4">
            <p className="text-body-sm text-slate-500">
              Format: JPG, PNG
            </p>
            <p className="text-body-sm text-slate-500">
              Ukuran maksimal 5MB
            </p>
          </div>
        </div>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
