"use client"

import { useMemo, useState } from "react"
import { Search, Plus, Eye, Users, TrendingUp, Award } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { mockAgents, getAgentStats, AgentTier, AgentStatus, tierLabels } from "@/lib/data/mock-agents"
import { formatCurrency } from "@/lib/data/mock-dashboard"
import { toast } from "sonner"

function AgentTierBadge({ tier }: { tier: AgentTier }) {
  const config = {
    silver: { label: 'Silver', className: 'bg-slate-100 text-slate-700 border-slate-300' },
    gold: { label: 'Gold', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    platinum: { label: 'Platinum', className: 'bg-purple-100 text-purple-700 border-purple-300' },
  }

  const { label, className } = config[tier]

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  )
}

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'
      )}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  )
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<AgentTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all')

  const stats = useMemo(() => getAgentStats(), [])

  const filteredAgents = useMemo(() => {
    let result = mockAgents

    if (tierFilter !== 'all') {
      result = result.filter(a => a.tier === tierFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.phone.includes(query)
      )
    }

    return result
  }, [tierFilter, statusFilter, searchQuery])

  const handleNotificationClick = () => console.log('Navigate to /notifications')
  const handleProfileClick = () => console.log('Navigate to /profile')
  const handleSettingsClick = () => toast.info('Navigasi ke Settings')
  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  const handleAddAgent = () => {
    toast.info('Fitur tambah agent segera hadir')
  }

  const handleViewAgent = (id: string) => {
    console.log('View agent:', id)
    toast.info('Fitur detail agent segera hadir')
  }

  return (
    <AppLayout
      userName="Mbak Rina"
      userRole="Admin Travel"
      notificationCount={3}
      breadcrumbs={[
        { label: "Agent", href: "/agents", isCurrentPage: true },
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
              Manajemen Agent
            </h1>
            <p className="mt-8 text-slate-600">
              Kelola agent dan monitor performa penjualan
            </p>
          </div>
          <Button onClick={handleAddAgent} className="flex items-center gap-2 h-[40px]">
            <Plus className="h-[16px] w-[16px]" />
            Tambah Agent Baru
          </Button>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-slate-600">Total Agent</CardTitle>
              <Users className="h-[20px] w-[20px] text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-600 mt-4">{stats.active} aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-purple-700">Platinum</CardTitle>
              <Award className="h-[20px] w-[20px] text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{stats.platinum}</div>
              <p className="text-xs text-purple-600 mt-4">Komisi 8%</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-yellow-700">Gold</CardTitle>
              <Award className="h-[20px] w-[20px] text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">{stats.gold}</div>
              <p className="text-xs text-yellow-600 mt-4">Komisi 6%</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium text-slate-700">Silver</CardTitle>
              <Award className="h-[20px] w-[20px] text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">{stats.silver}</div>
              <p className="text-xs text-slate-600 mt-4">Komisi 4%</p>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filters */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center gap-12">
          <div className="relative flex-1">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-400" />
            <Input
              type="search"
              placeholder="Cari nama, email, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-36"
            />
          </div>

          <Select
            value={tierFilter}
            onValueChange={(value: AgentTier | 'all') => setTierFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tier</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value: AgentStatus | 'all') => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Agent Table */}
        <section>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Agent</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Jamaah</TableHead>
                  <TableHead className="text-right">Total Komisi</TableHead>
                  <TableHead className="text-right">Conversion Rate</TableHead>
                  <TableHead className="text-right">Avg Deal Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent, index) => (
                    <TableRow
                      key={agent.id}
                      className={cn(
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
                        'hover:bg-slate-100 transition-colors'
                      )}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{agent.name}</div>
                          <div className="text-sm text-slate-500 mt-2">{agent.email}</div>
                          <div className="text-sm text-slate-500">{agent.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AgentTierBadge tier={agent.tier} />
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        {agent.jamaahCount}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-700">
                        {formatCurrency(agent.totalCommission)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-8">
                          <span className="font-medium text-slate-900">{agent.conversionRate}%</span>
                          {agent.conversionRate >= 70 && (
                            <TrendingUp className="h-[16px] w-[16px] text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-700">
                        {formatCurrency(agent.averageDealSize)}
                      </TableCell>
                      <TableCell>
                        <AgentStatusBadge status={agent.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAgent(agent.id)}
                            className="h-[32px]"
                          >
                            <Eye className="h-[16px] w-[16px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Tidak ada agent ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
