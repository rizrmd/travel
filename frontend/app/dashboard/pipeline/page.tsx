"use client"

import { useMemo } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  FileCheck,
  FileUp,
  Stamp,
  ShoppingBag,
  Plane,
  Hotel,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Phone,
} from "lucide-react"
import { adminMenuItems } from "@/lib/navigation/menu-items"
import {
  activePipelineStats,
  activeBottleneckAlerts,
  calculatePipelineHealth,
  getUpcomingDepartures,
  isUsingLargeDataset,
  datasetSize,
} from "@/lib/data/mock-pipeline"
import { cn } from "@/lib/utils"

// Icon mapping
const stageIcons: Record<string, any> = {
  'stage-1': FileText,
  'stage-2': FileCheck,
  'stage-3': FileUp,
  'stage-5': Stamp,
  'stage-7': ShoppingBag,
  'stage-8': Plane,
}

const stageColors: Record<string, string> = {
  'stage-1': 'blue',
  'stage-2': 'blue',
  'stage-3': 'purple',
  'stage-5': 'orange',
  'stage-7': 'teal',
  'stage-8': 'sky',
}

export default function PipelinePage() {
  const stageStats = useMemo(() => activePipelineStats, [])
  const bottlenecks = useMemo(() => activeBottleneckAlerts, [])
  const health = useMemo(() => calculatePipelineHealth(), [])
  const upcomingDepartures = useMemo(() => getUpcomingDepartures(), [])

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
      sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pipeline Overview", href: "/dashboard/pipeline", isCurrentPage: true },
      ]}
    >
      <div className="space-y-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
              Production Pipeline Overview
              {isUsingLargeDataset && (
                <Badge variant="outline" className="ml-12 text-xs">
                  Demo: {datasetSize.toLocaleString()} Jamaah
                </Badge>
              )}
            </h1>
            <p className="mt-8 text-slate-600">
              Monitor jamaah progress across all pipeline stages
            </p>
          </div>
          <Link href="/dashboard/pipeline/tasks">
            <Button>
              <Users className="h-[16px] w-[16px] mr-8" />
              View Task Queue
            </Button>
          </Link>
        </div>

        {/* Pipeline Health KPI */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24">
          <Card>
            <CardHeader className="pb-8">
              <CardTitle className="text-sm font-medium text-slate-600">Total Jamaah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{health.totalJamaah}</div>
              <p className="text-xs text-slate-500 mt-4">In pipeline</p>
            </CardContent>
          </Card>

          <Card className="border-green-300 bg-green-50">
            <CardHeader className="pb-8">
              <CardTitle className="text-sm font-medium text-green-700">On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{health.onTrack}</div>
              <p className="text-xs text-green-600 mt-4">{Math.round((health.onTrack / health.totalJamaah) * 100)}% of total</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-300 bg-yellow-50">
            <CardHeader className="pb-8">
              <CardTitle className="text-sm font-medium text-yellow-700">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">{health.atRisk}</div>
              <p className="text-xs text-yellow-600 mt-4">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-red-300 bg-red-50">
            <CardHeader className="pb-8">
              <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{health.overdue}</div>
              <p className="text-xs text-red-600 mt-4">Urgent action required</p>
            </CardContent>
          </Card>
        </section>

        {/* Pipeline Stages Overview */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-16">Pipeline Stages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {stageStats.map((stage) => {
              const Icon = stageIcons[stage.stageId] || FileText
              const colorClasses = getColorClasses(stageColors[stage.stageId] || 'blue')
              const overduePercent = Math.round((stage.overdue / stage.totalJamaah) * 100)

              return (
                <Card
                  key={stage.stageId}
                  className={cn(
                    "border-2",
                    stage.overdue > 3 ? "border-red-300" : colorClasses.border
                  )}
                >
                  <CardHeader className="pb-12">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-12">
                        <div className={cn("p-10 rounded-lg", colorClasses.bg)}>
                          <Icon className={cn("h-[20px] w-[20px]", colorClasses.text)} />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-slate-900">
                            {stage.stageName}
                          </CardTitle>
                          <p className="text-xs text-slate-500 mt-4">
                            {stage.totalJamaah} jamaah total
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-12">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">In Progress</span>
                      <span className="font-semibold text-slate-900">{stage.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Completed</span>
                      <span className="font-semibold text-green-600">{stage.completed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Overdue</span>
                      <span className={cn(
                        "font-semibold",
                        stage.overdue > 0 ? "text-red-600" : "text-slate-400"
                      )}>
                        {stage.overdue}
                      </span>
                    </div>
                    <div className="pt-8 border-t">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>Avg. Completion</span>
                        <span className="font-medium">{stage.avgCompletionDays} days</span>
                      </div>
                      {stage.overdue > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {overduePercent}% overdue rate
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Bottleneck Alerts & Upcoming Departures */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Bottleneck Alerts */}
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center gap-8">
                <AlertTriangle className="h-[20px] w-[20px] text-red-600" />
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Bottleneck Alerts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-16">
              {bottlenecks.length === 0 ? (
                <div className="text-center py-24 text-slate-500">
                  <CheckCircle className="h-[48px] w-[48px] mx-auto mb-12 text-green-400" />
                  <p>No bottlenecks detected</p>
                </div>
              ) : (
                bottlenecks.map((alert) => (
                  <div
                    key={alert.stageId}
                    className={cn(
                      "p-16 rounded-lg border-2",
                      alert.severity === 'critical' ? "border-red-300 bg-red-50" : "border-yellow-300 bg-yellow-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-8 mb-4">
                          <Badge
                            variant={alert.severity === 'critical' ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-semibold text-slate-900">
                            {alert.stageName}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{alert.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{alert.jamaahCount} jamaah stuck</span>
                      <span className="font-medium text-red-600">+{alert.avgDelayDays} days avg delay</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Departures */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-8">
                <Plane className="h-[20px] w-[20px] text-sky-600" />
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Upcoming Departures (7 Days)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-12">
              {upcomingDepartures.length === 0 ? (
                <div className="text-center py-24 text-slate-500">
                  <Clock className="h-[48px] w-[48px] mx-auto mb-12 text-slate-300" />
                  <p>No departures in next 7 days</p>
                </div>
              ) : (
                upcomingDepartures.map((jamaah) => (
                  <div
                    key={jamaah.jamaahId}
                    className="p-12 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="font-semibold text-slate-900">{jamaah.jamaahName}</p>
                        <p className="text-xs text-slate-500">{jamaah.packageName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {jamaah.departure}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-slate-900">{jamaah.overallProgress}%</span>
                      </div>
                      <Progress value={jamaah.overallProgress} className="h-[6px]" />
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            jamaah.currentStageStatus === 'on-track' ? 'outline' :
                            jamaah.currentStageStatus === 'at-risk' ? 'secondary' :
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {jamaah.currentStageStatus.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Link href={`/dashboard/pipeline/jamaah/${jamaah.jamaahId}`}>
                          <Button variant="ghost" size="sm" className="h-[28px] text-xs">
                            Details
                            <ArrowRight className="h-[12px] w-[12px] ml-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  )
}
