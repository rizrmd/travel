"use client"

import * as React from "react"
import { AlertTriangle, Info, Trash2, type LucideIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Dialog title
   */
  title: string
  /**
   * Dialog description/message
   */
  description: string
  /**
   * Confirm button text
   * @default "Konfirmasi"
   */
  confirmText?: string
  /**
   * Cancel button text
   * @default "Batal"
   */
  cancelText?: string
  /**
   * Callback when confirmed
   */
  onConfirm: () => void | Promise<void>
  /**
   * Callback when cancelled
   */
  onCancel?: () => void
  /**
   * Whether the action is destructive (red confirm button)
   * @default false
   */
  destructive?: boolean
  /**
   * Icon to display
   */
  icon?: LucideIcon
  /**
   * Whether the confirm action is loading
   */
  isLoading?: boolean
  /**
   * Additional className for the content
   */
  className?: string
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  destructive = false,
  icon: Icon,
  isLoading = false,
  className,
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    // Dialog will close automatically unless onOpenChange is controlled
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          {Icon && (
            <div className="mb-16">
              <div
                className={cn(
                  "h-48 w-48 rounded-full flex items-center justify-center mx-auto",
                  destructive ? "bg-red-50" : "bg-blue-50"
                )}
              >
                <Icon
                  className={cn(
                    "h-24 w-24",
                    destructive ? "text-red-600" : "text-blue-600"
                  )}
                />
              </div>
            </div>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              destructive &&
                "bg-red-600 hover:bg-red-700 focus:ring-red-600"
            )}
          >
            {isLoading ? "Memproses..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Hook to manage confirmation dialog state
 */
export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<
    Omit<ConfirmationDialogProps, "open" | "onOpenChange">
  >({
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const confirm = React.useCallback(
    (newConfig: Omit<ConfirmationDialogProps, "open" | "onOpenChange">) => {
      setConfig(newConfig)
      setIsOpen(true)
    },
    []
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    config,
    confirm,
    close,
    ConfirmationDialog: () => (
      <ConfirmationDialog
        {...config}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    ),
  }
}

/**
 * Pre-configured confirmation dialogs for common scenarios
 */

interface DeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName?: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  itemName = "item ini",
  onConfirm,
  isLoading,
}: DeleteConfirmationProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Data?"
      description={`Apakah Anda yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`}
      confirmText="Ya, Hapus"
      cancelText="Batal"
      onConfirm={onConfirm}
      destructive
      icon={Trash2}
      isLoading={isLoading}
    />
  )
}

interface UnsavedChangesConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export function UnsavedChangesConfirmation({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: UnsavedChangesConfirmationProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Perubahan Belum Disimpan"
      description="Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?"
      confirmText="Ya, Tinggalkan"
      cancelText="Tetap di Sini"
      onConfirm={onConfirm}
      onCancel={onCancel}
      destructive
      icon={AlertTriangle}
    />
  )
}

interface LogoutConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
}

export function LogoutConfirmation({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmationProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Keluar dari Akun?"
      description="Apakah Anda yakin ingin keluar dari akun Anda?"
      confirmText="Ya, Keluar"
      cancelText="Batal"
      onConfirm={onConfirm}
      icon={Info}
    />
  )
}
