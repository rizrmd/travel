'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Server,
  Database,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Terminal,
} from 'lucide-react';
import {
  systemHealth,
  systemMetrics,
  activityFeed,
  tenantActivities,
  errorMetrics,
  errorTypes,
  performanceMetrics,
  alerts,
  monitoringKPIs,
} from '@/lib/data/mock-super-admin-monitoring';

export default function MonitoringPage() {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-[20px] w-[20px] text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-[20px] w-[20px] text-amber-600" />;
      case 'down':
        return <XCircle className="h-[20px] w-[20px] text-red-600" />;
      default:
        return <Activity className="h-[20px] w-[20px] text-gray-600" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Users className="h-[16px] w-[16px] text-blue-600" />;
      case 'booking':
        return <Activity className="h-[16px] w-[16px] text-green-600" />;
      case 'payment':
        return <TrendingUp className="h-[16px] w-[16px] text-purple-600" />;
      case 'error':
        return <XCircle className="h-[16px] w-[16px] text-red-600" />;
      case 'api_call':
        return <Terminal className="h-[16px] w-[16px] text-gray-600" />;
      default:
        return <Activity className="h-[16px] w-[16px] text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AppLayout
      userName="System Administrator"
      userRole="Super Admin"
      breadcrumbs={[
        { label: 'Super Admin', href: '/super-admin' },
        { label: 'Cross-Tenant Monitoring' },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Cross-Tenant Monitoring
            </h1>
            <p className="text-gray-600 mt-8">
              Monitor kesehatan sistem dan aktivitas real-time
            </p>
          </div>
          <div className="flex items-center gap-12">
            <span className="text-sm text-gray-600">Auto-refresh (30s)</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center gap-8 text-sm text-gray-600">
          <Clock className="h-[16px] w-[16px]" />
          <span>
            Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
            {autoRefresh && (
              <span className="ml-8 inline-flex items-center">
                <span className="relative flex h-[8px] w-[8px] ml-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-[8px] w-[8px] bg-green-500"></span>
                </span>
              </span>
            )}
          </span>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {systemHealth.map((service) => (
            <Card key={service.service}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle className="text-sm font-medium">
                  {service.service}
                </CardTitle>
                {getHealthIcon(service.status)}
              </CardHeader>
              <CardContent>
                <Badge
                  variant="outline"
                  className={getHealthStatusColor(service.status)}
                >
                  {service.status.toUpperCase()}
                </Badge>
                <div className="mt-12 space-y-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-medium">{service.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium">{service.uptime}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span
                      className={`text-2xl font-bold ${getMetricStatusColor(
                        metric.status
                      )}`}
                    >
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                  <Progress
                    value={(metric.value / metric.threshold) * 100}
                    className="h-[8px]"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0{metric.unit}</span>
                    <span>
                      Threshold: {metric.threshold}
                      {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed & Tenant Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity Feed</CardTitle>
              <p className="text-sm text-gray-600">
                Last 50 activities across all tenants
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 max-h-[500px] overflow-y-auto">
                {activityFeed.slice(0, 15).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-12 p-12 bg-gray-50 rounded-lg"
                  >
                    <div className="mt-4">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-8">
                        <p className="text-sm font-medium truncate">
                          {activity.description}
                        </p>
                        <span
                          className={`text-xs ${getSeverityColor(
                            activity.severity
                          )}`}
                        >
                          {activity.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-12 mt-4 text-xs text-gray-600">
                        <span className="font-medium">{activity.tenant}</span>
                        <span>•</span>
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>
                          {new Date(activity.timestamp).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Active Tenants */}
          <Card>
            <CardHeader>
              <CardTitle>Tenant Activity Comparison</CardTitle>
              <p className="text-sm text-gray-600">Top 10 active tenants</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-12">
                {tenantActivities.map((tenant, index) => (
                  <div key={tenant.subdomain} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <span className="text-sm font-bold text-gray-400 w-[24px]">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{tenant.tenantName}</p>
                          <p className="text-xs text-gray-600">
                            {tenant.activeUsers} active users
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{tenant.activityCount}</p>
                        <p className="text-xs text-gray-600">activities</p>
                      </div>
                    </div>
                    <Progress
                      value={
                        (tenant.activityCount /
                          Math.max(...tenantActivities.map((t) => t.activityCount))) *
                        100
                      }
                      className="h-[6px]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Error Rate by Tenant */}
          <Card>
            <CardHeader>
              <CardTitle>Error Rate Monitoring</CardTitle>
              <p className="text-sm text-gray-600">Errors per tenant</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-12">
                {errorMetrics.map((error) => (
                  <div key={error.tenant} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{error.tenant}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-red-600">
                          {error.errorCount} errors
                        </span>
                        <span className="text-xs text-gray-600 ml-8">
                          ({error.errorRate}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={error.errorRate * 50}
                      className="h-[6px] bg-red-100"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error Types Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Error Types Breakdown</CardTitle>
              <p className="text-sm text-gray-600">Distribution by error type</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-12">
                {errorTypes.map((errorType) => (
                  <div key={errorType.type} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{errorType.type}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{errorType.count}</span>
                        <span className="text-xs text-gray-600 ml-8">
                          ({errorType.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress value={errorType.percentage} className="h-[6px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <p className="text-sm text-gray-600">
              System performance indicators
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
              {performanceMetrics.map((metric) => (
                <div key={metric.metric} className="p-16 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-12">{metric.metric}</p>
                  <div className="space-y-8">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-600">Current</span>
                      <span className="text-xl font-bold text-green-600">
                        {metric.current}
                        {metric.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-600">Average</span>
                      <span className="text-sm font-medium">
                        {metric.average}
                        {metric.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-600">P95</span>
                      <span className="text-sm font-medium">
                        {metric.p95}
                        {metric.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Status */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Status</CardTitle>
            <p className="text-sm text-gray-600">
              Critical: {monitoringKPIs.criticalAlerts} | Warning:{' '}
              {monitoringKPIs.warningAlerts} | Info: {monitoringKPIs.infoAlerts}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-16 rounded-lg border ${
                    alert.acknowledged ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-8 mb-8">
                        <Badge
                          variant="outline"
                          className={getAlertColor(alert.level)}
                        >
                          {alert.level.toUpperCase()}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline" className="bg-gray-100">
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-600 mt-4">
                        {new Date(alert.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
