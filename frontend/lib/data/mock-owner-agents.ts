// Mock data for owner agent performance analytics

export interface AgentPerformance {
  id: string
  name: string
  tier: 'Silver' | 'Gold' | 'Platinum'
  revenue: number
  jamaahCount: number
  conversionRate: number
  avgDealSize: number
  responseTime: number // in hours
  commission: number
  status: 'active' | 'inactive'
  joinDate: string
  lastActive: string
}

export interface TierDistribution {
  tier: 'Silver' | 'Gold' | 'Platinum'
  count: number
  percentage: number
}

export interface CommissionBreakdown {
  agentId: string
  agentName: string
  basePay: number
  tierBonus: number
  performanceBonus: number
  total: number
}

export const agentPerformances: AgentPerformance[] = [
  {
    id: '1',
    name: 'Ahmad Zaki',
    tier: 'Platinum',
    revenue: 480000000,
    jamaahCount: 32,
    conversionRate: 68,
    avgDealSize: 15000000,
    responseTime: 2.5,
    commission: 48000000,
    status: 'active',
    joinDate: '2022-01-15',
    lastActive: '2024-12-25'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    tier: 'Platinum',
    revenue: 420000000,
    jamaahCount: 28,
    conversionRate: 72,
    avgDealSize: 15000000,
    responseTime: 1.8,
    commission: 42000000,
    status: 'active',
    joinDate: '2022-03-20',
    lastActive: '2024-12-25'
  },
  {
    id: '3',
    name: 'Muhammad Yusuf',
    tier: 'Gold',
    revenue: 360000000,
    jamaahCount: 24,
    conversionRate: 65,
    avgDealSize: 15000000,
    responseTime: 3.2,
    commission: 32400000,
    status: 'active',
    joinDate: '2022-06-10',
    lastActive: '2024-12-24'
  },
  {
    id: '4',
    name: 'Fatimah Zahra',
    tier: 'Gold',
    revenue: 310000000,
    jamaahCount: 21,
    conversionRate: 58,
    avgDealSize: 14800000,
    responseTime: 4.1,
    commission: 27900000,
    status: 'active',
    joinDate: '2022-07-05',
    lastActive: '2024-12-25'
  },
  {
    id: '5',
    name: 'Umar Faruq',
    tier: 'Gold',
    revenue: 280000000,
    jamaahCount: 19,
    conversionRate: 62,
    avgDealSize: 14700000,
    responseTime: 3.5,
    commission: 25200000,
    status: 'active',
    joinDate: '2023-01-12',
    lastActive: '2024-12-25'
  },
  {
    id: '6',
    name: 'Khadijah Nur',
    tier: 'Silver',
    revenue: 240000000,
    jamaahCount: 16,
    conversionRate: 55,
    avgDealSize: 15000000,
    responseTime: 5.2,
    commission: 19200000,
    status: 'active',
    joinDate: '2023-03-08',
    lastActive: '2024-12-24'
  },
  {
    id: '7',
    name: 'Ali Hasan',
    tier: 'Silver',
    revenue: 210000000,
    jamaahCount: 14,
    conversionRate: 52,
    avgDealSize: 15000000,
    responseTime: 4.8,
    commission: 16800000,
    status: 'active',
    joinDate: '2023-04-15',
    lastActive: '2024-12-25'
  },
  {
    id: '8',
    name: 'Aisyah Putri',
    tier: 'Silver',
    revenue: 180000000,
    jamaahCount: 12,
    conversionRate: 48,
    avgDealSize: 15000000,
    responseTime: 6.1,
    commission: 14400000,
    status: 'active',
    joinDate: '2023-06-20',
    lastActive: '2024-12-23'
  },
  {
    id: '9',
    name: 'Hassan Ibrahim',
    tier: 'Silver',
    revenue: 150000000,
    jamaahCount: 10,
    conversionRate: 45,
    avgDealSize: 15000000,
    responseTime: 7.3,
    commission: 12000000,
    status: 'active',
    joinDate: '2023-08-10',
    lastActive: '2024-12-22'
  },
  {
    id: '10',
    name: 'Maryam Salsabila',
    tier: 'Silver',
    revenue: 135000000,
    jamaahCount: 9,
    conversionRate: 42,
    avgDealSize: 15000000,
    responseTime: 8.5,
    commission: 10800000,
    status: 'active',
    joinDate: '2023-09-05',
    lastActive: '2024-12-25'
  },
  {
    id: '11',
    name: 'Khalid Rahman',
    tier: 'Gold',
    revenue: 290000000,
    jamaahCount: 20,
    conversionRate: 60,
    avgDealSize: 14500000,
    responseTime: 3.8,
    commission: 26100000,
    status: 'active',
    joinDate: '2022-11-15',
    lastActive: '2024-12-24'
  },
  {
    id: '12',
    name: 'Laila Nurhaliza',
    tier: 'Silver',
    revenue: 165000000,
    jamaahCount: 11,
    conversionRate: 50,
    avgDealSize: 15000000,
    responseTime: 5.5,
    commission: 13200000,
    status: 'active',
    joinDate: '2023-05-22',
    lastActive: '2024-12-25'
  },
  {
    id: '13',
    name: 'Ibrahim Musa',
    tier: 'Platinum',
    revenue: 395000000,
    jamaahCount: 26,
    conversionRate: 70,
    avgDealSize: 15200000,
    responseTime: 2.2,
    commission: 39500000,
    status: 'active',
    joinDate: '2022-04-18',
    lastActive: '2024-12-25'
  },
  {
    id: '14',
    name: 'Zaynab Fathia',
    tier: 'Gold',
    revenue: 270000000,
    jamaahCount: 18,
    conversionRate: 56,
    avgDealSize: 15000000,
    responseTime: 4.5,
    commission: 24300000,
    status: 'active',
    joinDate: '2023-02-10',
    lastActive: '2024-12-24'
  },
  {
    id: '15',
    name: 'Ridwan Kamil',
    tier: 'Silver',
    revenue: 120000000,
    jamaahCount: 8,
    conversionRate: 40,
    avgDealSize: 15000000,
    responseTime: 9.2,
    commission: 9600000,
    status: 'active',
    joinDate: '2023-10-01',
    lastActive: '2024-12-23'
  },
  {
    id: '16',
    name: 'Hafsah Dewi',
    tier: 'Silver',
    revenue: 195000000,
    jamaahCount: 13,
    conversionRate: 53,
    avgDealSize: 15000000,
    responseTime: 6.8,
    commission: 15600000,
    status: 'active',
    joinDate: '2023-07-12',
    lastActive: '2024-12-25'
  },
  {
    id: '17',
    name: 'Bilal Fadillah',
    tier: 'Gold',
    revenue: 325000000,
    jamaahCount: 22,
    conversionRate: 64,
    avgDealSize: 14800000,
    responseTime: 3.0,
    commission: 29250000,
    status: 'active',
    joinDate: '2022-08-25',
    lastActive: '2024-12-25'
  },
  {
    id: '18',
    name: 'Safiyyah Ayu',
    tier: 'Silver',
    revenue: 140000000,
    jamaahCount: 9,
    conversionRate: 44,
    avgDealSize: 15600000,
    responseTime: 7.8,
    commission: 11200000,
    status: 'active',
    joinDate: '2023-11-08',
    lastActive: '2024-12-22'
  }
]

export const tierDistribution: TierDistribution[] = [
  { tier: 'Platinum', count: 3, percentage: 16.7 },
  { tier: 'Gold', count: 6, percentage: 33.3 },
  { tier: 'Silver', count: 9, percentage: 50.0 }
]

export const commissionBreakdowns: CommissionBreakdown[] = agentPerformances.map(agent => {
  const baseRate = agent.tier === 'Platinum' ? 0.10 : agent.tier === 'Gold' ? 0.09 : 0.08
  const basePay = agent.revenue * baseRate

  const tierBonus = agent.tier === 'Platinum' ? agent.revenue * 0.02 : agent.tier === 'Gold' ? agent.revenue * 0.01 : 0

  const performanceBonus = agent.conversionRate >= 65 ? agent.revenue * 0.01 : 0

  return {
    agentId: agent.id,
    agentName: agent.name,
    basePay,
    tierBonus,
    performanceBonus,
    total: basePay + tierBonus + performanceBonus
  }
})

export function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(0)}jt`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}
