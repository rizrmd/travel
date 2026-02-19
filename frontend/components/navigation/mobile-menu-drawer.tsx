"use client"

import * as React from "react"
import { Home, Users, FileText, User, Settings, LogOut, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface MenuItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
}

const defaultMenuItems: MenuItem[] = [
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
]

interface MobileMenuDrawerProps {
  menuItems?: MenuItem[]
  userName?: string
  userRole?: string
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

export function MobileMenuDrawer({
  menuItems = defaultMenuItems,
  userName = "Pengguna",
  userRole = "Agen",
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: MobileMenuDrawerProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const hasNotifications = notificationCount > 0

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleActionClick = (action?: () => void) => {
    action?.()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("md:hidden", className)}
          aria-label="Buka menu"
        >
          <Menu className="h-24 w-24" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-24 pb-16">
          <div className="flex items-center gap-12">
            {/* User Avatar */}
            <div className="h-48 w-48 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-24 w-24 text-white" />
            </div>
            {/* User Info */}
            <div className="flex-1 text-left">
              <SheetTitle className="text-body font-semibold text-slate-900">
                {userName}
              </SheetTitle>
              <p className="text-body-sm text-slate-600 mt-4">{userRole}</p>
            </div>
            {/* Notification Button */}
            {hasNotifications && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActionClick(onNotificationClick)}
                className="relative flex-shrink-0"
                aria-label={`${notificationCount} notifikasi baru`}
              >
                <Bell className="h-20 w-20 text-slate-600" />
                <Badge
                  variant="destructive"
                  className="absolute -top-4 -right-4 h-18 min-w-18 rounded-full p-0 flex items-center justify-center text-caption font-semibold"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator />

        {/* Navigation Menu */}
        <nav className="p-16" aria-label="Menu utama">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-12 px-16 py-12 rounded-lg",
                      "transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-20 w-20",
                        isActive && "fill-current"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span className="text-body font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Separator />

        {/* Account Actions */}
        <div className="p-16 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-12 text-slate-700 hover:bg-slate-100"
            onClick={() => handleActionClick(onProfileClick)}
          >
            <User className="h-20 w-20" />
            <span className="text-body">Profil Saya</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-12 text-slate-700 hover:bg-slate-100"
            onClick={() => handleActionClick(onSettingsClick)}
          >
            <Settings className="h-20 w-20" />
            <span className="text-body">Pengaturan</span>
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full justify-start gap-12 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleActionClick(onLogoutClick)}
          >
            <LogOut className="h-20 w-20" />
            <span className="text-body">Keluar</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
