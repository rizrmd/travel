"use client"

import * as React from "react"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MobileMenuDrawer } from "./mobile-menu-drawer"
import { DensityToggle } from "@/components/density/density-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockRecentActivities, formatRelativeTime } from "@/lib/data/mock-dashboard"

interface TopNavBarProps {
  userName?: string
  userRole?: string
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

export function TopNavBar({
  userName = "Agen Travel",
  userRole = "Agen",
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: TopNavBarProps) {
  const hasNotifications = notificationCount > 0

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-white border-b border-slate-200",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Mobile Menu Drawer */}
          <MobileMenuDrawer
            userName={userName}
            userRole={userRole}
            notificationCount={notificationCount}
            onNotificationClick={onNotificationClick}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />

          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded"
            >
              <div className="h-[32px] w-[32px] bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">TU</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-sm text-slate-900">
                  Travel Umroh
                </h1>
                <p className="text-xs text-slate-500 leading-tight">Manajemen Jamaah</p>
              </div>
            </Link>
          </div>

          {/* Right Side: Notifications & User Menu - Desktop Only */}
          <div className="hidden md:flex items-center gap-12">
            {/* Density Toggle */}
            <DensityToggle />

            {/* Notification Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 w-9 p-0"
                  aria-label={`Notifikasi${hasNotifications ? `, ${notificationCount} baru` : ''}`}
                >
                  <Bell className="h-[20px] w-[20px] text-slate-600" />
                  {hasNotifications && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-[16px] min-w-[16px] rounded-full p-0 flex items-center justify-center text-[10px] font-semibold"
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px]">
                <DropdownMenuLabel className="flex items-center justify-between pb-2 border-b">
                  <span className="font-semibold text-sm">Notifikasi</span>
                  {hasNotifications && (
                    <Badge variant="secondary" className="text-xs">
                      {notificationCount} Baru
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <div className="max-h-[300px] overflow-y-auto">
                  {mockRecentActivities.slice(0, 3).map((activity) => (
                    <DropdownMenuItem key={activity.id} className="cursor-pointer flex flex-col items-start gap-1 p-3 border-b last:border-0" onClick={onNotificationClick}>
                      <span className="font-medium text-sm text-slate-900">{activity.title}</span>
                      <span className="text-xs text-slate-600 line-clamp-2">{activity.description}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{formatRelativeTime(activity.timestamp)}</span>
                    </DropdownMenuItem>
                  ))}
                  {mockRecentActivities.length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-500">
                      Tidak ada notifikasi
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full text-center text-xs font-medium text-blue-600 justify-center cursor-pointer">
                    Lihat Semua Notifikasi
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-1 px-2"
                  aria-label="Menu pengguna"
                >
                  <div className="h-[32px] w-[32px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-[16px] w-[16px] text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-slate-900">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-600">{userRole}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-4">
                    <p className="text-body-sm font-medium">{userName}</p>
                    <p className="text-caption text-slate-600">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onProfileClick}>
                  <User className="mr-[8px] h-[16px] w-[16px]" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick}>
                  <Settings className="mr-[8px] h-[16px] w-[16px]" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogoutClick}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-[8px] h-[16px] w-[16px]" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
