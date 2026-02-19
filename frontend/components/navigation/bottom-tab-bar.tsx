"use client"

import * as React from "react"
import { Home, Users, FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface TabItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
}

const defaultTabs: TabItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "jamaah",
    label: "Jamaah",
    href: "/jamaah",
    icon: Users,
  },
  {
    id: "dokumen",
    label: "Dokumen",
    href: "/dokumen",
    icon: FileText,
  },
  {
    id: "profile",
    label: "Profil",
    href: "/profile",
    icon: User,
  },
]

interface BottomTabBarProps {
  tabs?: TabItem[]
  className?: string
}

export function BottomTabBar({ tabs = defaultTabs, className }: BottomTabBarProps) {
  const pathname = usePathname()

  return (
    <nav
      role="navigation"
      aria-label="Navigasi utama"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-white border-t border-slate-200",
        "md:hidden", // Only show on mobile (<768px)
        "safe-area-inset-bottom", // iOS safe area
        className
      )}
    >
      <div className="flex items-center justify-around h-56 px-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/")

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-4",
                "min-w-[64px] py-8 px-12 rounded-lg",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-700 active:text-slate-900"
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-24 w-24 transition-all",
                  isActive && "fill-current"
                )}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={cn(
                  "text-caption font-medium",
                  isActive && "font-semibold"
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
