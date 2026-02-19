"use client"

import * as React from "react"
import { Share2, Facebook, Instagram, MessageCircle, Link2, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/utils/toast"
import { cn } from "@/lib/utils"

interface SocialSharingProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function SocialSharing({ url, title, description, className }: SocialSharingProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || "")

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success("Link disalin ke clipboard")
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400")
  }

  return (
    <Card className={cn("p-24", className)}>
      <div className="flex items-center gap-12 mb-24">
        <Share2 className="h-20 w-20 text-blue-600" />
        <div>
          <h3 className="font-display font-semibold text-slate-900">
            Bagikan Landing Page
          </h3>
          <p className="text-body-sm text-slate-600">
            Bagikan landing page Anda ke media sosial
          </p>
        </div>
      </div>

      <div className="space-y-24">
        {/* URL Preview */}
        <div className="space-y-8">
          <div className="flex gap-8">
            <Input
              value={url}
              readOnly
              className="font-mono text-body-sm"
            />
            <Button
              variant="outline"
              onClick={handleCopyLink}
            >
              <Copy className="h-16 w-16 mr-8" />
              Salin
            </Button>
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="space-y-12">
          <h4 className="text-body-sm font-medium text-slate-900">
            Bagikan ke Media Sosial
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <Button
              variant="outline"
              onClick={() => handleShare("whatsapp")}
              className="flex-col h-auto py-16"
            >
              <MessageCircle className="h-24 w-24 mb-8 text-green-600" />
              <span className="text-body-sm">WhatsApp</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("facebook")}
              className="flex-col h-auto py-16"
            >
              <Facebook className="h-24 w-24 mb-8 text-blue-600" />
              <span className="text-body-sm">Facebook</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("twitter")}
              className="flex-col h-auto py-16"
            >
              <svg
                className="h-24 w-24 mb-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-body-sm">Twitter</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => handleShare("telegram")}
              className="flex-col h-auto py-16"
            >
              <svg
                className="h-24 w-24 mb-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.10.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span className="text-body-sm">Telegram</span>
            </Button>
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-8 pt-16 border-t">
          <h4 className="text-body-sm font-medium text-slate-900">
            Kode Embed (iFrame)
          </h4>
          <div className="relative">
            <pre className="p-12 bg-slate-900 text-slate-100 rounded text-xs overflow-x-auto">
              {`<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `<iframe src="${url}" width="100%" height="600" frameborder="0"></iframe>`
                )
                toast.success("Kode embed disalin ke clipboard")
              }}
              className="absolute top-8 right-8"
            >
              <Copy className="h-14 w-14" />
            </Button>
          </div>
          <p className="text-caption text-slate-500">
            Gunakan kode ini untuk menyematkan landing page di website Anda
          </p>
        </div>
      </div>
    </Card>
  )
}
