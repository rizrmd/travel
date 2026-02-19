export type CommissionStatus = 'pending' | 'paid'
export type AgentTier = 'Silver' | 'Gold' | 'Platinum'

export interface Commission {
  id: string
  jamaahId: string
  jamaahName: string
  packageName: string
  packagePrice: number
  commissionRate: number // as percentage (e.g., 4 for 4%)
  commissionAmount: number
  status: CommissionStatus
  earnedDate: string
  paidDate?: string

  // Phase 4 additions
  agentId: string
  packageId: string
  leadId?: string  // Optional - link back to original lead
  tier: AgentTier  // Agent tier at time of conversion
}

export interface TierInfo {
  tier: AgentTier
  commissionRate: number // as percentage
  minJamaah: number
  maxJamaah?: number
  benefits: string[]
}

export interface PayoutHistory {
  id: string
  amount: number
  requestDate: string
  approvedDate?: string
  paidDate?: string
  status: 'requested' | 'approved' | 'paid'
  bankAccount: string
}

export const tierStructure: TierInfo[] = [
  {
    tier: 'Silver',
    commissionRate: 4,
    minJamaah: 0,
    maxJamaah: 19,
    benefits: [
      'Komisi 4% dari setiap paket',
      'Akses landing page builder',
      'Lead management',
      'Support via WhatsApp',
    ]
  },
  {
    tier: 'Gold',
    commissionRate: 6,
    minJamaah: 20,
    maxJamaah: 49,
    benefits: [
      'Komisi 6% dari setiap paket',
      'Semua benefit Silver',
      'Template landing page premium',
      'Prioritas support',
      'Bonus referral agent',
    ]
  },
  {
    tier: 'Platinum',
    commissionRate: 8,
    minJamaah: 50,
    benefits: [
      'Komisi 8% dari setiap paket',
      'Semua benefit Gold',
      'Custom branding',
      'Dedicated account manager',
      'Bonus keberangkatan gratis (per 100 jamaah)',
    ]
  },
]

export const mockCommissions: Commission[] = [
  // December 2024
  {
    id: 'comm-1',
    jamaahId: '1',
    jamaahName: 'Ahmad Hidayat',
    packageName: 'Umroh Plus Turki 14 Hari',
    packagePrice: 35000000,
    commissionRate: 4,
    commissionAmount: 1400000,
    status: 'pending',
    earnedDate: '2024-12-15',
    agentId: 'agent-1',
    packageId: '2',
    leadId: 'lead-6',
    tier: 'Silver',
  },
  {
    id: 'comm-2',
    jamaahId: '3',
    jamaahName: 'Budi Santoso',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'pending',
    earnedDate: '2024-12-10',
    agentId: 'agent-1',
    packageId: '4',
    leadId: 'lead-7',
    tier: 'Silver',
  },
  {
    id: 'comm-3',
    jamaahId: '7',
    jamaahName: 'Muhammad Rizki',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'pending',
    earnedDate: '2024-12-05',
    agentId: 'agent-2',
    packageId: '5',
    tier: 'Gold',
  },

  // November 2024 - Paid
  {
    id: 'comm-4',
    jamaahId: '15',
    jamaahName: 'Abdullah Malik',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'paid',
    earnedDate: '2024-11-20',
    paidDate: '2024-12-01',
    agentId: 'agent-1',
    packageId: '4',
    tier: 'Silver',
  },
  {
    id: 'comm-5',
    jamaahId: '18',
    jamaahName: 'Mariam Salma',
    packageName: 'Umroh Plus Turki 14 Hari',
    packagePrice: 35000000,
    commissionRate: 4,
    commissionAmount: 1400000,
    status: 'paid',
    earnedDate: '2024-11-15',
    paidDate: '2024-12-01',
    agentId: 'agent-1',
    packageId: '2',
    tier: 'Silver',
  },
  {
    id: 'comm-6',
    jamaahId: '22',
    jamaahName: 'Hafizah Nur',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'paid',
    earnedDate: '2024-11-10',
    paidDate: '2024-12-01',
    agentId: 'agent-2',
    packageId: '4',
    tier: 'Gold',
  },

  // October 2024 - Paid
  {
    id: 'comm-7',
    jamaahId: '25',
    jamaahName: 'Ruqayyah Amina',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'paid',
    earnedDate: '2024-10-25',
    paidDate: '2024-11-01',
    agentId: 'agent-2',
    packageId: '4',
    tier: 'Gold',
  },
  {
    id: 'comm-8',
    jamaahId: '30',
    jamaahName: 'Khalid Walid',
    packageName: 'Umroh Plus Turki 14 Hari',
    packagePrice: 35000000,
    commissionRate: 4,
    commissionAmount: 1400000,
    status: 'paid',
    earnedDate: '2024-10-15',
    paidDate: '2024-11-01',
    agentId: 'agent-3',
    packageId: '2',
    tier: 'Platinum',
  },

  // September 2024 - Paid
  {
    id: 'comm-9',
    jamaahId: '34',
    jamaahName: 'Zaid Harith',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'paid',
    earnedDate: '2024-09-20',
    paidDate: '2024-10-01',
    agentId: 'agent-3',
    packageId: '4',
    tier: 'Platinum',
  },
  {
    id: 'comm-10',
    jamaahId: '40',
    jamaahName: 'Usama Zaid',
    packageName: 'Umroh VIP 12 Hari',
    packagePrice: 45000000,
    commissionRate: 4,
    commissionAmount: 1800000,
    status: 'paid',
    earnedDate: '2024-09-10',
    paidDate: '2024-10-01',
    agentId: 'agent-1',
    packageId: '4',
    tier: 'Silver',
  },
]

