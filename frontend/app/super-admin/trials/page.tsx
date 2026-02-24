'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
import {
  ScanText,
  MessageSquare,
  MessageCircle,
  CreditCard,
  FileSignature,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  PlayCircle,
  XCircle,
  Settings,
} from 'lucide-react';
import {
  availableFeatures,
  activeTrials,
  trialKPIs,
  conversionFunnel,
  ActiveTrial,
} from '@/lib/data/mock-super-admin-trials';
import { toast } from 'sonner';

export default function TrialsPage() {
  const [selectedTrial, setSelectedTrial] = useState<ActiveTrial | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleViewUsage = (trial: ActiveTrial) => {
    setSelectedTrial(trial);
  };

  const handleExtendTrial = (trial: ActiveTrial) => {
    toast.success(`Trial untuk ${trial.tenant} berhasil diperpanjang 7 hari`);
  };

  const handleConvertToPaid = (trial: ActiveTrial) => {
    toast.success(`Trial untuk ${trial.tenant} dikonversi ke paid subscription`);
  };

  const handleRevokeAccess = (trial: ActiveTrial) => {
    toast.success(`Akses trial untuk ${trial.tenant} telah dicabut`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Expiring Soon':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Converted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeatureIcon = (iconName: string) => {
    const iconProps = { className: 'h-[20px] w-[20px]' };
    switch (iconName) {
      case 'ScanText':
        return <ScanText {...iconProps} />;
      case 'MessageSquare':
        return <MessageSquare {...iconProps} />;
      case 'MessageCircle':
        return <MessageCircle {...iconProps} />;
      case 'CreditCard':
        return <CreditCard {...iconProps} />;
      case 'FileSignature':
        return <FileSignature {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Super Admin', href: '/super-admin' },
        { label: 'Feature Trial Management' },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Feature Trial Management
            </h1>
            <p className="text-gray-600 mt-8">
              Kelola trial features dan konversi ke paid subscription
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
              <PlayCircle className="h-[16px] w-[16px] text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trialKPIs.activeTrials}</div>
              <p className="text-xs text-gray-600 mt-4">
                Across {availableFeatures.filter((f) => f.featureType === 'TRIAL').length}{' '}
                trial features
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-[16px] w-[16px] text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trialKPIs.conversionRate}%</div>
              <p className="text-xs text-green-600 mt-4">+3.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Avg Trial Duration</CardTitle>
              <Clock className="h-[16px] w-[16px] text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trialKPIs.avgTrialDuration} days</div>
              <p className="text-xs text-gray-600 mt-4">Before conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Calendar className="h-[16px] w-[16px] text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {trialKPIs.expiringSoon}
              </div>
              <p className="text-xs text-gray-600 mt-4">Within next 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <p className="text-sm text-gray-600">
              Features yang tersedia untuk trial dan paid
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {availableFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="p-16 border rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-12">
                    <div className="p-12 bg-blue-50 rounded-lg">
                      {getFeatureIcon(feature.icon)}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        feature.featureType === 'TRIAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {feature.featureType}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-8">{feature.featureName}</h3>
                  <p className="text-sm text-gray-600 mb-12">
                    {feature.description}
                  </p>
                  {feature.featureType === 'TRIAL' && (
                    <div className="flex items-center gap-8 text-xs text-gray-600">
                      <Clock className="h-[16px] w-[16px]" />
                      <span>{feature.trialDuration} days trial</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <p className="text-sm text-gray-600">Trial to paid conversion journey</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-16">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-12">
                      <span className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-blue-600 text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{stage.stage}</p>
                        <p className="text-sm text-gray-600">
                          {stage.count} tenants ({stage.percentage.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stage.count}</p>
                    </div>
                  </div>
                  <Progress value={stage.percentage} className="h-[12px]" />
                  {index < conversionFunnel.length - 1 && (
                    <div className="flex justify-center my-8">
                      <div className="text-gray-400 text-xs">
                        ↓ {(
                          ((conversionFunnel[index + 1].count - stage.count) /
                            stage.count) *
                          100
                        ).toFixed(1)}
                        % drop-off
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Trials Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Trials ({activeTrials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Feature</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTrials.map((trial) => {
                    const daysRemaining = getDaysRemaining(trial.expiresAt);
                    const usagePercent =
                      (trial.usageCount / trial.usageLimit) * 100;

                    return (
                      <TableRow key={trial.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{trial.tenant}</p>
                            <p className="text-xs text-gray-600">
                              {trial.tenantSubdomain}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{trial.feature}</TableCell>
                        <TableCell>
                          {new Date(trial.startedAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>
                              {new Date(trial.expiresAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            {trial.status !== 'Converted' &&
                              trial.status !== 'Expired' && (
                                <p
                                  className={`text-xs ${
                                    daysRemaining <= 3
                                      ? 'text-red-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {daysRemaining > 0
                                    ? `${daysRemaining} hari lagi`
                                    : 'Expired'}
                                </p>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-4 min-w-[120px]">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">
                                {trial.usageCount} / {trial.usageLimit}
                              </span>
                              <span className="font-medium">
                                {usagePercent.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={usagePercent} className="h-[6px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(trial.status)}
                          >
                            {trial.status}
                          </Badge>
                          {trial.conversionDate && (
                            <p className="text-xs text-gray-600 mt-4">
                              {new Date(trial.conversionDate).toLocaleDateString(
                                'id-ID'
                              )}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-8">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUsage(trial)}
                              className="h-[32px]"
                            >
                              <Eye className="h-[16px] w-[16px]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trial Detail Modal */}
      <Dialog open={!!selectedTrial} onOpenChange={() => setSelectedTrial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trial Usage Details</DialogTitle>
            <DialogDescription>
              {selectedTrial?.tenant} - {selectedTrial?.feature}
            </DialogDescription>
          </DialogHeader>

          {selectedTrial && (
            <div className="space-y-24">
              {/* Status Overview */}
              <div className="grid grid-cols-2 gap-16">
                <div className="p-16 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-8">Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedTrial.status)}
                  >
                    {selectedTrial.status}
                  </Badge>
                </div>
                <div className="p-16 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-8">Days Remaining</p>
                  <p className="text-2xl font-bold">
                    {getDaysRemaining(selectedTrial.expiresAt)} days
                  </p>
                </div>
              </div>

              {/* Usage Stats */}
              <div>
                <h4 className="font-semibold mb-12">Usage Statistics</h4>
                <div className="space-y-12">
                  <div>
                    <div className="flex justify-between text-sm mb-8">
                      <span className="text-gray-600">Usage Count</span>
                      <span className="font-medium">
                        {selectedTrial.usageCount} / {selectedTrial.usageLimit}
                      </span>
                    </div>
                    <Progress
                      value={(selectedTrial.usageCount / selectedTrial.usageLimit) * 100}
                      className="h-[12px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-12 mt-16">
                    <div className="p-12 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600">Started</p>
                      <p className="font-medium">
                        {new Date(selectedTrial.startedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="p-12 bg-amber-50 rounded-lg">
                      <p className="text-xs text-gray-600">Expires</p>
                      <p className="font-medium">
                        {new Date(selectedTrial.expiresAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Info */}
              {selectedTrial.conversionDate && (
                <div className="p-16 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-12 mb-8">
                    <CheckCircle className="h-[20px] w-[20px] text-green-600" />
                    <h4 className="font-semibold text-green-900">Converted to Paid</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <p className="text-xs text-green-700">Conversion Date</p>
                      <p className="font-medium text-green-900">
                        {new Date(selectedTrial.conversionDate).toLocaleDateString(
                          'id-ID'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Revenue Generated</p>
                      <p className="font-medium text-green-900">
                        Rp {selectedTrial.revenue?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedTrial.status !== 'Converted' &&
                selectedTrial.status !== 'Expired' && (
                  <div className="flex flex-wrap gap-12 pt-16 border-t">
                    <Button
                      onClick={() => handleExtendTrial(selectedTrial)}
                      className="h-[40px]"
                    >
                      <Calendar className="h-[16px] w-[16px] mr-8" />
                      Extend Trial
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleConvertToPaid(selectedTrial)}
                      className="h-[40px]"
                    >
                      <CheckCircle className="h-[16px] w-[16px] mr-8" />
                      Convert to Paid
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRevokeAccess(selectedTrial)}
                      className="h-[40px] text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-[16px] w-[16px] mr-8" />
                      Revoke Access
                    </Button>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
