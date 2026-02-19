/**
 * Mock analytics data for dashboard
 */

// Revenue data for line chart
export const monthlyRevenueData = [
  { name: "Jan", pendapatan: 45000000, target: 50000000 },
  { name: "Feb", pendapatan: 52000000, target: 50000000 },
  { name: "Mar", pendapatan: 48000000, target: 55000000 },
  { name: "Apr", pendapatan: 61000000, target: 55000000 },
  { name: "Mei", pendapatan: 55000000, target: 60000000 },
  { name: "Jun", pendapatan: 67000000, target: 60000000 },
  { name: "Jul", pendapatan: 72000000, target: 65000000 },
  { name: "Agu", pendapatan: 68000000, target: 65000000 },
  { name: "Sep", pendapatan: 75000000, target: 70000000 },
  { name: "Okt", pendapatan: 82000000, target: 70000000 },
  { name: "Nov", pendapatan: 78000000, target: 75000000 },
  { name: "Des", pendapatan: 85000000, target: 80000000 },
]

// Package distribution for pie chart
export const packageDistributionData = [
  { name: "Ekonomi", value: 45, color: "#3b82f6" },
  { name: "Standard", value: 30, color: "#8b5cf6" },
  { name: "VIP", value: 15, color: "#ec4899" },
  { name: "Premium", value: 10, color: "#f59e0b" },
]

// Jamaah status for bar chart
export const jamaahStatusData = [
  { name: "Mendesak", jumlah: 5, percentage: 9 },
  { name: "Segera", jumlah: 8, percentage: 15 },
  { name: "Siap", jumlah: 42, percentage: 76 },
]

// Agent performance data
export const agentPerformanceData = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@example.com",
    totalJamaah: 55,
    completedJamaah: 42,
    revenue: 850000000,
    conversionRate: 76,
    avgResponseTime: "2.5 jam",
    lastActive: "2 jam yang lalu",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@example.com",
    totalJamaah: 48,
    completedJamaah: 38,
    revenue: 720000000,
    conversionRate: 79,
    avgResponseTime: "1.8 jam",
    lastActive: "30 menit yang lalu",
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    totalJamaah: 32,
    completedJamaah: 25,
    revenue: 480000000,
    conversionRate: 78,
    avgResponseTime: "3.2 jam",
    lastActive: "1 hari yang lalu",
  },
]

// Revenue summary stats
export const revenueSummary = {
  totalRevenue: 850000000,
  monthlyRevenue: 85000000,
  averagePerJamaah: 15454545,
  growth: 12.5,
  targetAchievement: 106,
}

// Quick stats for dashboard
export const dashboardStats = {
  totalJamaah: 55,
  completedJamaah: 42,
  pendingDocuments: 13,
  upcomingDepartures: 8,
  revenue: {
    thisMonth: 85000000,
    lastMonth: 78000000,
    change: 8.97,
  },
  conversion: {
    rate: 76,
    change: 3.2,
  },
  avgDealSize: {
    value: 15454545,
    change: -2.1,
  },
}
