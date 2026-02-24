'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Users,
  UserPlus,
  Download,
  FileText,
  MapPin,
  Award,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  platformKPIs,
  growthMetrics,
  tenantDistribution,
  topTenants,
  geographicDistribution,
  featureAdoption,
  cohortAnalysis,
  revenueBreakdown,
  customerHealth,
} from '@/lib/data/mock-super-admin-analytics';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 12 Months');

  const handleExportPDF = () => {
    toast.success('Exporting analytics to PDF...');
  };

  const handleExportExcel = () => {
    toast.success('Exporting analytics to Excel...');
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'Professional':
        return 'bg-blue-100 text-blue-800';
      case 'Starter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (churnRisk: string) => {
    switch (churnRisk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Churned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRetentionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Super Admin', href: '/super-admin' },
        { label: 'Platform Analytics' },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Platform Analytics
            </h1>
            <p className="text-gray-600 mt-8">
              Executive dashboard dan business intelligence
            </p>
          </div>
          <div className="flex gap-12">
            <Button variant="outline" onClick={handleExportPDF} className="h-[40px]">
              <FileText className="h-[16px] w-[16px] mr-8" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel} className="h-[40px]">
              <Download className="h-[16px] w-[16px] mr-8" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {(platformKPIs.totalRevenue / 1000000).toFixed(0)}M
              </div>
              <p className="text-xs text-gray-600 mt-4">All time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <TrendingUp className="h-[16px] w-[16px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rp {(platformKPIs.mrr / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-green-600 mt-4">+8.5% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingUp className="h-[16px] w-[16px] text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {platformKPIs.churnRate}%
              </div>
              <p className="text-xs text-gray-600 mt-4">Monthly churn rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">ARPT</CardTitle>
              <DollarSign className="h-[16px] w-[16px] text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {(platformKPIs.arpt / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-600 mt-4">Average Revenue Per Tenant</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-[16px] w-[16px] text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformKPIs.totalAgents}</div>
              <p className="text-xs text-gray-600 mt-4">Across all tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Total Jamaah</CardTitle>
              <UserPlus className="h-[16px] w-[16px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformKPIs.totalJamaah.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-gray-600 mt-4">Platform-wide jamaah</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <p className="text-sm text-gray-600">Revenue and tenant growth - last 12 months</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-16">
              {/* Simple chart representation */}
              {growthMetrics.map((metric) => (
                <div key={metric.month} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium w-[100px]">{metric.month}</span>
                    <div className="flex-1 flex items-center gap-16">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-4">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-medium">
                            Rp {(metric.revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <Progress
                          value={(metric.revenue / 50000000) * 100}
                          className="h-[8px]"
                        />
                      </div>
                      <div className="flex items-center gap-12 text-xs w-[200px]">
                        <div className="flex items-center gap-4">
                          <div className="h-[8px] w-[8px] rounded-full bg-green-600"></div>
                          <span className="text-green-600">+{metric.newTenants} new</span>
                        </div>
                        {metric.churn > 0 && (
                          <div className="flex items-center gap-4">
                            <div className="h-[8px] w-[8px] rounded-full bg-red-600"></div>
                            <span className="text-red-600">-{metric.churn} churn</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tenant Distribution & Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Distribution by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {tenantDistribution.map((dist) => (
                  <div key={dist.plan} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <Badge className={getPlanColor(dist.plan)}>{dist.plan}</Badge>
                        <span className="text-sm text-gray-600">
                          {dist.count} tenants
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        Rp {(dist.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress value={dist.percentage} className="h-[8px]" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{dist.percentage.toFixed(1)}% of tenants</span>
                      <span>
                        {((dist.revenue / platformKPIs.mrr) * 100).toFixed(1)}% of MRR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {revenueBreakdown.map((item) => (
                  <div key={item.category} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm font-bold">
                        Rp {(item.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-[8px]" />
                    <p className="text-xs text-gray-600">{item.percentage.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Tenants */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-12">
              <Award className="h-[20px] w-[20px] text-amber-600" />
              <CardTitle>Top 10 Tenants by Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Tenant Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Monthly Revenue</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Agents</TableHead>
                    <TableHead className="text-right">Jamaah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTenants.map((tenant) => (
                    <TableRow key={tenant.rank}>
                      <TableCell>
                        <div className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-gray-100 font-bold">
                          #{tenant.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tenant.tenantName}</p>
                          <p className="text-xs text-gray-600">{tenant.subdomain}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {(tenant.monthlyRevenue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {(tenant.totalRevenue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell className="text-right">{tenant.agents}</TableCell>
                      <TableCell className="text-right">{tenant.jamaah}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-12">
              <MapPin className="h-[20px] w-[20px] text-blue-600" />
              <CardTitle>Geographic Distribution</CardTitle>
            </div>
            <p className="text-sm text-gray-600">Provinces with most tenants</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-12">
              {geographicDistribution.map((geo, index) => (
                <div key={geo.province} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-12">
                      <span className="text-sm font-bold text-gray-400 w-[24px]">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{geo.province}</p>
                        <p className="text-xs text-gray-600">
                          {geo.tenantCount} tenants • {geo.totalJamaah.toLocaleString()} jamaah
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        Rp {(geo.totalRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={
                      (geo.tenantCount /
                        Math.max(...geographicDistribution.map((g) => g.tenantCount))) *
                      100
                    }
                    className="h-[6px]"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Adoption & Customer Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-12">
                <BarChart3 className="h-[20px] w-[20px] text-purple-600" />
                <CardTitle>Feature Adoption Rates</CardTitle>
              </div>
              <p className="text-sm text-gray-600">% of tenants using each feature</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {featureAdoption.map((feature) => (
                  <div key={feature.feature} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feature.feature}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">
                          {feature.percentage.toFixed(1)}%
                        </span>
                        <p className="text-xs text-gray-600">
                          {feature.adopters} tenants
                        </p>
                      </div>
                    </div>
                    <Progress value={feature.percentage} className="h-[8px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Health</CardTitle>
              <p className="text-sm text-gray-600">Segmentation by health score</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-16">
                {customerHealth.map((segment) => (
                  <div key={segment.segment} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{segment.segment}</p>
                        <p className="text-xs text-gray-600">
                          {segment.tenants} tenants
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getHealthColor(segment.churnRisk)}>
                          {segment.churnRisk} Risk
                        </Badge>
                        <p className="text-xs text-gray-600 mt-4">
                          Score: {segment.healthScore}
                        </p>
                      </div>
                    </div>
                    <Progress value={segment.healthScore} className="h-[8px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cohort Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-12">
              <Calendar className="h-[20px] w-[20px] text-green-600" />
              <CardTitle>Cohort Analysis</CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              Retention rates by signup month (%)
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signup Month</TableHead>
                    <TableHead className="text-right">Tenants</TableHead>
                    <TableHead className="text-right">Month 1</TableHead>
                    <TableHead className="text-right">Month 2</TableHead>
                    <TableHead className="text-right">Month 3</TableHead>
                    <TableHead className="text-right">Month 6</TableHead>
                    <TableHead className="text-right">Month 12</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohortAnalysis.map((cohort) => (
                    <TableRow key={cohort.signupMonth}>
                      <TableCell className="font-medium">
                        {cohort.signupMonth}
                      </TableCell>
                      <TableCell className="text-right">{cohort.tenants}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${getRetentionColor(
                          cohort.month1
                        )}`}
                      >
                        {cohort.month1 > 0 ? `${cohort.month1}%` : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getRetentionColor(
                          cohort.month2
                        )}`}
                      >
                        {cohort.month2 > 0 ? `${cohort.month2}%` : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getRetentionColor(
                          cohort.month3
                        )}`}
                      >
                        {cohort.month3 > 0 ? `${cohort.month3}%` : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getRetentionColor(
                          cohort.month6
                        )}`}
                      >
                        {cohort.month6 > 0 ? `${cohort.month6}%` : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getRetentionColor(
                          cohort.month12
                        )}`}
                      >
                        {cohort.month12 > 0 ? `${cohort.month12}%` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
