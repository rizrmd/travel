import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type Status = 'urgent' | 'soon' | 'ready'
export type BadgeSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
  status: Status
  size?: BadgeSize
  className?: string
}

const statusConfig = {
  urgent: {
    bg: 'bg-status-urgent',
    text: 'Mendesak',
    icon: AlertCircle,
  },
  soon: {
    bg: 'bg-status-soon',
    text: 'Segera',
    icon: Clock,
  },
  ready: {
    bg: 'bg-status-ready',
    text: 'Siap',
    icon: CheckCircle,
  },
}

const sizeConfig = {
  sm: {
    height: 'h-20',
    fontSize: 'text-caption',
    iconSize: 14,
    padding: 'px-8 py-4',
  },
  md: {
    height: 'h-24',
    fontSize: 'text-body-sm',
    iconSize: 16,
    padding: 'px-12 py-6',
  },
  lg: {
    height: 'h-32',
    fontSize: 'text-body',
    iconSize: 20,
    padding: 'px-16 py-8',
  },
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const statusCfg = statusConfig[status]
  const sizeCfg = sizeConfig[size]
  const Icon = statusCfg.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-md font-semibold text-white shadow-sm",
        statusCfg.bg,
        sizeCfg.height,
        sizeCfg.fontSize,
        sizeCfg.padding,
        className
      )}
    >
      <Icon size={sizeCfg.iconSize} strokeWidth={2.5} />
      <span>{statusCfg.text}</span>
    </div>
  )
}
