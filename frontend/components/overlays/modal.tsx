"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Modal title
   */
  title?: string
  /**
   * Modal description
   */
  description?: string
  /**
   * Modal content
   */
  children: React.ReactNode
  /**
   * Footer content
   */
  footer?: React.ReactNode
  /**
   * Size of the modal
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl" | "full"
  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean
  /**
   * Prevent closing when clicking outside
   * @default false
   */
  preventOutsideClose?: boolean
  /**
   * Additional className for content
   */
  className?: string
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] max-h-[95vh]",
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  preventOutsideClose = false,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onInteractOutside={(e) => {
          if (preventOutsideClose) {
            e.preventDefault()
          }
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}

        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              "absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-slate-500"
            )}
          >
            <X className="h-16 w-16" />
            <span className="sr-only">Tutup</span>
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook to manage modal state
 */
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

/**
 * Form Modal - Modal with form submit/cancel actions
 */
interface FormModalProps extends Omit<ModalProps, "footer"> {
  /**
   * Submit button text
   * @default "Simpan"
   */
  submitText?: string
  /**
   * Cancel button text
   * @default "Batal"
   */
  cancelText?: string
  /**
   * Callback when submit is clicked
   */
  onSubmit: () => void | Promise<void>
  /**
   * Callback when cancel is clicked
   */
  onCancel?: () => void
  /**
   * Whether the form is submitting
   */
  isSubmitting?: boolean
  /**
   * Disable submit button
   */
  isSubmitDisabled?: boolean
}

export function FormModal({
  submitText = "Simpan",
  cancelText = "Batal",
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSubmitDisabled = false,
  ...modalProps
}: FormModalProps) {
  const handleCancel = () => {
    onCancel?.()
    modalProps.onOpenChange(false)
  }

  const footer = (
    <div className="flex justify-end gap-12">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        {cancelText}
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || isSubmitDisabled}
      >
        {isSubmitting ? "Menyimpan..." : submitText}
      </Button>
    </div>
  )

  return <Modal {...modalProps} footer={footer} preventOutsideClose={isSubmitting} />
}

/**
 * Confirmation Modal - Simple yes/no confirmation
 */
interface ConfirmModalProps extends Omit<ModalProps, "children" | "footer"> {
  /**
   * Confirmation message
   */
  message: string
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
   * Whether the action is destructive
   */
  destructive?: boolean
}

export function ConfirmModal({
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  destructive = false,
  ...modalProps
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      modalProps.onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const footer = (
    <div className="flex justify-end gap-12">
      <Button
        type="button"
        variant="outline"
        onClick={() => modalProps.onOpenChange(false)}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isLoading}
        className={cn(
          destructive && "bg-red-600 hover:bg-red-700"
        )}
      >
        {isLoading ? "Memproses..." : confirmText}
      </Button>
    </div>
  )

  return (
    <Modal
      {...modalProps}
      size="sm"
      footer={footer}
      preventOutsideClose={isLoading}
    >
      <p className="text-body text-slate-600">{message}</p>
    </Modal>
  )
}
