export interface FeatureTrial {
  id: string;
  featureName: string;
  featureType: 'TRIAL' | 'PAID';
  trialDuration: number; // days
  description: string;
  icon: string;
}

export interface ActiveTrial {
  id: string;
  tenant: string;
  tenantSubdomain: string;
  feature: string;
  startedAt: string;
  expiresAt: string;
  usageCount: number;
  usageLimit: number;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Converted';
  conversionDate?: string;
  revenue?: number;
}

export interface TrialKPIs {
  activeTrials: number;
  conversionRate: number;
  avgTrialDuration: number;
  expiringSoon: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export const trialKPIs: TrialKPIs = {
  activeTrials: 12,
  conversionRate: 28.5,
  avgTrialDuration: 18,
  expiringSoon: 4,
};

export const availableFeatures: FeatureTrial[] = [
  {
    id: 'feat-001',
    featureName: 'OCR Document Intelligence',
    featureType: 'TRIAL',
    trialDuration: 14,
    description: 'Automatic passport and document scanning with AI',
    icon: 'ScanText',
  },
  {
    id: 'feat-002',
    featureName: 'AI Chatbot',
    featureType: 'TRIAL',
    trialDuration: 7,
    description: 'Automated customer support chatbot',
    icon: 'MessageSquare',
  },
  {
    id: 'feat-003',
    featureName: 'WhatsApp Business API',
    featureType: 'TRIAL',
    trialDuration: 30,
    description: 'Official WhatsApp Business messaging integration',
    icon: 'MessageCircle',
  },
  {
    id: 'feat-004',
    featureName: 'Virtual Account Payment',
    featureType: 'PAID',
    trialDuration: 0,
    description: 'Automated payment collection via virtual accounts',
    icon: 'CreditCard',
  },
  {
    id: 'feat-005',
    featureName: 'E-Signature',
    featureType: 'PAID',
    trialDuration: 0,
    description: 'Digital document signing with legal validity',
    icon: 'FileSignature',
  },
  {
    id: 'feat-006',
    featureName: 'SISKOPATUH Integration',
    featureType: 'PAID',
    trialDuration: 0,
    description: 'Direct integration with Kemenag SISKOPATUH system',
    icon: 'Shield',
  },
];

export const activeTrials: ActiveTrial[] = [
  {
    id: 'trial-001',
    tenant: 'Cahaya Makkah',
    tenantSubdomain: 'cahayamakkah',
    feature: 'OCR Document Intelligence',
    startedAt: '2024-12-01',
    expiresAt: '2024-12-15',
    usageCount: 45,
    usageLimit: 100,
    status: 'Expiring Soon',
  },
  {
    id: 'trial-002',
    tenant: 'Hidayah Tour',
    tenantSubdomain: 'hidayah',
    feature: 'AI Chatbot',
    startedAt: '2024-12-18',
    expiresAt: '2024-12-25',
    usageCount: 12,
    usageLimit: 50,
    status: 'Active',
  },
  {
    id: 'trial-003',
    tenant: 'Nurul Iman',
    tenantSubdomain: 'nuruliman',
    feature: 'WhatsApp Business API',
    startedAt: '2024-11-25',
    expiresAt: '2024-12-25',
    usageCount: 890,
    usageLimit: 1000,
    status: 'Expiring Soon',
  },
  {
    id: 'trial-004',
    tenant: 'Barokah Travel',
    tenantSubdomain: 'barokah',
    feature: 'OCR Document Intelligence',
    startedAt: '2024-12-10',
    expiresAt: '2024-12-24',
    usageCount: 78,
    usageLimit: 100,
    status: 'Active',
  },
  {
    id: 'trial-005',
    tenant: 'Furqon Tours',
    tenantSubdomain: 'furqon',
    feature: 'WhatsApp Business API',
    startedAt: '2024-12-08',
    expiresAt: '2025-01-07',
    usageCount: 234,
    usageLimit: 1000,
    status: 'Active',
  },
  {
    id: 'trial-006',
    tenant: 'Madinah Express',
    tenantSubdomain: 'madinah',
    feature: 'AI Chatbot',
    startedAt: '2024-12-12',
    expiresAt: '2024-12-19',
    usageCount: 28,
    usageLimit: 50,
    status: 'Expiring Soon',
  },
  {
    id: 'trial-007',
    tenant: 'Arminareka Perdana',
    tenantSubdomain: 'arminareka',
    feature: 'OCR Document Intelligence',
    startedAt: '2024-11-20',
    expiresAt: '2024-12-04',
    usageCount: 156,
    usageLimit: 100,
    status: 'Converted',
    conversionDate: '2024-12-05',
    revenue: 2500000,
  },
  {
    id: 'trial-008',
    tenant: 'Global Haji Umroh',
    tenantSubdomain: 'globalhaji',
    feature: 'WhatsApp Business API',
    startedAt: '2024-11-15',
    expiresAt: '2024-12-15',
    usageCount: 1250,
    usageLimit: 1000,
    status: 'Converted',
    conversionDate: '2024-12-10',
    revenue: 3500000,
  },
  {
    id: 'trial-009',
    tenant: 'Kaaba Tours',
    tenantSubdomain: 'kaaba',
    feature: 'AI Chatbot',
    startedAt: '2024-11-28',
    expiresAt: '2024-12-05',
    usageCount: 62,
    usageLimit: 50,
    status: 'Converted',
    conversionDate: '2024-12-06',
    revenue: 1500000,
  },
  {
    id: 'trial-010',
    tenant: 'Darul Hijrah',
    tenantSubdomain: 'darulhijrah',
    feature: 'OCR Document Intelligence',
    startedAt: '2024-12-05',
    expiresAt: '2024-12-19',
    usageCount: 52,
    usageLimit: 100,
    status: 'Active',
  },
  {
    id: 'trial-011',
    tenant: 'Zam-Zam Tours',
    tenantSubdomain: 'zamzam',
    feature: 'WhatsApp Business API',
    startedAt: '2024-11-18',
    expiresAt: '2024-12-18',
    usageCount: 1180,
    usageLimit: 1000,
    status: 'Expiring Soon',
  },
  {
    id: 'trial-012',
    tenant: 'Elfa Travel',
    tenantSubdomain: 'elfa',
    feature: 'AI Chatbot',
    startedAt: '2024-11-10',
    expiresAt: '2024-11-17',
    usageCount: 18,
    usageLimit: 50,
    status: 'Expired',
  },
  {
    id: 'trial-013',
    tenant: 'Al-Haramain Tours',
    tenantSubdomain: 'alharamain',
    feature: 'OCR Document Intelligence',
    startedAt: '2024-10-15',
    expiresAt: '2024-10-29',
    usageCount: 245,
    usageLimit: 100,
    status: 'Converted',
    conversionDate: '2024-10-25',
    revenue: 2500000,
  },
  {
    id: 'trial-014',
    tenant: 'Labbaik Travel',
    tenantSubdomain: 'labbaik',
    feature: 'WhatsApp Business API',
    startedAt: '2024-10-20',
    expiresAt: '2024-11-19',
    usageCount: 2150,
    usageLimit: 1000,
    status: 'Converted',
    conversionDate: '2024-11-05',
    revenue: 3500000,
  },
  {
    id: 'trial-015',
    tenant: 'Al-Haramain Tours',
    tenantSubdomain: 'alharamain',
    feature: 'WhatsApp Business API',
    startedAt: '2024-11-01',
    expiresAt: '2024-12-01',
    usageCount: 1890,
    usageLimit: 1000,
    status: 'Converted',
    conversionDate: '2024-11-25',
    revenue: 3500000,
  },
];

export const conversionFunnel: ConversionFunnel[] = [
  {
    stage: 'Trial Started',
    count: 42,
    percentage: 100,
  },
  {
    stage: 'Active Usage',
    count: 28,
    percentage: 66.7,
  },
  {
    stage: 'Converted',
    count: 12,
    percentage: 28.5,
  },
];

export interface TrialConfiguration {
  feature: string;
  duration: number;
  usageLimit: number;
  autoConvert: boolean;
  notifyBeforeExpiry: number; // days
}

export const trialConfigurations: TrialConfiguration[] = [
  {
    feature: 'OCR Document Intelligence',
    duration: 14,
    usageLimit: 100,
    autoConvert: false,
    notifyBeforeExpiry: 3,
  },
  {
    feature: 'AI Chatbot',
    duration: 7,
    usageLimit: 50,
    autoConvert: false,
    notifyBeforeExpiry: 2,
  },
  {
    feature: 'WhatsApp Business API',
    duration: 30,
    usageLimit: 1000,
    autoConvert: true,
    notifyBeforeExpiry: 7,
  },
];

export interface FeatureAdoptionRate {
  feature: string;
  totalTenants: number;
  adoptedBy: number;
  adoptionRate: number;
  trialToConversion: number;
}

export const featureAdoptionRates: FeatureAdoptionRate[] = [
  {
    feature: 'WhatsApp Business API',
    totalTenants: 15,
    adoptedBy: 8,
    adoptionRate: 53.3,
    trialToConversion: 37.5,
  },
  {
    feature: 'OCR Document Intelligence',
    totalTenants: 15,
    adoptedBy: 6,
    adoptionRate: 40.0,
    trialToConversion: 33.3,
  },
  {
    feature: 'AI Chatbot',
    totalTenants: 15,
    adoptedBy: 3,
    adoptionRate: 20.0,
    trialToConversion: 25.0,
  },
  {
    feature: 'Virtual Account Payment',
    totalTenants: 15,
    adoptedBy: 12,
    adoptionRate: 80.0,
    trialToConversion: 0,
  },
  {
    feature: 'SISKOPATUH Integration',
    totalTenants: 15,
    adoptedBy: 10,
    adoptionRate: 66.7,
    trialToConversion: 0,
  },
  {
    feature: 'E-Signature',
    totalTenants: 15,
    adoptedBy: 5,
    adoptionRate: 33.3,
    trialToConversion: 0,
  },
];
