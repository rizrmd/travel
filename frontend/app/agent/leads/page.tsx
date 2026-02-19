"use client"

import * as React from "react"
import { Search, MessageCircle, UserPlus, X, Filter, TrendingUp, Clock } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { agentProfile } from "@/lib/data/mock-agent-jamaah"
import { mockLeads, getLeadsByStatus, getLeadsCount, getLeadStats, LeadStatus } from "@/lib/data/mock-leads"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500' },
  contacted: { label: 'Contacted', color: 'bg-amber-500' },
  converted: { label: 'Converted', color: 'bg-green-500' },
  lost: { label: 'Lost', color: 'bg-slate-400' },
  negotiating: { label: 'Negotiating', color: 'bg-indigo-500' },
}

interface ConversionFormData {
  nik: string
  birthDate: string
  address: string
  gender: 'male' | 'female' | ''
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<LeadStatus | 'all'>('all')
  const [showConvertModal, setShowConvertModal] = React.useState(false)
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<'date' | 'name'>('date')
  const [isConverting, setIsConverting] = React.useState(false)
  const [conversionForm, setConversionForm] = React.useState<ConversionFormData>({
    nik: '',
    birthDate: '',
    address: '',
    gender: '',
  })

  const counts = getLeadsCount()
  const stats = getLeadStats()

