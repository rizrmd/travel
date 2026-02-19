/**
 * Generator for 2000 Mock Jamaah Data
 * For demo and scalability testing
 */

import { JamaahPipelineStatus, StageInstance } from './mock-pipeline'

// Indonesian name components for realistic data
const firstNamesM = [
  'Ahmad', 'Muhammad', 'Abdullah', 'Hasan', 'Husein', 'Ali', 'Umar', 'Yusuf',
  'Ibrahim', 'Ismail', 'Idris', 'Musa', 'Harun', 'Daud', 'Sulaiman', 'Isa',
  'Zakariya', 'Yahya', 'Zakaria', 'Bilal', 'Hamzah', 'Khalid', 'Usman', 'Salman',
  'Zaid', 'Talha', 'Zubair', 'Abdurrahman', 'Anas', 'Muawiyah', 'Amir', 'Farid',
  'Hafiz', 'Kamal', 'Nabil', 'Rashid', 'Tariq', 'Walid', 'Malik', 'Hakim'
]

const firstNamesF = [
  'Siti', 'Fatimah', 'Aisyah', 'Khadijah', 'Maryam', 'Zahra', 'Aminah', 'Halimah',
  'Zainab', 'Ramlah', 'Ummu', 'Hafsah', 'Sawdah', 'Juwairiyah', 'Safiyyah', 'Maymunah',
  'Asma', 'Ruqayyah', 'Ummu Kultsum', 'Laila', 'Nabilah', 'Salma', 'Wardah', 'Hanifah',
  'Karima', 'Latifah', 'Nafisa', 'Rahma', 'Salihah', 'Tasneem', 'Yasmin', 'Zaynab',
  'Aliyah', 'Bushra', 'Dalila', 'Farida', 'Huda', 'Jamila', 'Kamila', 'Layla'
]

const lastNames = [
  'Abdullah', 'Rahman', 'Malik', 'Hasan', 'Husein', 'Hakim', 'Aziz', 'Karim',
  'Latif', 'Majid', 'Nasir', 'Rashid', 'Salim', 'Tahir', 'Wahab', 'Zahir',
  'Basri', 'Faruq', 'Hamid', 'Jamil', 'Khalil', 'Munir', 'Qadir', 'Siddiq',
  'Amin', 'Azhar', 'Bakr', 'Faisal', 'Ghani', 'Habibi', 'Iskandar', 'Jibril',
  'Mustafa', 'Nizam', 'Rasyid', 'Syarif', 'Taufiq', 'Wahid', 'Yaqub', 'Zulkifli',
  'Hidayat', 'Wijaya', 'Santoso', 'Pratama', 'Permana', 'Nugroho', 'Saputra', 'Setiawan'
]

const packages = [
  { id: '1', name: 'Umroh Reguler 9 Hari', probability: 0.40 },
  { id: '2', name: 'Umroh VIP 12 Hari', probability: 0.30 },
  { id: '3', name: 'Umroh Plus Turki 14 Hari', probability: 0.20 },
  { id: '4', name: 'Umroh Plus Dubai 16 Hari', probability: 0.10 },
]

const stageDefinitions = [
  { id: 'stage-1', name: 'Pengumpulan Dokumen', avgDays: 3 },
  { id: 'stage-2', name: 'Verifikasi Dokumen', avgDays: 2 },
  { id: 'stage-3', name: 'Pengajuan SISKOPATUH', avgDays: 4 },
  { id: 'stage-4', name: 'Persetujuan SISKOPATUH', avgDays: 7 },
  { id: 'stage-5', name: 'Pengajuan Visa', avgDays: 5 },
  { id: 'stage-6', name: 'Persetujuan Visa', avgDays: 14 },
  { id: 'stage-7', name: 'Persiapan Perlengkapan', avgDays: 3 },
  { id: 'stage-8', name: 'Booking Penerbangan', avgDays: 5 },
  { id: 'stage-9', name: 'Booking Hotel', avgDays: 4 },
  { id: 'stage-10', name: 'Siap Berangkat', avgDays: 1 },
]

// Helper: Generate random date
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper: Add days to date
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Helper: Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper: Generate realistic NIK
function generateNIK(index: number): string {
  const province = '32' // Jawa Barat
  const kabupaten = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
  const kecamatan = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
  const birthDate = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0')
  const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const birthYear = String(Math.floor(Math.random() * 40) + 60).padStart(2, '0') // 1960-1999
  const serial = String(index).padStart(4, '0')

  return `${province}${kabupaten}${kecamatan}${birthDate}${birthMonth}${birthYear}${serial}`
}

