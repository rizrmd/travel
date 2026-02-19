// Mock data for owner business intelligence reports

export interface ReportTemplate {
  id: string
  name: string
  category: 'revenue' | 'sales' | 'commission' | 'documents' | 'operational'
  description: string
  lastGenerated?: string
}

export interface ReportData {
  category: 'revenue' | 'sales' | 'commission' | 'documents' | 'operational'
  title: string
  summary: string
  metrics: ReportMetric[]
  insights: string[]
  chartData?: any[]
}

export interface ReportMetric {
  label: string
  value: string
  change?: number
  trend?: 'up' | 'down' | 'stable'
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'rev-1',
    name: 'Laporan Revenue Bulanan',
    category: 'revenue',
    description: 'Analisis pendapatan per bulan dengan breakdown per paket dan agent',
    lastGenerated: '2024-12-20'
  },
  {
    id: 'rev-2',
    name: 'Laporan Revenue per Paket',
    category: 'revenue',
    description: 'Performa revenue masing-masing paket umroh',
    lastGenerated: '2024-12-18'
  },
  {
    id: 'sales-1',
    name: 'Laporan Penjualan Bulanan',
    category: 'sales',
    description: 'Total penjualan, conversion rate, dan funnel analysis',
    lastGenerated: '2024-12-22'
  },
  {
    id: 'sales-2',
    name: 'Laporan Lead to Closing',
    category: 'sales',
    description: 'Analisis perjalanan lead hingga menjadi jamaah',
    lastGenerated: '2024-12-15'
  },
  {
    id: 'comm-1',
    name: 'Laporan Komisi Agent',
    category: 'commission',
    description: 'Breakdown komisi per agent dengan bonus dan tier',
    lastGenerated: '2024-12-21'
  },
  {
    id: 'comm-2',
    name: 'Laporan Biaya Komisi',
    category: 'commission',
    description: 'Total biaya komisi vs revenue untuk analisis margin',
    lastGenerated: '2024-12-19'
  },
  {
    id: 'doc-1',
    name: 'Laporan Status Dokumen',
    category: 'documents',
    description: 'Status kelengkapan dokumen jamaah per paket',
    lastGenerated: '2024-12-23'
  },
  {
    id: 'doc-2',
    name: 'Laporan Document Processing Time',
    category: 'documents',
    description: 'Waktu rata-rata pemrosesan dokumen dari upload ke approval',
    lastGenerated: '2024-12-17'
  },
  {
    id: 'ops-1',
    name: 'Laporan Operasional Harian',
    category: 'operational',
    description: 'Aktivitas harian: leads baru, follow-up, dokumen, pembayaran',
    lastGenerated: '2024-12-25'
  },
  {
    id: 'ops-2',
    name: 'Laporan Agent Performance',
    category: 'operational',
    description: 'Performa agent: response time, conversion, kepuasan jamaah',
    lastGenerated: '2024-12-24'
  }
]

