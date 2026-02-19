/**
 * Mock data for Production Pipeline Management
 * Epic 16: Customizable Production Pipeline
 *
 * Toggle between small dataset (13 jamaah) and large dataset (2000 jamaah)
 * Set USE_LARGE_DATASET=true for demo with 2000 jamaah
 */

// Toggle for demo: set to true to use 2000 jamaah dataset
const USE_LARGE_DATASET = process.env.NEXT_PUBLIC_USE_LARGE_DATASET === 'true' || false

export interface PipelineStage {
  id: string
  code: string
  name: string
  category: 'document' | 'government' | 'travel' | 'logistics' | 'custom'
  icon: string
  color: string
  slaHours: number
  responsibleRole: string
  isActive: boolean
}

export interface JamaahPipelineStatus {
  jamaahId: string
  jamaahName: string
  packageName: string
  departure: string
  currentStageId: string
  currentStageStatus: 'on-track' | 'at-risk' | 'overdue' | 'completed'
  overallProgress: number
  stageInstances: StageInstance[]
}

export interface StageInstance {
  stageId: string
  stageName: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  startedAt: string | null
  completedAt: string | null
  dueAt: string
  assignedTo: string
  notes: string
  isOverdue: boolean
  slaDays: number
  daysElapsed: number
}

export interface PipelineStageStats {
  stageId: string
  stageName: string
  totalJamaah: number
  inProgress: number
  completed: number
  overdue: number
  avgCompletionDays: number
}

export interface BottleneckAlert {
  stageId: string
  stageName: string
  severity: 'critical' | 'moderate' | 'low'
  jamaahCount: number
  avgDelayDays: number
  reason: string
}

export interface DailyTask {
  id: string
  jamaahId: string
  jamaahName: string
  taskType: string
  stageId: string
  stageName: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  dueAt: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  assignedRole: string
  notes: string
}

// Global Pipeline Stages (configured by Super Admin)
export const globalPipelineStages: PipelineStage[] = [
  {
    id: 'stage-1',
    code: 'document-collection',
    name: 'Pengumpulan Dokumen',
    category: 'document',
    icon: 'FileText',
    color: 'blue',
    slaHours: 72, // 3 days
    responsibleRole: 'document-admin',
    isActive: true,
  },
  {
    id: 'stage-2',
    code: 'document-verification',
    name: 'Verifikasi Dokumen',
    category: 'document',
    icon: 'FileCheck',
    color: 'blue',
    slaHours: 48, // 2 days
    responsibleRole: 'document-admin',
    isActive: true,
  },
  {
    id: 'stage-3',
    code: 'siskopatuh-submission',
    name: 'Pengajuan SISKOPATUH',
    category: 'government',
    icon: 'FileUp',
    color: 'purple',
    slaHours: 96, // 4 days
    responsibleRole: 'siskopatuh-admin',
    isActive: true,
  },
  {
    id: 'stage-4',
    code: 'siskopatuh-approval',
    name: 'Persetujuan SISKOPATUH',
    category: 'government',
    icon: 'FileCheck2',
    color: 'purple',
    slaHours: 168, // 7 days (waiting for government)
    responsibleRole: 'siskopatuh-admin',
    isActive: true,
  },
  {
    id: 'stage-5',
    code: 'visa-application',
    name: 'Pengajuan Visa',
    category: 'government',
    icon: 'Stamp',
    color: 'orange',
    slaHours: 120, // 5 days
    responsibleRole: 'visa-admin',
    isActive: true,
  },
  {
    id: 'stage-6',
    code: 'visa-approval',
    name: 'Persetujuan Visa',
    category: 'government',
    icon: 'CheckCircle2',
    color: 'orange',
    slaHours: 336, // 14 days (waiting for embassy)
    responsibleRole: 'visa-admin',
    isActive: true,
  },
  {
    id: 'stage-7',
    code: 'merchandise-preparation',
    name: 'Persiapan Perlengkapan',
    category: 'logistics',
    icon: 'ShoppingBag',
    color: 'teal',
    slaHours: 72, // 3 days
    responsibleRole: 'logistics-admin',
    isActive: true,
  },
  {
    id: 'stage-8',
    code: 'flight-booking',
    name: 'Booking Penerbangan',
    category: 'travel',
    icon: 'Plane',
    color: 'sky',
    slaHours: 120, // 5 days
    responsibleRole: 'travel-admin',
    isActive: true,
  },
  {
    id: 'stage-9',
    code: 'hotel-booking',
    name: 'Booking Hotel',
    category: 'travel',
    icon: 'Hotel',
    color: 'sky',
    slaHours: 96, // 4 days
    responsibleRole: 'travel-admin',
    isActive: true,
  },
  {
    id: 'stage-10',
    code: 'departure-ready',
    name: 'Siap Berangkat',
    category: 'travel',
    icon: 'CheckCircle',
    color: 'green',
    slaHours: 24, // 1 day final check
    responsibleRole: 'travel-admin',
    isActive: true,
  },
]

