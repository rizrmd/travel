"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Activity
} from "lucide-react"
import {
  businessHealthScorecard,
  goalTrackings,
  getScoreColor,
  getScoreBackground,
  getScoreBorder,
  getStatusBadgeColor
} from "@/lib/data/mock-owner-metrics"

export default function OwnerMetricsPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Owner Dashboard', href: '/owner/dashboard' },
        { label: 'Strategic Metrics', href: '/owner/metrics' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Strategic Metrics & Business Health
        </h1>
        <p className="text-slate-600">
          Monitor kesehatan bisnis dan track progress terhadap strategic goals
        </p>
      </div>

      {/* Overall Health Score */}
      <Card className="mb-32">
        <CardContent className="pt-24">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-12">Overall Business Health Score</p>
            <div className="flex items-center justify-center gap-16 mb-16">
              <div className="relative">
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">82</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900 mb-4">Excellent Performance</p>
                <p className="text-sm text-slate-600 mb-8">
                  Bisnis Anda dalam kondisi sangat baik
                </p>
                <Badge className={getStatusBadgeColor('excellent')}>
                  Excellent Health
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-8">
              {businessHealthScorecard.map((category) => (
                <div key={category.id} className="text-center">
                  <div className={`w-full h-[6px] rounded-full mb-6 ${
                    category.score >= 85 ? 'bg-green-500' :
                    category.score >= 70 ? 'bg-blue-500' :
                    category.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <p className="text-xs text-slate-500">{category.name}</p>
                  <p className="text-sm font-semibold text-slate-900">{category.score}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Health Scorecard */}
      <div className="mb-24">
        <h2 className="text-xl font-bold text-slate-900 mb-16">Business Health Scorecard</h2>
        <div className="space-y-24">
          {businessHealthScorecard.map((category) => (
            <Card key={category.id} className={`border-2 ${getScoreBorder(category.score)}`}>
              <CardHeader className={getScoreBackground(category.score)}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-12 mb-8">
                      {category.name}
                      <Badge className={getStatusBadgeColor(category.status)}>
                        {category.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-8">
                      {category.trend === 'up' && (
                        <>
                          <TrendingUp className="h-[16px] w-[16px] text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Trending Up</span>
                        </>
                      )}
                      {category.trend === 'down' && (
                        <>
                          <TrendingDown className="h-[16px] w-[16px] text-red-600" />
                          <span className="text-sm text-red-600 font-medium">Trending Down</span>
                        </>
                      )}
                      {category.trend === 'stable' && (
                        <>
                          <Minus className="h-[16px] w-[16px] text-slate-600" />
                          <span className="text-sm text-slate-600 font-medium">Stable</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-4">Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-24 space-y-24">
                {/* Metrics */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-12 flex items-center gap-8">
                    <Activity className="h-[16px] w-[16px]" />
                    Metrics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {category.metrics.map((metric, index) => {
                      const progressPercentage = (metric.current / metric.target) * 100
                      const isOnTarget = metric.current >= metric.target
                      const vsTarget = ((metric.current - metric.target) / metric.target) * 100

                      return (
                        <div key={index} className="space-y-8">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{metric.label}</p>
                              <div className="flex items-baseline gap-8 mt-4">
                                <span className="text-lg font-bold text-slate-900">
                                  {metric.current}{metric.unit}
                                </span>
                                <span className="text-sm text-slate-500">
                                  / {metric.target}{metric.unit}
                                </span>
                              </div>
                            </div>
                            {isOnTarget ? (
                              <CheckCircle2 className="h-[16px] w-[16px] text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="h-[16px] w-[16px] text-amber-600 flex-shrink-0" />
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isOnTarget ? 'bg-green-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className={isOnTarget ? 'text-green-600' : 'text-amber-600'}>
                                {isOnTarget ? `+${vsTarget.toFixed(1)}% vs target` : `${vsTarget.toFixed(1)}% vs target`}
                              </span>
                              {metric.benchmark && (
                                <span className="text-slate-500">
                                  Industry: {metric.benchmark}{metric.unit}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-12 flex items-center gap-8">
                    <CheckCircle2 className="h-[16px] w-[16px] text-blue-600" />
                    Key Insights
                  </h4>
                  <div className="space-y-8">
                    {category.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-8 p-12 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-[4px] h-[4px] rounded-full bg-blue-600 mt-8 flex-shrink-0" />
                        <p className="text-sm text-blue-900">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-12 flex items-center gap-8">
                    <Target className="h-[16px] w-[16px] text-purple-600" />
                    Recommended Actions
                  </h4>
                  <div className="space-y-8">
                    {category.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-12 p-12 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer group"
                      >
                        <ArrowRight className="h-[16px] w-[16px] text-purple-600 flex-shrink-0 group-hover:translate-x-4 transition-transform" />
                        <p className="text-sm text-purple-900 font-medium">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goal Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Tracking vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-16">
            {goalTrackings.map((goal, index) => {
              const progressPercentage = (goal.actual / goal.target) * 100
              const isOnTrack = goal.status === 'on-track'
              const isAtRisk = goal.status === 'at-risk'
              const isBehind = goal.status === 'behind'

              return (
                <div key={index} className="space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-12 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                        <Badge className={
                          isOnTrack ? 'bg-green-100 text-green-700' :
                          isAtRisk ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="font-semibold text-slate-900">{goal.goal}</p>
                      <p className="text-sm text-slate-500 mt-4">
                        Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-4">Progress</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {goal.actual} / {goal.target}
                        <span className="text-sm text-slate-500 ml-4">{goal.unit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-[8px] bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOnTrack ? 'bg-green-500' :
                          isAtRisk ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        {progressPercentage.toFixed(1)}% achieved
                      </span>
                      <span className="text-sm text-slate-500">
                        {goal.target - goal.actual} {goal.unit} remaining
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