export const reportDataSamples: Record<string, ReportData> = {
  revenue: {
    category: 'revenue',
    title: 'Laporan Revenue Bulanan - Desember 2024',
    summary: 'Total revenue bulan ini mencapai Rp 450jt dari 32 transaksi, naik 18.4% dari bulan lalu',
    metrics: [
      { label: 'Total Revenue', value: 'Rp 450jt', change: 18.4, trend: 'up' },
      { label: 'Total Transaksi', value: '32', change: 12.3, trend: 'up' },
      { label: 'Avg Order Value', value: 'Rp 14.1jt', change: 5.4, trend: 'up' },
      { label: 'Growth Rate', value: '18.4%', change: 3.2, trend: 'up' }
    ],
    insights: [
      'Paket Umroh Premium Ramadhan menjadi best seller dengan kontribusi 28% terhadap total revenue',
      'Revenue dari agent tier Platinum meningkat 24% bulan ini',
      'Periode peak booking terjadi pada minggu ke-2 dan ke-4',
      'Proyeksi revenue bulan depan: Rp 520jt (growth 15.6%)'
    ],
    chartData: [
      { name: 'Minggu 1', revenue: 95000000 },
      { name: 'Minggu 2', revenue: 135000000 },
      { name: 'Minggu 3', revenue: 98000000 },
      { name: 'Minggu 4', revenue: 122000000 }
    ]
  },
  sales: {
    category: 'sales',
    title: 'Laporan Penjualan Bulanan - Desember 2024',
    summary: 'Conversion rate mencapai 42% dengan 76 leads baru dan 32 closing',
    metrics: [
      { label: 'Total Leads', value: '76', change: 8.6, trend: 'up' },
      { label: 'Total Closing', value: '32', change: 12.3, trend: 'up' },
      { label: 'Conversion Rate', value: '42.1%', change: 2.8, trend: 'up' },
      { label: 'Avg Sales Cycle', value: '12 hari', change: -8.3, trend: 'up' }
    ],
    insights: [
      'Conversion rate terbaik ada di agent Ahmad Zaki (68%) dan Siti Aminah (72%)',
      'Lead dari WhatsApp campaign memiliki conversion 2x lebih tinggi vs organic',
      'Sales cycle rata-rata turun dari 13 hari ke 12 hari',
      'Follow-up di hari ke-3 memiliki closing rate tertinggi (58%)'
    ],
    chartData: [
      { stage: 'Leads', count: 76 },
      { stage: 'Follow-up', count: 54 },
      { stage: 'Proposal', count: 38 },
      { stage: 'Closing', count: 32 }
    ]
  },
  commission: {
    category: 'commission',
    title: 'Laporan Komisi Agent - Desember 2024',
    summary: 'Total komisi yang dibayarkan Rp 36jt untuk 18 agent aktif',
    metrics: [
      { label: 'Total Komisi', value: 'Rp 36jt', change: 15.2, trend: 'up' },
      { label: 'Avg Komisi/Agent', value: 'Rp 2jt', change: 8.4, trend: 'up' },
      { label: 'Komisi vs Revenue', value: '8%', change: 0.2, trend: 'stable' },
      { label: 'Bonus Tier', value: 'Rp 4.2jt', change: 22.5, trend: 'up' }
    ],
    insights: [
      'Agent tier Platinum menghasilkan 45% revenue tapi hanya 24% total komisi',
      'Program bonus performa efektif meningkatkan conversion rate agent',
      'Rasio komisi vs revenue tetap sehat di 8% (target: <10%)',
      '3 agent sudah qualified untuk naik tier bulan depan'
    ]
  },
  documents: {
    category: 'documents',
    title: 'Laporan Status Dokumen - Desember 2024',
    summary: '89% dokumen jamaah sudah lengkap dan diverifikasi',
    metrics: [
      { label: 'Dokumen Lengkap', value: '89%', change: 5.3, trend: 'up' },
      { label: 'Pending Review', value: '18 docs', change: -12.5, trend: 'up' },
      { label: 'Avg Processing', value: '2.3 hari', change: -18.2, trend: 'up' },
      { label: 'Rejection Rate', value: '4.2%', change: -28.6, trend: 'up' }
    ],
    insights: [
      'Waktu processing dokumen turun dari 2.8 hari ke 2.3 hari',
      'OCR automation mengurangi manual entry sebesar 65%',
      'Dokumen passport dan KTP memiliki acceptance rate tertinggi (98%)',
      'Perlu training untuk agent terkait foto dokumen yang berkualitas'
    ]
  },
  operational: {
    category: 'operational',
    title: 'Laporan Operasional - Desember 2024',
    summary: 'Operasional berjalan lancar dengan response time rata-rata 4.2 jam',
    metrics: [
      { label: 'Avg Response Time', value: '4.2 jam', change: -15.8, trend: 'up' },
      { label: 'Active Jamaah', value: '247', change: 12.8, trend: 'up' },
      { label: 'Agent Utilization', value: '78%', change: 5.2, trend: 'up' },
      { label: 'Customer Satisfaction', value: '4.6/5', change: 2.3, trend: 'up' }
    ],
    insights: [
      'Response time terbaik ada di jam 09:00-12:00 (avg 2.1 jam)',
      'Agent dengan workload tinggi (>20 jamaah) perlu support tambahan',
      'WhatsApp automation meningkatkan response time sebesar 35%',
      'Customer satisfaction tertinggi di paket Premium (4.8/5)'
    ]
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(0)}jt`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}
