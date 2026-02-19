import {
  Home,
  Users,
  FileText,
  CreditCard,
  Package,
  UserCircle,
  BarChart3,
  Settings,
  Upload,
  Layout,
  MessageCircle,
  DollarSign,
  BookOpen,
  Bell,
  User,
  TrendingUp,
  Activity,
  AlertTriangle,
  FlaskConical,
  Building2,
  Workflow,
} from "lucide-react"
import { SidebarMenuItem } from "@/components/navigation/sidebar-nav"

/**
 * Admin Portal Menu Items
 */
export const adminMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "pipeline",
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: Workflow,
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
    id: "payments",
    label: "Pembayaran",
    href: "/payments",
    icon: CreditCard,
  },
  {
    id: "packages",
    label: "Paket",
    href: "/packages",
    icon: Package,
  },
  {
    id: "agents",
    label: "Agen",
    href: "/agents",
    icon: UserCircle,
  },
  {
    id: "reports",
    label: "Laporan",
    href: "/reports",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Pengaturan",
    href: "/settings",
    icon: Settings,
  },
]

/**
 * Agent Portal Menu Items
 */
export const agentMenuItems: SidebarMenuItem[] = [
  {
    id: "my-jamaah",
    label: "My Jamaah",
    href: "/agent/my-jamaah",
    icon: Users,
  },
  {
    id: "packages",
    label: "Paket Tersedia",
    href: "/agent/packages",
    icon: Package,
  },
  {
    id: "upload-dokumen",
    label: "Upload Dokumen",
    href: "/agent/upload-dokumen",
    icon: Upload,
  },
  {
    id: "landing-builder",
    label: "Landing Page",
    href: "/agent/landing-builder/create",
    icon: Layout,
  },
  {
    id: "leads",
    label: "Leads",
    href: "/agent/leads",
    icon: MessageCircle,
  },
  {
    id: "komisi",
    label: "Komisi",
    href: "/agent/komisi",
    icon: DollarSign,
  },
]

/**
 * Jamaah Portal Menu Items
 */
export const jamaahMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/my/dashboard",
    icon: Home,
  },
  {
    id: "documents",
    label: "Dokumen Saya",
    href: "/my/documents",
    icon: FileText,
  },
  {
    id: "payments",
    label: "Pembayaran",
    href: "/my/payments",
    icon: CreditCard,
  },
  {
    id: "itinerary",
    label: "Itinerary",
    href: "/my/itinerary",
    icon: BookOpen,
  },
  {
    id: "profile",
    label: "Profil Saya",
    href: "/my/profile",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifikasi",
    href: "/my/notifications",
    icon: Bell,
  },
]

/**
 * Owner Dashboard Menu Items
 */
export const ownerMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/owner/dashboard",
    icon: Home,
  },
  {
    id: "agents",
    label: "Performa Agen",
    href: "/owner/agents",
    icon: UserCircle,
  },
  {
    id: "reports",
    label: "Laporan",
    href: "/owner/reports",
    icon: BarChart3,
  },
  {
    id: "metrics",
    label: "Metrik Strategis",
    href: "/owner/metrics",
    icon: TrendingUp,
  },
  {
    id: "settings",
    label: "Pengaturan",
    href: "/owner/settings",
    icon: Settings,
  },
]

/**
 * Super Admin Platform Menu Items
 */
export const superAdminMenuItems: SidebarMenuItem[] = [
  {
    id: "tenants",
    label: "Tenants",
    href: "/super-admin/tenants",
    icon: Building2,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    href: "/super-admin/monitoring",
    icon: Activity,
  },
  {
    id: "anomalies",
    label: "Anomali",
    href: "/super-admin/anomalies",
    icon: AlertTriangle,
  },
  {
    id: "trials",
    label: "Trials",
    href: "/super-admin/trials",
    icon: FlaskConical,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/super-admin/analytics",
    icon: BarChart3,
  },
]
