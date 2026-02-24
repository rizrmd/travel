"use client"

import { useMemo, useState } from "react"
import { Search, Plus, Download, DollarSign, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  mockPayments,
  getPaymentStats,
  PaymentStatus,
  PaymentMethod,
  paymentMethodLabels,
  Payment,
} from "@/lib/data/mock-payments"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { mockJamaah } from "@/lib/data/mock-jamaah"
import { toast } from "sonner"

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = {
    lunas: { label: 'Lunas', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    cicilan: { label: 'Cicilan', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    nunggak: { label: 'Nunggak', className: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  }

  const { label, className, icon: Icon } = config[status]

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      <Icon className="mr-[4px] h-[12px] w-[12px]" />
      {label}
    </Badge>
  )
}

function isOverdue(payment: Payment): boolean {
  if (payment.status === 'lunas') return false
  return new Date(payment.dueDate) < new Date()
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedJamaahId, setSelectedJamaahId] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentNotes, setPaymentNotes] = useState("")

  const stats = useMemo(() => getPaymentStats(), [])

  const filteredPayments = useMemo(() => {
    let result = mockPayments

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.jamaahName.toLowerCase().includes(query) ||
          p.package.toLowerCase().includes(query)
      )
    }

    return result
  }, [statusFilter, searchQuery])

  const handleNotificationClick = () => {
    console.log('Navigate to /notifications')
  }

  const handleProfileClick = () => {
    console.log('Navigate to /profile')
  }

  const handleSettingsClick = () => {
    toast.info('Navigasi ke Settings')
  }

  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  const handleAddPayment = () => {
    setIsPaymentModalOpen(true)
    setSelectedJamaahId("")
    setPaymentAmount("")
    setPaymentMethod('transfer')
    setPaymentDate(new Date().toISOString().split('T')[0])
    setPaymentNotes("")
  }

  const handleSubmitPayment = () => {
    if (!selectedJamaahId || !paymentAmount) {
      toast.error('Mohon lengkapi jamaah dan jumlah pembayaran')
      return
    }

    const jamaah = mockJamaah.find(j => j.id === selectedJamaahId)
    console.log('Record payment:', {
      jamaahId: selectedJamaahId,
      amount: paymentAmount,
      method: paymentMethod,
      date: paymentDate,
      notes: paymentNotes,
    })

    toast.success(`Pembayaran ${formatCurrency(parseInt(paymentAmount))} dari ${jamaah?.name} berhasil dicatat`)
    setIsPaymentModalOpen(false)
  }

  const handleExportCSV = () => {
    const headers = ['Nama Jamaah', 'Paket', 'Total', 'Terbayar', 'Sisa', 'Status', 'Jatuh Tempo']
    const csvData = filteredPayments.map(p => [
      p.jamaahName,
      p.package,
      p.totalAmount,
      p.paidAmount,
      p.remaining,
      p.status === 'lunas' ? 'Lunas' : p.status === 'cicilan' ? 'Cicilan' : 'Nunggak',
      p.dueDate,
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `payments-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`${filteredPayments.length} data pembayaran berhasil diexport`)
  }

  return (
    <AppLayout
      notificationCount={3}
      breadcrumbs={[
        { label: "Pembayaran", href: "/payments", isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Manajemen Pembayaran
            </h1>
            <p className="mt-8 text-slate-600">
              Monitor dan catat pembayaran jamaah
            </p>
          </div>
          <div className="flex gap-8">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center gap-2 h-[40px]"
              disabled={filteredPayments.length === 0}
            >
              <Download className="h-[16px] w-[16px]" />
              Export CSV
            </Button>
            <Button
              onClick={handleAddPayment}
              className="flex items-center gap-2 h-[40px]"
            >
              <Plus className="h-[16px] w-[16px]" />
              Catat Pembayaran
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-slate-600">Total Jamaah</CardTitle>
              <DollarSign className="h-[20px] w-[20px] text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-600 mt-4">Jamaah aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-green-700">Lunas</CardTitle>
              <CheckCircle className="h-[20px] w-[20px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.lunas}</div>
              <p className="text-xs text-green-600 mt-4">Pembayaran selesai</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-blue-700">Cicilan</CardTitle>
              <Clock className="h-[20px] w-[20px] text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.cicilan}</div>
              <p className="text-xs text-blue-600 mt-4">Pembayaran berjalan</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-red-700">Nunggak</CardTitle>
              <AlertTriangle className="h-[20px] w-[20px] text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stats.nunggak}</div>
              <p className="text-xs text-red-600 mt-4">Perlu tindak lanjut</p>
            </CardContent>
          </Card>
        </section>

        {/* Revenue Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-green-700">Total Terbayar</CardTitle>
              <TrendingUp className="h-[20px] w-[20px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-green-700">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-green-600 mt-4">Akumulasi pembayaran diterima</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-orange-700">Total Piutang</CardTitle>
              <DollarSign className="h-[20px] w-[20px] text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-orange-700">
                {formatCurrency(stats.totalRemaining)}
              </div>
              <p className="text-xs text-orange-600 mt-4">Sisa pembayaran yang harus diterima</p>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
          <div className="relative flex-1">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama jamaah atau paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-36"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: PaymentStatus | 'all') => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="lunas">Lunas</SelectItem>
              <SelectItem value="cicilan">Cicilan</SelectItem>
              <SelectItem value="nunggak">Nunggak</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Results count */}
        <section className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredPayments.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{mockPayments.length}</span> pembayaran
          </div>
          {(statusFilter !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('all')
                setSearchQuery('')
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Reset Filter
            </Button>
          )}
        </section>

        {/* Payment Table */}
        <section>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Jamaah</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Terbayar</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead>Cicilan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => {
                    const overdue = isOverdue(payment)
                    return (
                      <TableRow
                        key={payment.id}
                        className={cn(
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                          'hover:bg-slate-100 transition-colors',
                          overdue && 'bg-red-50'
                        )}
                      >
                        <TableCell className="font-medium text-slate-900">
                          {payment.jamaahName}
                        </TableCell>
                        <TableCell className="text-slate-600">{payment.package}</TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatCurrency(payment.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-700">
                          {formatCurrency(payment.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-orange-700">
                          {formatCurrency(payment.remaining)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                              {payment.installments.paid}/{payment.installments.total}
                            </div>
                            <div className="w-[60px] h-[6px] bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{
                                  width: `${(payment.installments.paid / payment.installments.total) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "text-sm",
                            overdue ? "text-red-700 font-medium" : "text-slate-600"
                          )}>
                            {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                            {overdue && (
                              <Badge variant="outline" className="ml-8 bg-red-100 text-red-700 border-red-200">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Tidak ada pembayaran ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Pembayaran Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail pembayaran yang diterima dari jamaah
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-16">
            <div>
              <Label htmlFor="jamaah">Pilih Jamaah *</Label>
              <Select value={selectedJamaahId} onValueChange={setSelectedJamaahId}>
                <SelectTrigger id="jamaah" className="mt-8">
                  <SelectValue placeholder="Pilih jamaah" />
                </SelectTrigger>
                <SelectContent>
                  {mockJamaah.slice(0, 10).map(jamaah => (
                    <SelectItem key={jamaah.id} value={jamaah.id}>
                      {jamaah.name} - {jamaah.package}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Jumlah Pembayaran (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000000"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="mt-8"
              />
            </div>

            <div>
              <Label htmlFor="method">Metode Pembayaran *</Label>
              <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                <SelectTrigger id="method" className="mt-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">{paymentMethodLabels.transfer}</SelectItem>
                  <SelectItem value="cash">{paymentMethodLabels.cash}</SelectItem>
                  <SelectItem value="va">{paymentMethodLabels.va}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Tanggal Pembayaran *</Label>
              <Input
                id="date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-8"
              />
            </div>

            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan (opsional)"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={3}
                className="mt-8"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitPayment}>
              Simpan Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
