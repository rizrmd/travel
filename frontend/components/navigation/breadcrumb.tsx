"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /**
   * Show home icon for the first item
   * @default true
   */
  showHomeIcon?: boolean
  /**
   * Separator between breadcrumb items
   * @default "chevron"
   */
  separator?: "chevron" | "slash"
  className?: string
}

export function Breadcrumb({
  items,
  showHomeIcon = true,
  separator = "chevron",
  className,
}: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null
  }

  const Separator = separator === "chevron" ? ChevronRight : () => <span className="mx-8">/</span>

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-body-sm", className)}
    >
      <ol className="flex items-center flex-wrap gap-4">
        {items.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === items.length - 1
          const isCurrent = item.isCurrentPage || isLast

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-4"
            >
              {index > 0 && (
                <Separator
                  className={cn(
                    "h-16 w-16 text-slate-400",
                    separator === "slash" && "h-auto w-auto"
                  )}
                  aria-hidden="true"
                />
              )}

              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-6",
                    "text-slate-600 hover:text-slate-900",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                  )}
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-16 w-16" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-6",
                    isCurrent
                      ? "text-slate-900 font-medium"
                      : "text-slate-600"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {isFirst && showHomeIcon && (
                    <Home className="h-16 w-16" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
