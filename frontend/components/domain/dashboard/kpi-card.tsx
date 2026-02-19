"use client"

import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type KPIStatus = 'urgent' | 'soon' | 'ready'

interface KPICardProps {
  title: string
  value: number
  status: KPIStatus
  onClick?: () => void
  isActive?: boolean
}

const statusConfig = {
  urgent: {
    gradient: 'from-status-urgent to-red-600',
    icon: AlertCircle,
    ariaLabel: 'mendesak',
  },
  soon: {
    gradient: 'from-status-soon to-amber-600',
    icon: Clock,
    ariaLabel: 'segera',
  },
  ready: {
    gradient: 'from-status-ready to-green-600',
    icon: CheckCircle,
    ariaLabel: 'siap',
  },
}

export function KPICard({ title, value, status, onClick, isActive = false }: KPICardProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl p-24 text-white transition-all",
        `bg-gradient-to-br ${config.gradient}`,
        onClick && "cursor-pointer hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        isActive && "ring-4 ring-primary scale-[1.02]",
        !onClick && "pointer-events-none"
      )}
      aria-label={onClick ? `${value} jamaah ${config.ariaLabel}` : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Background Icon */}
      <div className="absolute right-4 top-4 opacity-20">
        <Icon size={64} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="relative space-y-8">
        {/* Icon */}
        <div className="flex items-center gap-8">
          <Icon size={24} strokeWidth={2} />
          <h3 className="text-body font-sans font-medium">{title}</h3>
        </div>

        {/* Value */}
        <div className="text-kpi font-display font-bold leading-none">
          {value}
        </div>
      </div>
    </Component>
  )
}
