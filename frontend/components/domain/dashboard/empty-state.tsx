import { LucideIcon, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function EmptyState({
  icon: Icon = UserPlus,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-48 px-32 text-center max-w-md mx-auto"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="mb-24">
        <Icon className="h-64 w-64 text-slate-400" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-h3 font-display font-semibold text-slate-700 mb-12">
        {title}
      </h3>

      {/* Description */}
      <p className="text-body text-slate-500 mb-24">
        {description}
      </p>

      {/* Action Button */}
      <Button
        size="lg"
        onClick={onAction}
        className="h-48"
      >
        {actionLabel}
      </Button>
    </div>
  )
}
