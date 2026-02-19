"use client"

import * as React from "react"
import { Globe, Link2, CheckCircle, AlertCircle, Loader2, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/lib/utils/toast"
import { cn } from "@/lib/utils"

type PublishStatus = "idle" | "publishing" | "success" | "error"

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPublish: (domain: string) => Promise<{ success: boolean; url?: string; error?: string }>
  currentUrl?: string
}

export function PublishDialog({
  open,
  onOpenChange,
  onPublish,
  currentUrl,
}: PublishDialogProps) {
  const [domain, setDomain] = React.useState("")
  const [status, setStatus] = React.useState<PublishStatus>("idle")
  const [publishedUrl, setPublishedUrl] = React.useState(currentUrl || "")
  const [error, setError] = React.useState("")

  const isValidDomain = (value: string) => {
    // Simple domain validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i
    return domainRegex.test(value)
  }

  const handlePublish = async () => {
    if (!domain) {
      setError("Domain wajib diisi")
      return
    }

    if (!isValidDomain(domain)) {
      setError("Domain tidak valid. Gunakan huruf, angka, dan tanda hubung saja")
      return
    }

    setStatus("publishing")
    setError("")

    try {
      const result = await onPublish(domain)

      if (result.success && result.url) {
        setStatus("success")
        setPublishedUrl(result.url)
        toast.success("Landing page berhasil dipublikasi!")
      } else {
        setStatus("error")
        setError(result.error || "Gagal mempublikasi landing page")
        toast.error("Gagal mempublikasi landing page")
      }
    } catch (err) {
      setStatus("error")
      setError("Terjadi kesalahan saat mempublikasi")
      toast.error("Terjadi kesalahan")
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publishedUrl)
    toast.success("URL disalin ke clipboard")
  }

  const handleReset = () => {
    setStatus("idle")
    setDomain("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-8">
            <Globe className="h-20 w-20 text-blue-600" />
            Publikasi Landing Page
          </DialogTitle>
          <DialogDescription>
            Publikasikan landing page Anda agar dapat diakses oleh calon jamaah
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-16 py-16">
          {status === "success" ? (
            // Success State
            <div className="space-y-16">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-16 w-16 text-green-600" />
                <AlertDescription className="text-green-800">
                  Landing page Anda telah berhasil dipublikasi!
                </AlertDescription>
              </Alert>

              <div className="space-y-8">
                <Label>URL Landing Page</Label>
                <div className="flex gap-8">
                  <Input
                    value={publishedUrl}
                    readOnly
                    className="font-mono text-body-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-16 w-16" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-8">
                <Button
                  variant="outline"
                  onClick={() => window.open(publishedUrl, "_blank")}
                  className="flex-1"
                >
                  Buka Landing Page
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Publikasi Ulang
                </Button>
              </div>
            </div>
          ) : (
            // Publish Form
            <>
              <div className="space-y-8">
                <Label htmlFor="domain">
                  Domain <span className="text-red-600">*</span>
                </Label>
                <div className="flex items-center gap-8">
                  <span className="text-body-sm text-slate-600">
                    https://
                  </span>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value.toLowerCase())
                      setError("")
                    }}
                    placeholder="nama-agen"
                    disabled={status === "publishing"}
                    className="flex-1"
                  />
                  <span className="text-body-sm text-slate-600">
                    .umroh.id
                  </span>
                </div>
                <p className="text-caption text-slate-500">
                  Landing page Anda akan tersedia di:{" "}
                  <span className="font-mono text-blue-600">
                    https://{domain || "nama-agen"}.umroh.id
                  </span>
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-16 w-16" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {status === "publishing" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                  <AlertDescription className="text-blue-800">
                    Sedang mempublikasi landing page Anda...
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        {status !== "success" && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={status === "publishing"}
            >
              Batal
            </Button>
            <Button
              onClick={handlePublish}
              disabled={status === "publishing" || !domain}
            >
              {status === "publishing" ? (
                <>
                  <Loader2 className="h-16 w-16 mr-8 animate-spin" />
                  Mempublikasi...
                </>
              ) : (
                <>
                  <Globe className="h-16 w-16 mr-8" />
                  Publikasi Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
