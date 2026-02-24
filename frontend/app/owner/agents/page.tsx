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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Target
} from "lucide-react"
import {
  agentPerformances,
  tierDistribution,
  commissionBreakdowns,
  formatCurrency,
  AgentPerformance
} from "@/lib/data/mock-owner-agents"
import { toast } from "sonner"

type SortField = 'revenue' | 'jamaahCount' | 'conversionRate' | 'responseTime'
type SortDirection = 'asc' | 'desc'

export default function OwnerAgentsPage() {
  const [tierFilter, setTierFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [sortField, setSortField] = React.useState<SortField>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  // Filter and sort agents
  const filteredAgents = React.useMemo(() => {
    let filtered = [...agentPerformances]

    // Apply tier filter
    if (tierFilter !== 'all') {
      filtered = filtered.filter(a => a.tier === tierFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [tierFilter, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleExportCSV = () => {
    toast.success("Export CSV berhasil", {
      description: "File agent-performance.csv siap diunduh"
    })
  }

  const handleExportPDF = () => {
    toast.success("Export PDF berhasil", {
      description: "File agent-performance-report.pdf siap diunduh"
    })
  }

  // Calculate totals
  const totalRevenue = agentPerformances.reduce((sum, a) => sum + a.revenue, 0)
  const totalJamaah = agentPerformances.reduce((sum, a) => sum + a.jamaahCount, 0)
  const avgConversion = agentPerformances.reduce((sum, a) => sum + a.conversionRate, 0) / agentPerformances.length
  const avgResponseTime = agentPerformances.reduce((sum, a) => sum + a.responseTime, 0) / agentPerformances.length

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Owner Dashboard', href: '/owner/dashboard' },
        { label: 'Agent Performance', href: '/owner/agents' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Agent Performance Analytics
        </h1>
        <p className="text-slate-600">
          Monitor dan analisa performa seluruh agent secara komprehensif
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <Card>
          <CardContent className="pt-24">
            <p className="text-sm text-slate-600 mb-8">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mb-4">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-sm text-slate-500">dari {agentPerformances.length} agent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-24">
            <p className="text-sm text-slate-600 mb-8">Total Jamaah</p>
            <p className="text-2xl font-bold text-slate-900 mb-4">{totalJamaah}</p>
            <p className="text-sm text-slate-500">active jamaah</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-24">
            <p className="text-sm text-slate-600 mb-8">Avg Conversion</p>
            <p className="text-2xl font-bold text-slate-900 mb-4">{avgConversion.toFixed(1)}%</p>
            <p className="text-sm text-slate-500">conversion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-24">
            <p className="text-sm text-slate-600 mb-8">Avg Response</p>
            <p className="text-2xl font-bold text-slate-900 mb-4">{avgResponseTime.toFixed(1)}h</p>
            <p className="text-sm text-slate-500">response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Distribution */}
      <Card className="mb-24">
        <CardHeader>
          <CardTitle>Tier Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-16">
            {tierDistribution.map((tier) => (
              <div key={tier.tier} className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-12">
                    <Badge variant={
                      tier.tier === 'Platinum' ? 'default' :
                      tier.tier === 'Gold' ? 'secondary' : 'outline'
                    }>
                      {tier.tier}
                    </Badge>
                    <span className="text-sm text-slate-600">{tier.count} agent</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{tier.percentage}%</span>
                </div>
                <div className="h-[8px] bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      tier.tier === 'Platinum' ? 'bg-purple-500' :
                      tier.tier === 'Gold' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${tier.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-16 mb-24">
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-[40px]">
            <SelectValue placeholder="Filter Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tier</SelectItem>
            <SelectItem value="Platinum">Platinum</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-[40px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-12 ml-auto">
          <Button variant="outline" onClick={handleExportCSV} className="h-[40px]">
            <Download className="h-[16px] w-[16px] mr-8" />
            CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="h-[40px]">
            <FileText className="h-[16px] w-[16px] mr-8" />
            PDF
          </Button>
        </div>
      </div>

      {/* Agent Leaderboard */}
      <Card className="mb-24">
        <CardHeader>
          <CardTitle>Agent Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center gap-4">
                      Revenue
                      {sortField === 'revenue' && (
                        sortDirection === 'desc' ?
                        <TrendingDown className="h-[14px] w-[14px]" /> :
                        <TrendingUp className="h-[14px] w-[14px]" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('jamaahCount')}
                  >
                    <div className="flex items-center gap-4">
                      Jamaah
                      {sortField === 'jamaahCount' && (
                        sortDirection === 'desc' ?
                        <TrendingDown className="h-[14px] w-[14px]" /> :
                        <TrendingUp className="h-[14px] w-[14px]" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('conversionRate')}
                  >
                    <div className="flex items-center gap-4">
                      Conversion
                      {sortField === 'conversionRate' && (
                        sortDirection === 'desc' ?
                        <TrendingDown className="h-[14px] w-[14px]" /> :
                        <TrendingUp className="h-[14px] w-[14px]" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Avg Deal</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort('responseTime')}
                  >
                    <div className="flex items-center gap-4">
                      Response
                      {sortField === 'responseTime' && (
                        sortDirection === 'desc' ?
                        <TrendingDown className="h-[14px] w-[14px]" /> :
                        <TrendingUp className="h-[14px] w-[14px]" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent, index) => {
                  const commission = commissionBreakdowns.find(c => c.agentId === agent.id)

                  return (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium text-slate-500">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{agent.name}</p>
                          <p className="text-sm text-slate-500">
                            Join: {new Date(agent.joinDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          agent.tier === 'Platinum' ? 'default' :
                          agent.tier === 'Gold' ? 'secondary' : 'outline'
                        }>
                          {agent.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(agent.revenue)}
                      </TableCell>
                      <TableCell>{agent.jamaahCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-8">
                          <span className={agent.conversionRate >= 65 ? 'text-green-600 font-medium' : ''}>
                            {agent.conversionRate}%
                          </span>
                          {agent.conversionRate >= 65 && (
                            <Target className="h-[14px] w-[14px] text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(agent.avgDealSize)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-8">
                          <Clock className="h-[14px] w-[14px] text-slate-400" />
                          <span className={agent.responseTime <= 3 ? 'text-green-600 font-medium' : ''}>
                            {agent.responseTime}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {commission ? formatCurrency(commission.total) : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-48">
              <p className="text-slate-500">Tidak ada agent yang sesuai filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Base Pay</TableHead>
                  <TableHead className="text-right">Tier Bonus</TableHead>
                  <TableHead className="text-right">Performance Bonus</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionBreakdowns.slice(0, 10).map((comm) => (
                  <TableRow key={comm.agentId}>
                    <TableCell className="font-medium">{comm.agentName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(comm.basePay)}</TableCell>
                    <TableCell className="text-right text-amber-600">
                      {comm.tierBonus > 0 ? formatCurrency(comm.tierBonus) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {comm.performanceBonus > 0 ? formatCurrency(comm.performanceBonus) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-blue-600">
                      {formatCurrency(comm.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
