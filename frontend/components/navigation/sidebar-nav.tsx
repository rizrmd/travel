"use client"

import * as React from "react"
import {
  Home,
  Users,
  FileText,
  BarChart3,
  Layout,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export interface SidebarMenuItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
}

const defaultMenuItems: SidebarMenuItem[] = [
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
    id: "analytics",
    label: "Analytics",
    href: "/owner/analytics",
    icon: BarChart3,
  },
  {
    id: "landing-builder",
    label: "Landing Page",
    href: "/agent/landing-builder",
    icon: Layout,
  },
]

interface SidebarNavProps {
  menuItems?: SidebarMenuItem[]
  className?: string
  defaultCollapsed?: boolean
}

export function SidebarNav({
  menuItems = defaultMenuItems,
  className,
  defaultCollapsed = false
}: SidebarNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col",
        "bg-white border-r border-slate-200",
        "transition-all duration-300 ease-in-out",
        "sticky top-14 self-start",
        "h-[calc(100vh-3.5rem)]",
        isCollapsed ? "w-[60px]" : "w-[180px]",
        className
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-end p-2 border-b border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-7 w-7 p-0"
          aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 overflow-y-auto" aria-label="Menu navigasi utama">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    "group relative",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "h-[20px] w-[20px] flex-shrink-0",
                      isActive && "fill-current"
                    )}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-700"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className={cn(
                      "absolute left-full ml-2 px-2 py-1 rounded",
                      "bg-slate-900 text-white text-xs",
                      "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                      "transition-all duration-200 whitespace-nowrap z-50",
                      "pointer-events-none"
                    )}>
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer - Settings Link (Optional) */}
      {!isCollapsed && (
        <div className="p-2 border-t border-slate-100">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
              "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              "transition-colors duration-200"
            )}
          >
            <Settings className="h-[20px] w-[20px]" strokeWidth={1.5} />
            <span className="font-medium">Pengaturan</span>
          </Link>
        </div>
      )}
    </aside>
  )
}
