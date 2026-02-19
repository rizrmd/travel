export interface Activity {
  id: string
  type: 'jamaah_added' | 'document_uploaded' | 'payment_received' | 'jamaah_completed'
  title: string
  description: string
  timestamp: string
  icon?: string
}

export interface DashboardKPI {
  totalJamaah: number
  pendingDocuments: number
  overduePayments: number
  monthRevenue: number
}

export const mockDashboardKPIs: DashboardKPI = {
  totalJamaah: 55,
  pendingDocuments: 8,
  overduePayments: 3,
  monthRevenue: 125000000, // Rp 125 juta
}

export const mockRecentActivities: Activity[] = [
  {
    id: '1',
    type: 'payment_received',
    title: 'Pembayaran Diterima',
    description: 'Ahmad Hidayat membayar cicilan Rp 5.000.000',
    timestamp: '2025-12-25T10:30:00',
  },
  {
    id: '2',
    type: 'document_uploaded',
    title: 'Dokumen Diupload',
    description: 'Siti Nurhaliza mengupload Paspor',
    timestamp: '2025-12-25T09:15:00',
  },
  {
    id: '3',
    type: 'jamaah_added',
    title: 'Jamaah Baru',
    description: 'Budi Santoso ditambahkan ke Umroh VIP 12 Hari',
    timestamp: '2025-12-24T16:45:00',
  },
  {
    id: '4',
    type: 'jamaah_completed',
    title: 'Jamaah Siap',
    description: 'Dewi Lestari ditandai sebagai siap berangkat',
    timestamp: '2025-12-24T14:20:00',
  },
  {
    id: '5',
    type: 'payment_received',
    title: 'Pembayaran Diterima',
    description: 'Fatimah Zahra melunasi pembayaran Rp 15.000.000',
    timestamp: '2025-12-24T11:00:00',
  },
]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Baru saja'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} menit yang lalu`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} jam yang lalu`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} hari yang lalu`
  }
}
