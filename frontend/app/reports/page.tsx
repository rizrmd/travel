"use client"

import { useState } from "react"
import { FileText, Download, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  ReportType,
  mockRevenueReport,
  mockDocumentReport,
  mockPaymentReport,
  mockAgentReport,
} from "@/lib/data/mock-reports"
import { toast } from "sonner"

const reports = {
  revenue: mockRevenueReport,
  documents: mockDocumentReport,
  payments: mockPaymentReport,
  agents: mockAgentReport,
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('revenue')
  const [dateFrom, setDateFrom] = useState('2025-01-01')
  const [dateTo, setDateTo] = useState('2025-12-31')

  const currentReport = reports[reportType]

  const handleNotificationClick = () => console.log('Navigate to /notifications')
  const handleProfileClick = () => console.log('Navigate to /profile')
  const handleSettingsClick = () => toast.info('Navigasi ke Settings')
  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  const handleExportPDF = () => {
    toast.success('Export ke PDF berhasil')
  }

  const handleExportExcel = () => {
    toast.success('Export ke Excel berhasil')
  }

  const reportTitles = {
    revenue: 'Laporan Pendapatan',
    documents: 'Laporan Kelengkapan Dokumen',
    payments: 'Laporan Pembayaran',
    agents: 'Laporan Performa Agent',
  }

  return (
    <AppLayout
      userName="Mbak Rina"
      userRole="Admin Travel"
      notificationCount={3}
      breadcrumbs={[
        { label: "Reports", href: "/reports", isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="mt-8 text-slate-600">
            Analisis performa bisnis umroh Anda
          </p>
        </div>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Konfigurasi Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
              <div>
                <Label htmlFor="reportType">Jenis Laporan</Label>
                <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                  <SelectTrigger id="reportType" className="mt-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Laporan Pendapatan</SelectItem>
                    <SelectItem value="documents">Laporan Dokumen</SelectItem>
                    <SelectItem value="payments">Laporan Pembayaran</SelectItem>
                    <SelectItem value="agents">Laporan Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateFrom">Dari Tanggal</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-8"
                />
              </div>

              <div>
                <Label htmlFor="dateTo">Sampai Tanggal</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-8"
                />
              </div>

              <div className="flex items-end">
                <Button className="w-full h-[40px]">
                  <FileText className="h-[16px] w-[16px] mr-8" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {reportTitles[reportType]}
          </h2>
          <div className="flex gap-8">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-[16px] w-[16px] mr-8" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-[16px] w-[16px] mr-8" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {currentReport.summary.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-8">
                <CardTitle className="text-sm font-medium text-slate-600">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                {item.change && (
                  <div className="flex items-center gap-4 mt-4">
                    {item.trend === 'up' && <TrendingUp className="h-[16px] w-[16px] text-green-600" />}
                    {item.trend === 'down' && <TrendingDown className="h-[16px] w-[16px] text-red-600" />}
                    {item.trend === 'neutral' && <Minus className="h-[16px] w-[16px] text-slate-600" />}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        item.trend === 'up' && 'text-green-600',
                        item.trend === 'down' && 'text-red-600',
                        item.trend === 'neutral' && 'text-slate-600'
                      )}
                    >
                      {item.change}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Chart Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-8">
              {currentReport.chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-8">
                  <div className="w-full bg-blue-600 rounded-t-lg" style={{ height: `${(item.value / Math.max(...currentReport.chartData.map(d => d.value))) * 250}px` }}></div>
                  <div className="text-sm font-medium text-slate-600">{item.month}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {reportType === 'revenue' && (
                      <>
                        <TableHead>Paket</TableHead>
                        <TableHead className="text-right">Terjual</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </>
                    )}
                    {reportType === 'documents' && (
                      <>
                        <TableHead>Tipe Dokumen</TableHead>
                        <TableHead className="text-right">Lengkap</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead className="text-right">Belum Upload</TableHead>
                      </>
                    )}
                    {reportType === 'payments' && (
                      <>
                        <TableHead>Bulan</TableHead>
                        <TableHead className="text-right">Terkumpul</TableHead>
                        <TableHead className="text-right">Target</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                      </>
                    )}
                    {reportType === 'agents' && (
                      <>
                        <TableHead>Agent</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead className="text-right">Jamaah</TableHead>
                        <TableHead className="text-right">Komisi</TableHead>
                        <TableHead className="text-right">Conversion</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReport.tableData.map((row: any, index) => (
                    <TableRow key={index}>
                      {reportType === 'revenue' && (
                        <>
                          <TableCell className="font-medium">{row.package}</TableCell>
                          <TableCell className="text-right">{row.sold}</TableCell>
                          <TableCell className="text-right font-medium text-green-700">
                            Rp {row.revenue.toLocaleString('id-ID')}
                          </TableCell>
                        </>
                      )}
                      {reportType === 'documents' && (
                        <>
                          <TableCell className="font-medium">{row.type}</TableCell>
                          <TableCell className="text-right text-green-700">{row.complete}</TableCell>
                          <TableCell className="text-right text-yellow-700">{row.pending}</TableCell>
                          <TableCell className="text-right text-red-700">{row.incomplete}</TableCell>
                        </>
                      )}
                      {reportType === 'payments' && (
                        <>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell className="text-right">Rp {row.collected.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right">Rp {row.target.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right font-medium text-green-700">{row.rate}%</TableCell>
                        </>
                      )}
                      {reportType === 'agents' && (
                        <>
                          <TableCell className="font-medium">{row.agent}</TableCell>
                          <TableCell>{row.tier}</TableCell>
                          <TableCell className="text-right">{row.jamaah}</TableCell>
                          <TableCell className="text-right">Rp {row.commission.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right font-medium text-green-700">{row.rate}%</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
