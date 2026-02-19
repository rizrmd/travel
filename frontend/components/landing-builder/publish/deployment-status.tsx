"use client"

import * as React from "react"
import { Globe, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export interface Deployment {
  id: string
  url: string
  status: "active" | "inactive" | "failed"
  publishedAt: Date
  views?: number
  leads?: number
}

interface DeploymentStatusProps {
  deployment?: Deployment
  onPublish?: () => void
  onUnpublish?: () => void
  className?: string
}

export function DeploymentStatus({
  deployment,
  onPublish,
  onUnpublish,
  className,
}: DeploymentStatusProps) {
  if (!deployment) {
    return (
      <Card className={cn("p-24", className)}>
        <div className="text-center py-32">
          <Globe className="h-48 w-48 mx-auto text-slate-300 mb-16" />
          <h3 className="font-display font-semibold text-slate-900 mb-8">
            Landing Page Belum Dipublikasi
          </h3>
          <p className="text-body-sm text-slate-600 mb-24">
            Publikasikan landing page Anda agar dapat diakses oleh calon jamaah
          </p>
          {onPublish && (
            <Button onClick={onPublish}>
              <Globe className="h-16 w-16 mr-8" />
              Publikasi Sekarang
            </Button>
          )}
        </div>
      </Card>
    )
  }

  const statusConfig = {
    active: {
      label: "Aktif",
      color: "bg-green-600",
      icon: CheckCircle,
      badgeVariant: "default" as const,
    },
    inactive: {
      label: "Tidak Aktif",
      color: "bg-slate-400",
      icon: XCircle,
      badgeVariant: "secondary" as const,
    },
    failed: {
      label: "Gagal",
      color: "bg-red-600",
      icon: XCircle,
      badgeVariant: "destructive" as const,
    },
  }

  const config = statusConfig[deployment.status]
  const StatusIcon = config.icon

  return (
    <Card className={cn("p-24", className)}>
      <div className="space-y-16">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-12">
            <Globe className="h-20 w-20 text-blue-600" />
            <div>
              <h3 className="font-display font-semibold text-slate-900">
                Status Publikasi
              </h3>
              <p className="text-body-sm text-slate-600">
                Landing page Anda saat ini
              </p>
            </div>
          </div>
          <Badge
            variant={config.badgeVariant}
            className={cn(
              deployment.status === "active" && "bg-green-600 hover:bg-green-700"
            )}
          >
            <StatusIcon className="h-12 w-12 mr-4" />
            {config.label}
          </Badge>
        </div>

        {/* URL */}
        <div className="flex items-center gap-8 p-12 bg-slate-50 rounded-lg">
          <span className="flex-1 font-mono text-body-sm text-slate-700 truncate">
            {deployment.url}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(deployment.url, "_blank")}
          >
            <ExternalLink className="h-16 w-16" />
          </Button>
        </div>

        {/* Stats */}
        {deployment.status === "active" && (
          <div className="grid grid-cols-3 gap-12 pt-16 border-t">
            <div>
              <p className="text-caption text-slate-600 mb-4">Dipublikasi</p>
              <div className="flex items-center gap-4 text-body-sm text-slate-900">
                <Clock className="h-12 w-12 text-slate-400" />
                {formatDistanceToNow(deployment.publishedAt, {
                  addSuffix: true,
                  locale: id,
                })}
              </div>
            </div>
            {deployment.views !== undefined && (
              <div>
                <p className="text-caption text-slate-600 mb-4">Pengunjung</p>
                <p className="text-lg font-display font-semibold text-slate-900">
                  {deployment.views.toLocaleString("id-ID")}
                </p>
              </div>
            )}
            {deployment.leads !== undefined && (
              <div>
                <p className="text-caption text-slate-600 mb-4">Leads</p>
                <p className="text-lg font-display font-semibold text-blue-600">
                  {deployment.leads.toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-8 pt-16 border-t">
          {deployment.status === "active" && onUnpublish && (
            <Button variant="outline" onClick={onUnpublish} className="flex-1">
              Nonaktifkan
            </Button>
          )}
          {deployment.status !== "active" && onPublish && (
            <Button onClick={onPublish} className="flex-1">
              Publikasi Ulang
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(deployment.url, "_blank")}
            className="flex-1"
          >
            <ExternalLink className="h-16 w-16 mr-8" />
            Buka Landing Page
          </Button>
        </div>
      </div>
    </Card>
  )
}
