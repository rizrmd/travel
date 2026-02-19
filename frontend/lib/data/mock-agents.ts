export type AgentTier = 'silver' | 'gold' | 'platinum'
export type AgentStatus = 'active' | 'inactive'

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  tier: AgentTier
  jamaahCount: number
  totalCommission: number
  conversionRate: number // percentage
  averageDealSize: number
  status: AgentStatus
  joinedAt: string
  assignedJamaah: string[] // jamaah IDs
}

export interface Commission {
  id: string
  agentId: string
  agentName: string
  jamaahName: string
  packageName: string
  dealValue: number
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'paid'
  date: string
}

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@example.com',
    phone: '081234567890',
    tier: 'platinum',
    jamaahCount: 25,
    totalCommission: 45000000,
    conversionRate: 85,
    averageDealSize: 32000000,
    status: 'active',
    joinedAt: '2023-06-15',
    assignedJamaah: ['1', '2', '3', '6', '7'],
  },
  {
    id: '2',
    name: 'Siti Aminah',
    email: 'siti.aminah@example.com',
    phone: '081234567891',
    tier: 'gold',
    jamaahCount: 18,
    totalCommission: 28000000,
    conversionRate: 75,
    averageDealSize: 28000000,
    status: 'active',
    joinedAt: '2023-09-01',
    assignedJamaah: ['4', '5', '8'],
  },
  {
    id: '3',
    name: 'Budi Hartono',
    email: 'budi.hartono@example.com',
    phone: '081234567892',
    tier: 'gold',
    jamaahCount: 15,
    totalCommission: 22000000,
    conversionRate: 70,
    averageDealSize: 26000000,
    status: 'active',
    joinedAt: '2023-10-10',
    assignedJamaah: ['9', '10'],
  },
  {
    id: '4',
    name: 'Dewi Kusuma',
    email: 'dewi.kusuma@example.com',
    phone: '081234567893',
    tier: 'silver',
    jamaahCount: 8,
    totalCommission: 12000000,
    conversionRate: 60,
    averageDealSize: 24000000,
    status: 'active',
    joinedAt: '2024-02-01',
    assignedJamaah: ['11'],
  },
  {
    id: '5',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@example.com',
    phone: '081234567894',
    tier: 'silver',
    jamaahCount: 5,
    totalCommission: 7000000,
    conversionRate: 55,
    averageDealSize: 22000000,
    status: 'active',
    joinedAt: '2024-05-15',
    assignedJamaah: [],
  },
  {
    id: '6',
    name: 'Fitri Handayani',
    email: 'fitri.handayani@example.com',
    phone: '081234567895',
    tier: 'gold',
    jamaahCount: 12,
    totalCommission: 18000000,
    conversionRate: 68,
    averageDealSize: 27000000,
    status: 'inactive',
    joinedAt: '2023-08-20',
    assignedJamaah: [],
  },
]

export const mockCommissions: Commission[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Ahmad Fauzi',
    jamaahName: 'Ahmad Hidayat',
    packageName: 'Umroh Plus Turki 14 Hari',
    dealValue: 35000000,
    commissionRate: 8, // 8% for platinum
    commissionAmount: 2800000,
    status: 'paid',
    date: '2025-12-01',
  },
  {
    id: '2',
    agentId: '1',
    agentName: 'Ahmad Fauzi',
    jamaahName: 'Siti Nurhaliza',
    packageName: 'Umroh Reguler 9 Hari',
    dealValue: 25000000,
    commissionRate: 8,
    commissionAmount: 2000000,
    status: 'paid',
    date: '2025-11-15',
  },
  {
    id: '3',
    agentId: '2',
    agentName: 'Siti Aminah',
    jamaahName: 'Dewi Lestari',
    packageName: 'Umroh Plus Dubai 16 Hari',
    dealValue: 42000000,
    commissionRate: 6, // 6% for gold
    commissionAmount: 2520000,
    status: 'pending',
    date: '2025-12-10',
  },
  {
    id: '4',
    agentId: '3',
    agentName: 'Budi Hartono',
    jamaahName: 'Muhammad Rizki',
    packageName: 'Umroh VIP 12 Hari',
    dealValue: 45000000,
    commissionRate: 6,
    commissionAmount: 2700000,
    status: 'paid',
    date: '2025-11-20',
  },
  {
    id: '5',
    agentId: '4',
    agentName: 'Dewi Kusuma',
    jamaahName: 'Fatimah Zahra',
    packageName: 'Umroh Plus Turki 14 Hari',
    dealValue: 35000000,
    commissionRate: 4, // 4% for silver
    commissionAmount: 1400000,
    status: 'pending',
    date: '2025-12-05',
  },
]

export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find(a => a.id === id)
}

export function getAgentStats() {
  return {
    total: mockAgents.length,
    active: mockAgents.filter(a => a.status === 'active').length,
    inactive: mockAgents.filter(a => a.status === 'inactive').length,
    platinum: mockAgents.filter(a => a.tier === 'platinum').length,
    gold: mockAgents.filter(a => a.tier === 'gold').length,
    silver: mockAgents.filter(a => a.tier === 'silver').length,
  }
}

export function getCommissionsByAgent(agentId: string): Commission[] {
  return mockCommissions.filter(c => c.agentId === agentId)
}

export const tierLabels: Record<AgentTier, string> = {
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

export const tierCommissionRates: Record<AgentTier, number> = {
  silver: 4,
  gold: 6,
  platinum: 8,
}
