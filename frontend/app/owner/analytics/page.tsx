"use client"

import * as React from "react"
import { DollarSign, Users, TrendingUp, Target } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard, MiniStatCard } from "@/components/analytics/stat-card"
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
} from "@/components/analytics/charts"
import { PerformanceTable } from "@/components/analytics/performance-table"
import { ExportReport } from "@/components/analytics/export-report"
import {
  monthlyRevenueData,
  packageDistributionData,
  jamaahStatusData,
  revenueSummary,
  dashboardStats,
  agentPerformanceData,
} from "@/lib/data/mock-analytics"
import { formatCurrency, formatCompactCurrency, formatPercentage } from "@/lib/utils/currency"
import { toast } from "@/lib/utils/toast"

export default function AnalyticsPage() {
  return (
    <AppLayout
      notificationCount={5}
      breadcrumbs={[
        { label: "Dashboard", href: "/owner" },
        { label: "Analytics", isCurrentPage: true },
      ]}
    >
      <div className="space-y-32">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Analytics & Laporan
          </h1>
          <p className="mt-8 text-slate-600">
            Monitor performa bisnis dan pendapatan Anda
          </p>
        </div>

        {/* Quick Stats */}
        <section>
          <h2 className="text-xl font-display font-semibold text-slate-900 mb-16">
            Ringkasan Bulan Ini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <StatCard
              title="Total Pendapatan"
              value={formatCompactCurrency(dashboardStats.revenue.thisMonth)}
              icon={DollarSign}
              change={dashboardStats.revenue.change}
              changePeriod="vs bulan lalu"
              variant="primary"
            />
            <StatCard
              title="Total Jamaah"
              value={dashboardStats.totalJamaah}
              icon={Users}
              change={5.2}
              changePeriod="vs bulan lalu"
              variant="success"
            />
            <StatCard
              title="Tingkat Konversi"
              value={formatPercentage(dashboardStats.conversion.rate)}
              icon={TrendingUp}
              change={dashboardStats.conversion.change}
              changePeriod="vs bulan lalu"
              variant="default"
            />
            <StatCard
              title="Pencapaian Target"
              value={formatPercentage(revenueSummary.targetAchievement, 0)}
              icon={Target}
              change={6.0}
              changePeriod="vs bulan lalu"
              variant="success"
            />
          </div>
        </section>

        {/* Revenue Chart */}
        <section>
          <LineChartComponent
            title="Pendapatan Bulanan"
            data={monthlyRevenueData}
            lines={[
              {
                dataKey: "pendapatan",
                name: "Pendapatan",
                color: "#2563eb",
              },
              {
                dataKey: "target",
                name: "Target",
                color: "#94a3b8",
              },
            ]}
            height={350}
          />
        </section>

        {/* Distribution Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <PieChartComponent
            title="Distribusi Paket"
            data={packageDistributionData}
            height={300}
            innerRadius={60}
          />
          <BarChartComponent
            title="Status Jamaah"
            data={jamaahStatusData}
            bars={[
              {
                dataKey: "jumlah",
                name: "Jumlah Jamaah",
                color: "#2563eb",
              },
            ]}
            height={300}
          />
        </section>

        {/* Revenue Details */}
        <section>
          <h2 className="text-xl font-display font-semibold text-slate-900 mb-16">
            Detail Pendapatan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <MiniStatCard
              title="Pendapatan Total"
              value={formatCompactCurrency(revenueSummary.totalRevenue)}
              icon={DollarSign}
              variant="primary"
            />
            <MiniStatCard
              title="Rata-rata per Jamaah"
              value={formatCompactCurrency(revenueSummary.averagePerJamaah)}
              icon={Users}
              change={-2.1}
              variant="default"
            />
            <MiniStatCard
              title="Pertumbuhan"
              value={formatPercentage(revenueSummary.growth)}
              icon={TrendingUp}
              change={12.5}
              variant="success"
            />
          </div>
        </section>

        {/* Agent Performance */}
        <section>
          <h2 className="text-xl font-display font-semibold text-slate-900 mb-16">
            Performa Agen
          </h2>
          <PerformanceTable
            data={agentPerformanceData}
            onViewDetails={(agent) => {
              toast.info(`Melihat detail ${agent.name}`)
            }}
          />
        </section>

        {/* Export Report */}
        <section>
          <ExportReport />
        </section>
      </div>
    </AppLayout>
  )
}
