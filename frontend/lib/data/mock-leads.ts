export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'converted' | 'lost'
export type LeadSource = 'landing_page' | 'whatsapp' | 'referral' | 'walk_in'

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  packageInterest: string
  source: string // Landing page slug or other source
  status: LeadStatus
  dateSubmitted: string
  lastContactedAt?: string
  notes?: string
  convertedToJamaahId?: string

  // New fields for Phase 3
  agentId: string
  packageId: string
  landingPageId?: string
  sourceType: LeadSource
}

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Farida Rahman',
    phone: '+62 821-9876-5432',
    email: 'farida.rahman@gmail.com',
    packageInterest: 'Umroh Plus Turki 14 Hari',
    source: 'ibu-siti-umroh-turki',
    status: 'new',
    dateSubmitted: '2024-12-24',
    agentId: 'agent-1',
    packageId: '2',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-2',
    name: 'Hasan Basri',
    phone: '+62 813-4567-8901',
    packageInterest: 'Umroh Reguler 9 Hari',
    source: 'ibu-siti-umroh-reguler',
    status: 'new',
    dateSubmitted: '2024-12-23',
    agentId: 'agent-1',
    packageId: '1',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-3',
    name: 'Nuraini Azizah',
    phone: '+62 822-3456-7890',
    email: 'nuraini.a@yahoo.com',
    packageInterest: 'Umroh VIP 12 Hari',
    source: 'ibu-siti-umroh-vip',
    status: 'contacted',
    dateSubmitted: '2024-12-22',
    lastContactedAt: '2024-12-23',
    notes: 'Tertarik, minta info lebih detail tentang hotel dan fasilitas',
    agentId: 'agent-1',
    packageId: '4',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-4',
    name: 'Rizal Maulana',
    phone: '+62 811-2345-6789',
    packageInterest: 'Umroh Plus Turki 14 Hari',
    source: 'ibu-siti-umroh-turki',
    status: 'negotiating',
    dateSubmitted: '2024-12-21',
    lastContactedAt: '2024-12-22',
    notes: 'Sudah dijelaskan detail paket, akan konsultasi dengan keluarga',
    agentId: 'agent-1',
    packageId: '2',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-5',
    name: 'Dewi Sartika',
    phone: '+62 856-7890-1234',
    email: 'dewi.sartika@hotmail.com',
    packageInterest: 'Umroh Reguler 9 Hari',
    source: 'ibu-siti-umroh-reguler',
    status: 'converted',
    dateSubmitted: '2024-12-18',
    lastContactedAt: '2024-12-19',
    convertedToJamaahId: '56',
    notes: 'Sudah daftar dan bayar DP',
    agentId: 'agent-1',
    packageId: '1',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-6',
    name: 'Ahmad Fauzi',
    phone: '+62 877-6543-2109',
    packageInterest: 'Umroh Plus Turki 14 Hari',
    source: 'ibu-siti-umroh-turki',
    status: 'converted',
    dateSubmitted: '2024-12-15',
    lastContactedAt: '2024-12-16',
    convertedToJamaahId: '57',
    notes: 'Langsung tertarik, sudah lunas',
    agentId: 'agent-1',
    packageId: '2',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-7',
    name: 'Laila Mufida',
    phone: '+62 831-2345-6780',
    packageInterest: 'Umroh VIP 12 Hari',
    source: 'ibu-siti-umroh-vip',
    status: 'converted',
    dateSubmitted: '2024-12-12',
    lastContactedAt: '2024-12-13',
    convertedToJamaahId: '58',
    notes: 'Pilih paket VIP, sudah bayar DP',
    agentId: 'agent-1',
    packageId: '4',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-8',
    name: 'Bambang Sutrisno',
    phone: '+62 819-8765-4321',
    packageInterest: 'Umroh Reguler 9 Hari',
    source: 'ibu-siti-umroh-reguler',
    status: 'lost',
    dateSubmitted: '2024-12-10',
    lastContactedAt: '2024-12-11',
    notes: 'Sudah daftar di travel lain',
    agentId: 'agent-1',
    packageId: '1',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-9',
    name: 'Siti Rahma',
    phone: '+62 852-3456-7891',
    packageInterest: 'Umroh Plus Turki 14 Hari',
    source: 'ibu-siti-umroh-turki',
    status: 'lost',
    dateSubmitted: '2024-12-08',
    lastContactedAt: '2024-12-09',
    notes: 'Nomor tidak aktif setelah kontak pertama',
    agentId: 'agent-1',
    packageId: '2',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-10',
    name: 'Yusuf Habibi',
    phone: '+62 895-1234-5678',
    email: 'yusuf.habibi@gmail.com',
    packageInterest: 'Umroh VIP 12 Hari',
    source: 'ibu-siti-umroh-vip',
    status: 'contacted',
    dateSubmitted: '2024-12-20',
    lastContactedAt: '2024-12-21',
    notes: 'Minta waktu untuk pikir-pikir, follow up minggu depan',
    agentId: 'agent-1',
    packageId: '4',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-11',
    name: 'Khadijah Amina',
    phone: '+62 878-9012-3456',
    packageInterest: 'Umroh Reguler 9 Hari',
    source: 'ibu-siti-umroh-reguler',
    status: 'new',
    dateSubmitted: '2024-12-24',
    agentId: 'agent-1',
    packageId: '1',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
  {
    id: 'lead-12',
    name: 'Fahmi Zainudin',
    phone: '+62 838-7654-3210',
    packageInterest: 'Umroh Plus Turki 14 Hari',
    source: 'ibu-siti-umroh-turki',
    status: 'contacted',
    dateSubmitted: '2024-12-19',
    lastContactedAt: '2024-12-20',
    notes: 'Tanya detail visa dan persyaratan Turki',
    agentId: 'agent-1',
    packageId: '2',
    landingPageId: 'lp-1',
    sourceType: 'landing_page',
  },
]

