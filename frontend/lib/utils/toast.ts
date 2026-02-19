import { toast as sonnerToast, type ExternalToast } from "sonner"

/**
 * Enhanced toast utilities with consistent patterns and Indonesian messages
 * Built on top of Sonner toast library
 */

interface ToastOptions extends ExternalToast {
  /**
   * Toast description (subtitle)
   */
  description?: string
}

/**
 * Standard toast durations (in milliseconds)
 */
export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 4000,
  LONG: 8000,
  PERSISTENT: Infinity,
} as const

/**
 * Success toast with green checkmark
 */
export function success(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, {
    duration: TOAST_DURATION.DEFAULT,
    ...options,
  })
}

/**
 * Error toast with red X
 */
export function error(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, {
    duration: TOAST_DURATION.LONG,
    ...options,
  })
}

/**
 * Warning toast with amber triangle
 */
export function warning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    duration: TOAST_DURATION.LONG,
    ...options,
  })
}

/**
 * Info toast with blue info icon
 */
export function info(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, {
    duration: TOAST_DURATION.DEFAULT,
    ...options,
  })
}

/**
 * Loading toast - must be dismissed manually or with promise
 */
export function loading(message: string, options?: ToastOptions) {
  return sonnerToast.loading(message, {
    duration: TOAST_DURATION.PERSISTENT,
    ...options,
  })
}

/**
 * Promise toast - shows loading, then success/error based on promise resolution
 */
export function promise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: Error) => string)
  }
) {
  return sonnerToast.promise(promise, messages)
}

/**
 * Dismiss a specific toast by ID
 */
export function dismiss(toastId?: string | number) {
  return sonnerToast.dismiss(toastId)
}

/**
 * Common toast messages for typical operations
 */
export const messages = {
  // Save operations
  saveSuccess: "Data berhasil disimpan",
  saveError: "Gagal menyimpan data",
  saving: "Menyimpan data...",

  // Delete operations
  deleteSuccess: "Data berhasil dihapus",
  deleteError: "Gagal menghapus data",
  deleting: "Menghapus data...",

  // Create operations
  createSuccess: "Data berhasil dibuat",
  createError: "Gagal membuat data",
  creating: "Membuat data...",

  // Update operations
  updateSuccess: "Data berhasil diperbarui",
  updateError: "Gagal memperbarui data",
  updating: "Memperbarui data...",

  // Upload operations
  uploadSuccess: "File berhasil diupload",
  uploadError: "Gagal mengupload file",
  uploading: "Mengupload file...",

  // Network errors
  networkError: "Tidak dapat terhubung ke server",
  timeout: "Permintaan melebihi batas waktu",

  // Permission errors
  unauthorized: "Anda tidak memiliki akses",
  forbidden: "Aksi tidak diizinkan",

  // Validation errors
  validationError: "Mohon periksa kembali data yang diisi",
  requiredFields: "Mohon lengkapi semua field yang wajib diisi",

  // Generic
  success: "Berhasil",
  error: "Terjadi kesalahan",
  loading: "Memuat...",
} as const

/**
 * Specialized toast functions for common operations
 */

export function saveOperation<T>(
  operation: Promise<T>,
  customMessages?: Partial<typeof messages>
) {
  return promise(operation, {
    loading: customMessages?.saving || messages.saving,
    success: customMessages?.saveSuccess || messages.saveSuccess,
    error: (err) =>
      customMessages?.saveError || `${messages.saveError}: ${err.message}`,
  })
}

export function deleteOperation<T>(
  operation: Promise<T>,
  customMessages?: Partial<typeof messages>
) {
  return promise(operation, {
    loading: customMessages?.deleting || messages.deleting,
    success: customMessages?.deleteSuccess || messages.deleteSuccess,
    error: (err) =>
      customMessages?.deleteError || `${messages.deleteError}: ${err.message}`,
  })
}

export function createOperation<T>(
  operation: Promise<T>,
  customMessages?: Partial<typeof messages>
) {
  return promise(operation, {
    loading: customMessages?.creating || messages.creating,
    success: customMessages?.createSuccess || messages.createSuccess,
    error: (err) =>
      customMessages?.createError || `${messages.createError}: ${err.message}`,
  })
}

export function updateOperation<T>(
  operation: Promise<T>,
  customMessages?: Partial<typeof messages>
) {
  return promise(operation, {
    loading: customMessages?.updating || messages.updating,
    success: customMessages?.updateSuccess || messages.updateSuccess,
    error: (err) =>
      customMessages?.updateError || `${messages.updateError}: ${err.message}`,
  })
}

export function uploadOperation<T>(
  operation: Promise<T>,
  customMessages?: Partial<typeof messages>
) {
  return promise(operation, {
    loading: customMessages?.uploading || messages.uploading,
    success: customMessages?.uploadSuccess || messages.uploadSuccess,
    error: (err) =>
      customMessages?.uploadError || `${messages.uploadError}: ${err.message}`,
  })
}

/**
 * Export all toast functions as a namespace
 */
export const toast = {
  success,
  error,
  warning,
  info,
  loading,
  promise,
  dismiss,
  messages,
  // Operation helpers
  save: saveOperation,
  delete: deleteOperation,
  create: createOperation,
  update: updateOperation,
  upload: uploadOperation,
}
