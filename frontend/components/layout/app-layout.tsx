"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TopNavBar } from "@/components/navigation/top-nav-bar"
import { BottomTabBar } from "@/components/navigation/bottom-tab-bar"
import { SidebarNav, SidebarMenuItem } from "@/components/navigation/sidebar-nav"
import { Breadcrumb, BreadcrumbItem } from "@/components/navigation/breadcrumb"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import {
  adminMenuItems,
  agentMenuItems,
  jamaahMenuItems,
  ownerMenuItems,
  superAdminMenuItems,
} from "@/lib/navigation/menu-items"

function getMenuItemsByPath(pathname: string | null): SidebarMenuItem[] {
  if (!pathname) return adminMenuItems;
  if (pathname.startsWith('/agent')) return agentMenuItems;
  if (pathname.startsWith('/my')) return jamaahMenuItems;
  if (pathname.startsWith('/owner')) return ownerMenuItems;
  if (pathname.startsWith('/super-admin')) return superAdminMenuItems;
  return adminMenuItems; // Default to admin for /dashboard, /jamaah, /dokumen, etc
}

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
  userName: propUserName,
  userRole: propUserRole,
  notificationCount,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  menuItems: propMenuItems,
}: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userName: authUserName, userRole: authUserRole, menuItems: authMenuItems } = useAuth()

  // Use auth values but allow props to override (useful for testing or specific isolated pages)
  const resolvedUserName = propUserName || authUserName
  const resolvedUserRole = propUserRole || authUserRole
  const resolvedMenuItems = propMenuItems || authMenuItems || getMenuItemsByPath(pathname)

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (refreshToken && accessToken) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({ refreshToken })
        }).catch(err => {
          console.error("Logout API error:", err);
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");

      toast.success("Anda telah keluar");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      {showTopNav && (
        <TopNavBar
          userName={resolvedUserName}
          userRole={resolvedUserRole}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogoutClick={handleLogout}
        />
      )}

      {/* Desktop Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar Navigation - Desktop Only */}
        <SidebarNav menuItems={resolvedMenuItems} />

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
