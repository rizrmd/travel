export interface LandingPage {
  id: string
  slug: string
  agentId: string
  agentName: string
  packageId: string
  packageName: string
  customMessage: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  analytics: {
    views: number
    clicks: number
    conversions: number
    conversionRate: number
  }
}

export const mockLandingPages: LandingPage[] = [
  {
    id: 'lp-1',
    slug: 'ibu-siti-umroh-turki',
    agentId: 'agent-1',
    agentName: 'Ibu Siti Aminah',
    packageId: '3',
    packageName: 'Umroh Plus Turki 14 Hari',
    customMessage: 'Assalamualaikum! Saya Ibu Siti, agent umroh berpengalaman 5 tahun. Alhamdulillah sudah memberangkatkan 200+ jamaah. Harga spesial untuk Anda! Hubungi saya untuk info lengkap.',
    createdAt: '2024-11-15',
    updatedAt: '2024-12-20',
    isActive: true,
    analytics: {
      views: 127,
      clicks: 45,
      conversions: 3,
      conversionRate: 6.7,
    }
  },
  {
    id: 'lp-2',
    slug: 'ibu-siti-umroh-reguler',
    agentId: 'agent-1',
    agentName: 'Ibu Siti Aminah',
    packageId: '1',
    packageName: 'Umroh Reguler 9 Hari',
    customMessage: 'Paket umroh reguler terbaik dengan harga terjangkau! Fasilitas nyaman, hotel walking distance, dan bimbingan ibadah lengkap. Cicilan tersedia!',
    createdAt: '2024-10-10',
    updatedAt: '2024-12-01',
    isActive: true,
    analytics: {
      views: 89,
      clicks: 32,
      conversions: 2,
      conversionRate: 6.25,
    }
  },
  {
    id: 'lp-3',
    slug: 'ibu-siti-umroh-vip',
    agentId: 'agent-1',
    agentName: 'Ibu Siti Aminah',
    packageId: '2',
    packageName: 'Umroh VIP 12 Hari',
    customMessage: 'Umroh dengan fasilitas VIP! Hotel bintang 5 dengan view Masjidil Haram dan Masjid Nabawi. Pengalaman ibadah yang tak terlupakan!',
    createdAt: '2024-09-05',
    updatedAt: '2024-11-10',
    isActive: false,
    analytics: {
      views: 56,
      clicks: 18,
      conversions: 1,
      conversionRate: 5.56,
    }
  },
]

export function getLandingPageBySlug(slug: string) {
  return mockLandingPages.find(lp => lp.slug === slug)
}

export function getAgentLandingPages(agentId: string) {
  return mockLandingPages.filter(lp => lp.agentId === agentId)
}

export function getActiveLandingPages(agentId: string) {
  return mockLandingPages.filter(lp => lp.agentId === agentId && lp.isActive)
}