// Helper: Select package based on probability
function selectPackage(): typeof packages[0] {
  const rand = Math.random()
  let cumulative = 0
  for (const pkg of packages) {
    cumulative += pkg.probability
    if (rand <= cumulative) return pkg
  }
  return packages[0]
}

// Helper: Generate stage instances based on current progress
function generateStageInstances(
  currentStageIndex: number,
  status: 'on-track' | 'at-risk' | 'overdue' | 'completed',
  startDate: Date
): StageInstance[] {
  const instances: StageInstance[] = []
  let currentDate = new Date(startDate)

  for (let i = 0; i < stageDefinitions.length; i++) {
    const stage = stageDefinitions[i]
    const isCompleted = i < currentStageIndex
    const isCurrent = i === currentStageIndex
    const isPending = i > currentStageIndex

    if (isPending) {
      // Future stages - not started yet
      continue
    }

    const avgDays = stage.avgDays
    const varianceDays = Math.floor(Math.random() * 3) - 1 // -1 to +1 days variance

    let actualDays: number
    let isOverdue = false

    if (isCurrent) {
      // Current stage - determine if overdue based on status
      if (status === 'overdue') {
        actualDays = avgDays + Math.floor(Math.random() * 10) + 5 // 5-15 days over
        isOverdue = true
      } else if (status === 'at-risk') {
        actualDays = avgDays + Math.floor(Math.random() * 3) + 1 // 1-3 days over
        isOverdue = false
      } else {
        actualDays = Math.floor(Math.random() * avgDays) + 1 // In progress
        isOverdue = false
      }
    } else {
      // Completed stages
      actualDays = avgDays + varianceDays
    }

    const startedAt = formatDate(currentDate)
    const dueAt = formatDate(addDays(currentDate, avgDays))
    const completedAt = isCompleted ? formatDate(addDays(currentDate, actualDays)) : null

    instances.push({
      stageId: stage.id,
      stageName: stage.name,
      status: isCompleted ? 'completed' : isCurrent ? 'in-progress' : 'pending',
      startedAt,
      completedAt,
      dueAt,
      assignedTo: getAdminForStage(stage.id),
      notes: generateNotes(isCurrent, status),
      isOverdue,
      slaDays: avgDays,
      daysElapsed: isCurrent ? actualDays : isCompleted ? actualDays : 0,
    })

    if (isCompleted || isCurrent) {
      currentDate = addDays(currentDate, actualDays)
    }
  }

  return instances
}

// Helper: Get admin role for stage
function getAdminForStage(stageId: string): string {
  const adminMap: Record<string, string> = {
    'stage-1': 'Siti (Document Admin)',
    'stage-2': 'Siti (Document Admin)',
    'stage-3': 'Budi (SISKOPATUH Admin)',
    'stage-4': 'Budi (SISKOPATUH Admin)',
    'stage-5': 'Rina (Visa Admin)',
    'stage-6': 'Rina (Visa Admin)',
    'stage-7': 'Doni (Logistics Admin)',
    'stage-8': 'Andi (Travel Admin)',
    'stage-9': 'Andi (Travel Admin)',
    'stage-10': 'Andi (Travel Admin)',
  }
  return adminMap[stageId] || 'Admin'
}

// Helper: Generate notes based on status
function generateNotes(isCurrent: boolean, status: string): string {
  if (!isCurrent) return ''

  const notesMap: Record<string, string[]> = {
    'overdue': [
      'Embassy appointment delayed',
      'Waiting for missing documents',
      'Kemenag approval pending',
      'Agent non-responsive',
      'Document verification issues',
      'Incomplete submission',
    ],
    'at-risk': [
      'Approaching deadline',
      'Follow up needed',
      'Waiting for approval',
      'Minor document issues',
    ],
    'on-track': [
      'In progress',
      'On schedule',
      'Processing normally',
    ],
  }

  const notes = notesMap[status] || notesMap['on-track']
  return notes[Math.floor(Math.random() * notes.length)]
}

