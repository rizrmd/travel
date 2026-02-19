export interface PlatformKPIs {
  totalRevenue: number;
  mrr: number;
  churnRate: number;
  arpt: number;
  totalAgents: number;
  totalJamaah: number;
}

export interface GrowthMetric {
  month: string;
  revenue: number;
  newTenants: number;
  churn: number;
}

export interface TenantDistribution {
  plan: string;
  count: number;
  percentage: number;
  revenue: number;
}

export interface TopTenant {
  rank: number;
  tenantName: string;
  subdomain: string;
  plan: string;
  monthlyRevenue: number;
  totalRevenue: number;
  agents: number;
  jamaah: number;
}

export interface GeographicDistribution {
  province: string;
  tenantCount: number;
  totalJamaah: number;
  totalRevenue: number;
}

export interface FeatureAdoption {
  feature: string;
  adopters: number;
  percentage: number;
  avgUsage: number;
}

export interface CohortData {
  signupMonth: string;
  tenants: number;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}

export const platformKPIs: PlatformKPIs = {
  totalRevenue: 548000000, // Total all time
  mrr: 45750000, // Monthly Recurring Revenue
  churnRate: 3.2, // percentage
  arpt: 3812500, // Average Revenue Per Tenant
  totalAgents: 191,
  totalJamaah: 9995,
};

export const growthMetrics: GrowthMetric[] = [
  {
    month: 'Jan 2024',
    revenue: 35000000,
    newTenants: 2,
    churn: 0,
  },
  {
    month: 'Feb 2024',
    revenue: 35000000,
    newTenants: 0,
    churn: 0,
  },
  {
    month: 'Mar 2024',
    revenue: 37500000,
    newTenants: 1,
    churn: 0,
  },
  {
    month: 'Apr 2024',
    revenue: 40000000,
    newTenants: 1,
    churn: 0,
  },
  {
    month: 'May 2024',
    revenue: 40000000,
    newTenants: 0,
    churn: 0,
  },
  {
    month: 'Jun 2024',
    revenue: 42500000,
    newTenants: 1,
    churn: 0,
  },
  {
    month: 'Jul 2024',
    revenue: 45000000,
    newTenants: 1,
    churn: 0,
  },
  {
    month: 'Aug 2024',
    revenue: 45000000,
    newTenants: 0,
    churn: 1,
  },
  {
    month: 'Sep 2024',
    revenue: 45000000,
    newTenants: 0,
    churn: 0,
  },
  {
    month: 'Oct 2024',
    revenue: 45000000,
    newTenants: 0,
    churn: 0,
  },
  {
    month: 'Nov 2024',
    revenue: 45750000,
    newTenants: 1,
    churn: 0,
  },
  {
    month: 'Dec 2024',
    revenue: 45750000,
    newTenants: 0,
    churn: 0,
  },
];

export const tenantDistribution: TenantDistribution[] = [
  {
    plan: 'Enterprise',
    count: 3,
    percentage: 20.0,
    revenue: 37500000,
  },
  {
    plan: 'Professional',
    count: 6,
    percentage: 40.0,
    revenue: 45000000,
  },
  {
    plan: 'Starter',
    count: 4,
    percentage: 26.7,
    revenue: 10000000,
  },
  {
    plan: 'Trial',
    count: 3,
    percentage: 20.0,
    revenue: 0,
  },
];

export const topTenants: TopTenant[] = [
  {
    rank: 1,
    tenantName: 'Labbaik Travel',
    subdomain: 'labbaik',
    plan: 'Enterprise',
    monthlyRevenue: 12500000,
    totalRevenue: 112500000,
    agents: 28,
    jamaah: 1380,
  },
  {
    rank: 2,
    tenantName: 'Al-Haramain Tours',
    subdomain: 'alharamain',
    plan: 'Enterprise',
    monthlyRevenue: 12500000,
    totalRevenue: 112500000,
    agents: 25,
    jamaah: 1250,
  },
  {
    rank: 3,
    tenantName: 'Elfa Travel',
    subdomain: 'elfa',
    plan: 'Enterprise',
    monthlyRevenue: 12500000,
    totalRevenue: 100000000,
    agents: 22,
    jamaah: 1100,
  },
  {
    rank: 4,
    tenantName: 'Global Haji Umroh',
    subdomain: 'globalhaji',
    plan: 'Professional',
    monthlyRevenue: 7500000,
    totalRevenue: 60000000,
    agents: 20,
    jamaah: 920,
  },
  {
    rank: 5,
    tenantName: 'Zam-Zam Tours',
    subdomain: 'zamzam',
    plan: 'Professional',
    monthlyRevenue: 7500000,
    totalRevenue: 48750000,
    agents: 19,
    jamaah: 890,
  },
  {
    rank: 6,
    tenantName: 'Arminareka Perdana',
    subdomain: 'arminareka',
    plan: 'Professional',
    monthlyRevenue: 7500000,
    totalRevenue: 48750000,
    agents: 18,
    jamaah: 850,
  },
  {
    rank: 7,
    tenantName: 'Kaaba Tours',
    subdomain: 'kaaba',
    plan: 'Professional',
    monthlyRevenue: 7500000,
    totalRevenue: 40000000,
    agents: 16,
    jamaah: 750,
  },
  {
    rank: 8,
    tenantName: 'Darul Hijrah',
    subdomain: 'darulhijrah',
    plan: 'Professional',
    monthlyRevenue: 7500000,
    totalRevenue: 40000000,
    agents: 15,
    jamaah: 680,
  },
  {
    rank: 9,
    tenantName: 'Barokah Travel',
    subdomain: 'barokah',
    plan: 'Starter',
    monthlyRevenue: 2500000,
    totalRevenue: 15000000,
    agents: 8,
    jamaah: 320,
  },
  {
    rank: 10,
    tenantName: 'Madinah Express',
    subdomain: 'madinah',
    plan: 'Starter',
    monthlyRevenue: 2500000,
    totalRevenue: 12500000,
    agents: 7,
    jamaah: 290,
  },
];

