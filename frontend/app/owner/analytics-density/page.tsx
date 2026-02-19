"use client"

import * as React from "react"
import { DollarSign, Users, TrendingUp, Target } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { DensityStatCard } from "@/components/density/density-card"
import { DensityGrid, DensitySection } from "@/components/density/density-list"
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
} from "@/components/analytics/charts"
import {
  DensityTable,
  DensityTableHeader,
  DensityTableBody,
  DensityTableRow,
  DensityTableHead,
  DensityTableCell,
} from "@/components/density/density-table"
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AnalyticsDensityPage() {
  return (
    <AppLayout
      userName="Owner Travel"
      userRole="Pemilik Usaha"
      notificationCount={5}
      breadcrumbs={[
        { label: "Dashboard", href: "/owner" },
        { label: "Analytics (Density Mode)", isCurrentPage: true },
      ]}
    >
      <DensitySection title="Analytics & Laporan" className="space-y-32">
        <p className="text-slate-600">
          Monitor performa bisnis dan pendapatan Anda dengan density mode
        </p>

        {/* Quick Stats */}
        <DensitySection title="Ringkasan Bulan Ini">
          <DensityGrid cols={4}>
            <DensityStatCard
              title="Total Pendapatan"
              value={formatCompactCurrency(dashboardStats.revenue.thisMonth)}
              icon={DollarSign}
              change={dashboardStats.revenue.change}
            />
            <DensityStatCard
              title="Total Jamaah"
              value={dashboardStats.totalJamaah}
              icon={Users}
              change={5.2}
            />
            <DensityStatCard
              title="Tingkat Konversi"
              value={formatPercentage(dashboardStats.conversion.rate)}
              icon={TrendingUp}
              change={dashboardStats.conversion.change}
            />
            <DensityStatCard
              title="Pencapaian Target"
              value={formatPercentage(revenueSummary.targetAchievement, 0)}
              icon={Target}
              change={6.0}
            />
          </DensityGrid>
        </DensitySection>

        {/* Revenue Chart */}
        <DensitySection title="Pendapatan Bulanan">
          <LineChartComponent
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
        </DensitySection>

        {/* Distribution Charts */}
        <DensityGrid cols={2}>
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
        </DensityGrid>

        {/* Agent Performance Table with Density */}
        <DensitySection title="Performa Agen">
          <DensityTable>
            <DensityTableHeader>
              <DensityTableRow>
                <DensityTableHead>Nama Agen</DensityTableHead>
                <DensityTableHead>Total Jamaah</DensityTableHead>
                <DensityTableHead>Pendapatan</DensityTableHead>
                <DensityTableHead>Konversi</DensityTableHead>
                <DensityTableHead>Waktu Respon</DensityTableHead>
              </DensityTableRow>
            </DensityTableHeader>
            <DensityTableBody>
              {agentPerformanceData.map((agent) => (
                <DensityTableRow key={agent.id}>
                  <DensityTableCell>
                    <div>
                      <p className="font-medium text-slate-900">{agent.name}</p>
                      <p className="text-body-sm text-slate-600">{agent.email}</p>
                    </div>
                  </DensityTableCell>
                  <DensityTableCell>
                    <div>
                      <p className="font-medium text-slate-900">{agent.totalJamaah}</p>
                      <p className="text-body-sm text-slate-600">
                        {agent.completedJamaah} selesai
                      </p>
                    </div>
                  </DensityTableCell>
                  <DensityTableCell>
                    <p className="font-medium text-slate-900">
                      {formatCurrency(agent.revenue)}
                    </p>
                  </DensityTableCell>
                  <DensityTableCell>
                    <Badge
                      variant={agent.conversionRate >= 75 ? "default" : "secondary"}
                      className={cn(
                        agent.conversionRate >= 75 && "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      {formatPercentage(agent.conversionRate)}
                    </Badge>
                  </DensityTableCell>
                  <DensityTableCell>
                    <p className="text-body-sm text-slate-600">
                      {agent.avgResponseTime}
                    </p>
                  </DensityTableCell>
                </DensityTableRow>
              ))}
            </DensityTableBody>
          </DensityTable>
        </DensitySection>

        {/* Export Report */}
        <DensitySection title="Export Laporan">
          <ExportReport />
        </DensitySection>
      </DensitySection>
    </AppLayout>
  )
}
