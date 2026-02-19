"use client"

import * as React from "react"
import { UseFormReturn } from "react-hook-form"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FileUploadFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: string
  /**
   * Accepted file types (e.g., "image/jpeg,image/png,application/pdf")
   */
  accept?: string
  /**
   * Maximum file size in bytes
   * @default 5242880 (5MB)
   */
  maxSize?: number
  /**
   * Allow multiple files
   * @default false
   */
  multiple?: boolean
  /**
   * Callback when file is selected
   */
  onFileSelect?: (files: File[]) => void
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function FileUploadField({
  form,
  name,
  label,
  description,
  disabled,
  required,
  className,
  accept = "image/jpeg,image/png,application/pdf",
  maxSize = DEFAULT_MAX_SIZE,
  multiple = false,
  onFileSelect,
}: FileUploadFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const validateFile = (file: File): boolean => {
    // Check file type
    const acceptedTypes = accept.split(",").map((t) => t.trim())
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Format file tidak didukung: ${file.type}`, {
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

  const handleFiles = (files: FileList | null, field: any) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(validateFile)

    if (validFiles.length === 0) return

    if (multiple) {
      const currentFiles = field.value || []
      const newFiles = [...currentFiles, ...validFiles]
      field.onChange(newFiles)
      onFileSelect?.(newFiles)
    } else {
      field.onChange(validFiles[0])
      onFileSelect?.(validFiles)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, field: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    handleFiles(e.dataTransfer.files, field)
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRemoveFile = (index: number, field: any) => {
    if (multiple) {
      const newFiles = (field.value || []).filter(
        (_: any, i: number) => i !== index
      )
      field.onChange(newFiles.length > 0 ? newFiles : undefined)
      onFileSelect?.(newFiles)
    } else {
      field.onChange(undefined)
      onFileSelect?.([])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-8", className)}>
          {label && (
            <FormLabel
              className={cn(
                required &&
                  "after:content-['*'] after:ml-4 after:text-red-600"
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, field)}
              className={cn(
                "relative border-2 border-dashed rounded-lg transition-all",
                isDragOver
                  ? "border-primary bg-blue-50"
                  : "border-slate-300 bg-slate-50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Upload Area */}
              {(!field.value ||
                (multiple && (!field.value || field.value.length === 0))) && (
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={disabled}
                  className={cn(
                    "w-full p-24 flex flex-col items-center justify-center gap-12",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                  )}
                >
                  <Upload
                    className={cn(
                      "h-48 w-48",
                      isDragOver ? "text-primary" : "text-slate-400"
                    )}
                  />
                  <div className="text-center space-y-4">
                    <p className="text-body font-medium text-slate-700">
                      Seret file ke sini atau klik untuk upload
                    </p>
                    <p className="text-body-sm text-slate-500">
                      {accept
                        .split(",")
                        .map((t) => t.split("/")[1]?.toUpperCase())
                        .join(", ")}
                      {" • "}
                      Maks. {(maxSize / (1024 * 1024)).toFixed(0)}MB
                    </p>
                  </div>
                </button>
              )}

              {/* Selected Files Display */}
              {field.value && (
                <div className="p-16 space-y-8">
                  {multiple ? (
                    (field.value as File[]).map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-12 p-12 bg-white rounded-lg border border-slate-200"
                      >
                        <FileIcon className="h-20 w-20 text-slate-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-caption text-slate-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index, field)}
                          disabled={disabled}
                          className="flex-shrink-0"
                        >
                          <X className="h-16 w-16" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-12 p-12 bg-white rounded-lg border border-slate-200">
                      <FileIcon className="h-20 w-20 text-slate-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-medium text-slate-900 truncate">
                          {(field.value as File).name}
                        </p>
                        <p className="text-caption text-slate-500">
                          {formatFileSize((field.value as File).size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(0, field)}
                        disabled={disabled}
                        className="flex-shrink-0"
                      >
                        <X className="h-16 w-16" />
                      </Button>
                    </div>
                  )}

                  {/* Add More Files Button (for multiple) */}
                  {multiple && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClick}
                      disabled={disabled}
                      className="w-full"
                    >
                      <Upload className="h-16 w-16 mr-8" />
                      Tambah File
                    </Button>
                  )}
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => handleFiles(e.target.files, field)}
                className="hidden"
                disabled={disabled}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
