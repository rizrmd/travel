export type PackageStatus = 'active' | 'inactive'

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface Package {
  id: string
  name: string
  duration: string // e.g., "9 Hari 7 Malam"
  priceRetail: number
  priceWholesale: number
  status: PackageStatus
  description: string
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  createdAt: string
  updatedAt: string
}

export const mockPackages: Package[] = [
  {
    id: '1',
    name: 'Umroh Reguler 9 Hari',
    duration: '9 Hari 7 Malam',
    priceRetail: 25000000,
    priceWholesale: 23000000,
    status: 'active',
    description: 'Paket umroh reguler dengan fasilitas standar yang nyaman dan terpercaya',
    createdAt: '2024-01-15',
    updatedAt: '2024-12-01',
    itinerary: [
      {
        day: 1,
        title: 'Keberangkatan Jakarta - Jeddah',
        activities: [
          'Berkumpul di Bandara Soekarno-Hatta',
          'Penerbangan menuju Jeddah',
          'Tiba di Jeddah, perjalanan ke Madinah'
        ]
      },
      {
        day: 2,
        title: 'Ziarah Madinah',
        activities: [
          'Sholat di Masjid Nabawi',
          'Ziarah Jabal Uhud',
          'Ziarah Masjid Quba',
          'Ziarah Kebun Kurma'
        ]
      },
      {
        day: 3,
        title: 'Madinah - Makkah',
        activities: [
          'Sholat Subuh di Masjid Nabawi',
          'Perjalanan Madinah ke Makkah',
          'Check-in hotel Makkah',
          'Ibadah di Masjidil Haram'
        ]
      },
      {
        day: 4,
        title: 'Ibadah di Makkah',
        activities: [
          'Thawaf dan Sai',
          'Ziarah Jabal Rahmah',
          'Belanja oleh-oleh',
          'Ibadah di Masjidil Haram'
        ]
      },
      {
        day: 5,
        title: 'Ibadah di Makkah',
        activities: [
          'Thawaf Wada',
          'Sholat di Masjidil Haram',
          'City tour Makkah',
          'Waktu bebas'
        ]
      },
    ],
    inclusions: [
      'Tiket pesawat PP Jakarta-Jeddah',
      'Hotel bintang 4 di Madinah (walking distance)',
      'Hotel bintang 4 di Makkah (walking distance)',
      'Makan 3x sehari',
      'Transportasi AC',
      'Perlengkapan umroh',
      'Manasik umroh',
      'Tour leader berpengalaman',
      'Air Zam-zam 5 liter',
    ],
    exclusions: [
      'Biaya passport dan visa',
      'Pengeluaran pribadi',
      'Asuransi perjalanan',
      'Tips guide lokal',
      'Excess baggage',
    ],
  },
  {
    id: '2',
    name: 'Umroh VIP 12 Hari',
    duration: '12 Hari 10 Malam',
    priceRetail: 45000000,
    priceWholesale: 42000000,
    status: 'active',
    description: 'Paket umroh VIP dengan hotel bintang 5 dan fasilitas premium',
    createdAt: '2024-01-20',
    updatedAt: '2024-11-15',
    itinerary: [
      {
        day: 1,
        title: 'Keberangkatan Jakarta - Jeddah',
        activities: [
          'Berkumpul di Bandara Soekarno-Hatta',
          'Penerbangan business class menuju Jeddah',
          'VIP service di airport',
          'Tiba di Jeddah, perjalanan ke Madinah'
        ]
      },
      {
        day: 2,
        title: 'Ziarah Madinah Premium',
        activities: [
          'Sholat di Masjid Nabawi (shaf depan)',
          'Ziarah Jabal Uhud dengan guide khusus',
          'Ziarah Masjid Quba',
          'Makan malam di restoran premium'
        ]
      },
    ],
    inclusions: [
      'Tiket pesawat business class PP Jakarta-Jeddah',
      'Hotel bintang 5 di Madinah (view Masjid Nabawi)',
      'Hotel bintang 5 di Makkah (view Masjidil Haram)',
      'Makan 4x sehari di restoran premium',
      'Transportasi VIP',
      'Perlengkapan umroh premium',
      'Manasik umroh private',
      'Tour leader dan mutawif berpengalaman',
      'Air Zam-zam 10 liter',
      'Asuransi perjalanan',
      'Tas dan koper berkualitas',
    ],
    exclusions: [
      'Biaya passport dan visa',
      'Pengeluaran pribadi',
      'Tips guide lokal',
    ],
  },
  {
    id: '3',
    name: 'Umroh Plus Turki 14 Hari',
    duration: '14 Hari 12 Malam',
    priceRetail: 35000000,
    priceWholesale: 32000000,
    status: 'active',
    description: 'Paket umroh lengkap dengan wisata Turki yang menakjubkan',
    createdAt: '2024-02-01',
    updatedAt: '2024-12-10',
    itinerary: [
      {
        day: 1,
        title: 'Jakarta - Istanbul',
        activities: [
          'Berkumpul di Bandara Soekarno-Hatta',
          'Penerbangan ke Istanbul',
          'City tour Istanbul'
        ]
      },
      {
        day: 2,
        title: 'Wisata Istanbul',
        activities: [
          'Hagia Sophia',
          'Blue Mosque',
          'Topkapi Palace',
          'Grand Bazaar'
        ]
      },
      {
        day: 3,
        title: 'Istanbul - Jeddah',
        activities: [
          'Belanja oleh-oleh',
          'Penerbangan ke Jeddah',
          'Perjalanan ke Madinah'
        ]
      },
    ],
    inclusions: [
      'Tiket pesawat PP via Istanbul',
      'Hotel bintang 4 di Istanbul',
      'Hotel bintang 4 di Madinah & Makkah',
      'Makan 3x sehari',
      'Tour wisata Turki',
      'Transportasi AC',
      'Perlengkapan umroh',
      'Air Zam-zam 5 liter',
    ],
    exclusions: [
      'Biaya passport dan visa Turki',
      'Pengeluaran pribadi',
      'Asuransi perjalanan',
      'Tips guide',
    ],
  },
  {
    id: '4',
    name: 'Umroh Plus Dubai 16 Hari',
    duration: '16 Hari 14 Malam',
    priceRetail: 42000000,
    priceWholesale: 38000000,
    status: 'active',
    description: 'Paket umroh plus wisata Dubai dan Abu Dhabi',
    createdAt: '2024-02-10',
    updatedAt: '2024-11-20',
    itinerary: [
      {
        day: 1,
        title: 'Jakarta - Dubai',
        activities: [
          'Berkumpul di Bandara Soekarno-Hatta',
          'Penerbangan ke Dubai',
          'Check-in hotel Dubai'
        ]
      },
      {
        day: 2,
        title: 'Dubai City Tour',
        activities: [
          'Burj Khalifa',
          'Dubai Mall',
          'Dubai Fountain',
          'Desert Safari'
        ]
      },
    ],
    inclusions: [
      'Tiket pesawat PP via Dubai',
      'Hotel bintang 4 di Dubai',
      'Hotel bintang 4 di Madinah & Makkah',
      'Makan 3x sehari',
      'Tour wisata Dubai & Abu Dhabi',
      'Desert Safari',
      'Transportasi AC',
      'Air Zam-zam 5 liter',
    ],
    exclusions: [
      'Biaya passport dan visa UAE',
      'Pengeluaran pribadi',
      'Asuransi perjalanan',
    ],
  },
  {
    id: '5',
    name: 'Umroh Promo Ramadhan',
    duration: '12 Hari 10 Malam',
    priceRetail: 32000000,
    priceWholesale: 29000000,
    status: 'inactive',
    description: 'Paket umroh spesial Ramadhan (non-aktif saat ini)',
    createdAt: '2024-01-05',
    updatedAt: '2024-10-01',
    itinerary: [],
    inclusions: [
      'Tiket pesawat PP',
      'Hotel bintang 4',
      'Makan 3x sehari',
      'Transportasi',
    ],
    exclusions: [
      'Visa',
      'Pengeluaran pribadi',
    ],
  },
]

export function getPackageById(id: string): Package | undefined {
  return mockPackages.find(p => p.id === id)
}

export function getPackageStats() {
  return {
    total: mockPackages.length,
    active: mockPackages.filter(p => p.status === 'active').length,
    inactive: mockPackages.filter(p => p.status === 'inactive').length,
  }
}