// Main generator function
export function generate2000Jamaah(): JamaahPipelineStatus[] {
  const jamaah: JamaahPipelineStatus[] = []

  // Distribution targets
  const total = 2000
  const overdueCount = Math.floor(total * 0.10) // 10% overdue (200)
  const atRiskCount = Math.floor(total * 0.15) // 15% at-risk (300)
  const completedCount = Math.floor(total * 0.25) // 25% completed (500)
  const onTrackCount = total - overdueCount - atRiskCount - completedCount // 50% on-track (1000)

  // Date ranges
  const today = new Date('2024-12-26')
  const startDate = new Date('2024-09-01') // 3 months ago
  const endDate = new Date('2025-03-31') // 3 months ahead

  let overdueGenerated = 0
  let atRiskGenerated = 0
  let completedGenerated = 0
  let onTrackGenerated = 0

  for (let i = 0; i < total; i++) {
    // Determine status based on distribution
    let status: 'on-track' | 'at-risk' | 'overdue' | 'completed'
    if (overdueGenerated < overdueCount) {
      status = 'overdue'
      overdueGenerated++
    } else if (atRiskGenerated < atRiskCount) {
      status = 'at-risk'
      atRiskGenerated++
    } else if (completedGenerated < completedCount) {
      status = 'completed'
      completedGenerated++
    } else {
      status = 'on-track'
      onTrackGenerated++
    }

    // Generate name
    const gender = Math.random() > 0.5 ? 'M' : 'F'
    const firstName = gender === 'M'
      ? firstNamesM[Math.floor(Math.random() * firstNamesM.length)]
      : firstNamesF[Math.floor(Math.random() * firstNamesF.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`

    // Select package
    const pkg = selectPackage()

    // Determine current stage based on status
    let currentStageIndex: number
    if (status === 'completed') {
      currentStageIndex = 10 // All stages completed
    } else if (status === 'overdue') {
      // Stuck in early-mid stages (1-6)
      currentStageIndex = Math.floor(Math.random() * 6) + 1
    } else if (status === 'at-risk') {
      // In mid stages (3-8)
      currentStageIndex = Math.floor(Math.random() * 6) + 3
    } else {
      // On-track - distributed across all stages
      currentStageIndex = Math.floor(Math.random() * 9) + 1
    }

    // Generate departure date
    // Completed: past dates
    // Others: future dates based on progress
    let departureDate: Date
    if (status === 'completed') {
      departureDate = randomDate(new Date('2024-10-01'), today)
    } else {
      const daysAhead = 30 + Math.floor(Math.random() * 90) // 30-120 days ahead
      departureDate = addDays(today, daysAhead)
    }

    // Pipeline start date (work backwards from departure)
    const totalPipelineDays = stageDefinitions.reduce((sum, s) => sum + s.avgDays, 0)
    const pipelineStartDate = addDays(departureDate, -totalPipelineDays - 30) // Start 30 days before needed

    // Generate stage instances
    const currentStage = currentStageIndex < stageDefinitions.length
      ? stageDefinitions[currentStageIndex]
      : stageDefinitions[stageDefinitions.length - 1]

    const stageInstances = generateStageInstances(currentStageIndex, status, pipelineStartDate)

    // Calculate overall progress
    const progress = status === 'completed'
      ? 100
      : Math.floor((currentStageIndex / stageDefinitions.length) * 100)

    jamaah.push({
      jamaahId: String(i + 1),
      jamaahName: name,
      packageName: pkg.name,
      departure: formatDate(departureDate),
      currentStageId: currentStage.id,
      currentStageStatus: status === 'completed' ? 'on-track' : status,
      overallProgress: progress,
      stageInstances,
    })
  }

  // Sort by departure date
  jamaah.sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime())

  return jamaah
}

// Pre-generate and export
export const mock2000Jamaah = generate2000Jamaah()

// Export summary stats for verification
export const mock2000Stats = {
  total: mock2000Jamaah.length,
  onTrack: mock2000Jamaah.filter(j => j.currentStageStatus === 'on-track').length,
  atRisk: mock2000Jamaah.filter(j => j.currentStageStatus === 'at-risk').length,
  overdue: mock2000Jamaah.filter(j => j.currentStageStatus === 'overdue').length,
  completed: mock2000Jamaah.filter(j => j.currentStageStatus === 'completed').length,
  byPackage: {
    reguler: mock2000Jamaah.filter(j => j.packageName.includes('Reguler')).length,
    vip: mock2000Jamaah.filter(j => j.packageName.includes('VIP')).length,
    turki: mock2000Jamaah.filter(j => j.packageName.includes('Turki')).length,
    dubai: mock2000Jamaah.filter(j => j.packageName.includes('Dubai')).length,
  },
}