export const geographicDistribution: GeographicDistribution[] = [
  {
    province: 'DKI Jakarta',
    tenantCount: 5,
    totalJamaah: 3870,
    totalRevenue: 37500000,
  },
  {
    province: 'Jawa Barat',
    tenantCount: 3,
    totalJamaah: 2520,
    totalRevenue: 22500000,
  },
  {
    province: 'Jawa Timur',
    tenantCount: 2,
    totalJamaah: 1170,
    totalRevenue: 10000000,
  },
  {
    province: 'Jawa Tengah',
    tenantCount: 1,
    totalJamaah: 280,
    totalRevenue: 2500000,
  },
  {
    province: 'Sumatera Utara',
    tenantCount: 1,
    totalJamaah: 680,
    totalRevenue: 7500000,
  },
  {
    province: 'Sumatera Barat',
    tenantCount: 1,
    totalJamaah: 290,
    totalRevenue: 2500000,
  },
  {
    province: 'Banten',
    tenantCount: 1,
    totalJamaah: 62,
    totalRevenue: 0,
  },
  {
    province: 'DI Yogyakarta',
    tenantCount: 1,
    totalJamaah: 150,
    totalRevenue: 0,
  },
  {
    province: 'Kalimantan Timur',
    tenantCount: 1,
    totalJamaah: 78,
    totalRevenue: 0,
  },
];

export const featureAdoption: FeatureAdoption[] = [
  {
    feature: 'WhatsApp Business API',
    adopters: 8,
    percentage: 53.3,
    avgUsage: 1250,
  },
  {
    feature: 'Virtual Account Payment',
    adopters: 12,
    percentage: 80.0,
    avgUsage: 450,
  },
  {
    feature: 'SISKOPATUH Integration',
    adopters: 10,
    percentage: 66.7,
    avgUsage: 180,
  },
  {
    feature: 'OCR Document Intelligence',
    adopters: 6,
    percentage: 40.0,
    avgUsage: 95,
  },
  {
    feature: 'E-Signature',
    adopters: 5,
    percentage: 33.3,
    avgUsage: 65,
  },
  {
    feature: 'AI Chatbot',
    adopters: 3,
    percentage: 20.0,
    avgUsage: 42,
  },
];

export const cohortAnalysis: CohortData[] = [
  {
    signupMonth: 'Jan 2023',
    tenants: 2,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Feb 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Mar 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Apr 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'May 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Jul 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Aug 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Sep 2023',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 100,
  },
  {
    signupMonth: 'Jan 2024',
    tenants: 1,
    month1: 0,
    month2: 0,
    month3: 0,
    month6: 0,
    month12: 0,
  },
  {
    signupMonth: 'Apr 2024',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 100,
    month12: 0,
  },
  {
    signupMonth: 'Jun 2024',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 0,
    month12: 0,
  },
  {
    signupMonth: 'Jul 2024',
    tenants: 1,
    month1: 100,
    month2: 100,
    month3: 100,
    month6: 0,
    month12: 0,
  },
  {
    signupMonth: 'Nov 2024',
    tenants: 1,
    month1: 100,
    month2: 0,
    month3: 0,
    month6: 0,
    month12: 0,
  },
  {
    signupMonth: 'Dec 2024',
    tenants: 3,
    month1: 0,
    month2: 0,
    month3: 0,
    month6: 0,
    month12: 0,
  },
];

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export const revenueBreakdown: RevenueBreakdown[] = [
  {
    category: 'Subscription Revenue',
    amount: 45750000,
    percentage: 83.5,
  },
  {
    category: 'Feature Add-ons',
    amount: 7500000,
    percentage: 13.7,
  },
  {
    category: 'Professional Services',
    amount: 1500000,
    percentage: 2.8,
  },
];

export interface CustomerHealth {
  segment: string;
  tenants: number;
  healthScore: number;
  churnRisk: string;
}

export const customerHealth: CustomerHealth[] = [
  {
    segment: 'Champions',
    tenants: 5,
    healthScore: 95,
    churnRisk: 'Low',
  },
  {
    segment: 'Loyal',
    tenants: 4,
    healthScore: 82,
    churnRisk: 'Low',
  },
  {
    segment: 'At Risk',
    tenants: 2,
    healthScore: 45,
    churnRisk: 'High',
  },
  {
    segment: 'Trial',
    tenants: 3,
    healthScore: 60,
    churnRisk: 'Medium',
  },
  {
    segment: 'Churned',
    tenants: 1,
    healthScore: 0,
    churnRisk: 'Churned',
  },
];
