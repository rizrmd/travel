'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { superAdminMenuItems } from '@/lib/navigation/menu-items';
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
import {
  Building2,
  Users,
  DollarSign,
  UserPlus,
  Search,
  Download,
  Eye,
  PauseCircle,
  ArrowUpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Server,
  Activity,
  HardDrive,
  TrendingUp,
} from 'lucide-react';
import { mockTenants, tenantKPIs, Tenant } from '@/lib/data/mock-super-admin-tenants';
import { toast } from 'sonner';

export default function TenantManagementPage() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesPlan = planFilter === 'All' || tenant.plan === planFilter;
    const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
    const matchesSearch =
      tenant.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlan && matchesStatus && matchesSearch;
  });

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleSuspendAccount = (tenant: Tenant) => {
    toast.success(`Akun ${tenant.agencyName} telah disuspend`);
  };

  const handleUpgradePlan = (tenant: Tenant) => {
    toast.success(`Upgrade plan untuk ${tenant.agencyName} berhasil`);
  };

  const handleContactAgency = (tenant: Tenant) => {
    toast.success(`Email dibuka untuk menghubungi ${tenant.agencyName}`);
  };

  const handleExportCSV = () => {
    toast.success('Data tenant berhasil diexport ke CSV');
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Starter':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Trial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Trial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspended':
        return 'bg-red-100 text-red-800 border-red-200';
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
        { label: 'Tenant Management' },
      ]}
      menuItems={superAdminMenuItems}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tenant Management
            </h1>
            <p className="text-gray-600 mt-8">
              Kelola semua tenant dan subscription di platform
            </p>
          </div>
          <Button className="h-[40px]">
            <UserPlus className="h-[16px] w-[16px] mr-8" />
            Buat Tenant Baru
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Building2 className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantKPIs.totalTenants}</div>
              <p className="text-xs text-gray-600 mt-4">
                {tenantKPIs.activeSubscriptions} active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantKPIs.activeSubscriptions}</div>
              <p className="text-xs text-green-600 mt-4">
                {((tenantKPIs.activeSubscriptions / tenantKPIs.totalTenants) * 100).toFixed(
                  1
                )}
                % subscription rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {(tenantKPIs.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-green-600 mt-4">+8.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
              <CardTitle className="text-sm font-medium">Trial Accounts</CardTitle>
              <UserPlus className="h-[16px] w-[16px] text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantKPIs.trialAccounts}</div>
              <p className="text-xs text-amber-600 mt-4">Expiring dalam 7 hari</p>
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
                    placeholder="Cari agency atau subdomain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-40 h-[40px]"
                  />
                </div>
              </div>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-[40px]">
                  <SelectValue placeholder="Filter Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua Plan</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-[40px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="h-[40px]"
              >
                <Download className="h-[16px] w-[16px] mr-8" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Tenant ({filteredTenants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>Subdomain</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Agents</TableHead>
                    <TableHead className="text-right">Jamaah</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">
                        {tenant.agencyName}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-8 py-4 rounded">
                          {tenant.subdomain}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(tenant.status)}
                        >
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{tenant.agents}</TableCell>
                      <TableCell className="text-right">{tenant.jamaah}</TableCell>
                      <TableCell className="text-right">
                        {tenant.monthlyRevenue > 0
                          ? `Rp ${(tenant.monthlyRevenue / 1000000).toFixed(1)}M`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(tenant.createdDate).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-8">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(tenant)}
                            className="h-[32px]"
                          >
                            <Eye className="h-[16px] w-[16px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Detail Modal */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Tenant: {selectedTenant?.agencyName}</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang tenant dan subscription
            </DialogDescription>
          </DialogHeader>

          {selectedTenant && (
            <div className="space-y-24">
              {/* Agency Info */}
              <div>
                <h3 className="font-semibold text-lg mb-12">Informasi Agency</h3>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="flex items-start gap-8">
                      <Building2 className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Agency Name</p>
                        <p className="font-medium">{selectedTenant.agencyName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-8">
                      <Mail className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedTenant.contactEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-8">
                      <Phone className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedTenant.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-start gap-8">
                      <Server className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Subdomain</p>
                        <p className="font-medium">{selectedTenant.subdomain}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-8">
                      <MapPin className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Alamat</p>
                        <p className="font-medium">{selectedTenant.address}</p>
                        <p className="text-sm text-gray-600">{selectedTenant.province}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div>
                <h3 className="font-semibold text-lg mb-12">Detail Subscription</h3>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <Badge
                        variant="outline"
                        className={getPlanColor(selectedTenant.plan)}
                      >
                        {selectedTenant.plan}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedTenant.status)}
                      >
                        {selectedTenant.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-start gap-8">
                      <Calendar className="h-[16px] w-[16px] text-gray-500 mt-4" />
                      <div>
                        <p className="text-sm text-gray-600">Subscription Period</p>
                        <p className="font-medium">
                          {new Date(selectedTenant.subscriptionStart).toLocaleDateString(
                            'id-ID'
                          )}{' '}
                          -{' '}
                          {new Date(selectedTenant.subscriptionEnd).toLocaleDateString(
                            'id-ID'
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="font-medium text-lg">
                        Rp {selectedTenant.monthlyRevenue.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div>
                <h3 className="font-semibold text-lg mb-12">Statistik Penggunaan</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                  <div className="p-12 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-8 mb-8">
                      <Activity className="h-[16px] w-[16px] text-blue-600" />
                      <p className="text-sm text-gray-600">Total Departures</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {selectedTenant.usageStats.totalDepartures}
                    </p>
                  </div>
                  <div className="p-12 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-8 mb-8">
                      <Users className="h-[16px] w-[16px] text-green-600" />
                      <p className="text-sm text-gray-600">Total Bookings</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {selectedTenant.usageStats.totalBookings}
                    </p>
                  </div>
                  <div className="p-12 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-8 mb-8">
                      <Users className="h-[16px] w-[16px] text-purple-600" />
                      <p className="text-sm text-gray-600">Active Agents</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {selectedTenant.usageStats.activeAgents}
                    </p>
                  </div>
                  <div className="p-12 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-8 mb-8">
                      <HardDrive className="h-[16px] w-[16px] text-amber-600" />
                      <p className="text-sm text-gray-600">Storage Used</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {selectedTenant.usageStats.storageUsed} GB
                    </p>
                  </div>
                  <div className="p-12 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-8 mb-8">
                      <TrendingUp className="h-[16px] w-[16px] text-red-600" />
                      <p className="text-sm text-gray-600">API Calls</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {(selectedTenant.usageStats.apiCalls / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="font-semibold text-lg mb-12">Riwayat Pembayaran</h3>
                {selectedTenant.billingHistory.length > 0 ? (
                  <div className="space-y-8">
                    {selectedTenant.billingHistory.map((billing) => (
                      <div
                        key={billing.id}
                        className="flex items-center justify-between p-12 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{billing.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(billing.date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Rp {billing.amount.toLocaleString('id-ID')}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              billing.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : billing.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {billing.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-16">
                    Belum ada riwayat pembayaran
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-12 pt-16 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleContactAgency(selectedTenant)}
                  className="h-[40px]"
                >
                  <Mail className="h-[16px] w-[16px] mr-8" />
                  Contact Agency
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpgradePlan(selectedTenant)}
                  className="h-[40px]"
                >
                  <ArrowUpCircle className="h-[16px] w-[16px] mr-8" />
                  Upgrade Plan
                </Button>
                {selectedTenant.status === 'Active' && (
                  <Button
                    variant="outline"
                    onClick={() => handleSuspendAccount(selectedTenant)}
                    className="h-[40px] text-red-600 hover:text-red-700"
                  >
                    <PauseCircle className="h-[16px] w-[16px] mr-8" />
                    Suspend Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
