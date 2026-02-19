"use client"

import * as React from "react"
import { X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DrawerSide = "top" | "right" | "bottom" | "left"

interface DrawerProps {
  /**
   * Whether the drawer is open
   */
  open: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Side from which the drawer slides in
   * @default "right"
   */
  side?: DrawerSide
  /**
   * Drawer title
   */
  title?: string
  /**
   * Drawer description
   */
  description?: string
  /**
   * Drawer content
   */
  children: React.ReactNode
  /**
   * Footer content
   */
  footer?: React.ReactNode
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
   * Custom width/height for the drawer
   */
  size?: "sm" | "md" | "lg" | "full"
  /**
   * Additional className for content
   */
  className?: string
}

const sizeClasses = {
  right: {
    sm: "w-[300px] sm:w-[350px]",
    md: "w-[400px] sm:w-[500px]",
    lg: "w-[500px] sm:w-[600px]",
    full: "w-full",
  },
  left: {
    sm: "w-[300px] sm:w-[350px]",
    md: "w-[400px] sm:w-[500px]",
    lg: "w-[500px] sm:w-[600px]",
    full: "w-full",
  },
  top: {
    sm: "h-[200px]",
    md: "h-[400px]",
    lg: "h-[600px]",
    full: "h-full",
  },
  bottom: {
    sm: "h-[200px]",
    md: "h-[400px]",
    lg: "h-[600px]",
    full: "h-full",
  },
}

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  preventOutsideClose = false,
  size = "md",
  className,
}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          sizeClasses[side][size],
          "flex flex-col",
          className
        )}
        onInteractOutside={(e) => {
          if (preventOutsideClose) {
            e.preventDefault()
          }
        }}
      >
        {(title || description) && (
          <SheetHeader className="flex-shrink-0">
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
        )}

        <div className="flex-1 overflow-y-auto py-16">{children}</div>

        {footer && (
          <SheetFooter className="flex-shrink-0">{footer}</SheetFooter>
        )}

        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className={cn(
              "absolute right-16 top-16 rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
          >
            <X className="h-16 w-16" />
            <span className="sr-only">Tutup</span>
          </button>
        )}
      </SheetContent>
    </Sheet>
  )
}

/**
 * Hook to manage drawer state
 */
export function useDrawer() {
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
 * Form Drawer - Drawer with form submit/cancel actions
 */
interface FormDrawerProps extends Omit<DrawerProps, "footer"> {
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

export function FormDrawer({
  submitText = "Simpan",
  cancelText = "Batal",
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSubmitDisabled = false,
  ...drawerProps
}: FormDrawerProps) {
  const handleCancel = () => {
    onCancel?.()
    drawerProps.onOpenChange(false)
  }

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-12">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {cancelText}
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || isSubmitDisabled}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Menyimpan..." : submitText}
      </Button>
    </div>
  )

  return (
    <Drawer
      {...drawerProps}
      footer={footer}
      preventOutsideClose={isSubmitting}
    />
  )
}

/**
 * Detail Drawer - For viewing details with optional edit action
 */
interface DetailDrawerProps extends Omit<DrawerProps, "footer"> {
  /**
   * Edit button text
   */
  editText?: string
  /**
   * Callback when edit is clicked
   */
  onEdit?: () => void
  /**
   * Close button text
   * @default "Tutup"
   */
  closeText?: string
}

export function DetailDrawer({
  editText,
  onEdit,
  closeText = "Tutup",
  ...drawerProps
}: DetailDrawerProps) {
  const footer = (
    <div className="flex justify-end gap-12">
      <Button
        type="button"
        variant="outline"
        onClick={() => drawerProps.onOpenChange(false)}
      >
        {closeText}
      </Button>
      {editText && onEdit && (
        <Button type="button" onClick={onEdit}>
          {editText}
        </Button>
      )}
    </div>
  )

  return <Drawer {...drawerProps} footer={footer} />
}
