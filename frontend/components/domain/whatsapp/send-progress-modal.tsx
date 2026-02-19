"use client"

import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SendProgress } from "@/lib/whatsapp/bulk-send"
import { cn } from "@/lib/utils"

interface SendProgressModalProps {
  open: boolean
  progress: SendProgress
  onCancel?: () => void
}

export function SendProgressModal({
  open,
  progress,
  onCancel,
}: SendProgressModalProps) {
  const percentage = (progress.current / progress.total) * 100

  const statusConfig = {
    sending: {
      icon: Loader2,
      iconClass: "text-blue-600 animate-spin",
      title: "Mengirim pesan...",
      bgClass: "bg-blue-50",
    },
    success: {
      icon: CheckCircle2,
      iconClass: "text-green-600",
      title: `Berhasil mengirim ke ${progress.total} jamaah`,
      bgClass: "bg-green-50",
    },
    partial: {
      icon: AlertCircle,
      iconClass: "text-amber-600",
      title: `Berhasil ${progress.current - progress.failed} dari ${progress.total}, ${progress.failed} gagal`,
      bgClass: "bg-amber-50",
    },
    error: {
      icon: XCircle,
      iconClass: "text-red-600",
      title: "Gagal mengirim pesan",
      bgClass: "bg-red-50",
    },
  }

  const config = statusConfig[progress.status]
  const Icon = config.icon
  const canCancel = progress.status === 'sending' && progress.current < progress.total

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-12">
            <Icon className={cn("h-24 w-24", config.iconClass)} />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {progress.status === 'sending' && 'Harap tunggu, jangan tutup halaman ini'}
            {progress.status === 'success' && 'Semua pesan WhatsApp berhasil dikirim'}
            {progress.status === 'partial' && 'Beberapa pesan gagal dikirim'}
            {progress.status === 'error' && 'Terjadi kesalahan saat mengirim pesan'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-16 py-16" role="status" aria-live="polite">
          {/* Progress Bar */}
          <div className="space-y-8">
            <div className="flex justify-between text-body-sm text-slate-600">
              <span>Progress</span>
              <span className="font-medium text-slate-900">
                {progress.current} / {progress.total} jamaah
              </span>
            </div>
            <Progress value={percentage} className="h-8" />
          </div>

          {/* Status Message */}
          <div className={cn("rounded-lg p-16", config.bgClass)}>
            {progress.status === 'sending' && (
              <p className="text-body-sm text-blue-900">
                Mengirim pesan ke jamaah {progress.current} dari {progress.total}...
              </p>
            )}
            {progress.status === 'success' && (
              <p className="text-body-sm text-green-900">
                ✓ Semua {progress.total} pesan WhatsApp berhasil dibuka di tab baru.
                Silakan lanjutkan pengiriman dari aplikasi WhatsApp.
              </p>
            )}
            {progress.status === 'partial' && (
              <p className="text-body-sm text-amber-900">
                ⚠️ {progress.current - progress.failed} pesan berhasil, {progress.failed} pesan gagal.
                Silakan coba kirim ulang untuk yang gagal.
              </p>
            )}
            {progress.status === 'error' && (
              <p className="text-body-sm text-red-900">
                ✗ Gagal mengirim pesan. Silakan coba lagi atau hubungi administrator.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-8">
            {canCancel && onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                aria-label="Cancel sending"
              >
                Batalkan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
