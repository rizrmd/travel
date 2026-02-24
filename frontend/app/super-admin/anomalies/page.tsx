'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  Database,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
} from 'lucide-react';
import { mockAnomalies, anomalyKPIs, Anomaly } from '@/lib/data/mock-super-admin-anomalies';
import { toast } from 'sonner';

export default function AnomaliesPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnomalies = mockAnomalies.filter((anomaly) => {
    const matchesType = typeFilter === 'All' || anomaly.type === typeFilter;
    const matchesSeverity =
      severityFilter === 'All' || anomaly.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || anomaly.status === statusFilter;
    const matchesSearch =
      anomaly.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anomaly.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSeverity && matchesStatus && matchesSearch;
  });

  const handleViewDetails = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
  };

  const handleMarkInvestigating = (anomaly: Anomaly) => {
    toast.success(`Anomali ditandai sebagai "Investigating"`);
    setSelectedAnomaly(null);
  };

  const handleResolve = (anomaly: Anomaly) => {
    toast.success(`Anomali berhasil diresolve`);
    setSelectedAnomaly(null);
  };

  const handleFalsePositive = (anomaly: Anomaly) => {
    toast.success(`Anomali ditandai sebagai "False Positive"`);
    setSelectedAnomaly(null);
  };

  const handleContactTenant = (anomaly: Anomaly) => {
    toast.success(`Membuka email untuk menghubungi ${anomaly.tenant}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Investigating':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'False Positive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Security':
        return <Shield className="h-[16px] w-[16px]" />;
      case 'Performance':
        return <Zap className="h-[16px] w-[16px]" />;
      case 'Usage':
        return <TrendingUp className="h-[16px] w-[16px]" />;
      case 'Financial':
        return <DollarSign className="h-[16px] w-[16px]" />;
      case 'Data Integrity':
        return <Database className="h-[16px] w-[16px]" />;
      default:
        return <AlertTriangle className="h-[16px] w-[16px]" />;
    }
  };

  const getAnomaliesByType = (type: string) => {
    return mockAnomalies.filter((a) => a.type === type);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Super Admin', href: '/super-admin' },
        { label: 'Anomaly Detection' },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Anomaly Detection
            </h1>
            <p className="text-gray-600 mt-8">
              Deteksi dan kelola anomali sistem secara real-time
            </p>
          </div>
          <Button variant="outline" className="h-[40px]">
            <Settings className="h-[16px] w-[16px] mr-8" />
            Detection Rules
            <Badge variant="outline" className="ml-8 bg-blue-100 text-blue-800">
              Coming Soon
            </Badge>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-[16px] w-[16px] text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {anomalyKPIs.criticalAlerts}
              </div>
              <p className="text-xs text-gray-600 mt-4">Require immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-[16px] w-[16px] text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {anomalyKPIs.warnings}
              </div>
              <p className="text-xs text-gray-600 mt-4">Need monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-[16px] w-[16px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {anomalyKPIs.resolved}
              </div>
              <p className="text-xs text-gray-600 mt-4">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Last 24h Incidents</CardTitle>
              <Clock className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{anomalyKPIs.last24hIncidents}</div>
              <p className="text-xs text-gray-600 mt-4">-15% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-24">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-12 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-gray-400" />
                  <Input
                    placeholder="Cari anomali atau tenant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-40 h-[40px]"
                  />
                </div>
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-[40px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-[40px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="False Positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Anomaly Types Tabs */}
        <Tabs defaultValue="All" onValueChange={setTypeFilter}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="All">
              All ({mockAnomalies.length})
            </TabsTrigger>
            <TabsTrigger value="Security">
              <Shield className="h-[16px] w-[16px] mr-8" />
              Security ({getAnomaliesByType('Security').length})
            </TabsTrigger>
            <TabsTrigger value="Performance">
              <Zap className="h-[16px] w-[16px] mr-8" />
              Performance ({getAnomaliesByType('Performance').length})
            </TabsTrigger>
            <TabsTrigger value="Usage">
              <TrendingUp className="h-[16px] w-[16px] mr-8" />
              Usage ({getAnomaliesByType('Usage').length})
            </TabsTrigger>
            <TabsTrigger value="Financial">
              <DollarSign className="h-[16px] w-[16px] mr-8" />
              Financial ({getAnomaliesByType('Financial').length})
            </TabsTrigger>
            <TabsTrigger value="Data Integrity">
              <Database className="h-[16px] w-[16px] mr-8" />
              Data ({getAnomaliesByType('Data Integrity').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={typeFilter} className="mt-24">
            <Card>
              <CardHeader>
                <CardTitle>
                  Anomaly List ({filteredAnomalies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Severity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Detected At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnomalies.map((anomaly) => (
                        <TableRow key={anomaly.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getSeverityColor(anomaly.severity)}
                            >
                              {anomaly.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-8">
                              {getTypeIcon(anomaly.type)}
                              <span className="text-sm">{anomaly.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{anomaly.tenant}</p>
                              <p className="text-xs text-gray-600">
                                {anomaly.tenantSubdomain}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-sm truncate">{anomaly.description}</p>
                          </TableCell>
                          <TableCell>
                            {new Date(anomaly.detectedAt).toLocaleString('id-ID', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(anomaly.status)}
                            >
                              {anomaly.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(anomaly)}
                              className="h-[32px]"
                            >
                              <Eye className="h-[16px] w-[16px]" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredAnomalies.length === 0 && (
                  <div className="text-center py-32">
                    <CheckCircle className="h-[48px] w-[48px] mx-auto text-green-600 mb-16" />
                    <p className="text-gray-600">Tidak ada anomali ditemukan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Anomaly Detail Modal */}
      <Dialog open={!!selectedAnomaly} onOpenChange={() => setSelectedAnomaly(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Anomali</DialogTitle>
            <DialogDescription>
              Informasi lengkap dan langkah resolusi
            </DialogDescription>
          </DialogHeader>

          {selectedAnomaly && (
            <div className="space-y-24">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-8 mb-8">
                    <Badge
                      variant="outline"
                      className={getSeverityColor(selectedAnomaly.severity)}
                    >
                      {selectedAnomaly.severity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedAnomaly.status)}
                    >
                      {selectedAnomaly.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{selectedAnomaly.tenant}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedAnomaly.tenantSubdomain}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Detected at</p>
                  <p className="font-medium">
                    {new Date(selectedAnomaly.detectedAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-8">Description</h4>
                <p className="text-gray-700">{selectedAnomaly.description}</p>
              </div>

              {/* Impact */}
              <div>
                <h4 className="font-semibold mb-8">Impact</h4>
                <div className="p-12 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-900">{selectedAnomaly.impact}</p>
                </div>
              </div>

              {/* Root Cause */}
              {selectedAnomaly.rootCause && (
                <div>
                  <h4 className="font-semibold mb-8">Root Cause</h4>
                  <div className="p-12 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-900">{selectedAnomaly.rootCause}</p>
                  </div>
                </div>
              )}

              {/* Affected Resources */}
              <div>
                <h4 className="font-semibold mb-8">Affected Resources</h4>
                <div className="flex flex-wrap gap-8">
                  {selectedAnomaly.affectedResources.map((resource, index) => (
                    <Badge key={index} variant="outline">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-12">Timeline</h4>
                <div className="space-y-12">
                  {selectedAnomaly.timeline.map((event, index) => (
                    <div key={index} className="flex gap-12">
                      <div className="flex flex-col items-center">
                        <div className="h-[8px] w-[8px] rounded-full bg-blue-600"></div>
                        {index < selectedAnomaly.timeline.length - 1 && (
                          <div className="flex-1 w-[2px] bg-blue-200 min-h-[40px]"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-16">
                        <p className="text-sm font-medium">{event.event}</p>
                        <div className="flex items-center gap-8 mt-4 text-xs text-gray-600">
                          <span>{event.actor}</span>
                          <span>•</span>
                          <span>
                            {new Date(event.timestamp).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Steps */}
              {selectedAnomaly.resolutionSteps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-12">Resolution Steps</h4>
                  <div className="space-y-8">
                    {selectedAnomaly.resolutionSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-12 p-12 bg-gray-50 rounded-lg"
                      >
                        <span className="flex items-center justify-center h-[24px] w-[24px] rounded-full bg-blue-600 text-white text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="flex-1 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-12 pt-16 border-t">
                {selectedAnomaly.status === 'Active' && (
                  <Button
                    onClick={() => handleMarkInvestigating(selectedAnomaly)}
                    className="h-[40px]"
                  >
                    Mark as Investigating
                  </Button>
                )}
                {(selectedAnomaly.status === 'Active' ||
                  selectedAnomaly.status === 'Investigating') && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleResolve(selectedAnomaly)}
                      className="h-[40px]"
                    >
                      <CheckCircle className="h-[16px] w-[16px] mr-8" />
                      Resolve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleFalsePositive(selectedAnomaly)}
                      className="h-[40px]"
                    >
                      <XCircle className="h-[16px] w-[16px] mr-8" />
                      Flag as False Positive
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleContactTenant(selectedAnomaly)}
                  className="h-[40px]"
                >
                  Contact Tenant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
