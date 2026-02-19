'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ChevronDown,
  Info
} from 'lucide-react'
import { mockJamaahProfile } from '@/lib/data/mock-jamaah-profile'
import { useToast } from '@/hooks/use-toast'

export default function PaymentsPage() {
  const profile = mockJamaahProfile
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText('8808123456789012')
    toast({
      title: 'Disalin!',
      description: 'Nomor Virtual Account telah disalin ke clipboard',
    })
  }

  const getInstallmentStatus = (status: string) => {
    switch (status) {
      case 'lunas':
        return <Badge variant="default">Lunas</Badge>
      case 'pending':
        return <Badge variant="secondary">Belum Bayar</Badge>
      case 'overdue':
        return <Badge variant="destructive">Terlambat</Badge>
      default:
        return null
    }
  }

  return (
    <AppLayout
      userRole="jamaah"
    >
      {/* Payment Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ringkasan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Paket</p>
                <p className="font-semibold text-lg">{profile.package.name}</p>
              </div>
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Harga</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(profile.paymentStatus.total)}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Sudah Dibayar</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(profile.paymentStatus.paid)}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Sisa Pembayaran</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {formatCurrency(profile.paymentStatus.remaining)}
                  </p>
                  <Badge variant={profile.paymentStatus.status === 'lunas' ? 'default' : 'secondary'}>
                    {profile.paymentStatus.status === 'lunas' ? 'Lunas' : 'Cicilan'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installment Schedule */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Jadwal Cicilan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cicilan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.paymentStatus.installments.map((installment) => (
                <TableRow key={installment.number}>
                  <TableCell className="font-medium">
                    Cicilan {installment.number}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(installment.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(installment.dueDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {getInstallmentStatus(installment.status)}
                  </TableCell>
                  <TableCell>
                    {installment.paidDate ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        {new Date(installment.paidDate).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Virtual Account Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Virtual Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bank</p>
                <p className="font-semibold text-lg">BCA (Bank Central Asia)</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Atas Nama</p>
                <p className="font-semibold text-lg">PT Travel Umroh Indonesia</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Nomor Virtual Account</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-4 bg-gray-50 border rounded-lg">
                  <p className="text-2xl font-mono font-bold tracking-wider">
                    8808 1234 5678 9012
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={copyVirtualAccount}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Salin
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">
                Nomor Virtual Account ini khusus untuk pembayaran umroh Anda.
                Pastikan transfer sesuai dengan nominal cicilan yang jatuh tempo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.paymentStatus.installments
              .filter(i => i.paidDate)
              .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
              .map((installment) => (
                <div
                  key={installment.number}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-emerald-100">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        Transfer Bank BCA - {formatCurrency(installment.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cicilan {installment.number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(installment.paidDate!).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <Badge variant="default" className="mt-1">Terverifikasi</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
          <CardHeader>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle>Cara Pembayaran</CardTitle>
                <ChevronDown className={`h-5 w-5 transition-transform ${instructionsOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Melalui ATM BCA:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Masukkan kartu ATM dan PIN Anda</li>
                    <li>Pilih menu &quot;Transaksi Lainnya&quot;</li>
                    <li>Pilih &quot;Transfer&quot;</li>
                    <li>Pilih &quot;Ke Rek BCA&quot;</li>
                    <li>Masukkan nomor Virtual Account: <strong className="text-foreground">8808123456789012</strong></li>
                    <li>Masukkan jumlah pembayaran sesuai cicilan</li>
                    <li>Konfirmasi dan selesaikan transaksi</li>
                    <li>Simpan bukti transfer</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Melalui Mobile Banking (BCA Mobile):</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Login ke aplikasi BCA Mobile</li>
                    <li>Pilih menu &quot;m-Transfer&quot;</li>
                    <li>Pilih &quot;BCA Virtual Account&quot;</li>
                    <li>Masukkan nomor Virtual Account: <strong className="text-foreground">8808123456789012</strong></li>
                    <li>Masukkan jumlah pembayaran sesuai cicilan</li>
                    <li>Masukkan PIN m-BCA</li>
                    <li>Konfirmasi dan selesaikan transaksi</li>
                    <li>Screenshot bukti transfer</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Melalui Internet Banking (KlikBCA):</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Login ke KlikBCA</li>
                    <li>Pilih &quot;Transfer Dana&quot;</li>
                    <li>Pilih &quot;Transfer ke BCA Virtual Account&quot;</li>
                    <li>Masukkan nomor Virtual Account: <strong className="text-foreground">8808123456789012</strong></li>
                    <li>Masukkan jumlah pembayaran sesuai cicilan</li>
                    <li>Masukkan Response KeyBCA Appli 1</li>
                    <li>Konfirmasi dan selesaikan transaksi</li>
                    <li>Simpan bukti transfer</li>
                  </ol>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Penting:</p>
                    <ul className="space-y-1">
                      <li>• Pembayaran akan otomatis terverifikasi dalam 1x24 jam</li>
                      <li>• Jika ada kendala, hubungi admin atau agent Anda</li>
                      <li>• Pastikan transfer sesuai dengan nominal cicilan yang jatuh tempo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Note */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Catatan Penting</p>
              <p className="text-sm text-blue-800">
                Pembayaran dikelola oleh admin. Untuk bantuan atau pertanyaan terkait pembayaran,
                silakan hubungi admin atau agent Anda.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
