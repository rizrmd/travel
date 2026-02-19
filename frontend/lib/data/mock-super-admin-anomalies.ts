export interface Anomaly {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  type: 'Security' | 'Performance' | 'Usage' | 'Financial' | 'Data Integrity';
  tenant: string;
  tenantSubdomain: string;
  description: string;
  detectedAt: string;
  status: 'Active' | 'Investigating' | 'Resolved' | 'False Positive';
  affectedResources: string[];
  timeline: AnomalyTimelineEvent[];
  resolutionSteps: string[];
  impact: string;
  rootCause?: string;
}

export interface AnomalyTimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
}

export interface AnomalyKPIs {
  criticalAlerts: number;
  warnings: number;
  resolved: number;
  last24hIncidents: number;
}

export const anomalyKPIs: AnomalyKPIs = {
  criticalAlerts: 2,
  warnings: 8,
  resolved: 15,
  last24hIncidents: 12,
};

export const mockAnomalies: Anomaly[] = [
  {
    id: 'anom-001',
    severity: 'Critical',
    type: 'Security',
    tenant: 'Elfa Travel',
    tenantSubdomain: 'elfa',
    description: 'Multiple failed login attempts detected (15 attempts in 5 minutes)',
    detectedAt: '2024-12-25T10:15:00',
    status: 'Active',
    affectedResources: ['Login API', 'User Authentication Service'],
    timeline: [
      {
        timestamp: '2024-12-25T10:15:00',
        event: 'Anomaly detected by security monitoring',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T10:16:30',
        event: 'Alert generated and sent to security team',
        actor: 'System',
      },
    ],
    resolutionSteps: [
      'Investigate login attempts source IP',
      'Check if legitimate user forgot password',
      'Consider temporary IP block if malicious',
      'Enable CAPTCHA for this tenant',
      'Review security logs for other tenants',
    ],
    impact: 'Potential security breach attempt',
  },
  {
    id: 'anom-002',
    severity: 'Critical',
    type: 'Performance',
    tenant: 'Labbaik Travel',
    tenantSubdomain: 'labbaik',
    description: 'API response time spike: 2500ms (normal: 50ms)',
    detectedAt: '2024-12-25T09:45:00',
    status: 'Investigating',
    affectedResources: ['Booking API', 'Database Connection Pool'],
    timeline: [
      {
        timestamp: '2024-12-25T09:45:00',
        event: 'Performance degradation detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T09:46:15',
        event: 'Engineering team notified',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T09:50:00',
        event: 'Investigation started',
        actor: 'Tech Team',
      },
    ],
    resolutionSteps: [
      'Check database query performance',
      'Review recent code deployments',
      'Analyze slow query logs',
      'Check connection pool saturation',
      'Consider scaling database if needed',
    ],
    impact: 'Slow booking process affecting user experience',
  },
  {
    id: 'anom-003',
    severity: 'High',
    type: 'Usage',
    tenant: 'Al-Haramain Tours',
    tenantSubdomain: 'alharamain',
    description: 'Unusual API usage: 50,000 calls in 1 hour (normal: 5,000/hour)',
    detectedAt: '2024-12-25T08:30:00',
    status: 'Resolved',
    affectedResources: ['API Gateway', 'Rate Limiter'],
    timeline: [
      {
        timestamp: '2024-12-25T08:30:00',
        event: 'Abnormal API usage detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T08:35:00',
        event: 'Tenant contacted for verification',
        actor: 'Support Team',
      },
      {
        timestamp: '2024-12-25T08:45:00',
        event: 'Confirmed as bulk data migration',
        actor: 'Tenant Admin',
      },
      {
        timestamp: '2024-12-25T09:00:00',
        event: 'Marked as resolved - legitimate use case',
        actor: 'Support Team',
      },
    ],
    resolutionSteps: [],
    impact: 'No negative impact - authorized bulk operation',
    rootCause: 'Tenant performing scheduled data migration',
  },
  {
    id: 'anom-004',
    severity: 'High',
    type: 'Financial',
    tenant: 'Iman Travel',
    tenantSubdomain: 'iman',
    description: 'Payment failure rate: 85% (12 of 14 transactions failed)',
    detectedAt: '2024-12-25T07:20:00',
    status: 'Resolved',
    affectedResources: ['Payment Gateway', 'Virtual Account Service'],
    timeline: [
      {
        timestamp: '2024-12-25T07:20:00',
        event: 'High payment failure rate detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T07:25:00',
        event: 'Payment provider contacted',
        actor: 'Finance Team',
      },
      {
        timestamp: '2024-12-25T07:40:00',
        event: 'Issue identified: expired API credentials',
        actor: 'Payment Provider',
      },
      {
        timestamp: '2024-12-25T08:00:00',
        event: 'Account suspended for non-payment',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Account suspended due to repeated payment failures',
    rootCause: 'Tenant credit card expired, failed to update payment method',
  },
  {
    id: 'anom-005',
    severity: 'Medium',
    type: 'Data Integrity',
    tenant: 'Global Haji Umroh',
    tenantSubdomain: 'globalhaji',
    description: 'Duplicate jamaah records detected (same passport number)',
    detectedAt: '2024-12-25T06:15:00',
    status: 'Investigating',
    affectedResources: ['Jamaah Database', 'Data Validation Service'],
    timeline: [
      {
        timestamp: '2024-12-25T06:15:00',
        event: 'Data integrity check found duplicates',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T06:30:00',
        event: 'Tenant notified of potential duplicates',
        actor: 'Support Team',
      },
    ],
    resolutionSteps: [
      'Review duplicate records',
      'Check if same person or data entry error',
      'Provide tenant with duplicate report',
      'Assist in merging or deleting duplicates',
      'Strengthen validation rules',
    ],
    impact: 'Potential data inconsistency in jamaah records',
  },
  {
    id: 'anom-006',
    severity: 'Medium',
    type: 'Performance',
    tenant: 'Zam-Zam Tours',
    tenantSubdomain: 'zamzam',
    description: 'Storage usage increased 500% in 24 hours',
    detectedAt: '2024-12-25T05:00:00',
    status: 'Active',
    affectedResources: ['File Storage', 'Document Storage'],
    timeline: [
      {
        timestamp: '2024-12-25T05:00:00',
        event: 'Abnormal storage growth detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T05:15:00',
        event: 'Storage audit initiated',
        actor: 'System',
      },
    ],
    resolutionSteps: [
      'Analyze what files were uploaded',
      'Check if within plan limits',
      'Contact tenant about storage usage',
      'Recommend cleanup or plan upgrade',
      'Monitor for continued growth',
    ],
    impact: 'Approaching storage quota limit',
  },
  {
    id: 'anom-007',
    severity: 'Medium',
    type: 'Security',
    tenant: 'Kaaba Tours',
    tenantSubdomain: 'kaaba',
    description: 'Unusual access pattern: Admin login from 3 different countries in 1 hour',
    detectedAt: '2024-12-24T22:30:00',
    status: 'False Positive',
    affectedResources: ['Authentication Service', 'Session Management'],
    timeline: [
      {
        timestamp: '2024-12-24T22:30:00',
        event: 'Geo-location anomaly detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T22:35:00',
        event: 'Security alert sent to tenant',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T23:00:00',
        event: 'Tenant confirmed legitimate - VPN usage',
        actor: 'Tenant Admin',
      },
      {
        timestamp: '2024-12-24T23:05:00',
        event: 'Marked as false positive',
        actor: 'Security Team',
      },
    ],
    resolutionSteps: [],
    impact: 'No impact - legitimate VPN usage',
    rootCause: 'Admin using VPN with multiple server locations',
  },
  {
    id: 'anom-008',
    severity: 'Medium',
    type: 'Usage',
    tenant: 'Arminareka Perdana',
    tenantSubdomain: 'arminareka',
    description: 'WhatsApp API quota exceeded: 5,500 messages sent (limit: 5,000)',
    detectedAt: '2024-12-24T20:15:00',
    status: 'Resolved',
    affectedResources: ['WhatsApp Business API', 'Message Queue'],
    timeline: [
      {
        timestamp: '2024-12-24T20:15:00',
        event: 'API quota exceeded',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T20:20:00',
        event: 'Additional quota purchased',
        actor: 'Tenant Admin',
      },
      {
        timestamp: '2024-12-24T20:25:00',
        event: 'Service resumed',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Temporary message sending interruption (10 minutes)',
    rootCause: 'Mass notification campaign exceeded monthly quota',
  },
  {
    id: 'anom-009',
    severity: 'Low',
    type: 'Performance',
    tenant: 'Darul Hijrah',
    tenantSubdomain: 'darulhijrah',
    description: 'Slow report generation: 45 seconds (normal: 8 seconds)',
    detectedAt: '2024-12-24T18:45:00',
    status: 'Investigating',
    affectedResources: ['Report Service', 'Database Queries'],
    timeline: [
      {
        timestamp: '2024-12-24T18:45:00',
        event: 'Slow report generation detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T19:00:00',
        event: 'Performance analysis started',
        actor: 'Tech Team',
      },
    ],
    resolutionSteps: [
      'Analyze report query complexity',
      'Check database indexing',
      'Review report size and data volume',
      'Consider caching strategy',
      'Optimize query if needed',
    ],
    impact: 'Slower report generation affecting user experience',
  },
  {
    id: 'anom-010',
    severity: 'Low',
    type: 'Data Integrity',
    tenant: 'Barokah Travel',
    tenantSubdomain: 'barokah',
    description: 'Missing mandatory field in 3 jamaah records (emergency contact)',
    detectedAt: '2024-12-24T16:30:00',
    status: 'Resolved',
    affectedResources: ['Jamaah Database', 'Validation Rules'],
    timeline: [
      {
        timestamp: '2024-12-24T16:30:00',
        event: 'Data validation check failed',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T16:45:00',
        event: 'Tenant notified to complete data',
        actor: 'Support Team',
      },
      {
        timestamp: '2024-12-24T18:00:00',
        event: 'All records updated by tenant',
        actor: 'Tenant Admin',
      },
      {
        timestamp: '2024-12-24T18:05:00',
        event: 'Issue resolved',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Data completeness improved',
    rootCause: 'Old records migrated before emergency contact was mandatory',
  },
  {
    id: 'anom-011',
    severity: 'Low',
    type: 'Security',
    tenant: 'Furqon Tours',
    tenantSubdomain: 'furqon',
    description: 'Weak password detected for 2 agent accounts',
    detectedAt: '2024-12-24T14:20:00',
    status: 'Active',
    affectedResources: ['User Management', 'Password Policy'],
    timeline: [
      {
        timestamp: '2024-12-24T14:20:00',
        event: 'Password audit identified weak passwords',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T14:30:00',
        event: 'Users notified to update passwords',
        actor: 'System',
      },
    ],
    resolutionSteps: [
      'Enforce password reset for affected users',
      'Strengthen password policy',
      'Enable 2FA recommendation',
      'Schedule security awareness training',
    ],
    impact: 'Low security risk - users prompted to update',
  },
  {
    id: 'anom-012',
    severity: 'High',
    type: 'Financial',
    tenant: 'Madinah Express',
    tenantSubdomain: 'madinah',
    description: 'Revenue discrepancy: Rp 5.000.000 mismatch between bookings and payments',
    detectedAt: '2024-12-24T12:00:00',
    status: 'Investigating',
    affectedResources: ['Payment Reconciliation', 'Booking System'],
    timeline: [
      {
        timestamp: '2024-12-24T12:00:00',
        event: 'Daily reconciliation found discrepancy',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T13:00:00',
        event: 'Finance team started investigation',
        actor: 'Finance Team',
      },
      {
        timestamp: '2024-12-24T14:30:00',
        event: 'Tenant records requested',
        actor: 'Finance Team',
      },
    ],
    resolutionSteps: [
      'Compare booking records with payment logs',
      'Check for cancelled bookings',
      'Verify refund transactions',
      'Review manual payment entries',
      'Reconcile with tenant financial records',
    ],
    impact: 'Financial reporting accuracy affected',
  },
  {
    id: 'anom-013',
    severity: 'Medium',
    type: 'Usage',
    tenant: 'Hidayah Tour',
    tenantSubdomain: 'hidayah',
    description: 'Trial account inactive for 10 days (last login: 2024-12-15)',
    detectedAt: '2024-12-25T08:00:00',
    status: 'Active',
    affectedResources: ['Trial Management', 'User Engagement'],
    timeline: [
      {
        timestamp: '2024-12-25T08:00:00',
        event: 'Inactivity detected in trial account',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T08:15:00',
        event: 'Engagement email sent',
        actor: 'System',
      },
    ],
    resolutionSteps: [
      'Send re-engagement email',
      'Offer onboarding assistance',
      'Schedule follow-up call',
      'Extend trial if needed',
      'Gather feedback on barriers',
    ],
    impact: 'Risk of trial not converting',
  },
  {
    id: 'anom-014',
    severity: 'Low',
    type: 'Performance',
    tenant: 'Cahaya Makkah',
    tenantSubdomain: 'cahayamakkah',
    description: 'Image upload failures: 4 out of 5 attempts failed',
    detectedAt: '2024-12-25T07:30:00',
    status: 'Resolved',
    affectedResources: ['File Upload Service', 'Storage Service'],
    timeline: [
      {
        timestamp: '2024-12-25T07:30:00',
        event: 'Multiple upload failures detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T07:35:00',
        event: 'Issue identified: network timeout',
        actor: 'System',
      },
      {
        timestamp: '2024-12-25T07:45:00',
        event: 'Network issue resolved',
        actor: 'Infrastructure Team',
      },
      {
        timestamp: '2024-12-25T07:50:00',
        event: 'Upload functionality restored',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Brief interruption in document upload',
    rootCause: 'Temporary network connectivity issue',
  },
  {
    id: 'anom-015',
    severity: 'Medium',
    type: 'Security',
    tenant: 'Nurul Iman',
    tenantSubdomain: 'nuruliman',
    description: 'API key exposed in public GitHub repository',
    detectedAt: '2024-12-24T10:00:00',
    status: 'Resolved',
    affectedResources: ['API Security', 'Credentials Management'],
    timeline: [
      {
        timestamp: '2024-12-24T10:00:00',
        event: 'Exposed API key detected by scanner',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T10:05:00',
        event: 'API key immediately revoked',
        actor: 'Security Team',
      },
      {
        timestamp: '2024-12-24T10:15:00',
        event: 'Tenant contacted about security breach',
        actor: 'Security Team',
      },
      {
        timestamp: '2024-12-24T10:30:00',
        event: 'New API key issued',
        actor: 'Security Team',
      },
      {
        timestamp: '2024-12-24T11:00:00',
        event: 'Security training scheduled for tenant',
        actor: 'Support Team',
      },
    ],
    resolutionSteps: [],
    impact: 'Potential unauthorized API access prevented',
    rootCause: 'Tenant accidentally committed API key to version control',
  },
  {
    id: 'anom-016',
    severity: 'Low',
    type: 'Data Integrity',
    tenant: 'Labbaik Travel',
    tenantSubdomain: 'labbaik',
    description: 'Orphaned document records: 12 files without associated jamaah',
    detectedAt: '2024-12-23T22:00:00',
    status: 'Resolved',
    affectedResources: ['Document Storage', 'Database Relations'],
    timeline: [
      {
        timestamp: '2024-12-23T22:00:00',
        event: 'Nightly cleanup found orphaned records',
        actor: 'System',
      },
      {
        timestamp: '2024-12-24T09:00:00',
        event: 'Records analyzed for recovery',
        actor: 'Support Team',
      },
      {
        timestamp: '2024-12-24T10:00:00',
        event: 'Orphaned files archived',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Storage optimization - 45MB freed',
    rootCause: 'Jamaah records deleted without cascade delete',
  },
  {
    id: 'anom-017',
    severity: 'High',
    type: 'Performance',
    tenant: 'Al-Haramain Tours',
    tenantSubdomain: 'alharamain',
    description: 'Database connection pool exhausted: 100/100 connections in use',
    detectedAt: '2024-12-23T18:30:00',
    status: 'Resolved',
    affectedResources: ['Database', 'Connection Pool'],
    timeline: [
      {
        timestamp: '2024-12-23T18:30:00',
        event: 'Connection pool saturation detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-23T18:35:00',
        event: 'Emergency scaling initiated',
        actor: 'Infrastructure Team',
      },
      {
        timestamp: '2024-12-23T18:45:00',
        event: 'Connection pool increased to 150',
        actor: 'Infrastructure Team',
      },
      {
        timestamp: '2024-12-23T19:00:00',
        event: 'Performance restored',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Temporary service degradation for 30 minutes',
    rootCause: 'High concurrent user activity during peak hours',
  },
  {
    id: 'anom-018',
    severity: 'Medium',
    type: 'Financial',
    tenant: 'Elfa Travel',
    tenantSubdomain: 'elfa',
    description: 'Unusual refund volume: 8 refunds in 24 hours (normal: 1-2/month)',
    detectedAt: '2024-12-23T16:00:00',
    status: 'Investigating',
    affectedResources: ['Refund Processing', 'Payment System'],
    timeline: [
      {
        timestamp: '2024-12-23T16:00:00',
        event: 'Abnormal refund pattern detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-23T16:30:00',
        event: 'Finance team reviewing refund requests',
        actor: 'Finance Team',
      },
    ],
    resolutionSteps: [
      'Review refund reasons',
      'Check for cancelled departures',
      'Verify refund policy compliance',
      'Contact tenant for clarification',
      'Monitor for fraud patterns',
    ],
    impact: 'Potential revenue impact under investigation',
  },
  {
    id: 'anom-019',
    severity: 'Low',
    type: 'Usage',
    tenant: 'Barokah Travel',
    tenantSubdomain: 'barokah',
    description: 'Feature adoption low: OCR feature not used in 30 days',
    detectedAt: '2024-12-23T12:00:00',
    status: 'Active',
    affectedResources: ['OCR Service', 'Feature Usage Analytics'],
    timeline: [
      {
        timestamp: '2024-12-23T12:00:00',
        event: 'Low feature adoption detected',
        actor: 'System',
      },
      {
        timestamp: '2024-12-23T14:00:00',
        event: 'Training materials sent to tenant',
        actor: 'Support Team',
      },
    ],
    resolutionSteps: [
      'Send feature tutorial email',
      'Offer training session',
      'Gather feedback on feature usability',
      'Consider feature improvement',
    ],
    impact: 'Underutilized premium feature',
  },
  {
    id: 'anom-020',
    severity: 'Low',
    type: 'Security',
    tenant: 'Global Haji Umroh',
    tenantSubdomain: 'globalhaji',
    description: 'Session timeout configuration too long: 24 hours (recommended: 8 hours)',
    detectedAt: '2024-12-23T10:00:00',
    status: 'Resolved',
    affectedResources: ['Session Management', 'Security Settings'],
    timeline: [
      {
        timestamp: '2024-12-23T10:00:00',
        event: 'Security audit found long session timeout',
        actor: 'System',
      },
      {
        timestamp: '2024-12-23T10:30:00',
        event: 'Tenant notified of security recommendation',
        actor: 'Security Team',
      },
      {
        timestamp: '2024-12-23T14:00:00',
        event: 'Tenant updated session timeout to 8 hours',
        actor: 'Tenant Admin',
      },
      {
        timestamp: '2024-12-23T14:05:00',
        event: 'Configuration validated',
        actor: 'System',
      },
    ],
    resolutionSteps: [],
    impact: 'Security posture improved',
    rootCause: 'Default configuration not following best practices',
  },
];
