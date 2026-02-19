"use client"

import * as React from "react"
import { Info, HelpCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

/**
 * Simple Tooltip Wrapper
 */
interface SimpleTooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode
  /**
   * Element to trigger the tooltip
   */
  children: React.ReactElement
  /**
   * Side of the trigger where tooltip should appear
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Delay before showing tooltip (ms)
   * @default 200
   */
  delayDuration?: number
  /**
   * Additional className for content
   */
  className?: string
}

export function SimpleTooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  className,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Info Tooltip - Small info icon with tooltip
 */
interface InfoTooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode
  /**
   * Icon to use
   * @default Info
   */
  icon?: LucideIcon
  /**
   * Icon size class
   * @default "h-16 w-16"
   */
  iconSize?: string
  /**
   * Side of the trigger where tooltip should appear
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Additional className
   */
  className?: string
}

export function InfoTooltip({
  content,
  icon: Icon = Info,
  iconSize = "h-16 w-16",
  side = "top",
  className,
}: InfoTooltipProps) {
  return (
    <SimpleTooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          "inline-flex text-slate-500 hover:text-slate-700 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded",
          className
        )}
        aria-label="Informasi tambahan"
      >
        <Icon className={iconSize} />
      </button>
    </SimpleTooltip>
  )
}

/**
 * Help Tooltip - Question mark icon with tooltip
 */
export function HelpTooltip(props: Omit<InfoTooltipProps, "icon">) {
  return <InfoTooltip {...props} icon={HelpCircle} />
}

/**
 * Rich Popover - Popover with title and description
 */
interface RichPopoverProps {
  /**
   * Trigger element
   */
  trigger: React.ReactNode
  /**
   * Popover title
   */
  title?: string
  /**
   * Popover content
   */
  children: React.ReactNode
  /**
   * Side where popover should appear
   * @default "bottom"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Alignment of the popover
   * @default "center"
   */
  align?: "start" | "center" | "end"
  /**
   * Width of the popover content
   */
  width?: "sm" | "md" | "lg"
}

const widthClasses = {
  sm: "w-[200px]",
  md: "w-[300px]",
  lg: "w-[400px]",
}

export function RichPopover({
  trigger,
  title,
  children,
  side = "bottom",
  align = "center",
  width = "md",
}: RichPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn("p-0", widthClasses[width])}
      >
        {title && (
          <div className="px-16 py-12 border-b">
            <h4 className="text-body-sm font-semibold text-slate-900">
              {title}
            </h4>
          </div>
        )}
        <div className="p-16">{children}</div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Info Popover - Information icon that opens a popover
 */
interface InfoPopoverProps {
  /**
   * Popover title
   */
  title?: string
  /**
   * Popover content
   */
  children: React.ReactNode
  /**
   * Icon to use
   * @default Info
   */
  icon?: LucideIcon
  /**
   * Icon size
   * @default "h-16 w-16"
   */
  iconSize?: string
  /**
   * Width of the popover
   */
  width?: "sm" | "md" | "lg"
}

export function InfoPopover({
  title,
  children,
  icon: Icon = Info,
  iconSize = "h-16 w-16",
  width = "md",
}: InfoPopoverProps) {
  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex text-slate-500 hover:text-slate-700 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      )}
      aria-label={title || "Informasi tambahan"}
    >
      <Icon className={iconSize} />
    </button>
  )

  return (
    <RichPopover trigger={trigger} title={title} width={width}>
      {children}
    </RichPopover>
  )
}

/**
 * Menu Popover - Popover with list of actions
 */
interface MenuAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}

interface MenuPopoverProps {
  /**
   * Trigger element
   */
  trigger: React.ReactNode
  /**
   * List of menu actions
   */
  actions: MenuAction[]
  /**
   * Side where popover should appear
   * @default "bottom"
   */
  side?: "top" | "right" | "bottom" | "left"
  /**
   * Alignment
   * @default "end"
   */
  align?: "start" | "center" | "end"
}

export function MenuPopover({
  trigger,
  actions,
  side = "bottom",
  align = "end",
}: MenuPopoverProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="w-[200px] p-4"
      >
        <div className="flex flex-col gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon

            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  action.onClick()
                  setOpen(false)
                }}
                disabled={action.disabled}
                className={cn(
                  "justify-start",
                  action.destructive && "text-red-600 hover:text-red-700"
                )}
              >
                {Icon && <Icon className="h-16 w-16 mr-8" />}
                {action.label}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Form Field Helper - Adds an info icon next to form labels
 */
interface FormFieldHelperProps {
  /**
   * Helper text or content
   */
  content: React.ReactNode
  /**
   * Additional className
   */
  className?: string
}

export function FormFieldHelper({ content, className }: FormFieldHelperProps) {
  return (
    <InfoTooltip
      content={content}
      iconSize="h-14 w-14"
      side="right"
      className={cn("ml-4 align-middle", className)}
    />
  )
}
