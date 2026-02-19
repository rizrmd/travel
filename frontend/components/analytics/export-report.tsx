"use client"

import * as React from "react"
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/lib/utils/toast"
import { cn } from "@/lib/utils"

type ExportFormat = "pdf" | "excel" | "csv"
type ReportType = "revenue" | "jamaah" | "agent" | "complete"

interface ExportReportProps {
  className?: string
}

export function ExportReport({ className }: ExportReportProps) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>("pdf")
  const [selectedReport, setSelectedReport] = React.useState<ReportType>("complete")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Mohon pilih periode laporan")
      return
    }

    setIsExporting(true)

    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsExporting(false)
    toast.success(`Laporan ${getReportName(selectedReport)} berhasil di-export sebagai ${selectedFormat.toUpperCase()}`)
  }

  const getReportName = (type: ReportType) => {
    switch (type) {
      case "revenue":
        return "Pendapatan"
      case "jamaah":
        return "Jamaah"
      case "agent":
        return "Performa Agen"
      case "complete":
        return "Lengkap"
      default:
        return ""
    }
  }

  const formatOptions = [
    {
      value: "pdf" as ExportFormat,
      label: "PDF",
      icon: FileText,
      description: "Dokumen PDF untuk print",
    },
    {
      value: "excel" as ExportFormat,
      label: "Excel",
      icon: FileSpreadsheet,
      description: "Spreadsheet untuk analisis",
    },
    {
      value: "csv" as ExportFormat,
      label: "CSV",
      icon: FileText,
      description: "Data mentah untuk import",
    },
  ]

  return (
    <Card className={cn("p-24", className)}>
      <div className="space-y-24">
        {/* Header */}
        <div>
          <h3 className="text-lg font-display font-semibold text-slate-900 mb-8">
            Export Laporan
          </h3>
          <p className="text-body-sm text-slate-600">
            Unduh laporan dalam berbagai format untuk analisis lebih lanjut
          </p>
        </div>

        {/* Report Type Selection */}
        <div className="space-y-8">
          <label className="text-body-sm font-medium text-slate-900">
            Jenis Laporan
          </label>
          <Select
            value={selectedReport}
            onValueChange={(value) => setSelectedReport(value as ReportType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Laporan Lengkap</SelectItem>
              <SelectItem value="revenue">Laporan Pendapatan</SelectItem>
              <SelectItem value="jamaah">Laporan Jamaah</SelectItem>
              <SelectItem value="agent">Laporan Performa Agen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <label className="text-body-sm font-medium text-slate-900">
              Tanggal Mulai <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex h-40 w-full rounded-md border border-input bg-background px-12 py-8 text-body ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="space-y-8">
            <label className="text-body-sm font-medium text-slate-900">
              Tanggal Selesai <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex h-40 w-full rounded-md border border-input bg-background px-12 py-8 text-body ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-8">
          <label className="text-body-sm font-medium text-slate-900">
            Format Export
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {formatOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedFormat === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedFormat(option.value)}
                  className={cn(
                    "flex items-start gap-12 p-16 rounded-lg border-2 transition-all text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "h-40 w-40 rounded-lg flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-primary" : "bg-slate-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-20 w-20",
                        isSelected ? "text-white" : "text-slate-600"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-body-sm font-medium",
                        isSelected ? "text-primary" : "text-slate-900"
                      )}
                    >
                      {option.label}
                    </p>
                    <p className="text-caption text-slate-600 mt-4">
                      {option.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          <Download className="h-20 w-20 mr-8" />
          {isExporting ? "Meng-export..." : `Export sebagai ${selectedFormat.toUpperCase()}`}
        </Button>
      </div>
    </Card>
  )
}
