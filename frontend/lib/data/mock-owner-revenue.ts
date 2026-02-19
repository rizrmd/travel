// Mock data for owner revenue intelligence dashboard

export interface RevenueKPI {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  orders: number
}

export interface TopPackage {
  id: string
  name: string
  revenue: number
  bookings: number
  avgPrice: number
  growth: number
}

export interface AgentRevenue {
  id: string
  name: string
  revenue: number
  jamaahCount: number
  tier: 'Silver' | 'Gold' | 'Platinum'
}

export const revenueKPIs: RevenueKPI[] = [
  {
    label: 'Total Revenue',
    value: 'Rp 2.4M',
    change: 12.5,
    trend: 'up'
  },
  {
    label: 'Revenue Bulan Ini',
    value: 'Rp 450jt',
    change: 8.3,
    trend: 'up'
  },
  {
    label: 'Growth Rate',
    value: '12.5%',
    change: 2.1,
    trend: 'up'
  },
  {
    label: 'Active Jamaah',
    value: '247',
    change: 15.8,
    trend: 'up'
  },
  {
    label: 'Active Agents',
    value: '18',
    change: 0,
    trend: 'stable'
  },
  {
    label: 'Avg Order Value',
    value: 'Rp 35.5jt',
    change: -3.2,
    trend: 'down'
  }
]

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Jan', revenue: 185000000, orders: 12 },
  { month: 'Feb', revenue: 220000000, orders: 15 },
  { month: 'Mar', revenue: 195000000, orders: 13 },
  { month: 'Apr', revenue: 240000000, orders: 18 },
  { month: 'Mei', revenue: 280000000, orders: 21 },
  { month: 'Jun', revenue: 310000000, orders: 24 },
  { month: 'Jul', revenue: 290000000, orders: 22 },
  { month: 'Agu', revenue: 265000000, orders: 19 },
  { month: 'Sep', revenue: 300000000, orders: 23 },
  { month: 'Okt', revenue: 340000000, orders: 26 },
  { month: 'Nov', revenue: 380000000, orders: 28 },
  { month: 'Des', revenue: 450000000, orders: 32 }
]

export const topPackages: TopPackage[] = [
  {
    id: '1',
    name: 'Umroh Premium Ramadhan 2024',
    revenue: 420000000,
    bookings: 28,
    avgPrice: 15000000,
    growth: 18.5
  },
  {
    id: '2',
    name: 'Paket Umroh Plus Turki 14 Hari',
    revenue: 380000000,
    bookings: 19,
    avgPrice: 20000000,
    growth: 12.3
  },
  {
    id: '3',
    name: 'Umroh Executive Desember',
    revenue: 350000000,
    bookings: 25,
    avgPrice: 14000000,
    growth: 8.7
  },
  {
    id: '4',
    name: 'Umroh Hemat 9 Hari',
    revenue: 280000000,
    bookings: 35,
    avgPrice: 8000000,
    growth: 15.2
  },
  {
    id: '5',
    name: 'Umroh VIP Plus Dubai',
    revenue: 240000000,
    bookings: 12,
    avgPrice: 20000000,
    growth: -5.4
  }
]

export const agentRevenues: AgentRevenue[] = [
  {
    id: '1',
    name: 'Ahmad Zaki',
    revenue: 480000000,
    jamaahCount: 32,
    tier: 'Platinum'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    revenue: 420000000,
    jamaahCount: 28,
    tier: 'Platinum'
  },
  {
    id: '3',
    name: 'Muhammad Yusuf',
    revenue: 360000000,
    jamaahCount: 24,
    tier: 'Gold'
  },
  {
    id: '4',
    name: 'Fatimah Zahra',
    revenue: 310000000,
    jamaahCount: 21,
    tier: 'Gold'
  },
  {
    id: '5',
    name: 'Umar Faruq',
    revenue: 280000000,
    jamaahCount: 19,
    tier: 'Gold'
  },
  {
    id: '6',
    name: 'Khadijah Nur',
    revenue: 240000000,
    jamaahCount: 16,
    tier: 'Silver'
  },
  {
    id: '7',
    name: 'Ali Hasan',
    revenue: 210000000,
    jamaahCount: 14,
    tier: 'Silver'
  },
  {
    id: '8',
    name: 'Aisyah Putri',
    revenue: 180000000,
    jamaahCount: 12,
    tier: 'Silver'
  }
]

export function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(0)}jt`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}
