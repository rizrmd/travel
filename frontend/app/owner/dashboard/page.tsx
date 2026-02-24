"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"
import { ownerMenuItems } from "@/lib/navigation/menu-items"
import {
  revenueKPIs,
  monthlyRevenue,
  topPackages,
  agentRevenues,
  formatCurrency
} from "@/lib/data/mock-owner-revenue"
import { toast } from "sonner"

export default function OwnerDashboardPage() {
  const handleExportReport = () => {
    toast.success("Laporan berhasil diekspor", {
      description: "File revenue-report-december-2024.pdf siap diunduh"
    })
  }

  const handleViewDetails = () => {
    toast.info("Fitur detail analytics", {
      description: "Akan menampilkan drill-down data revenue"
    })
  }

  const handleGenerateForecast = () => {
    toast.info("Generate Forecast", {
      description: "Forecasting akan tersedia segera"
    })
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Owner Dashboard', href: '/owner/dashboard' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Revenue Intelligence Dashboard
        </h1>
        <p className="text-slate-600">
          Monitor performa revenue dan business metrics secara real-time
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mb-32">
        {revenueKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-24">
              <div className="flex items-start justify-between mb-12">
                <div>
                  <p className="text-sm text-slate-600 mb-4">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                </div>
                <div className={`p-8 rounded-lg ${
                  kpi.trend === 'up' ? 'bg-green-50' :
                  kpi.trend === 'down' ? 'bg-red-50' : 'bg-slate-50'
                }`}>
                  {index === 0 && <DollarSign className="h-[20px] w-[20px] text-green-600" />}
                  {index === 1 && <TrendingUp className="h-[20px] w-[20px] text-green-600" />}
                  {index === 2 && <BarChart3 className="h-[20px] w-[20px] text-blue-600" />}
                  {index === 3 && <Users className="h-[20px] w-[20px] text-purple-600" />}
                  {index === 4 && <Users className="h-[20px] w-[20px] text-slate-600" />}
                  {index === 5 && <Package className="h-[20px] w-[20px] text-amber-600" />}
                </div>
              </div>
              <div className="flex items-center gap-8">
                {kpi.trend === 'up' && (
                  <>
                    <ArrowUpRight className="h-[16px] w-[16px] text-green-600" />
                    <span className="text-sm text-green-600 font-medium">+{kpi.change}%</span>
                  </>
                )}
                {kpi.trend === 'down' && (
                  <>
                    <ArrowDownRight className="h-[16px] w-[16px] text-red-600" />
                    <span className="text-sm text-red-600 font-medium">{kpi.change}%</span>
                  </>
                )}
                {kpi.trend === 'stable' && (
                  <>
                    <Minus className="h-[16px] w-[16px] text-slate-600" />
                    <span className="text-sm text-slate-600 font-medium">Stabil</span>
                  </>
                )}
                <span className="text-sm text-slate-500">vs bulan lalu</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="mb-24">
        <CardHeader>
          <CardTitle>Revenue Trend (12 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simple bar chart visualization */}
          <div className="space-y-12">
            {monthlyRevenue.map((item, index) => {
              const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))
              const percentage = (item.revenue / maxRevenue) * 100

              return (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 w-[40px]">{item.month}</span>
                    <span className="text-slate-900 font-medium flex-1 text-right">
                      {formatCurrency(item.revenue)}
                    </span>
                    <span className="text-slate-500 text-xs ml-8 w-[60px] text-right">
                      {item.orders} order
                    </span>
                  </div>
                  <div className="h-[8px] bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
        {/* Top Performing Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paket</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{pkg.name}</p>
                        <p className="text-sm text-slate-500">{pkg.bookings} bookings</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(pkg.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={pkg.growth >= 0 ? "default" : "destructive"}>
                        {pkg.growth >= 0 ? '+' : ''}{pkg.growth}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue by Agent */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Agent (Top 8)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-16">
              {agentRevenues.map((agent, index) => {
                const maxRevenue = Math.max(...agentRevenues.map(a => a.revenue))
                const percentage = (agent.revenue / maxRevenue) * 100

                return (
                  <div key={agent.id} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <span className="text-sm font-medium text-slate-500 w-[24px]">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{agent.name}</p>
                          <p className="text-sm text-slate-500">
                            {agent.jamaahCount} jamaah • {agent.tier}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(agent.revenue)}
                      </p>
                    </div>
                    <div className="h-[6px] bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          agent.tier === 'Platinum' ? 'bg-purple-500' :
                          agent.tier === 'Gold' ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-12">
            <Button onClick={handleExportReport} className="h-[40px]">
              <Download className="h-[16px] w-[16px] mr-8" />
              Export Report
            </Button>
            <Button variant="outline" onClick={handleViewDetails} className="h-[40px]">
              <BarChart3 className="h-[16px] w-[16px] mr-8" />
              View Details
            </Button>
            <Button variant="outline" onClick={handleGenerateForecast} className="h-[40px]">
              <TrendingUp className="h-[16px] w-[16px] mr-8" />
              Generate Forecast
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
