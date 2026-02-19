export interface SystemHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  tenant: string;
  type: 'login' | 'booking' | 'payment' | 'departure' | 'api_call' | 'error';
  description: string;
  user: string;
  severity: 'info' | 'warning' | 'error';
}

export interface TenantActivity {
  tenantName: string;
  subdomain: string;
  activityCount: number;
  apiCalls: number;
  activeUsers: number;
}

export interface ErrorMetric {
  tenant: string;
  errorCount: number;
  errorRate: number;
}

export interface ErrorType {
  type: string;
  count: number;
  percentage: number;
}

export interface PerformanceMetric {
  metric: string;
  current: number;
  average: number;
  p95: number;
  unit: string;
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export const systemHealth: SystemHealth[] = [
  {
    service: 'API Health',
    status: 'healthy',
    responseTime: 45,
    uptime: 99.98,
    lastCheck: '2024-12-25T10:30:00',
  },
  {
    service: 'Database',
    status: 'healthy',
    responseTime: 12,
    uptime: 99.99,
    lastCheck: '2024-12-25T10:30:00',
  },
  {
    service: 'Redis',
    status: 'healthy',
    responseTime: 3,
    uptime: 99.95,
    lastCheck: '2024-12-25T10:30:00',
  },
  {
    service: 'Background Jobs',
    status: 'degraded',
    responseTime: 156,
    uptime: 98.5,
    lastCheck: '2024-12-25T10:30:00',
  },
];

export const systemMetrics: SystemMetric[] = [
  {
    name: 'CPU Usage',
    value: 45,
    unit: '%',
    threshold: 80,
    status: 'good',
  },
  {
    name: 'Memory',
    value: 62,
    unit: '%',
    threshold: 85,
    status: 'good',
  },
  {
    name: 'Disk',
    value: 58,
    unit: '%',
    threshold: 90,
    status: 'good',
  },
  {
    name: 'Network',
    value: 28,
    unit: 'Mbps',
    threshold: 100,
    status: 'good',
  },
];

export const activityFeed: ActivityLog[] = [
  {
    id: 'act-001',
    timestamp: '2024-12-25T10:28:45',
    tenant: 'Al-Haramain Tours',
    type: 'booking',
    description: 'Booking baru untuk paket Umroh Desember',
    user: 'Ahmad Fauzi',
    severity: 'info',
  },
  {
    id: 'act-002',
    timestamp: '2024-12-25T10:27:30',
    tenant: 'Arminareka Perdana',
    type: 'payment',
    description: 'Pembayaran diterima Rp 25.000.000',
    user: 'Siti Nurhaliza',
    severity: 'info',
  },
  {
    id: 'act-003',
    timestamp: '2024-12-25T10:26:15',
    tenant: 'Labbaik Travel',
    type: 'error',
    description: 'API timeout saat mengakses SISKOPATUH',
    user: 'System',
    severity: 'error',
  },
  {
    id: 'act-004',
    timestamp: '2024-12-25T10:25:00',
    tenant: 'Global Haji Umroh',
    type: 'login',
    description: 'Login oleh agent',
    user: 'Budi Santoso',
    severity: 'info',
  },
  {
    id: 'act-005',
    timestamp: '2024-12-25T10:23:45',
    tenant: 'Elfa Travel',
    type: 'departure',
    description: 'Keberangkatan grup A ke Jeddah',
    user: 'Dewi Lestari',
    severity: 'info',
  },
  {
    id: 'act-006',
    timestamp: '2024-12-25T10:22:30',
    tenant: 'Barokah Travel',
    type: 'api_call',
    description: 'OCR dokumen paspor berhasil diproses',
    user: 'Hendra Wijaya',
    severity: 'info',
  },
  {
    id: 'act-007',
    timestamp: '2024-12-25T10:21:15',
    tenant: 'Darul Hijrah',
    type: 'booking',
    description: 'Update data jamaah',
    user: 'Fitri Amalia',
    severity: 'info',
  },
  {
    id: 'act-008',
    timestamp: '2024-12-25T10:20:00',
    tenant: 'Kaaba Tours',
    type: 'payment',
    description: 'Cicilan ke-2 diterima',
    user: 'Rudi Hartono',
    severity: 'info',
  },
  {
    id: 'act-009',
    timestamp: '2024-12-25T10:18:45',
    tenant: 'Zam-Zam Tours',
    type: 'error',
    description: 'Gagal mengirim WhatsApp notifikasi',
    user: 'System',
    severity: 'warning',
  },
  {
    id: 'act-010',
    timestamp: '2024-12-25T10:17:30',
    tenant: 'Furqon Tours',
    type: 'login',
    description: 'Login oleh owner',
    user: 'Muhammad Rizki',
    severity: 'info',
  },
  {
    id: 'act-011',
    timestamp: '2024-12-25T10:16:15',
    tenant: 'Al-Haramain Tours',
    type: 'api_call',
    description: 'Export data jamaah ke Excel',
    user: 'Ahmad Fauzi',
    severity: 'info',
  },
  {
    id: 'act-012',
    timestamp: '2024-12-25T10:15:00',
    tenant: 'Madinah Express',
    type: 'booking',
    description: 'Jamaah baru didaftarkan',
    user: 'Andi Wijaya',
    severity: 'info',
  },
  {
    id: 'act-013',
    timestamp: '2024-12-25T10:13:45',
    tenant: 'Labbaik Travel',
    type: 'departure',
    description: 'Manifest keberangkatan dikirim',
    user: 'Lisa Permata',
    severity: 'info',
  },
  {
    id: 'act-014',
    timestamp: '2024-12-25T10:12:30',
    tenant: 'Hidayah Tour',
    type: 'login',
    description: 'Login pertama kali (trial account)',
    user: 'Yoga Pratama',
    severity: 'info',
  },
  {
    id: 'act-015',
    timestamp: '2024-12-25T10:11:15',
    tenant: 'Cahaya Makkah',
    type: 'api_call',
    description: 'Test WhatsApp API',
    user: 'Rina Susanti',
    severity: 'info',
  },
  {
    id: 'act-016',
    timestamp: '2024-12-25T10:10:00',
    tenant: 'Arminareka Perdana',
    type: 'payment',
    description: 'Virtual Account pembayaran terverifikasi',
    user: 'System',
    severity: 'info',
  },
  {
    id: 'act-017',
    timestamp: '2024-12-25T10:08:45',
    tenant: 'Global Haji Umroh',
    type: 'booking',
    description: 'Upgrade paket ke VIP',
    user: 'Budi Santoso',
    severity: 'info',
  },
  {
    id: 'act-018',
    timestamp: '2024-12-25T10:07:30',
    tenant: 'Elfa Travel',
    type: 'error',
    description: 'Database connection timeout',
    user: 'System',
    severity: 'error',
  },
  {
    id: 'act-019',
    timestamp: '2024-12-25T10:06:15',
    tenant: 'Nurul Iman',
    type: 'login',
    description: 'Setup akun trial pertama kali',
    user: 'Bambang Setiawan',
    severity: 'info',
  },
  {
    id: 'act-020',
    timestamp: '2024-12-25T10:05:00',
    tenant: 'Barokah Travel',
    type: 'api_call',
    description: 'Sinkronisasi data dengan SISKOPATUH',
    user: 'System',
    severity: 'info',
  },
];

export const tenantActivities: TenantActivity[] = [
  {
    tenantName: 'Labbaik Travel',
    subdomain: 'labbaik',
    activityCount: 1245,
    apiCalls: 8950,
    activeUsers: 26,
  },
  {
    tenantName: 'Al-Haramain Tours',
    subdomain: 'alharamain',
    activityCount: 1180,
    apiCalls: 8320,
    activeUsers: 23,
  },
  {
    tenantName: 'Elfa Travel',
    subdomain: 'elfa',
    activityCount: 980,
    apiCalls: 6890,
    activeUsers: 20,
  },
  {
    tenantName: 'Global Haji Umroh',
    subdomain: 'globalhaji',
    activityCount: 850,
    apiCalls: 5240,
    activeUsers: 18,
  },
  {
    tenantName: 'Zam-Zam Tours',
    subdomain: 'zamzam',
    activityCount: 780,
    apiCalls: 4680,
    activeUsers: 17,
  },
  {
    tenantName: 'Arminareka Perdana',
    subdomain: 'arminareka',
    activityCount: 720,
    apiCalls: 4120,
    activeUsers: 16,
  },
  {
    tenantName: 'Kaaba Tours',
    subdomain: 'kaaba',
    activityCount: 650,
    apiCalls: 3890,
    activeUsers: 15,
  },
  {
    tenantName: 'Darul Hijrah',
    subdomain: 'darulhijrah',
    activityCount: 580,
    apiCalls: 3250,
    activeUsers: 14,
  },
  {
    tenantName: 'Barokah Travel',
    subdomain: 'barokah',
    activityCount: 320,
    apiCalls: 1890,
    activeUsers: 7,
  },
  {
    tenantName: 'Madinah Express',
    subdomain: 'madinah',
    activityCount: 280,
    apiCalls: 1560,
    activeUsers: 6,
  },
];

export const errorMetrics: ErrorMetric[] = [
  {
    tenant: 'Labbaik Travel',
    errorCount: 12,
    errorRate: 0.13,
  },
  {
    tenant: 'Al-Haramain Tours',
    errorCount: 8,
    errorRate: 0.10,
  },
  {
    tenant: 'Elfa Travel',
    errorCount: 15,
    errorRate: 0.22,
  },
  {
    tenant: 'Global Haji Umroh',
    errorCount: 5,
    errorRate: 0.06,
  },
  {
    tenant: 'Zam-Zam Tours',
    errorCount: 6,
    errorRate: 0.08,
  },
];

export const errorTypes: ErrorType[] = [
  {
    type: 'API Timeout',
    count: 18,
    percentage: 39,
  },
  {
    type: 'Database Error',
    count: 12,
    percentage: 26,
  },
  {
    type: 'Authentication Failed',
    count: 8,
    percentage: 17,
  },
  {
    type: 'Validation Error',
    count: 6,
    percentage: 13,
  },
  {
    type: 'Network Error',
    count: 2,
    percentage: 5,
  },
];

export const performanceMetrics: PerformanceMetric[] = [
  {
    metric: 'API Response Time',
    current: 45,
    average: 52,
    p95: 120,
    unit: 'ms',
  },
  {
    metric: 'Database Query Time',
    current: 12,
    average: 15,
    p95: 35,
    unit: 'ms',
  },
  {
    metric: 'Page Load Time',
    current: 1.8,
    average: 2.1,
    p95: 4.5,
    unit: 's',
  },
  {
    metric: 'WebSocket Latency',
    current: 8,
    average: 10,
    p95: 25,
    unit: 'ms',
  },
];

export const alerts: Alert[] = [
  {
    id: 'alert-001',
    level: 'warning',
    message: 'Background Jobs response time melebihi threshold (156ms)',
    timestamp: '2024-12-25T10:25:00',
    acknowledged: false,
  },
  {
    id: 'alert-002',
    level: 'warning',
    message: 'Elfa Travel error rate tinggi (0.22%)',
    timestamp: '2024-12-25T10:20:00',
    acknowledged: false,
  },
  {
    id: 'alert-003',
    level: 'warning',
    message: 'Disk usage mendekati 60%',
    timestamp: '2024-12-25T10:15:00',
    acknowledged: true,
  },
  {
    id: 'alert-004',
    level: 'info',
    message: '3 trial accounts akan berakhir dalam 7 hari',
    timestamp: '2024-12-25T09:00:00',
    acknowledged: false,
  },
  {
    id: 'alert-005',
    level: 'info',
    message: 'Monthly backup berhasil diselesaikan',
    timestamp: '2024-12-25T02:00:00',
    acknowledged: true,
  },
  {
    id: 'alert-006',
    level: 'info',
    message: 'Scheduled maintenance 28 Desember 2024',
    timestamp: '2024-12-24T10:00:00',
    acknowledged: false,
  },
  {
    id: 'alert-007',
    level: 'info',
    message: 'New feature deployment successful',
    timestamp: '2024-12-23T15:30:00',
    acknowledged: true,
  },
  {
    id: 'alert-008',
    level: 'info',
    message: 'Certificate renewal reminder (expires in 30 days)',
    timestamp: '2024-12-22T08:00:00',
    acknowledged: false,
  },
];

export const monitoringKPIs = {
  criticalAlerts: 0,
  warningAlerts: 3,
  infoAlerts: 5,
  avgResponseTime: 45,
};