// Mock Jamaah Pipeline Status (runtime tracking) - Using real jamaah data
export const mockJamaahPipelineStatus: JamaahPipelineStatus[] = [
  // URGENT Status Jamaah (5 jamaah) - Critical pipeline issues
  {
    jamaahId: '1',
    jamaahName: 'Ahmad Hidayat',
    packageName: 'Umroh Plus Turki 14 Hari',
    departure: '2025-01-05',
    currentStageId: 'stage-5',
    currentStageStatus: 'overdue',
    overallProgress: 50,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'completed',
        startedAt: '2024-11-20',
        completedAt: '2024-11-22',
        dueAt: '2024-11-23',
        assignedTo: 'Siti (Document Admin)',
        notes: 'Dokumen lengkap',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-2',
        stageName: 'Verifikasi Dokumen',
        status: 'completed',
        startedAt: '2024-11-22',
        completedAt: '2024-11-24',
        dueAt: '2024-11-24',
        assignedTo: 'Siti (Document Admin)',
        notes: 'Verified',
        isOverdue: false,
        slaDays: 2,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-3',
        stageName: 'Pengajuan SISKOPATUH',
        status: 'completed',
        startedAt: '2024-11-24',
        completedAt: '2024-11-27',
        dueAt: '2024-11-28',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Submitted',
        isOverdue: false,
        slaDays: 4,
        daysElapsed: 3,
      },
      {
        stageId: 'stage-4',
        stageName: 'Persetujuan SISKOPATUH',
        status: 'completed',
        startedAt: '2024-11-27',
        completedAt: '2024-12-03',
        dueAt: '2024-12-04',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Approved by Kemenag',
        isOverdue: false,
        slaDays: 7,
        daysElapsed: 6,
      },
      {
        stageId: 'stage-5',
        stageName: 'Pengajuan Visa',
        status: 'in-progress',
        startedAt: '2024-12-03',
        completedAt: null,
        dueAt: '2024-12-08',
        assignedTo: 'Rina (Visa Admin)',
        notes: 'Embassy appointment delayed',
        isOverdue: true,
        slaDays: 5,
        daysElapsed: 22,
      },
    ],
  },
  {
    jamaahId: '2',
    jamaahName: 'Siti Nurhaliza',
    packageName: 'Umroh Reguler 9 Hari',
    departure: '2025-01-08',
    currentStageId: 'stage-1',
    currentStageStatus: 'overdue',
    overallProgress: 10,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'in-progress',
        startedAt: '2024-12-15',
        completedAt: null,
        dueAt: '2024-12-18',
        assignedTo: 'Siti (Document Admin)',
        notes: 'Missing passport copy',
        isOverdue: true,
        slaDays: 3,
        daysElapsed: 10,
      },
    ],
  },
  {
    jamaahId: '3',
    jamaahName: 'Budi Santoso',
    packageName: 'Umroh VIP 12 Hari',
    departure: '2025-01-10',
    currentStageId: 'stage-3',
    currentStageStatus: 'at-risk',
    overallProgress: 30,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'completed',
        startedAt: '2024-12-01',
        completedAt: '2024-12-03',
        dueAt: '2024-12-04',
        assignedTo: 'Siti (Document Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-2',
        stageName: 'Verifikasi Dokumen',
        status: 'completed',
        startedAt: '2024-12-03',
        completedAt: '2024-12-05',
        dueAt: '2024-12-05',
        assignedTo: 'Siti (Document Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 2,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-3',
        stageName: 'Pengajuan SISKOPATUH',
        status: 'in-progress',
        startedAt: '2024-12-05',
        completedAt: null,
        dueAt: '2024-12-09',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Incomplete documents from jamaah',
        isOverdue: true,
        slaDays: 4,
        daysElapsed: 20,
      },
    ],
  },
  {
    jamaahId: '4',
    jamaahName: 'Dewi Lestari',
    packageName: 'Umroh Plus Dubai 16 Hari',
    departure: '2025-01-12',
    currentStageId: 'stage-6',
    currentStageStatus: 'at-risk',
    overallProgress: 60,
    stageInstances: [
      {
        stageId: 'stage-5',
        stageName: 'Pengajuan Visa',
        status: 'completed',
        startedAt: '2024-12-10',
        completedAt: '2024-12-15',
        dueAt: '2024-12-15',
        assignedTo: 'Rina (Visa Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 5,
        daysElapsed: 5,
      },
      {
        stageId: 'stage-6',
        stageName: 'Persetujuan Visa',
        status: 'in-progress',
        startedAt: '2024-12-15',
        completedAt: null,
        dueAt: '2024-12-29',
        assignedTo: 'Rina (Visa Admin)',
        notes: 'Waiting for embassy response',
        isOverdue: false,
        slaDays: 14,
        daysElapsed: 10,
      },
    ],
  },
  {
    jamaahId: '5',
    jamaahName: 'Hendra Wijaya',
    packageName: 'Umroh Reguler 9 Hari',
    departure: '2025-01-15',
    currentStageId: 'stage-2',
    currentStageStatus: 'overdue',
    overallProgress: 20,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'completed',
        startedAt: '2024-12-10',
        completedAt: '2024-12-13',
        dueAt: '2024-12-13',
        assignedTo: 'Siti (Document Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 3,
      },
      {
        stageId: 'stage-2',
        stageName: 'Verifikasi Dokumen',
        status: 'in-progress',
        startedAt: '2024-12-13',
        completedAt: null,
        dueAt: '2024-12-15',
        assignedTo: 'Siti (Document Admin)',
        notes: 'KTP & KK issues - need reupload',
        isOverdue: true,
        slaDays: 2,
        daysElapsed: 12,
      },
    ],
  },

  // SOON Status Jamaah (8 jamaah) - In pipeline, progressing normally
  {
    jamaahId: '6',
    jamaahName: 'Fatimah Zahra',
    packageName: 'Umroh Plus Turki 14 Hari',
    departure: '2025-01-25',
    currentStageId: 'stage-7',
    currentStageStatus: 'on-track',
    overallProgress: 70,
    stageInstances: [
      {
        stageId: 'stage-6',
        stageName: 'Persetujuan Visa',
        status: 'completed',
        startedAt: '2024-12-01',
        completedAt: '2024-12-12',
        dueAt: '2024-12-15',
        assignedTo: 'Rina (Visa Admin)',
        notes: 'Visa approved',
        isOverdue: false,
        slaDays: 14,
        daysElapsed: 11,
      },
      {
        stageId: 'stage-7',
        stageName: 'Persiapan Perlengkapan',
        status: 'in-progress',
        startedAt: '2024-12-12',
        completedAt: null,
        dueAt: '2024-12-15',
        assignedTo: 'Doni (Logistics Admin)',
        notes: 'Ordering merchandise',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 2,
      },
    ],
  },
  {
    jamaahId: '7',
    jamaahName: 'Muhammad Rizki',
    packageName: 'Umroh VIP 12 Hari',
    departure: '2025-01-28',
    currentStageId: 'stage-5',
    currentStageStatus: 'on-track',
    overallProgress: 50,
    stageInstances: [
      {
        stageId: 'stage-4',
        stageName: 'Persetujuan SISKOPATUH',
        status: 'completed',
        startedAt: '2024-12-01',
        completedAt: '2024-12-07',
        dueAt: '2024-12-08',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Approved',
        isOverdue: false,
        slaDays: 7,
        daysElapsed: 6,
      },
      {
        stageId: 'stage-5',
        stageName: 'Pengajuan Visa',
        status: 'in-progress',
        startedAt: '2024-12-07',
        completedAt: null,
        dueAt: '2024-12-12',
        assignedTo: 'Rina (Visa Admin)',
        notes: 'Submitted to embassy',
        isOverdue: false,
        slaDays: 5,
        daysElapsed: 4,
      },
    ],
  },
  {
    jamaahId: '8',
    jamaahName: 'Nurul Aisyah',
    packageName: 'Umroh Reguler 9 Hari',
    departure: '2025-02-01',
    currentStageId: 'stage-3',
    currentStageStatus: 'on-track',
    overallProgress: 30,
    stageInstances: [
      {
        stageId: 'stage-2',
        stageName: 'Verifikasi Dokumen',
        status: 'completed',
        startedAt: '2024-12-08',
        completedAt: '2024-12-10',
        dueAt: '2024-12-10',
        assignedTo: 'Siti (Document Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 2,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-3',
        stageName: 'Pengajuan SISKOPATUH',
        status: 'in-progress',
        startedAt: '2024-12-10',
        completedAt: null,
        dueAt: '2024-12-14',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Preparing submission',
        isOverdue: false,
        slaDays: 4,
        daysElapsed: 2,
      },
    ],
  },
  {
    jamaahId: '9',
    jamaahName: 'Rahman Hakim',
    packageName: 'Umroh Plus Dubai 16 Hari',
    departure: '2025-02-05',
    currentStageId: 'stage-8',
    currentStageStatus: 'on-track',
    overallProgress: 80,
    stageInstances: [
      {
        stageId: 'stage-7',
        stageName: 'Persiapan Perlengkapan',
        status: 'completed',
        startedAt: '2024-12-15',
        completedAt: '2024-12-18',
        dueAt: '2024-12-18',
        assignedTo: 'Doni (Logistics Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 3,
      },
      {
        stageId: 'stage-8',
        stageName: 'Booking Penerbangan',
        status: 'in-progress',
        startedAt: '2024-12-18',
        completedAt: null,
        dueAt: '2024-12-23',
        assignedTo: 'Andi (Travel Admin)',
        notes: 'Processing flight booking',
        isOverdue: false,
        slaDays: 5,
        daysElapsed: 2,
      },
    ],
  },
  {
    jamaahId: '10',
    jamaahName: 'Laila Majnun',
    packageName: 'Umroh VIP 12 Hari',
    departure: '2025-02-08',
    currentStageId: 'stage-4',
    currentStageStatus: 'on-track',
    overallProgress: 40,
    stageInstances: [
      {
        stageId: 'stage-3',
        stageName: 'Pengajuan SISKOPATUH',
        status: 'completed',
        startedAt: '2024-12-05',
        completedAt: '2024-12-09',
        dueAt: '2024-12-09',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 4,
        daysElapsed: 4,
      },
      {
        stageId: 'stage-4',
        stageName: 'Persetujuan SISKOPATUH',
        status: 'in-progress',
        startedAt: '2024-12-09',
        completedAt: null,
        dueAt: '2024-12-16',
        assignedTo: 'Budi (SISKOPATUH Admin)',
        notes: 'Waiting for Kemenag approval',
        isOverdue: false,
        slaDays: 7,
        daysElapsed: 6,
      },
    ],
  },
  {
    jamaahId: '11',
    jamaahName: 'Yusuf Ibrahim',
    packageName: 'Umroh Reguler 9 Hari',
    departure: '2025-02-10',
    currentStageId: 'stage-1',
    currentStageStatus: 'at-risk',
    overallProgress: 10,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'blocked',
        startedAt: '2024-12-20',
        completedAt: null,
        dueAt: '2024-12-23',
        assignedTo: 'Siti (Document Admin)',
        notes: 'Agent contacted, waiting for response',
        isOverdue: true,
        slaDays: 3,
        daysElapsed: 5,
      },
    ],
  },
  {
    jamaahId: '12',
    jamaahName: 'Khadijah Azzahra',
    packageName: 'Umroh Plus Turki 14 Hari',
    departure: '2025-02-12',
    currentStageId: 'stage-2',
    currentStageStatus: 'on-track',
    overallProgress: 20,
    stageInstances: [
      {
        stageId: 'stage-1',
        stageName: 'Pengumpulan Dokumen',
        status: 'completed',
        startedAt: '2024-12-18',
        completedAt: '2024-12-20',
        dueAt: '2024-12-21',
        assignedTo: 'Siti (Document Admin)',
        notes: '',
        isOverdue: false,
        slaDays: 3,
        daysElapsed: 2,
      },
      {
        stageId: 'stage-2',
        stageName: 'Verifikasi Dokumen',
        status: 'in-progress',
        startedAt: '2024-12-20',
        completedAt: null,
        dueAt: '2024-12-22',
        assignedTo: 'Siti (Document Admin)',
        notes: 'In review',
        isOverdue: false,
        slaDays: 2,
        daysElapsed: 1,
      },
    ],
  },
  {
    jamaahId: '13',
    jamaahName: 'Ali Akbar',
    packageName: 'Umroh VIP 12 Hari',
    departure: '2025-02-15',
    currentStageId: 'stage-9',
    currentStageStatus: 'on-track',
    overallProgress: 90,
    stageInstances: [
      {
        stageId: 'stage-8',
        stageName: 'Booking Penerbangan',
        status: 'completed',
        startedAt: '2024-12-10',
        completedAt: '2024-12-14',
        dueAt: '2024-12-15',
        assignedTo: 'Andi (Travel Admin)',
        notes: 'Flight booked',
        isOverdue: false,
        slaDays: 5,
        daysElapsed: 4,
      },
      {
        stageId: 'stage-9',
        stageName: 'Booking Hotel',
        status: 'in-progress',
        startedAt: '2024-12-14',
        completedAt: null,
        dueAt: '2024-12-18',
        assignedTo: 'Andi (Travel Admin)',
        notes: 'Hotel confirmation pending',
        isOverdue: false,
        slaDays: 4,
        daysElapsed: 3,
      },
    ],
  },
]

