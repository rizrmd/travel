"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Users, Check, X } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { adminMenuItems } from "@/lib/navigation/menu-items"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getPackageById } from "@/lib/data/mock-packages"
import { mockAgents, tierCommissionRates } from "@/lib/data/mock-agents"
import { getAssignedAgents } from "@/lib/data/mock-package-assignments"
import { formatCurrency } from "@/lib/data/mock-dashboard"

export default function AssignAgentsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const packageId = params.id

  // Load package data
  const packageData = getPackageById(packageId)

  // Load assigned agents
  const initialAssignedAgents = getAssignedAgents(packageId)
  const [assignedAgents, setAssignedAgents] = useState<string[]>(initialAssignedAgents)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if package not found
  useEffect(() => {
    if (!packageData) {
      toast.error('Paket tidak ditemukan')
      router.push('/packages')
    }
  }, [packageData, router])

  if (!packageData) {
    return null
  }

  const toggleAgent = (agentId: string) => {
    setAssignedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const selectAll = () => {
    setAssignedAgents(mockAgents.map(agent => agent.id))
  }

  const selectNone = () => {
    setAssignedAgents([])
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      // console.log('Saving package assignments:', {
      //   packageId,
      //   agentIds: assignedAgents,
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(
        `Paket berhasil di-assign ke ${assignedAgents.length} agent${assignedAgents.length !== 1 ? 's' : ''}`
      )
      router.push('/packages')
    } catch (error) {
      toast.error('Gagal menyimpan assignment. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/packages')
  }

  return (
    <AppLayout
      menuItems={adminMenuItems}
      userName="Mbak Rina"
      userRole="Admin Travel"
      breadcrumbs={[
        { label: "Paket Umroh", href: "/packages" },
        { label: packageData.name, href: `/packages/${packageId}/edit` },
        { label: "Assign Agents", href: `/packages/${packageId}/assign-agents`, isCurrentPage: true },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Header */}
        <div className="flex items-center gap-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-8"
          >
            <ArrowLeft className="h-16 w-16" />
            Kembali
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Assign Package ke Agent
            </h1>
            <p className="mt-8 text-slate-600">
              {packageData.name}
            </p>
          </div>
        </div>

        {/* Package Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Paket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-12">
            <div className="grid grid-cols-2 gap-16">
              <div>
                <p className="text-sm text-blue-700 font-medium">Nama Paket</p>
                <p className="text-blue-900 font-semibold">{packageData.name}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Durasi</p>
                <p className="text-blue-900">{packageData.duration}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Harga Retail</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(packageData.priceRetail)}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Harga Wholesale</p>
                <p className="text-blue-900 font-semibold">
                  {formatCurrency(packageData.priceWholesale)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-8">
                <Users className="h-20 w-20" />
                Pilih Agent
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {assignedAgents.length} / {mockAgents.length} selected
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-8">
              Pilih agent mana saja yang bisa menjual paket ini
            </p>
          </CardHeader>
          <CardContent className="space-y-16">
            {/* Bulk Actions */}
            <div className="flex gap-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAll}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectNone}
              >
                Deselect All
              </Button>
            </div>

            {/* Agent List */}
            <div className="space-y-8">
              {mockAgents.map((agent) => {
                const isSelected = assignedAgents.includes(agent.id)

                return (
                  <div
                    key={agent.id}
                    className={`flex items-center gap-12 p-12 border rounded-lg transition-colors cursor-pointer ${isSelected
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-slate-50 border-slate-200'
                      }`}
                    onClick={() => toggleAgent(agent.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleAgent(agent.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-8 mb-4">
                        <p className="font-medium text-slate-900">{agent.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${agent.tier === 'silver'
                            ? 'bg-slate-100 text-slate-700'
                            : agent.tier === 'gold'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-purple-100 text-purple-700'
                            }`}
                        >
                          {agent.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-16 text-sm text-slate-500">
                        <span>{agent.jamaahCount} jamaah</span>
                        <span>•</span>
                        <span>{agent.phone}</span>
                        <span>•</span>
                        <span>Komisi {tierCommissionRates[agent.tier]}%</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-8 text-blue-600">
                        <Check className="h-20 w-20" />
                        <span className="text-sm font-medium">Assigned</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        {assignedAgents.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-16">
              <div className="flex items-start gap-12">
                <Check className="h-20 w-20 text-green-600 mt-2" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 mb-8">
                    {assignedAgents.length} Agent akan menerima notifikasi
                  </p>
                  <p className="text-sm text-green-700">
                    Agent akan otomatis menerima notifikasi bahwa paket &quot;{packageData.name}&quot;
                    sudah tersedia untuk mereka jual. Mereka dapat langsung membuat landing page
                    untuk promosi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {assignedAgents.length === 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-16">
              <div className="flex items-start gap-12">
                <X className="h-20 w-20 text-amber-600 mt-2" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-8">
                    Tidak ada agent yang dipilih
                  </p>
                  <p className="text-sm text-amber-700">
                    Pilih minimal 1 agent untuk menjual paket ini. Agent yang tidak di-assign
                    tidak akan bisa melihat atau menjual paket ini.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-12 pt-24 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting || assignedAgents.length === 0}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan & Broadcast'}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
