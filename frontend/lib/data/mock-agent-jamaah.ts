import { Jamaah } from '../types/jamaah'

// Agent profile data
export const agentProfile = {
  id: 'agent-1',
  name: 'Ibu Siti Aminah',
  role: 'Agent Silver',
  tier: 'Silver' as const,
  phone: '+62 812-3456-7890',
  email: 'siti.aminah@example.com',
  assignedJamaahCount: 12,
  totalAgencyJamaah: 55,
  commissionRate: 0.04, // 4% for Silver tier
  totalEarned: 4800000,
  photo: '/images/agent-avatar.jpg',
}

// Subset of jamaah assigned to Agent "Ibu Siti Aminah" (12 out of 55)
export const agentJamaah: Jamaah[] = [
  // Urgent (2 jamaah)
  { id: '1', name: 'Ahmad Hidayat', nik: '3201012345670001', package: 'Umroh Plus Turki 14 Hari', status: 'urgent' },
  { id: '3', name: 'Budi Santoso', nik: '3201012345670003', package: 'Umroh VIP 12 Hari', status: 'urgent' },

  // Soon (3 jamaah)
  { id: '7', name: 'Muhammad Rizki', nik: '3201012345670007', package: 'Umroh VIP 12 Hari', status: 'soon' },
  { id: '9', name: 'Rahman Hakim', nik: '3201012345670009', package: 'Umroh Plus Dubai 16 Hari', status: 'soon' },
  { id: '11', name: 'Yusuf Ibrahim', nik: '3201012345670011', package: 'Umroh Reguler 9 Hari', status: 'soon' },

  // Ready (7 jamaah)
  { id: '15', name: 'Abdullah Malik', nik: '3201012345670015', package: 'Umroh VIP 12 Hari', status: 'ready' },
  { id: '18', name: 'Mariam Salma', nik: '3201012345670018', package: 'Umroh Plus Turki 14 Hari', status: 'ready' },
  { id: '22', name: 'Hafizah Nur', nik: '3201012345670022', package: 'Umroh VIP 12 Hari', status: 'ready' },
  { id: '25', name: 'Ruqayyah Amina', nik: '3201012345670025', package: 'Umroh VIP 12 Hari', status: 'ready' },
  { id: '30', name: 'Khalid Walid', nik: '3201012345670030', package: 'Umroh Plus Turki 14 Hari', status: 'ready' },
  { id: '34', name: 'Zaid Harith', nik: '3201012345670034', package: 'Umroh VIP 12 Hari', status: 'ready' },
  { id: '40', name: 'Usama Zaid', nik: '3201012345670040', package: 'Umroh VIP 12 Hari', status: 'ready' },
]

export function getAgentJamaahByStatus(status: 'urgent' | 'soon' | 'ready') {
  return agentJamaah.filter(j => j.status === status)
}

export function getAgentJamaahCount() {
  return {
    urgent: agentJamaah.filter(j => j.status === 'urgent').length,
    soon: agentJamaah.filter(j => j.status === 'soon').length,
    ready: agentJamaah.filter(j => j.status === 'ready').length,
    total: agentJamaah.length,
  }
}

export function getAgentJamaahById(id: string) {
  return agentJamaah.find(j => j.id === id)
}