// Pipeline Stage Statistics (calculated from jamaah pipeline data)
export const mockPipelineStageStats: PipelineStageStats[] = [
  {
    stageId: 'stage-1',
    stageName: 'Pengumpulan Dokumen',
    totalJamaah: 13,
    inProgress: 2,
    completed: 11,
    overdue: 2,
    avgCompletionDays: 2.5,
  },
  {
    stageId: 'stage-2',
    stageName: 'Verifikasi Dokumen',
    totalJamaah: 13,
    inProgress: 3,
    completed: 10,
    overdue: 1,
    avgCompletionDays: 2.0,
  },
  {
    stageId: 'stage-3',
    stageName: 'Pengajuan SISKOPATUH',
    totalJamaah: 13,
    inProgress: 2,
    completed: 11,
    overdue: 1,
    avgCompletionDays: 3.5,
  },
  {
    stageId: 'stage-4',
    stageName: 'Persetujuan SISKOPATUH',
    totalJamaah: 13,
    inProgress: 1,
    completed: 12,
    overdue: 0,
    avgCompletionDays: 6.5,
  },
  {
    stageId: 'stage-5',
    stageName: 'Pengajuan Visa',
    totalJamaah: 13,
    inProgress: 2,
    completed: 11,
    overdue: 1,
    avgCompletionDays: 5.0,
  },
  {
    stageId: 'stage-6',
    stageName: 'Persetujuan Visa',
    totalJamaah: 13,
    inProgress: 1,
    completed: 12,
    overdue: 0,
    avgCompletionDays: 12.0,
  },
  {
    stageId: 'stage-7',
    stageName: 'Persiapan Perlengkapan',
    totalJamaah: 13,
    inProgress: 1,
    completed: 12,
    overdue: 0,
    avgCompletionDays: 2.8,
  },
  {
    stageId: 'stage-8',
    stageName: 'Booking Penerbangan',
    totalJamaah: 13,
    inProgress: 1,
    completed: 12,
    overdue: 0,
    avgCompletionDays: 4.2,
  },
  {
    stageId: 'stage-9',
    stageName: 'Booking Hotel',
    totalJamaah: 13,
    inProgress: 1,
    completed: 12,
    overdue: 0,
    avgCompletionDays: 3.5,
  },
]

