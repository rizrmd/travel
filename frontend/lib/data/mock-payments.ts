export type PaymentStatus = 'lunas' | 'cicilan' | 'nunggak'
export type PaymentMethod = 'transfer' | 'cash' | 'va'

export interface Payment {
  id: string
  jamaahId: string
  jamaahName: string
  package: string
  totalAmount: number
  paidAmount: number
  remaining: number
  status: PaymentStatus
  dueDate: string
  installments: {
    total: number
    paid: number
  }
  history: PaymentHistoryItem[]
}

export interface PaymentHistoryItem {
  id: string
  date: string
  amount: number
  method: PaymentMethod
  notes?: string
}

export const mockPayments: Payment[] = [
  {
    id: '1',
    jamaahId: '1',
    jamaahName: 'Ahmad Hidayat',
    package: 'Umroh Plus Turki 14 Hari',
    totalAmount: 35000000,
    paidAmount: 20000000,
    remaining: 15000000,
    status: 'cicilan',
    dueDate: '2026-01-15',
    installments: { total: 7, paid: 4 },
    history: [
      { id: '1-1', date: '2025-09-01', amount: 5000000, method: 'transfer', notes: 'DP' },
      { id: '1-2', date: '2025-10-01', amount: 5000000, method: 'transfer' },
      { id: '1-3', date: '2025-11-01', amount: 5000000, method: 'transfer' },
      { id: '1-4', date: '2025-12-01', amount: 5000000, method: 'transfer' },
    ],
  },
  {
    id: '2',
    jamaahId: '2',
    jamaahName: 'Siti Nurhaliza',
    package: 'Umroh Reguler 9 Hari',
    totalAmount: 25000000,
    paidAmount: 25000000,
    remaining: 0,
    status: 'lunas',
    dueDate: '2025-11-30',
    installments: { total: 1, paid: 1 },
    history: [
      { id: '2-1', date: '2025-10-15', amount: 25000000, method: 'transfer', notes: 'Lunas' },
    ],
  },
  {
    id: '3',
    jamaahId: '3',
    jamaahName: 'Budi Santoso',
    package: 'Umroh VIP 12 Hari',
    totalAmount: 45000000,
    paidAmount: 35000000,
    remaining: 10000000,
    status: 'cicilan',
    dueDate: '2026-02-01',
    installments: { total: 9, paid: 7 },
    history: [
      { id: '3-1', date: '2025-06-01', amount: 5000000, method: 'transfer', notes: 'DP' },
      { id: '3-2', date: '2025-07-01', amount: 5000000, method: 'transfer' },
      { id: '3-3', date: '2025-08-01', amount: 5000000, method: 'transfer' },
      { id: '3-4', date: '2025-09-01', amount: 5000000, method: 'transfer' },
      { id: '3-5', date: '2025-10-01', amount: 5000000, method: 'transfer' },
      { id: '3-6', date: '2025-11-01', amount: 5000000, method: 'transfer' },
      { id: '3-7', date: '2025-12-01', amount: 5000000, method: 'transfer' },
    ],
  },
  {
    id: '4',
    jamaahId: '4',
    jamaahName: 'Dewi Lestari',
    package: 'Umroh Plus Dubai 16 Hari',
    totalAmount: 42000000,
    paidAmount: 20000000,
    remaining: 22000000,
    status: 'nunggak',
    dueDate: '2025-12-15', // Overdue
    installments: { total: 8, paid: 4 },
    history: [
      { id: '4-1', date: '2025-07-01', amount: 5000000, method: 'transfer', notes: 'DP' },
      { id: '4-2', date: '2025-08-01', amount: 5000000, method: 'transfer' },
      { id: '4-3', date: '2025-09-01', amount: 5000000, method: 'va' },
      { id: '4-4', date: '2025-10-01', amount: 5000000, method: 'transfer' },
    ],
  },
  {
    id: '5',
    jamaahId: '5',
    jamaahName: 'Hendra Wijaya',
    package: 'Umroh Reguler 9 Hari',
    totalAmount: 25000000,
    paidAmount: 15000000,
    remaining: 10000000,
    status: 'nunggak',
    dueDate: '2025-12-20', // Overdue
    installments: { total: 5, paid: 3 },
    history: [
      { id: '5-1', date: '2025-09-01', amount: 5000000, method: 'cash', notes: 'DP' },
      { id: '5-2', date: '2025-10-01', amount: 5000000, method: 'transfer' },
      { id: '5-3', date: '2025-11-01', amount: 5000000, method: 'transfer' },
    ],
  },
  {
    id: '6',
    jamaahId: '6',
    jamaahName: 'Fatimah Zahra',
    package: 'Umroh Plus Turki 14 Hari',
    totalAmount: 35000000,
    paidAmount: 35000000,
    remaining: 0,
    status: 'lunas',
    dueDate: '2025-12-01',
    installments: { total: 1, paid: 1 },
    history: [
      { id: '6-1', date: '2025-11-15', amount: 35000000, method: 'transfer', notes: 'Lunas full payment' },
    ],
  },
  {
    id: '7',
    jamaahId: '7',
    jamaahName: 'Muhammad Rizki',
    package: 'Umroh VIP 12 Hari',
    totalAmount: 45000000,
    paidAmount: 30000000,
    remaining: 15000000,
    status: 'cicilan',
    dueDate: '2026-03-01',
    installments: { total: 9, paid: 6 },
    history: [
      { id: '7-1', date: '2025-07-01', amount: 5000000, method: 'transfer', notes: 'DP' },
      { id: '7-2', date: '2025-08-01', amount: 5000000, method: 'transfer' },
      { id: '7-3', date: '2025-09-01', amount: 5000000, method: 'transfer' },
      { id: '7-4', date: '2025-10-01', amount: 5000000, method: 'va' },
      { id: '7-5', date: '2025-11-01', amount: 5000000, method: 'transfer' },
      { id: '7-6', date: '2025-12-01', amount: 5000000, method: 'transfer' },
    ],
  },
  {
    id: '8',
    jamaahId: '8',
    jamaahName: 'Nurul Aisyah',
    package: 'Umroh Reguler 9 Hari',
    totalAmount: 25000000,
    paidAmount: 12000000,
    remaining: 13000000,
    status: 'nunggak',
    dueDate: '2025-12-10', // Overdue
    installments: { total: 5, paid: 2 },
    history: [
      { id: '8-1', date: '2025-10-01', amount: 7000000, method: 'transfer', notes: 'DP' },
      { id: '8-2', date: '2025-11-01', amount: 5000000, method: 'cash' },
    ],
  },
]

export function getPaymentById(id: string): Payment | undefined {
  return mockPayments.find(p => p.id === id)
}

export function getPaymentStats() {
  return {
    total: mockPayments.length,
    lunas: mockPayments.filter(p => p.status === 'lunas').length,
    cicilan: mockPayments.filter(p => p.status === 'cicilan').length,
    nunggak: mockPayments.filter(p => p.status === 'nunggak').length,
    totalRevenue: mockPayments.reduce((sum, p) => sum + p.paidAmount, 0),
    totalRemaining: mockPayments.reduce((sum, p) => sum + p.remaining, 0),
  }
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  transfer: 'Transfer Bank',
  cash: 'Tunai',
  va: 'Virtual Account',
}
