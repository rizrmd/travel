"use client"

import * as React from "react"
import {
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  Award,
  ArrowUpRight,
  CheckCircle,
  Clock,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { agentProfile } from "@/lib/data/mock-agent-jamaah"
import {
  mockCommissions,
  mockPayoutHistory,
  getCommissionsByStatus,
  getCommissionSummary,
  getMonthlyCommissionTrend,
  getCurrentTierInfo,
  agentBankInfo,
  minimumPayout,
} from "@/lib/data/mock-commissions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function KomisiPage() {
  const { toast } = useToast()
  const [showPayoutModal, setShowPayoutModal] = React.useState(false)
  const [payoutAmount, setPayoutAmount] = React.useState("")

  const summary = getCommissionSummary()
  const monthlyTrend = getMonthlyCommissionTrend()
  const tierInfo = getCurrentTierInfo(agentProfile.assignedJamaahCount)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleRequestPayout = () => {
    if (summary.available < minimumPayout) {
      toast({
        title: "Saldo Tidak Mencukupi",
        description: `Minimum payout adalah ${formatCurrency(minimumPayout)}`,
        variant: "destructive",
      })
      return
    }

    setPayoutAmount(summary.available.toString())
    setShowPayoutModal(true)
  }

  const handleConfirmPayout = () => {
    toast({
      title: "Payout Request Terkirim!",
      description: `Permintaan pencairan ${formatCurrency(summary.available)} telah diajukan. Tim akan memproses dalam 1-3 hari kerja.`,
    })
    setShowPayoutModal(false)
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Komisi', href: '/agent/komisi' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-32">
        <h1 className="text-h2 font-display font-bold text-slate-900 mb-8">
          Komisi & Pendapatan
        </h1>
        <p className="text-body text-slate-600">
          Kelola dan pantau komisi dari jamaah Anda
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <Card className="p-24 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-12 mb-8">
            <DollarSign className="h-24 w-24" />
            <p className="text-body-sm opacity-90">Earned This Month</p>
          </div>
          <p className="text-h2 font-bold">{formatCurrency(summary.thisMonth)}</p>
        </Card>

        <Card className="p-24 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-12 mb-8">
            <Clock className="h-24 w-24" />
            <p className="text-body-sm opacity-90">Total Pending</p>
          </div>
          <p className="text-h2 font-bold">{formatCurrency(summary.pending)}</p>
        </Card>

        <Card className="p-24 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-12 mb-8">
            <CheckCircle className="h-24 w-24" />
            <p className="text-body-sm opacity-90">Total Paid Out</p>
          </div>
          <p className="text-h2 font-bold">{formatCurrency(summary.paid)}</p>
        </Card>

        <Card className="p-24 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-12 mb-8">
            <Wallet className="h-24 w-24" />
            <p className="text-body-sm opacity-90">Available Balance</p>
          </div>
          <p className="text-h2 font-bold">{formatCurrency(summary.available)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-32">
          {/* Commission Breakdown */}
          <Card className="p-32">
            <div className="flex items-center justify-between mb-24">
              <h2 className="text-h4 font-display font-bold text-slate-900">
                Rincian Komisi
              </h2>
            </div>

            <div className="space-y-12 max-h-[600px] overflow-y-auto">
              {mockCommissions.length === 0 ? (
                <p className="text-body-sm text-slate-500 text-center py-24">
                  Belum ada komisi
                </p>
              ) : (
                mockCommissions.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-16 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-16">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body font-semibold text-slate-900 mb-4">
                          {comm.jamaahName}
                        </h3>
                        <p className="text-body-sm text-slate-600 mb-8">
                          {comm.packageName}
                        </p>
                        <div className="flex items-center gap-16 text-body-sm text-slate-500">
                          <span>Harga Paket: {formatCurrency(comm.packagePrice)}</span>
                          <span>•</span>
                          <span>Rate: {comm.commissionRate}%</span>
                          <span>•</span>
                          <span>{new Date(comm.earnedDate).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-body font-bold text-green-600 mb-8">
                          {formatCurrency(comm.commissionAmount)}
                        </p>
                        <Badge
                          className={cn(
                            "text-xs",
                            comm.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'
                          )}
                        >
                          {comm.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Monthly Trend Chart */}
          <Card className="p-32">
            <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
              Trend Komisi Bulanan
            </h2>
            <div className="space-y-12">
              {monthlyTrend.map((item, index) => {
                const maxAmount = Math.max(...monthlyTrend.map(t => t.amount))
                const percentage = (item.amount / maxAmount) * 100

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-body-sm font-semibold text-slate-700">
                        {item.month}
                      </span>
                      <span className="text-body-sm font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Payout History */}
          <Card className="p-32">
            <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
              Riwayat Pencairan
            </h2>

            {mockPayoutHistory.length === 0 ? (
              <p className="text-body-sm text-slate-500 text-center py-24">
                Belum ada riwayat pencairan
              </p>
            ) : (
              <div className="space-y-12">
                {mockPayoutHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-16 rounded-lg border"
                  >
                    <div className="flex items-start justify-between gap-16">
                      <div className="flex-1">
                        <div className="flex items-center gap-8 mb-8">
                          <p className="text-body font-bold text-slate-900">
                            {formatCurrency(payout.amount)}
                          </p>
                          <Badge
                            className={cn(
                              "text-xs",
                              payout.status === 'paid' && 'bg-green-500',
                              payout.status === 'approved' && 'bg-blue-500',
                              payout.status === 'requested' && 'bg-amber-500'
                            )}
                          >
                            {payout.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-body-sm text-slate-600 mb-4">
                          {payout.bankAccount}
                        </p>
                        <p className="text-body-sm text-slate-500">
                          Request: {new Date(payout.requestDate).toLocaleDateString('id-ID')}
                          {payout.paidDate && (
                            <> • Paid: {new Date(payout.paidDate).toLocaleDateString('id-ID')}</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-32">
          {/* Tier Information */}
          <Card className="p-24">
            <div className="flex items-center gap-12 mb-20">
              <Award className="h-24 w-24 text-primary" />
              <h3 className="text-body font-display font-bold text-slate-900">
                Tier Anda
              </h3>
            </div>

            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <Badge className="bg-slate-500 text-white text-sm px-12 py-4">
                  {tierInfo.tier}
                </Badge>
                <span className="text-body font-bold text-primary">
                  {tierInfo.commissionRate}%
                </span>
              </div>
              <p className="text-body-sm text-slate-600">
                Komisi rate untuk tier {tierInfo.tier}
              </p>
            </div>

            {/* Progress to next tier */}
            {tierInfo.nextTier && (
              <div className="mb-20 p-16 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-body-sm font-semibold text-blue-900 mb-8">
                  Menuju {tierInfo.nextTier.tier}
                </p>
                <p className="text-body-sm text-blue-700">
                  Butuh {tierInfo.jamaahToNext} jamaah lagi untuk naik ke tier {tierInfo.nextTier.tier} dengan komisi {tierInfo.nextTier.commissionRate}%
                </p>
              </div>
            )}

            {/* Benefits */}
            <div>
              <p className="text-body-sm font-semibold text-slate-900 mb-12">
                Benefit {tierInfo.tier}:
              </p>
              <ul className="space-y-8">
                {tierInfo.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mt-2 flex-shrink-0" />
                    <span className="text-body-sm text-slate-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Payout Section */}
          <Card className="p-24">
            <div className="flex items-center gap-12 mb-20">
              <CreditCard className="h-24 w-24 text-primary" />
              <h3 className="text-body font-display font-bold text-slate-900">
                Pencairan Dana
              </h3>
            </div>

            <div className="space-y-16">
              <div className="p-16 bg-slate-50 rounded-lg">
                <p className="text-body-sm text-slate-600 mb-4">
                  Saldo Tersedia
                </p>
                <p className="text-h3 font-bold text-slate-900">
                  {formatCurrency(summary.available)}
                </p>
              </div>

              <div className="p-12 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-900">
                  Minimum pencairan: {formatCurrency(minimumPayout)}
                </p>
              </div>

              {/* Bank Info */}
              <div>
                <p className="text-body-sm font-semibold text-slate-900 mb-8">
                  Rekening Terdaftar:
                </p>
                <div className="p-12 bg-slate-50 rounded-lg border text-body-sm text-slate-700">
                  <p className="font-semibold">{agentBankInfo.bankName}</p>
                  <p>{agentBankInfo.accountNumber}</p>
                  <p>{agentBankInfo.accountName}</p>
                </div>
              </div>

              <Button
                onClick={handleRequestPayout}
                disabled={summary.available < minimumPayout}
                className="w-full h-48 gap-8"
              >
                <ArrowUpRight className="h-20 w-20" />
                Request Payout
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Payout Modal */}
      <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Pencairan Dana</DialogTitle>
            <DialogDescription>
              Ajukan permintaan pencairan komisi ke rekening Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-20 py-16">
            <div className="p-16 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-body-sm text-blue-900">
                Dana akan ditransfer ke rekening terdaftar dalam 1-3 hari kerja setelah disetujui.
              </p>
            </div>

            <div>
              <Label>Jumlah Pencairan</Label>
              <Input
                value={formatCurrency(summary.available)}
                readOnly
                className="h-48 mt-8 font-bold text-lg"
              />
            </div>

            <div>
              <Label>Rekening Tujuan</Label>
              <div className="mt-8 p-16 bg-slate-50 rounded-lg border">
                <p className="text-body-sm font-semibold text-slate-900">
                  {agentBankInfo.bankName}
                </p>
                <p className="text-body-sm text-slate-600">
                  {agentBankInfo.accountNumber}
                </p>
                <p className="text-body-sm text-slate-600">
                  {agentBankInfo.accountName}
                </p>
              </div>
            </div>

            <div className="p-12 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-900">
                Pastikan data rekening Anda benar. Kesalahan transfer bukan tanggung jawab kami.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayoutModal(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmPayout}>
              Ajukan Pencairan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
