"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TopNavBar } from "@/components/navigation/top-nav-bar"
import { BottomTabBar } from "@/components/navigation/bottom-tab-bar"
import { SidebarNav, SidebarMenuItem } from "@/components/navigation/sidebar-nav"
import { Breadcrumb, BreadcrumbItem } from "@/components/navigation/breadcrumb"

interface AppLayoutProps {
  children: React.ReactNode
  /**
   * Show the top navigation bar (desktop)
   * @default true
   */
  showTopNav?: boolean
  /**
   * Show the bottom tab bar (mobile)
   * @default true
   */
  showBottomNav?: boolean
  /**
   * Maximum width of the content container
   * @default "7xl"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
  /**
   * Additional class name for the main container
   */
  className?: string
  /**
   * Breadcrumb items to display above content
   */
  breadcrumbs?: BreadcrumbItem[]
  /**
   * User information for top nav bar
   */
  userName?: string
  userRole?: string
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  /**
   * Menu items for the sidebar navigation
   */
  menuItems?: SidebarMenuItem[]
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
}

export function AppLayout({
  children,
  showTopNav = true,
  showBottomNav = true,
  maxWidth = "7xl",
  className,
  breadcrumbs,
  userName,
  userRole,
  notificationCount,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  menuItems,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      {showTopNav && (
        <TopNavBar
          userName={userName}
          userRole={userRole}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
        />
      )}

      {/* Desktop Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop Only */}
        <SidebarNav menuItems={menuItems} />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-64px)]",
            showBottomNav && "pb-[72px] md:pb-0",
            className
          )}
        >
          <div
            className={cn(
              maxWidthClasses[maxWidth],
              "mx-auto p-16 md:p-24 lg:p-32"
            )}
          >
            {/* Breadcrumb Navigation */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-16 md:mb-24">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      {/* Bottom Tab Bar - Mobile Only */}
      {showBottomNav && <BottomTabBar />}
    </div>
  )
}