  // Filter and sort leads
  const filteredLeads = React.useMemo(() => {
    let filtered = mockLeads

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        l =>
          l.name.toLowerCase().includes(query) ||
          l.phone.toLowerCase().includes(query) ||
          l.packageInterest.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) =>
        new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
      )
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchQuery, statusFilter, sortBy])

  const selectedLead = selectedLeadId ? mockLeads.find(l => l.id === selectedLeadId) : null

  const handleContact = (leadId: string) => {
    const lead = mockLeads.find(l => l.id === leadId)
    if (!lead) return

    const message = `Assalamualaikum ${lead.name}, terima kasih sudah tertarik dengan ${lead.packageInterest}. Saya ${agentProfile.name} dari Travel Umroh. Ada yang bisa saya bantu?`
    const encodedMessage = encodeURIComponent(message)
    const phone = lead.phone.replace(/\+/g, '').replace(/\s/g, '')
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  const handleConvert = (leadId: string) => {
    setSelectedLeadId(leadId)
    setShowConvertModal(true)
    // Reset form
    setConversionForm({
      nik: '',
      birthDate: '',
      address: '',
      gender: '',
    })
  }

  const handleMarkLost = (leadId: string) => {
    toast.info("Fitur mark lost segera hadir")
  }

  const handleConfirmConvert = async () => {
    if (!selectedLead) return

    // Validation
    if (!conversionForm.nik) {
      toast.error("NIK harus diisi")
      return
    }
    if (!conversionForm.birthDate) {
      toast.error("Tanggal lahir harus diisi")
      return
    }
    if (!conversionForm.address) {
      toast.error("Alamat harus diisi")
      return
    }
    if (!conversionForm.gender) {
      toast.error("Jenis kelamin harus dipilih")
      return
    }

    setIsConverting(true)

    try {
      // Call conversion API
      const response = await fetch('/api/leads/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: selectedLead.id,
          jamaahData: {
            name: selectedLead.name,
            phone: selectedLead.phone,
            email: selectedLead.email || '',
            nik: conversionForm.nik,
            birthDate: conversionForm.birthDate,
            address: conversionForm.address,
            gender: conversionForm.gender,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const result = await response.json()

      // Show success message with commission info
      toast.success(
        `${selectedLead.name} berhasil dikonversi menjadi jamaah! Komisi: Rp ${result.commission.amount.toLocaleString('id-ID')}`
      )

      // Check for tier upgrade
      if (result.tierUpgrade) {
        toast.success(
          `🎉 Selamat! Tier Anda naik ke ${result.tierUpgrade.newTier}! Komisi sekarang ${result.tierUpgrade.newRate}%`,
          { duration: 5000 }
        )
      }

      setShowConvertModal(false)
      setSelectedLeadId(null)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error('Gagal convert lead. Silakan coba lagi.')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Leads', href: '/agent/leads' },
      ]}
      userName={agentProfile.name}
      userRole={agentProfile.role}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-h2 font-display font-bold text-slate-900 mb-8">
          Lead Management
        </h1>
        <p className="text-body text-slate-600">
          Kelola leads dari landing page Anda
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <Card className="p-24">
          <div className="flex items-center gap-12 mb-8">
            <UserPlus className="h-20 w-20 text-blue-600" />
            <p className="text-body-sm text-slate-600">Total Leads</p>
          </div>
          <p className="text-h2 font-bold text-slate-900">{stats.totalLeads}</p>
        </Card>

        <Card className="p-24">
          <div className="flex items-center gap-12 mb-8">
            <TrendingUp className="h-20 w-20 text-green-600" />
            <p className="text-body-sm text-slate-600">New (This Week)</p>
          </div>
          <p className="text-h2 font-bold text-green-600">{stats.newThisWeek}</p>
        </Card>

        <Card className="p-24">
          <div className="flex items-center gap-12 mb-8">
            <UserPlus className="h-20 w-20 text-purple-600" />
            <p className="text-body-sm text-slate-600">Conversion Rate</p>
          </div>
          <p className="text-h2 font-bold text-purple-600">{stats.conversionRate}%</p>
        </Card>

        <Card className="p-24">
          <div className="flex items-center gap-12 mb-8">
            <Clock className="h-20 w-20 text-amber-600" />
            <p className="text-body-sm text-slate-600">Avg Response</p>
          </div>
          <p className="text-h2 font-bold text-amber-600">{stats.avgResponseTime}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-16 mb-24">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-20 w-20 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari nama, nomor, atau paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-40 h-44"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-8 overflow-x-auto">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className="h-44 whitespace-nowrap"
          >
            Semua ({counts.total})
          </Button>
          <Button
            variant={statusFilter === 'new' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('new')}
            className="h-44 whitespace-nowrap"
          >
            New ({counts.new})
          </Button>
          <Button
            variant={statusFilter === 'contacted' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('contacted')}
            className="h-44 whitespace-nowrap"
          >
            Contacted ({counts.contacted})
          </Button>
          <Button
            variant={statusFilter === 'converted' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('converted')}
            className="h-44 whitespace-nowrap"
          >
            Converted ({counts.converted})
          </Button>
          <Button
            variant={statusFilter === 'lost' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('lost')}
            className="h-44 whitespace-nowrap"
          >
            Lost ({counts.lost})
          </Button>
        </div>
      </div>

      {/* Leads Table/List */}
      <div className="space-y-12">
        {filteredLeads.length === 0 ? (
          <Card className="p-48 text-center">
            <p className="text-body text-slate-500">Tidak ada lead ditemukan</p>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-24 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-12 mb-8">
                    <h3 className="text-body font-bold text-slate-900">
                      {lead.name}
                    </h3>
                    <Badge className={cn("text-xs", statusConfig[lead.status].color)}>
                      {statusConfig[lead.status].label}
                    </Badge>
                  </div>
                  <div className="space-y-4 text-body-sm text-slate-600">
                    <p>
                      <span className="font-semibold">Phone:</span> {lead.phone}
                    </p>
                    {lead.email && (
                      <p>
                        <span className="font-semibold">Email:</span> {lead.email}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Interest:</span> {lead.packageInterest}
                    </p>
                    <p>
                      <span className="font-semibold">Source:</span> {lead.source}
                    </p>
                    <p>
                      <span className="font-semibold">Submitted:</span>{' '}
                      {new Date(lead.dateSubmitted).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    {lead.notes && (
                      <p className="italic text-slate-500">
                        Note: {lead.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-8">
                  {lead.status !== 'converted' && lead.status !== 'lost' && (
                    <>
                      <Button
                        onClick={() => handleContact(lead.id)}
                        className="h-40 gap-8 bg-whatsapp hover:bg-whatsapp/90 text-white"
                      >
                        <MessageCircle className="h-16 w-16" />
                        Hubungi
                      </Button>
                      <Button
                        onClick={() => handleConvert(lead.id)}
                        variant="default"
                        className="h-40 gap-8"
                      >
                        <UserPlus className="h-16 w-16" />
                        Convert
                      </Button>
                      <Button
                        onClick={() => handleMarkLost(lead.id)}
                        variant="outline"
                        className="h-40 gap-8"
                      >
                        <X className="h-16 w-16" />
                        Mark Lost
                      </Button>
                    </>
                  )}
                  {lead.status === 'converted' && lead.convertedToJamaahId && (
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `/agent/jamaah/${lead.convertedToJamaahId}`}
                      className="h-40"
                    >
                      Lihat Jamaah
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Convert Modal */}
      <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Convert Lead to Jamaah</DialogTitle>
            <DialogDescription>
              Buat jamaah baru dari lead {selectedLead?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-20 py-16">
              <div className="p-16 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-body-sm text-blue-900">
                  Data lead akan otomatis terisi. Lengkapi informasi tambahan untuk membuat jamaah.
                </p>
              </div>

              <div>
                <Label>Nama Lengkap</Label>
                <Input value={selectedLead.name} className="h-48 mt-8" readOnly />
              </div>

              <div className="grid grid-cols-2 gap-16">
                <div>
                  <Label>Nomor Telepon</Label>
                  <Input value={selectedLead.phone} className="h-48 mt-8" readOnly />
                </div>
                <div>
                  <Label>Email (Optional)</Label>
                  <Input value={selectedLead.email || '-'} className="h-48 mt-8" readOnly />
                </div>
              </div>

              <div>
                <Label>Paket yang Diminati</Label>
                <Input value={selectedLead.packageInterest} className="h-48 mt-8" readOnly />
              </div>

              <div>
                <Label htmlFor="nik">NIK <span className="text-red-600">*</span></Label>
                <Input
                  id="nik"
                  placeholder="3201012345670001"
                  className="h-48 mt-8"
                  value={conversionForm.nik}
                  onChange={(e) => setConversionForm(prev => ({ ...prev, nik: e.target.value }))}
                  maxLength={16}
                />
              </div>

              <div className="grid grid-cols-2 gap-16">
                <div>
                  <Label htmlFor="birthDate">Tanggal Lahir <span className="text-red-600">*</span></Label>
                  <Input
                    id="birthDate"
                    type="date"
                    className="h-48 mt-8"
                    value={conversionForm.birthDate}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Jenis Kelamin <span className="text-red-600">*</span></Label>
                  <select
                    id="gender"
                    className="h-48 mt-8 w-full rounded-md border border-input bg-background px-12 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={conversionForm.gender}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                  >
                    <option value="">Pilih...</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Alamat Lengkap <span className="text-red-600">*</span></Label>
                <Textarea
                  id="address"
                  placeholder="Alamat lengkap..."
                  className="h-80 mt-8"
                  value={conversionForm.address}
                  onChange={(e) => setConversionForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConvertModal(false)}
              disabled={isConverting}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmConvert}
              disabled={isConverting}
            >
              {isConverting ? 'Memproses...' : 'Buat Jamaah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
