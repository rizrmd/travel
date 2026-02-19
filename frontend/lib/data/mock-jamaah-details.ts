export type DocumentStatus = 'complete' | 'pending' | 'missing'

export interface JamaahDocument {
  id: string
  type: string
  label: string
  status: DocumentStatus
  uploadedAt?: string
  uploadedBy?: string
}

export interface PaymentInstallment {
  id: string
  installmentNumber: number
  amount: number
  dueDate: string
  paidDate?: string
  status: 'paid' | 'pending' | 'overdue'
}

export interface PaymentInfo {
  jamaahId: string
  packagePrice: number
  totalPaid: number
  remainingBalance: number
  status: 'lunas' | 'cicilan' | 'nunggak'
  installments: PaymentInstallment[]
}

export interface AgentNote {
  id: string
  jamaahId: string
  note: string
  createdAt: string
  agentName: string
}

export interface ActivityLog {
  id: string
  jamaahId: string
  type: 'document' | 'payment' | 'note' | 'status_change'
  description: string
  timestamp: string
  performedBy: string
}

// Sample documents for jamaah
export const jamaahDocuments: Record<string, JamaahDocument[]> = {
  '1': [ // Ahmad Hidayat - Urgent
    { id: 'doc-1-1', type: 'ktp', label: 'KTP', status: 'complete', uploadedAt: '2024-12-10', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-1-2', type: 'kk', label: 'Kartu Keluarga', status: 'complete', uploadedAt: '2024-12-10', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-1-3', type: 'passport', label: 'Paspor', status: 'missing' },
    { id: 'doc-1-4', type: 'vaksin', label: 'Sertifikat Vaksin', status: 'pending' },
    { id: 'doc-1-5', type: 'foto', label: 'Foto 4x6', status: 'missing' },
  ],
  '3': [ // Budi Santoso - Urgent
    { id: 'doc-3-1', type: 'ktp', label: 'KTP', status: 'complete', uploadedAt: '2024-12-08', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-3-2', type: 'kk', label: 'Kartu Keluarga', status: 'pending' },
    { id: 'doc-3-3', type: 'passport', label: 'Paspor', status: 'missing' },
    { id: 'doc-3-4', type: 'vaksin', label: 'Sertifikat Vaksin', status: 'missing' },
    { id: 'doc-3-5', type: 'foto', label: 'Foto 4x6', status: 'complete', uploadedAt: '2024-12-08', uploadedBy: 'Ibu Siti Aminah' },
  ],
  '7': [ // Muhammad Rizki - Soon
    { id: 'doc-7-1', type: 'ktp', label: 'KTP', status: 'complete', uploadedAt: '2024-12-05', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-7-2', type: 'kk', label: 'Kartu Keluarga', status: 'complete', uploadedAt: '2024-12-05', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-7-3', type: 'passport', label: 'Paspor', status: 'complete', uploadedAt: '2024-12-06', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-7-4', type: 'vaksin', label: 'Sertifikat Vaksin', status: 'pending' },
    { id: 'doc-7-5', type: 'foto', label: 'Foto 4x6', status: 'complete', uploadedAt: '2024-12-05', uploadedBy: 'Ibu Siti Aminah' },
  ],
  '15': [ // Abdullah Malik - Ready
    { id: 'doc-15-1', type: 'ktp', label: 'KTP', status: 'complete', uploadedAt: '2024-11-20', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-15-2', type: 'kk', label: 'Kartu Keluarga', status: 'complete', uploadedAt: '2024-11-20', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-15-3', type: 'passport', label: 'Paspor', status: 'complete', uploadedAt: '2024-11-21', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-15-4', type: 'vaksin', label: 'Sertifikat Vaksin', status: 'complete', uploadedAt: '2024-11-21', uploadedBy: 'Ibu Siti Aminah' },
    { id: 'doc-15-5', type: 'foto', label: 'Foto 4x6', status: 'complete', uploadedAt: '2024-11-20', uploadedBy: 'Ibu Siti Aminah' },
  ],
}

// Sample payment info for jamaah
export const jamaahPayments: Record<string, PaymentInfo> = {
  '1': {
    jamaahId: '1',
    packagePrice: 35000000,
    totalPaid: 10000000,
    remainingBalance: 25000000,
    status: 'cicilan',
    installments: [
      { id: 'pay-1-1', installmentNumber: 1, amount: 10000000, dueDate: '2024-12-01', paidDate: '2024-11-28', status: 'paid' },
      { id: 'pay-1-2', installmentNumber: 2, amount: 10000000, dueDate: '2024-12-30', status: 'pending' },
      { id: 'pay-1-3', installmentNumber: 3, amount: 15000000, dueDate: '2025-01-30', status: 'pending' },
    ],
  },
  '3': {
    jamaahId: '3',
    packagePrice: 45000000,
    totalPaid: 15000000,
    remainingBalance: 30000000,
    status: 'cicilan',
    installments: [
      { id: 'pay-3-1', installmentNumber: 1, amount: 15000000, dueDate: '2024-12-01', paidDate: '2024-11-30', status: 'paid' },
      { id: 'pay-3-2', installmentNumber: 2, amount: 15000000, dueDate: '2025-01-01', status: 'pending' },
      { id: 'pay-3-3', installmentNumber: 3, amount: 15000000, dueDate: '2025-02-01', status: 'pending' },
    ],
  },
  '7': {
    jamaahId: '7',
    packagePrice: 45000000,
    totalPaid: 30000000,
    remainingBalance: 15000000,
    status: 'cicilan',
    installments: [
      { id: 'pay-7-1', installmentNumber: 1, amount: 15000000, dueDate: '2024-11-15', paidDate: '2024-11-14', status: 'paid' },
      { id: 'pay-7-2', installmentNumber: 2, amount: 15000000, dueDate: '2024-12-15', paidDate: '2024-12-14', status: 'paid' },
      { id: 'pay-7-3', installmentNumber: 3, amount: 15000000, dueDate: '2025-01-15', status: 'pending' },
    ],
  },
  '15': {
    jamaahId: '15',
    packagePrice: 45000000,
    totalPaid: 45000000,
    remainingBalance: 0,
    status: 'lunas',
    installments: [
      { id: 'pay-15-1', installmentNumber: 1, amount: 45000000, dueDate: '2024-11-20', paidDate: '2024-11-18', status: 'paid' },
    ],
  },
}

// Sample agent notes
export const agentNotes: Record<string, AgentNote[]> = {
  '1': [
    {
      id: 'note-1-1',
      jamaahId: '1',
      note: 'Jamaah sudah dikonfirmasi untuk upload paspor minggu depan. Perlu follow up.',
      createdAt: '2024-12-20',
      agentName: 'Ibu Siti Aminah',
    },
    {
      id: 'note-1-2',
      jamaahId: '1',
      note: 'Tertarik untuk upgrade ke paket VIP. Akan diskusi dengan keluarga.',
      createdAt: '2024-12-15',
      agentName: 'Ibu Siti Aminah',
    },
  ],
  '3': [
    {
      id: 'note-3-1',
      jamaahId: '3',
      note: 'Kesulitan upload dokumen. Sudah dijadwalkan ketemu di kantor besok.',
      createdAt: '2024-12-22',
      agentName: 'Ibu Siti Aminah',
    },
  ],
  '7': [
    {
      id: 'note-7-1',
      jamaahId: '7',
      note: 'Jamaah sangat kooperatif. Semua dokumen sudah hampir lengkap.',
      createdAt: '2024-12-18',
      agentName: 'Ibu Siti Aminah',
    },
  ],
}

// Sample activity logs
export const activityLogs: Record<string, ActivityLog[]> = {
  '1': [
    {
      id: 'act-1-1',
      jamaahId: '1',
      type: 'document',
      description: 'KTP berhasil diupload',
      timestamp: '2024-12-10 10:30',
      performedBy: 'Ibu Siti Aminah',
    },
    {
      id: 'act-1-2',
      jamaahId: '1',
      type: 'document',
      description: 'Kartu Keluarga berhasil diupload',
      timestamp: '2024-12-10 10:35',
      performedBy: 'Ibu Siti Aminah',
    },
    {
      id: 'act-1-3',
      jamaahId: '1',
      type: 'payment',
      description: 'Pembayaran cicilan 1 sebesar Rp 10.000.000 diterima',
      timestamp: '2024-11-28 14:20',
      performedBy: 'Admin',
    },
    {
      id: 'act-1-4',
      jamaahId: '1',
      type: 'note',
      description: 'Catatan ditambahkan oleh agent',
      timestamp: '2024-12-20 09:15',
      performedBy: 'Ibu Siti Aminah',
    },
  ],
  '15': [
    {
      id: 'act-15-1',
      jamaahId: '15',
      type: 'payment',
      description: 'Pelunasan paket sebesar Rp 45.000.000 diterima',
      timestamp: '2024-11-18 11:00',
      performedBy: 'Admin',
    },
    {
      id: 'act-15-2',
      jamaahId: '15',
      type: 'document',
      description: 'Semua dokumen lengkap',
      timestamp: '2024-11-21 15:30',
      performedBy: 'Ibu Siti Aminah',
    },
    {
      id: 'act-15-3',
      jamaahId: '15',
      type: 'status_change',
      description: 'Status berubah menjadi Ready',
      timestamp: '2024-11-22 10:00',
      performedBy: 'System',
    },
  ],
}

export function getJamaahDocuments(jamaahId: string): JamaahDocument[] {
  return jamaahDocuments[jamaahId] || []
}

export function getJamaahPayment(jamaahId: string): PaymentInfo | null {
  return jamaahPayments[jamaahId] || null
}

export function getAgentNotes(jamaahId: string): AgentNote[] {
  return agentNotes[jamaahId] || []
}

export function getActivityLogs(jamaahId: string): ActivityLog[] {
  return activityLogs[jamaahId] || []
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
