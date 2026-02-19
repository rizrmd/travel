// Mock data for Jamaah Self-Service Portal - Full Profile

export interface JamaahProfile {
  id: string
  name: string
  nik: string
  birthPlace: string
  birthDate: string
  gender: 'male' | 'female'
  address: string
  phone: string
  email: string
  photo?: string

  // Package & Travel Info
  package: {
    name: string
    duration: string
    departureDate: string
    returnDate: string
  }

  // Assigned Agent
  agent: {
    name: string
    phone: string
    email: string
  }

  // Emergency Contact
  emergencyContact: {
    name: string
    relation: string
    phone: string
    address: string
  }

  // Medical Info
  medicalInfo: {
    bloodType: string
    allergies: string
    chronicDiseases: string
    regularMedications: string
    medicalHistory: string
  }

  // Passport Info
  passportInfo: {
    number: string
    issueDate: string
    expiryDate: string
    issuePlace: string
    photo?: string
  }

  // Progress Tracking
  progress: {
    documents: number // percentage
    payments: number // percentage
    medical: number // percentage
    manasik: number // percentage
    departure: number // percentage
  }

  // Payment Status
  paymentStatus: {
    total: number
    paid: number
    remaining: number
    status: 'lunas' | 'cicilan' | 'belum-bayar'
    installments: {
      number: number
      amount: number
      dueDate: string
      status: 'lunas' | 'pending' | 'overdue'
      paidDate?: string
    }[]
  }

  // Document Status
  documents: {
    id: string
    name: string
    status: 'complete' | 'pending' | 'rejected' | 'missing'
    uploadedDate?: string
    rejectionReason?: string
    fileUrl?: string
  }[]
}

export const mockJamaahProfile: JamaahProfile = {
  id: '3',
  name: 'Budi Santoso',
  nik: '3201012345670003',
  birthPlace: 'Jakarta',
  birthDate: '1980-01-01',
  gender: 'male',
  address: 'Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 10110',
  phone: '+62 812-9876-5432',
  email: 'budi.santoso@example.com',
  photo: '/avatars/budi-santoso.jpg',

  package: {
    name: 'Umroh Reguler 9 Hari',
    duration: '9 Hari 7 Malam',
    departureDate: '2025-03-15',
    returnDate: '2025-03-23',
  },

  agent: {
    name: 'Ibu Siti Aminah',
    phone: '+62 812-3456-7890',
    email: 'siti.aminah@travelumroh.com',
  },

  emergencyContact: {
    name: 'Dewi Lestari',
    relation: 'Istri',
    phone: '+62 813-1234-5678',
    address: 'Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 10110',
  },

  medicalInfo: {
    bloodType: 'A+',
    allergies: 'Tidak ada',
    chronicDiseases: 'Tidak ada',
    regularMedications: 'Tidak ada',
    medicalHistory: 'Tidak ada',
  },

  passportInfo: {
    number: 'A1234567',
    issueDate: '2022-01-01',
    expiryDate: '2032-01-01',
    issuePlace: 'Jakarta',
    photo: '/documents/passport-budi.jpg',
  },

  progress: {
    documents: 75, // 3 of 4 complete
    payments: 100, // Lunas
    medical: 0, // Not started
    manasik: 0, // Not started
    departure: 0, // Not started
  },

  paymentStatus: {
    total: 35000000, // Rp 35.000.000
    paid: 35000000, // Rp 35.000.000
    remaining: 0,
    status: 'lunas',
    installments: [
      {
        number: 1,
        amount: 17500000,
        dueDate: '2025-01-15',
        status: 'lunas',
        paidDate: '2025-01-15',
      },
      {
        number: 2,
        amount: 17500000,
        dueDate: '2025-02-15',
        status: 'lunas',
        paidDate: '2025-02-15',
      },
    ],
  },

  documents: [
    {
      id: 'doc-1',
      name: 'KTP',
      status: 'complete',
      uploadedDate: '2025-01-10',
      fileUrl: '/documents/ktp-budi.jpg',
    },
    {
      id: 'doc-2',
      name: 'Kartu Keluarga',
      status: 'complete',
      uploadedDate: '2025-01-10',
      fileUrl: '/documents/kk-budi.jpg',
    },
    {
      id: 'doc-3',
      name: 'Paspor',
      status: 'pending',
      uploadedDate: '2025-01-12',
      fileUrl: '/documents/passport-budi.jpg',
    },
    {
      id: 'doc-4',
      name: 'Sertifikat Vaksin',
      status: 'missing',
    },
    {
      id: 'doc-5',
      name: 'Buku Nikah',
      status: 'rejected',
      uploadedDate: '2025-01-11',
      rejectionReason: 'Foto blur, mohon upload ulang dengan foto yang lebih jelas',
      fileUrl: '/documents/buku-nikah-budi.jpg',
    },
    {
      id: 'doc-6',
      name: 'Akta Kelahiran',
      status: 'missing',
    },
  ],
}

// Alternative profile with installment payment (for testing)
export const mockJamaahProfileWithInstallment: JamaahProfile = {
  ...mockJamaahProfile,
  paymentStatus: {
    total: 45000000, // Rp 45.000.000
    paid: 30000000, // Rp 30.000.000
    remaining: 15000000, // Rp 15.000.000
    status: 'cicilan',
    installments: [
      {
        number: 1,
        amount: 15000000,
        dueDate: '2025-01-15',
        status: 'lunas',
        paidDate: '2025-01-15',
      },
      {
        number: 2,
        amount: 15000000,
        dueDate: '2025-02-15',
        status: 'lunas',
        paidDate: '2025-02-15',
      },
      {
        number: 3,
        amount: 15000000,
        dueDate: '2025-03-01',
        status: 'pending',
      },
    ],
  },
  progress: {
    documents: 75,
    payments: 67, // 2 of 3 installments paid
    medical: 0,
    manasik: 0,
    departure: 0,
  },
}

// Helper function to calculate days until departure
export function getDaysUntilDeparture(departureDate: string): number {
  const today = new Date()
  const departure = new Date(departureDate)
  const diffTime = departure.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Helper function to get next steps
export function getNextSteps(profile: JamaahProfile): string[] {
  const steps: string[] = []

  // Check for missing documents
  const missingDocs = profile.documents.filter(d => d.status === 'missing')
  const rejectedDocs = profile.documents.filter(d => d.status === 'rejected')

  if (rejectedDocs.length > 0) {
    rejectedDocs.forEach(doc => {
      steps.push(`Upload ulang ${doc.name}`)
    })
  }

  if (missingDocs.length > 0) {
    missingDocs.forEach(doc => {
      steps.push(`Upload ${doc.name}`)
    })
  }

  // Check payment status
  if (profile.paymentStatus.status === 'cicilan') {
    const pendingInstallment = profile.paymentStatus.installments.find(i => i.status === 'pending')
    if (pendingInstallment) {
      steps.push(`Bayar Cicilan Ke-${pendingInstallment.number} (Jatuh tempo: ${new Date(pendingInstallment.dueDate).toLocaleDateString('id-ID')})`)
    }
  }

  // Check medical
  if (profile.progress.medical === 0) {
    steps.push('Jadwalkan Medical Check')
  }

  // Check manasik
  if (profile.progress.manasik === 0) {
    steps.push('Jadwalkan Manasik')
  }

  return steps
}