// Bottleneck Alerts (based on real jamaah pipeline status)
export const mockBottleneckAlerts: BottleneckAlert[] = [
  {
    stageId: 'stage-1',
    stageName: 'Pengumpulan Dokumen',
    severity: 'critical',
    jamaahCount: 2,
    avgDelayDays: 8.5,
    reason: 'Missing documents and agent non-responsive',
  },
  {
    stageId: 'stage-5',
    stageName: 'Pengajuan Visa',
    severity: 'critical',
    jamaahCount: 1,
    avgDelayDays: 17.0,
    reason: 'Embassy appointment severely delayed',
  },
  {
    stageId: 'stage-3',
    stageName: 'Pengajuan SISKOPATUH',
    severity: 'critical',
    jamaahCount: 1,
    avgDelayDays: 16.0,
    reason: 'Incomplete documents from jamaah',
  },
  {
    stageId: 'stage-2',
    stageName: 'Verifikasi Dokumen',
    severity: 'moderate',
    jamaahCount: 1,
    avgDelayDays: 10.0,
    reason: 'KTP & KK verification issues',
  },
]

// Daily Tasks (for Admin Task Queue) - Using real jamaah data
export const mockDailyTasks: DailyTask[] = [
  // URGENT Tasks (overdue or critical)
  {
    id: 'task-1',
    jamaahId: '1',
    jamaahName: 'Ahmad Hidayat',
    taskType: 'Follow up visa application',
    stageId: 'stage-5',
    stageName: 'Pengajuan Visa',
    priority: 'urgent',
    dueAt: '2024-12-08',
    status: 'in-progress',
    assignedRole: 'visa-admin',
    notes: 'Overdue by 17 days - Embassy appointment delayed',
  },
  {
    id: 'task-2',
    jamaahId: '2',
    jamaahName: 'Siti Nurhaliza',
    taskType: 'Missing passport copy',
    stageId: 'stage-1',
    stageName: 'Pengumpulan Dokumen',
    priority: 'urgent',
    dueAt: '2024-12-18',
    status: 'in-progress',
    assignedRole: 'document-admin',
    notes: 'Overdue by 7 days - Contact agent immediately',
  },
  {
    id: 'task-3',
    jamaahId: '3',
    jamaahName: 'Budi Santoso',
    taskType: 'Complete SISKOPATUH submission',
    stageId: 'stage-3',
    stageName: 'Pengajuan SISKOPATUH',
    priority: 'urgent',
    dueAt: '2024-12-09',
    status: 'in-progress',
    assignedRole: 'siskopatuh-admin',
    notes: 'Overdue by 16 days - Incomplete documents',
  },
  {
    id: 'task-4',
    jamaahId: '5',
    jamaahName: 'Hendra Wijaya',
    taskType: 'Verify and approve documents',
    stageId: 'stage-2',
    stageName: 'Verifikasi Dokumen',
    priority: 'urgent',
    dueAt: '2024-12-15',
    status: 'in-progress',
    assignedRole: 'document-admin',
    notes: 'Overdue by 10 days - KTP & KK issues',
  },
  {
    id: 'task-5',
    jamaahId: '11',
    jamaahName: 'Yusuf Ibrahim',
    taskType: 'Follow up missing documents',
    stageId: 'stage-1',
    stageName: 'Pengumpulan Dokumen',
    priority: 'urgent',
    dueAt: '2024-12-23',
    status: 'blocked',
    assignedRole: 'document-admin',
    notes: 'Agent contacted 2 days ago, no response',
  },

  // HIGH Priority Tasks (due today/soon)
  {
    id: 'task-6',
    jamaahId: '6',
    jamaahName: 'Fatimah Zahra',
    taskType: 'Complete merchandise order',
    stageId: 'stage-7',
    stageName: 'Persiapan Perlengkapan',
    priority: 'high',
    dueAt: '2024-12-15',
    status: 'in-progress',
    assignedRole: 'logistics-admin',
    notes: 'Due today - Items in stock',
  },
  {
    id: 'task-7',
    jamaahId: '4',
    jamaahName: 'Dewi Lestari',
    taskType: 'Check visa approval status',
    stageId: 'stage-6',
    stageName: 'Persetujuan Visa',
    priority: 'high',
    dueAt: '2024-12-29',
    status: 'in-progress',
    assignedRole: 'visa-admin',
    notes: 'Follow up with embassy',
  },
  {
    id: 'task-8',
    jamaahId: '12',
    jamaahName: 'Khadijah Azzahra',
    taskType: 'Verify uploaded documents',
    stageId: 'stage-2',
    stageName: 'Verifikasi Dokumen',
    priority: 'high',
    dueAt: '2024-12-22',
    status: 'in-progress',
    assignedRole: 'document-admin',
    notes: 'Documents uploaded yesterday',
  },
  {
    id: 'task-9',
    jamaahId: '9',
    jamaahName: 'Rahman Hakim',
    taskType: 'Process flight booking',
    stageId: 'stage-8',
    stageName: 'Booking Penerbangan',
    priority: 'high',
    dueAt: '2024-12-23',
    status: 'in-progress',
    assignedRole: 'travel-admin',
    notes: 'Visa approved, ready to book',
  },
  {
    id: 'task-10',
    jamaahId: '13',
    jamaahName: 'Ali Akbar',
    taskType: 'Confirm hotel booking',
    stageId: 'stage-9',
    stageName: 'Booking Hotel',
    priority: 'high',
    dueAt: '2024-12-18',
    status: 'in-progress',
    assignedRole: 'travel-admin',
    notes: 'Waiting for hotel confirmation',
  },

  // NORMAL Priority Tasks (upcoming)
  {
    id: 'task-11',
    jamaahId: '7',
    jamaahName: 'Muhammad Rizki',
    taskType: 'Submit visa application',
    stageId: 'stage-5',
    stageName: 'Pengajuan Visa',
    priority: 'normal',
    dueAt: '2024-12-12',
    status: 'in-progress',
    assignedRole: 'visa-admin',
    notes: 'SISKOPATUH approved, ready for submission',
  },
  {
    id: 'task-12',
    jamaahId: '8',
    jamaahName: 'Nurul Aisyah',
    taskType: 'Prepare SISKOPATUH documents',
    stageId: 'stage-3',
    stageName: 'Pengajuan SISKOPATUH',
    priority: 'normal',
    dueAt: '2024-12-14',
    status: 'in-progress',
    assignedRole: 'siskopatuh-admin',
    notes: 'Documents verified and ready',
  },
  {
    id: 'task-13',
    jamaahId: '10',
    jamaahName: 'Laila Majnun',
    taskType: 'Monitor SISKOPATUH approval',
    stageId: 'stage-4',
    stageName: 'Persetujuan SISKOPATUH',
    priority: 'normal',
    dueAt: '2024-12-16',
    status: 'in-progress',
    assignedRole: 'siskopatuh-admin',
    notes: 'Waiting for Kemenag approval',
  },
]

