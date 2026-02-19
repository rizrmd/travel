export type ReportType = 'revenue' | 'documents' | 'payments' | 'agents'

export interface ReportSummary {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface ReportData {
  month: string
  value: number
  label?: string
}

export const mockRevenueReport = {
  summary: [
    { title: 'Total Pendapatan', value: 'Rp 275.000.000', change: '+12%', trend: 'up' as const },
    { title: 'Transaksi Bulan Ini', value: 35, change: '+5', trend: 'up' as const },
    { title: 'Rata-rata Deal', value: 'Rp 32.000.000', change: '+8%', trend: 'up' as const },
    { title: 'Lunas Bulan Ini', value: 12, change: '+3', trend: 'up' as const },
  ],
  chartData: [
    { month: 'Jul', value: 85000000 },
    { month: 'Agu', value: 95000000 },
    { month: 'Sep', value: 120000000 },
    { month: 'Okt', value: 110000000 },
    { month: 'Nov', value: 135000000 },
    { month: 'Des', value: 125000000 },
  ],
  tableData: [
    { package: 'Umroh Reguler 9 Hari', sold: 15, revenue: 375000000 },
    { package: 'Umroh VIP 12 Hari', sold: 8, revenue: 360000000 },
    { package: 'Umroh Plus Turki 14 Hari', sold: 7, revenue: 245000000 },
    { package: 'Umroh Plus Dubai 16 Hari', sold: 5, revenue: 210000000 },
  ],
}

export const mockDocumentReport = {
  summary: [
    { title: 'Total Dokumen', value: 120, change: '+15', trend: 'up' as const },
    { title: 'Lengkap', value: 85, change: '+10', trend: 'up' as const },
    { title: 'Pending Review', value: 20, change: '+5', trend: 'neutral' as const },
    { title: 'Belum Upload', value: 15, change: '-3', trend: 'down' as const },
  ],
  chartData: [
    { month: 'Jul', value: 65 },
    { month: 'Agu', value: 72 },
    { month: 'Sep', value: 78 },
    { month: 'Okt', value: 80 },
    { month: 'Nov', value: 82 },
    { month: 'Des', value: 85 },
  ],
  tableData: [
    { type: 'KTP', complete: 50, pending: 5, incomplete: 0 },
    { type: 'Kartu Keluarga', complete: 48, pending: 4, incomplete: 3 },
    { type: 'Paspor', complete: 42, pending: 8, incomplete: 5 },
    { type: 'Sertifikat Vaksin', complete: 40, pending: 3, incomplete: 7 },
  ],
}

export const mockPaymentReport = {
  summary: [
    { title: 'Total Terbayar', value: 'Rp 240.000.000', change: '+18%', trend: 'up' as const },
    { title: 'Piutang', value: 'Rp 135.000.000', change: '-5%', trend: 'down' as const },
    { title: 'Lunas', value: 12, change: '+4', trend: 'up' as const },
    { title: 'Overdue', value: 3, change: '-1', trend: 'down' as const },
  ],
  chartData: [
    { month: 'Jul', value: 65 },
    { month: 'Agu', value: 70 },
    { month: 'Sep', value: 75 },
    { month: 'Okt', value: 72 },
    { month: 'Nov', value: 78 },
    { month: 'Des', value: 82 },
  ],
  tableData: [
    { month: 'Desember', collected: 125000000, target: 150000000, rate: 83 },
    { month: 'November', collected: 135000000, target: 150000000, rate: 90 },
    { month: 'Oktober', collected: 110000000, target: 120000000, rate: 92 },
  ],
}

export const mockAgentReport = {
  summary: [
    { title: 'Total Agent', value: 6, change: '+1', trend: 'up' as const },
    { title: 'Top Performer', value: 'Ahmad Fauzi', change: '25 jamaah', trend: 'up' as const },
    { title: 'Total Komisi', value: 'Rp 45.000.000', change: '+15%', trend: 'up' as const },
    { title: 'Avg Conversion', value: '72%', change: '+3%', trend: 'up' as const },
  ],
  chartData: [
    { month: 'Jul', value: 18 },
    { month: 'Agu', value: 22 },
    { month: 'Sep', value: 28 },
    { month: 'Okt', value: 25 },
    { month: 'Nov', value: 30 },
    { month: 'Des', value: 35 },
  ],
  tableData: [
    { agent: 'Ahmad Fauzi', tier: 'Platinum', jamaah: 25, commission: 45000000, rate: 85 },
    { agent: 'Siti Aminah', tier: 'Gold', jamaah: 18, commission: 28000000, rate: 75 },
    { agent: 'Budi Hartono', tier: 'Gold', jamaah: 15, commission: 22000000, rate: 70 },
    { agent: 'Dewi Kusuma', tier: 'Silver', jamaah: 8, commission: 12000000, rate: 60 },
  ],
}