export const mockPayoutHistory: PayoutHistory[] = [
  {
    id: 'payout-1',
    amount: 5000000,
    requestDate: '2024-11-25',
    approvedDate: '2024-11-27',
    paidDate: '2024-12-01',
    status: 'paid',
    bankAccount: 'BCA - 1234567890 (Siti Aminah)',
  },
  {
    id: 'payout-2',
    amount: 3600000,
    requestDate: '2024-10-25',
    approvedDate: '2024-10-27',
    paidDate: '2024-11-01',
    status: 'paid',
    bankAccount: 'BCA - 1234567890 (Siti Aminah)',
  },
]

export function getCommissionsByStatus(status: CommissionStatus) {
  return mockCommissions.filter(c => c.status === status)
}

export function getCommissionSummary() {
  const thisMonth = mockCommissions.filter(c => {
    const earnedDate = new Date(c.earnedDate)
    const now = new Date()
    return earnedDate.getMonth() === now.getMonth() && earnedDate.getFullYear() === now.getFullYear()
  })

  const pending = mockCommissions.filter(c => c.status === 'pending')
  const paid = mockCommissions.filter(c => c.status === 'paid')

  return {
    thisMonth: thisMonth.reduce((sum, c) => sum + c.commissionAmount, 0),
    pending: pending.reduce((sum, c) => sum + c.commissionAmount, 0),
    paid: paid.reduce((sum, c) => sum + c.commissionAmount, 0),
    available: pending.reduce((sum, c) => sum + c.commissionAmount, 0), // Same as pending for simplicity
  }
}

export function getMonthlyCommissionTrend() {
  // Last 6 months of commission data
  return [
    { month: 'Jul', amount: 2800000 },
    { month: 'Agt', amount: 3200000 },
    { month: 'Sep', amount: 3600000 },
    { month: 'Okt', amount: 2800000 },
    { month: 'Nov', amount: 5000000 },
    { month: 'Des', amount: 5000000 },
  ]
}

export function getCurrentTierInfo(totalJamaah: number): TierInfo & { nextTier?: TierInfo, jamaahToNext?: number } {
  let currentTier = tierStructure[0]
  let nextTier: TierInfo | undefined
  let jamaahToNext: number | undefined

  for (let i = 0; i < tierStructure.length; i++) {
    const tier = tierStructure[i]
    if (totalJamaah >= tier.minJamaah && (!tier.maxJamaah || totalJamaah <= tier.maxJamaah)) {
      currentTier = tier
      nextTier = tierStructure[i + 1]
      if (nextTier) {
        jamaahToNext = nextTier.minJamaah - totalJamaah
      }
      break
    }
  }

  return {
    ...currentTier,
    nextTier,
    jamaahToNext,
  }
}

export const agentBankInfo = {
  bankName: 'BCA',
  accountNumber: '1234567890',
  accountName: 'Siti Aminah',
}

export const minimumPayout = 500000

// Phase 4: Helper functions for commission management

/**
 * Get all commissions for a specific agent
 */
export function getAgentCommissions(agentId: string): Commission[] {
  return mockCommissions.filter(c => c.agentId === agentId)
}

/**
 * Calculate commission for a lead conversion
 * Commission is ALWAYS calculated from RETAIL price, not wholesale
 */
export function calculateCommission(
  retailPrice: number,
  agentTier: AgentTier
): { commissionRate: number; commissionAmount: number } {
  const tierInfo = tierStructure.find(t => t.tier === agentTier)
  if (!tierInfo) {
    throw new Error(`Invalid tier: ${agentTier}`)
  }

  const commissionRate = tierInfo.commissionRate
  const commissionAmount = retailPrice * (commissionRate / 100)

  return {
    commissionRate,
    commissionAmount,
  }
}

/**
 * Create a commission record when converting lead to jamaah
 */
export function createCommission(data: {
  jamaahId: string
  jamaahName: string
  packageId: string
  packageName: string
  packagePrice: number  // MUST be retail price
  agentId: string
  tier: AgentTier
  leadId?: string
}): Commission {
  const { commissionRate, commissionAmount } = calculateCommission(
    data.packagePrice,
    data.tier
  )

  const newCommission: Commission = {
    id: `comm-${Date.now()}`,
    jamaahId: data.jamaahId,
    jamaahName: data.jamaahName,
    packageName: data.packageName,
    packagePrice: data.packagePrice,
    commissionRate,
    commissionAmount,
    status: 'pending',
    earnedDate: new Date().toISOString().split('T')[0],
    agentId: data.agentId,
    packageId: data.packageId,
    leadId: data.leadId,
    tier: data.tier,
  }

  mockCommissions.push(newCommission)
  return newCommission
}

/**
 * Get commission stats for an agent
 */
export function getAgentCommissionStats(agentId: string) {
  const agentComms = getAgentCommissions(agentId)

  const pending = agentComms.filter(c => c.status === 'pending')
  const paid = agentComms.filter(c => c.status === 'paid')

  const totalPending = pending.reduce((sum, c) => sum + c.commissionAmount, 0)
  const totalPaid = paid.reduce((sum, c) => sum + c.commissionAmount, 0)
  const totalEarned = totalPending + totalPaid

  return {
    total: agentComms.length,
    pending: pending.length,
    paid: paid.length,
    totalEarned,
    totalPending,
    totalPaid,
  }
}