// Helper: Get tasks by role and priority
export function getTasksByRole(role: string, priorityFilter?: DailyTask['priority'][]): DailyTask[] {
  let filtered = mockDailyTasks.filter(task => task.assignedRole === role)

  if (priorityFilter) {
    filtered = filtered.filter(task => priorityFilter.includes(task.priority))
  }

  return filtered
}

// Helper: Get bottlenecks by severity
export function getBottlenecksBySeverity(severity: BottleneckAlert['severity']): BottleneckAlert[] {
  return mockBottleneckAlerts.filter(alert => alert.severity === severity)
}

// Helper: Calculate overall pipeline health
export function calculatePipelineHealth(): {
  totalJamaah: number
  onTrack: number
  atRisk: number
  overdue: number
  healthScore: number
} {
  const dataset = getAllJamaahPipeline()
  const total = dataset.length
  const onTrack = dataset.filter(j => j.currentStageStatus === 'on-track').length
  const atRisk = dataset.filter(j => j.currentStageStatus === 'at-risk').length
  const overdue = dataset.filter(j => j.currentStageStatus === 'overdue').length

  const healthScore = Math.round((onTrack / total) * 100)

  return { totalJamaah: total, onTrack, atRisk, overdue, healthScore }
}

// Helper: Get upcoming departures (next 7 days)
export function getUpcomingDepartures(): JamaahPipelineStatus[] {
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const dataSource = USE_LARGE_DATASET ? getAllJamaahPipeline() : mockJamaahPipelineStatus

  return dataSource.filter(jamaah => {
    const departureDate = new Date(jamaah.departure)
    return departureDate >= now && departureDate <= sevenDaysFromNow
  })
}