export function getLeadsByStatus(status: LeadStatus) {
  return mockLeads.filter(l => l.status === status)
}

export function getLeadsCount() {
  return {
    new: mockLeads.filter(l => l.status === 'new').length,
    contacted: mockLeads.filter(l => l.status === 'contacted').length,
    converted: mockLeads.filter(l => l.status === 'converted').length,
    lost: mockLeads.filter(l => l.status === 'lost').length,
    total: mockLeads.length,
  }
}

export function getLeadById(id: string) {
  return mockLeads.find(l => l.id === id)
}

// Calculate statistics
export function getLeadStats() {
  const thisWeekLeads = mockLeads.filter(lead => {
    const submitDate = new Date(lead.dateSubmitted)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return submitDate >= oneWeekAgo
  })

  const converted = mockLeads.filter(l => l.status === 'converted').length
  const conversionRate = mockLeads.length > 0 ? (converted / mockLeads.length) * 100 : 0

  // Calculate average response time (mock data - assume 24 hours average)
  const avgResponseTime = '24 jam'

  return {
    totalLeads: mockLeads.length,
    newThisWeek: thisWeekLeads.length,
    conversionRate: conversionRate.toFixed(1),
    avgResponseTime,
  }
}

/**
 * Get all leads for a specific agent
 */
export function getAgentLeads(agentId: string): Lead[] {
  return mockLeads.filter(lead => lead.agentId === agentId)
}

/**
 * Get leads for a specific landing page
 */
export function getLandingPageLeads(landingPageId: string): Lead[] {
  return mockLeads.filter(lead => lead.landingPageId === landingPageId)
}

/**
 * Create a new lead (for API simulation)
 */
export function createLead(leadData: Omit<Lead, 'id' | 'dateSubmitted' | 'status'>): Lead {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    ...leadData,
    status: 'new',
    dateSubmitted: new Date().toISOString().split('T')[0],
  }

  mockLeads.push(newLead)
  return newLead
}
