"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  CheckCircle2
} from "lucide-react"
import {
  reportTemplates,
  reportDataSamples,
  ReportData
} from "@/lib/data/mock-owner-reports"
import { toast } from "sonner"

type ReportCategory = 'revenue' | 'sales' | 'commission' | 'documents' | 'operational'
type DateRange = 'this-month' | 'last-month' | 'last-quarter' | 'custom'

export default function OwnerReportsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<ReportCategory>('revenue')
  const [dateRange, setDateRange] = React.useState<DateRange>('this-month')
  const [currentReport, setCurrentReport] = React.useState<ReportData>(reportDataSamples.revenue)

  React.useEffect(() => {
    setCurrentReport(reportDataSamples[selectedCategory])
  }, [selectedCategory])

  const handleExportPDF = () => {
    toast.success("Export PDF berhasil", {
      description: `Laporan ${currentReport.title} siap diunduh`
    })
  }

  const handleExportExcel = () => {
    toast.success("Export Excel berhasil", {
      description: `Laporan ${currentReport.title} dalam format .xlsx siap diunduh`
    })
  }

  const handleScheduleReport = () => {
    toast.info("Scheduled Reports", {
      description: "Fitur ini akan segera tersedia"
    })
  }

  const categoryTemplates = reportTemplates.filter(t => t.category === selectedCategory)

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'this-month': return 'Bulan Ini (Des 2024)'
      case 'last-month': return 'Bulan Lalu (Nov 2024)'
      case 'last-quarter': return 'Kuartal Lalu (Q3 2024)'
      case 'custom': return 'Custom Range'
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Owner Dashboard', href: '/owner/dashboard' },
        { label: 'Reports', href: '/owner/reports' },
      ]}
      userName="Haji Abdullah Rahman"
      userRole="Agency Owner"
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Business Intelligence Reports
        </h1>
        <p className="text-slate-600">
          Generate dan analisa berbagai laporan bisnis untuk decision making
        </p>
      </div>

      {/* Report Type & Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <Card>
          <CardContent className="pt-24">
            <label className="text-sm font-medium text-slate-700 mb-12 block">
              Tipe Laporan
            </label>
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ReportCategory)}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="commission">Komisi</TabsTrigger>
                <TabsTrigger value="documents">Dokumen</TabsTrigger>
                <TabsTrigger value="operational">Ops</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-24">
            <label className="text-sm font-medium text-slate-700 mb-12 block">
              Periode Laporan
            </label>
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger className="h-[40px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">Bulan Ini</SelectItem>
                <SelectItem value="last-month">Bulan Lalu</SelectItem>
                <SelectItem value="last-quarter">Kuartal Lalu</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="mb-24">
        <CardHeader>
          <CardTitle>Report Templates ({categoryTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {categoryTemplates.map((template) => (
              <div
                key={template.id}
                className="p-16 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-12">
                  <FileText className="h-[20px] w-[20px] text-blue-600" />
                  {template.lastGenerated && (
                    <span className="text-xs text-slate-500">
                      Last: {new Date(template.lastGenerated).toLocaleDateString('id-ID')}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-8">{template.name}</h3>
                <p className="text-sm text-slate-600">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Report */}
      <Card className="mb-24">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{currentReport.title}</CardTitle>
              <div className="flex items-center gap-12 mt-8">
                <Calendar className="h-[14px] w-[14px] text-slate-400" />
                <span className="text-sm text-slate-600">{getDateRangeLabel()}</span>
              </div>
            </div>
            <div className="flex gap-12">
              <Button variant="outline" onClick={handleExportExcel} className="h-[32px]">
                <Download className="h-[14px] w-[14px] mr-6" />
                Excel
              </Button>
              <Button onClick={handleExportPDF} className="h-[32px]">
                <Download className="h-[14px] w-[14px] mr-6" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-24">
          {/* Summary */}
          <div className="p-16 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-4">Executive Summary</p>
            <p className="text-blue-800">{currentReport.summary}</p>
          </div>

          {/* Key Metrics */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-16">Key Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
              {currentReport.metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-16">
                    <p className="text-sm text-slate-600 mb-8">{metric.label}</p>
                    <p className="text-xl font-bold text-slate-900 mb-8">
                      {metric.value}
                    </p>
                    {metric.change !== undefined && metric.trend && (
                      <div className="flex items-center gap-6">
                        {metric.trend === 'up' ? (
                          <>
                            <ArrowUpRight className="h-[14px] w-[14px] text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              +{metric.change}%
                            </span>
                          </>
                        ) : metric.trend === 'down' ? (
                          <>
                            <ArrowDownRight className="h-[14px] w-[14px] text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              {metric.change}%
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-500">Stabil</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chart/Visualization */}
          {currentReport.chartData && currentReport.chartData.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-16">Visualization</h3>
              <div className="p-24 bg-slate-50 rounded-lg">
                <div className="space-y-12">
                  {currentReport.chartData.map((item: any, index: number) => {
                    const maxValue = Math.max(
                      ...currentReport.chartData!.map((d: any) =>
                        d.revenue || d.count || d.value || 0
                      )
                    )
                    const value = item.revenue || item.count || item.value || 0
                    const percentage = (value / maxValue) * 100

                    return (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 font-medium">
                            {item.name || item.stage || item.label}
                          </span>
                          <span className="text-slate-900 font-semibold">
                            {typeof value === 'number' && value >= 1000000
                              ? `Rp ${(value / 1000000).toFixed(0)}jt`
                              : value}
                          </span>
                        </div>
                        <div className="h-[10px] bg-white rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div>
            <div className="flex items-center gap-8 mb-16">
              <Lightbulb className="h-[20px] w-[20px] text-amber-600" />
              <h3 className="font-semibold text-slate-900">Key Insights</h3>
            </div>
            <div className="space-y-12">
              {currentReport.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-12 p-12 bg-amber-50 rounded-lg border border-amber-200">
                  <CheckCircle2 className="h-[16px] w-[16px] text-amber-600 mt-2 flex-shrink-0" />
                  <p className="text-sm text-amber-900">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-12">
            <Button onClick={handleExportPDF} className="h-[40px]">
              <Download className="h-[16px] w-[16px] mr-8" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel} className="h-[40px]">
              <Download className="h-[16px] w-[16px] mr-8" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={handleScheduleReport} className="h-[40px]">
              <Calendar className="h-[16px] w-[16px] mr-8" />
              Schedule Report
              <Badge variant="secondary" className="ml-8">Coming Soon</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