// ============================================================================
// LARGE DATASET SUPPORT (2000 Jamaah)
// ============================================================================

// Dynamic import for large dataset
let largeDataset: JamaahPipelineStatus[] | null = null

function getAllJamaahPipeline(): JamaahPipelineStatus[] {
  if (USE_LARGE_DATASET) {
    if (!largeDataset) {
      // Lazy load 2000 jamaah dataset
      const { mock2000Jamaah } = require('./generate-mock-jamaah-2000')
      largeDataset = mock2000Jamaah
      console.log('📊 Loaded 2000 jamaah dataset for demo')
    }
    return largeDataset || []
  }
  return mockJamaahPipelineStatus
}

// Export the active dataset
export function getActiveJamaahDataset(): JamaahPipelineStatus[] {
  return getAllJamaahPipeline()
}

// Calculate stats dynamically from active dataset
export function calculatePipelineStatsFromData(): PipelineStageStats[] {
  const dataset = getAllJamaahPipeline()
  const stageStats = new Map<string, {
    total: number
    inProgress: number
    completed: number
    overdue: number
    totalDays: number
    count: number
  }>()

  // Initialize all stages
  globalPipelineStages.forEach(stage => {
    stageStats.set(stage.id, {
      total: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      totalDays: 0,
      count: 0,
    })
  })

  // Calculate from jamaah data
  dataset.forEach(jamaah => {
    jamaah.stageInstances.forEach(instance => {
      const stat = stageStats.get(instance.stageId)
      if (stat) {
        stat.total++
        if (instance.status === 'in-progress') stat.inProgress++
        if (instance.status === 'completed') {
          stat.completed++
          stat.totalDays += instance.daysElapsed
          stat.count++
        }
        if (instance.isOverdue) stat.overdue++
      }
    })
  })

  // Convert to array
  return Array.from(stageStats.entries()).map(([stageId, stat]) => {
    const stage = globalPipelineStages.find(s => s.id === stageId)
    return {
      stageId,
      stageName: stage?.name || stageId,
      totalJamaah: stat.total,
      inProgress: stat.inProgress,
      completed: stat.completed,
      overdue: stat.overdue,
      avgCompletionDays: stat.count > 0 ? Math.round((stat.totalDays / stat.count) * 10) / 10 : 0,
    }
  }).filter(s => s.totalJamaah > 0)
}

