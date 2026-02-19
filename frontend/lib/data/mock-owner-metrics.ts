// Mock data for owner strategic metrics

export interface BusinessHealthCategory {
  id: string
  name: string
  score: number
  trend: 'up' | 'down' | 'stable'
  status: 'excellent' | 'good' | 'warning' | 'critical'
  metrics: CategoryMetric[]
  insights: string[]
  actions: string[]
}

export interface CategoryMetric {
  label: string
  current: number
  target: number
  unit: string
  benchmark?: number
}

export const businessHealthScorecard: BusinessHealthCategory[] = [
  {
    id: 'revenue',
    name: 'Revenue Health',
    score: 85,
    trend: 'up',
    status: 'excellent',
    metrics: [
      { label: 'Monthly Revenue Growth', current: 18.4, target: 15, unit: '%', benchmark: 12 },
      { label: 'Revenue per Agent', current: 25, target: 20, unit: 'jt', benchmark: 18 },
      { label: 'Revenue Diversity Index', current: 72, target: 70, unit: '%', benchmark: 65 },
      { label: 'Revenue Retention Rate', current: 88, target: 85, unit: '%', benchmark: 80 }
    ],
    insights: [
      'Revenue growth berada di atas target dan benchmark industri',
      'Diversifikasi revenue cukup baik, tidak tergantung pada 1-2 paket saja',
      'Retention rate jamaah sangat baik, menandakan kepuasan tinggi'
    ],
    actions: [
      'Pertahankan momentum growth dengan marketing campaign',
      'Eksplorasi paket baru untuk meningkatkan diversifikasi',
      'Implementasi loyalty program untuk meningkatkan retention'
    ]
  },
  {
    id: 'operations',
    name: 'Operational Excellence',
    score: 78,
    trend: 'up',
    status: 'good',
    metrics: [
      { label: 'Avg Response Time', current: 4.2, target: 3, unit: 'jam', benchmark: 6 },
      { label: 'Document Processing Time', current: 2.3, target: 2, unit: 'hari', benchmark: 3.5 },
      { label: 'Agent Utilization', current: 78, target: 80, unit: '%', benchmark: 75 },
      { label: 'Process Automation Rate', current: 65, target: 70, unit: '%', benchmark: 50 }
    ],
    insights: [
      'Response time masih di atas target, perlu improvement',
      'Document processing sudah efisien dengan OCR automation',
      'Agent utilization mendekati optimal, tapi perlu monitoring workload'
    ],
    actions: [
      'Implementasi chatbot untuk improve response time',
      'Training agent untuk time management yang lebih baik',
      'Tambah automation untuk proses repetitif'
    ]
  },
  {
    id: 'satisfaction',
    name: 'Customer Satisfaction',
    score: 92,
    trend: 'stable',
    status: 'excellent',
    metrics: [
      { label: 'Overall CSAT Score', current: 4.6, target: 4.5, unit: '/5', benchmark: 4.2 },
      { label: 'Net Promoter Score', current: 68, target: 60, unit: '', benchmark: 50 },
      { label: 'Complaint Resolution Rate', current: 96, target: 95, unit: '%', benchmark: 90 },
      { label: 'Repeat Customer Rate', current: 24, target: 20, unit: '%', benchmark: 15 }
    ],
    insights: [
      'Customer satisfaction sangat tinggi, melampaui target dan benchmark',
      'NPS score menunjukkan jamaah sangat merekomendasikan travel kita',
      'Repeat customer rate bagus, potensi untuk family & friends referral'
    ],
    actions: [
      'Maintain service quality dengan consistent training',
      'Launch referral program untuk leverage high NPS',
      'Collect testimonials untuk marketing materials'
    ]
  },
  {
    id: 'agent-performance',
    name: 'Agent Performance',
    score: 74,
    trend: 'down',
    status: 'good',
    metrics: [
      { label: 'Avg Conversion Rate', current: 58, target: 65, unit: '%', benchmark: 55 },
      { label: 'Avg Deal Size', current: 14.1, target: 15, unit: 'jt', benchmark: 13 },
      { label: 'Agent Retention Rate', current: 94, target: 90, unit: '%', benchmark: 85 },
      { label: 'Training Completion', current: 72, target: 85, unit: '%', benchmark: 70 }
    ],
    insights: [
      'Conversion rate di bawah target, perlu coaching dan training',
      'Deal size sedikit di bawah target, dorong upselling paket premium',
      'Agent retention bagus, tim cukup stabil'
    ],
    actions: [
      'Intensive coaching untuk agent dengan conversion < 50%',
      'Training upselling techniques dan product knowledge',
      'Implementasi sales playbook dan best practices sharing'
    ]
  },
  {
    id: 'financial',
    name: 'Financial Health',
    score: 81,
    trend: 'up',
    status: 'good',
    metrics: [
      { label: 'Gross Profit Margin', current: 28, target: 30, unit: '%', benchmark: 25 },
      { label: 'Operating Expense Ratio', current: 18, target: 20, unit: '%', benchmark: 22 },
      { label: 'Commission to Revenue', current: 8, target: 10, unit: '%', benchmark: 12 },
      { label: 'Cash Flow Health', current: 85, target: 80, unit: '%', benchmark: 75 }
    ],
    insights: [
      'Profit margin mendekati target, efisiensi operasional cukup baik',
      'Operating expense terkontrol dengan baik',
      'Rasio komisi sangat sehat, di bawah budget'
    ],
    actions: [
      'Optimasi pricing untuk improve profit margin 2%',
      'Review operational costs untuk identify saving opportunities',
      'Maintain commission structure yang sustainable'
    ]
  }
]

export interface GoalTracking {
  category: string
  goal: string
  target: number
  actual: number
  unit: string
  deadline: string
  status: 'on-track' | 'at-risk' | 'behind'
}

export const goalTrackings: GoalTracking[] = [
  {
    category: 'Revenue',
    goal: 'Revenue Q4 2024',
    target: 1200,
    actual: 1180,
    unit: 'jt',
    deadline: '2024-12-31',
    status: 'on-track'
  },
  {
    category: 'Sales',
    goal: 'Total Jamaah 2024',
    target: 300,
    actual: 247,
    unit: 'orang',
    deadline: '2024-12-31',
    status: 'at-risk'
  },
  {
    category: 'Operations',
    goal: 'Response Time < 3 jam',
    target: 3,
    actual: 4.2,
    unit: 'jam',
    deadline: '2024-12-31',
    status: 'behind'
  },
  {
    category: 'Team',
    goal: 'Agent Count',
    target: 20,
    actual: 18,
    unit: 'orang',
    deadline: '2024-12-31',
    status: 'on-track'
  },
  {
    category: 'Quality',
    goal: 'CSAT Score',
    target: 4.5,
    actual: 4.6,
    unit: '/5',
    deadline: '2024-12-31',
    status: 'on-track'
  }
]

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-600'
}

export function getScoreBackground(score: number): string {
  if (score >= 85) return 'bg-green-50'
  if (score >= 70) return 'bg-blue-50'
  if (score >= 50) return 'bg-amber-50'
  return 'bg-red-50'
}

export function getScoreBorder(score: number): string {
  if (score >= 85) return 'border-green-200'
  if (score >= 70) return 'border-blue-200'
  if (score >= 50) return 'border-amber-200'
  return 'border-red-200'
}

export function getStatusBadgeColor(status: 'excellent' | 'good' | 'warning' | 'critical'): string {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-700'
    case 'good': return 'bg-blue-100 text-blue-700'
    case 'warning': return 'bg-amber-100 text-amber-700'
    case 'critical': return 'bg-red-100 text-red-700'
  }
}
