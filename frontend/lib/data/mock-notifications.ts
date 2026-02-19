// Mock data for Jamaah Notifications

export type NotificationType = 'document' | 'payment' | 'update' | 'important'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export const mockNotifications: Notification[] = [
  // Today
  {
    id: 'notif-1',
    type: 'important',
    title: 'Sertifikat Vaksin Ditolak',
    message: 'Dokumen Sertifikat Vaksin Anda ditolak. Alasan: Foto tidak jelas. Mohon upload ulang dengan foto yang lebih jelas.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-2',
    type: 'update',
    title: 'Jadwal Medical Check Ditentukan',
    message: 'Medical check Anda telah dijadwalkan pada tanggal 1 Maret 2025 pukul 09:00 WIB di Klinik Travel Umroh Jakarta.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: false,
    actionUrl: '/my/dashboard',
  },

  // Yesterday
  {
    id: 'notif-3',
    type: 'document',
    title: 'Dokumen KTP Disetujui',
    message: 'Dokumen KTP Anda telah disetujui oleh admin. 3 dari 6 dokumen sudah lengkap.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-4',
    type: 'payment',
    title: 'Pembayaran Cicilan Ke-2 Diterima',
    message: 'Pembayaran cicilan ke-2 sebesar Rp 17.500.000 telah diterima dan diverifikasi. Terima kasih.',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/payments',
  },
  {
    id: 'notif-5',
    type: 'document',
    title: 'Dokumen Kartu Keluarga Disetujui',
    message: 'Dokumen Kartu Keluarga Anda telah disetujui oleh admin.',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },

  // Last Week
  {
    id: 'notif-6',
    type: 'update',
    title: 'Itinerary Perjalanan Tersedia',
    message: 'Itinerary lengkap perjalanan umroh Anda sudah tersedia. Silakan lihat detail jadwal perjalanan.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    actionUrl: '/my/itinerary',
  },
  {
    id: 'notif-7',
    type: 'document',
    title: 'Dokumen Paspor Sedang Direview',
    message: 'Dokumen Paspor Anda sedang dalam proses review oleh admin. Harap menunggu 1-2 hari kerja.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-8',
    type: 'important',
    title: 'Buku Nikah Ditolak',
    message: 'Dokumen Buku Nikah Anda ditolak. Alasan: Foto blur, mohon upload ulang dengan kualitas yang lebih baik.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-9',
    type: 'payment',
    title: 'Pembayaran Cicilan Ke-1 Diterima',
    message: 'Pembayaran cicilan ke-1 sebesar Rp 17.500.000 telah diterima dan diverifikasi. Terima kasih.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/payments',
  },
  {
    id: 'notif-10',
    type: 'update',
    title: 'Selamat Datang di Portal Jamaah',
    message: 'Selamat datang di Portal Jamaah Travel Umroh! Di sini Anda dapat mengelola dokumen, melihat pembayaran, dan memantau persiapan umroh Anda.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },

  // 2 Weeks Ago
  {
    id: 'notif-11',
    type: 'update',
    title: 'Agent Ditugaskan',
    message: 'Ibu Siti Aminah telah ditugaskan sebagai agent Anda. Anda dapat menghubungi beliau untuk bantuan.',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'notif-12',
    type: 'document',
    title: 'Dokumen Buku Nikah Diterima',
    message: 'Dokumen Buku Nikah Anda telah diterima dan sedang dalam proses review.',
    timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-13',
    type: 'document',
    title: 'Dokumen Paspor Diterima',
    message: 'Dokumen Paspor Anda telah diterima dan sedang dalam proses review.',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-14',
    type: 'document',
    title: 'Dokumen Kartu Keluarga Diterima',
    message: 'Dokumen Kartu Keluarga Anda telah diterima dan sedang dalam proses review.',
    timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
  {
    id: 'notif-15',
    type: 'document',
    title: 'Dokumen KTP Diterima',
    message: 'Dokumen KTP Anda telah diterima dan sedang dalam proses review.',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/my/documents',
  },
]

// Helper functions
export function getUnreadCount(): number {
  return mockNotifications.filter(n => !n.read).length
}

export function getNotificationsByType(type: NotificationType): Notification[] {
  return mockNotifications.filter(n => n.type === type)
}

export function getNotificationsByDateRange(days: number): Notification[] {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return mockNotifications.filter(n => new Date(n.timestamp) >= cutoffDate)
}

export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  notifications.forEach(notification => {
    const notifDate = new Date(notification.timestamp)
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate())

    if (notifDay.getTime() === today.getTime()) {
      groups.today.push(notification)
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification)
    } else if (notifDay >= lastWeek) {
      groups.lastWeek.push(notification)
    } else {
      groups.older.push(notification)
    }
  })

  return groups
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`
  return `${Math.floor(diffDays / 30)} bulan yang lalu`
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean
  whatsapp: boolean
  push: boolean
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: true,
  whatsapp: true,
  push: false, // Coming soon
}