// Calculate bottlenecks dynamically
export function calculateBottlenecksFromData(): BottleneckAlert[] {
  const dataset = getAllJamaahPipeline()
  const stageIssues = new Map<string, {
    count: number
    totalDelay: number
    reasons: Map<string, number>
  }>()

  dataset.forEach(jamaah => {
    if (jamaah.currentStageStatus === 'overdue' || jamaah.currentStageStatus === 'at-risk') {
      const currentStage = jamaah.stageInstances.find(s => s.stageId === jamaah.currentStageId)
      if (currentStage && currentStage.isOverdue) {
        if (!stageIssues.has(currentStage.stageId)) {
          stageIssues.set(currentStage.stageId, {
            count: 0,
            totalDelay: 0,
            reasons: new Map(),
          })
        }
        const issue = stageIssues.get(currentStage.stageId)!
        issue.count++
        issue.totalDelay += (currentStage.daysElapsed - currentStage.slaDays)

        const reason = currentStage.notes || 'Unknown issue'
        issue.reasons.set(reason, (issue.reasons.get(reason) || 0) + 1)
      }
    }
  })

  const bottlenecks: BottleneckAlert[] = []
  stageIssues.forEach((issue, stageId) => {
    const stage = globalPipelineStages.find(s => s.id === stageId)
    if (stage && issue.count >= 5) { // Only show if 5+ jamaah stuck
      const avgDelay = Math.round((issue.totalDelay / issue.count) * 10) / 10
      const topReason = Array.from(issue.reasons.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Multiple issues'

      const severity: 'critical' | 'moderate' | 'low' =
        avgDelay > 10 || issue.count > 50 ? 'critical' :
          avgDelay > 5 || issue.count > 20 ? 'moderate' : 'low'

      bottlenecks.push({
        stageId,
        stageName: stage.name,
        severity,
        jamaahCount: issue.count,
        avgDelayDays: avgDelay,
        reason: topReason,
      })
    }
  })

  return bottlenecks.sort((a, b) => {
    const severityOrder = { critical: 0, moderate: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

// Override exports when using large dataset
export const activePipelineStats = USE_LARGE_DATASET
  ? calculatePipelineStatsFromData()
  : mockPipelineStageStats

export const activeBottleneckAlerts = USE_LARGE_DATASET
  ? calculateBottlenecksFromData()
  : mockBottleneckAlerts

// Export flag for UI to check
export const isUsingLargeDataset = USE_LARGE_DATASET
export const datasetSize = USE_LARGE_DATASET ? 2000 : 13
