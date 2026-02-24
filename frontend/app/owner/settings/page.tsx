"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Upload,
  Save,
  DollarSign,
  CreditCard,
  Users,
  UserPlus,
  Crown,
  Award,
  Medal,
  TrendingUp,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react"
import { toast } from "sonner"

export default function OwnerSettingsPage() {
  const handleSaveProfile = () => {
    toast.success("Profil berhasil disimpan", {
      description: "Perubahan profil bisnis telah tersimpan"
    })
  }

  const handleUploadLogo = () => {
    toast.info("Upload logo", {
      description: "Fitur upload akan segera tersedia"
    })
  }

  const handleSaveCommission = () => {
    toast.success("Komisi berhasil disimpan", {
      description: "Struktur komisi telah diperbarui"
    })
  }

  const handleUpgradePlan = () => {
    toast.info("Upgrade Plan", {
      description: "Anda akan diarahkan ke halaman upgrade"
    })
  }

  const handleInviteUser = () => {
    toast.success("Undangan terkirim", {
      description: "Email undangan telah dikirim ke user baru"
    })
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Owner Dashboard', href: '/owner/dashboard' },
        { label: 'Settings', href: '/owner/settings' },
      ]}
    >
      {/* Page Header */}
      <div className="mb-24">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Agency Settings
        </h1>
        <p className="text-slate-600">
          Kelola profil bisnis, komisi, billing, dan tim Anda
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-24">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="profile">Business Profile</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Business Profile Tab */}
        <TabsContent value="profile" className="space-y-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-12">
                <Building2 className="h-[20px] w-[20px]" />
                Informasi Travel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-24">
              {/* Logo */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-12 block">
                  Logo Travel
                </label>
                <div className="flex items-center gap-16">
                  <div className="w-[80px] h-[80px] bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                    <Building2 className="h-[32px] w-[32px] text-slate-400" />
                  </div>
                  <Button variant="outline" onClick={handleUploadLogo} className="h-[32px]">
                    <Upload className="h-[14px] w-[14px] mr-8" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              {/* Agency Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block">
                    Nama Travel
                  </label>
                  <Input
                    defaultValue="Al-Karomah Travel & Tours"
                    className="h-[40px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block">
                    Nomor Izin Usaha
                  </label>
                  <Input
                    defaultValue="551/2022/KEMENAG"
                    className="h-[40px]"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block flex items-center gap-8">
                    <Mail className="h-[14px] w-[14px]" />
                    Email Kantor
                  </label>
                  <Input
                    type="email"
                    defaultValue="info@alkaromah.travel"
                    className="h-[40px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block flex items-center gap-8">
                    <Phone className="h-[14px] w-[14px]" />
                    Telepon Kantor
                  </label>
                  <Input
                    type="tel"
                    defaultValue="+62 21 5551 2345"
                    className="h-[40px]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-8 block flex items-center gap-8">
                  <MapPin className="h-[14px] w-[14px]" />
                  Alamat Kantor
                </label>
                <Input
                  defaultValue="Jl. Sudirman No. 123, Jakarta Pusat 10220"
                  className="h-[40px]"
                />
              </div>

              {/* License Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block flex items-center gap-8">
                    <FileText className="h-[14px] w-[14px]" />
                    NPWP
                  </label>
                  <Input
                    defaultValue="01.234.567.8-901.000"
                    className="h-[40px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-8 block">
                    Tahun Berdiri
                  </label>
                  <Input
                    defaultValue="2015"
                    className="h-[40px]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="h-[40px]">
                  <Save className="h-[16px] w-[16px] mr-8" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Structure Tab */}
        <TabsContent value="commission" className="space-y-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-12">
                <DollarSign className="h-[20px] w-[20px]" />
                Tier Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-24">
                {/* Silver Tier */}
                <div className="p-16 border-2 border-slate-300 rounded-lg">
                  <div className="flex items-center gap-12 mb-16">
                    <Medal className="h-[24px] w-[24px] text-slate-500" />
                    <h3 className="text-lg font-bold text-slate-900">Silver Tier</h3>
                    <Badge variant="outline">Entry Level</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Base Commission Rate</label>
                      <Input defaultValue="8%" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Revenue/Month</label>
                      <Input defaultValue="Rp 0" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Jamaah/Month</label>
                      <Input defaultValue="0" className="h-[40px]" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Tier untuk agent baru atau yang belum mencapai target minimum
                  </p>
                </div>

                {/* Gold Tier */}
                <div className="p-16 border-2 border-amber-300 rounded-lg bg-amber-50/30">
                  <div className="flex items-center gap-12 mb-16">
                    <Award className="h-[24px] w-[24px] text-amber-600" />
                    <h3 className="text-lg font-bold text-slate-900">Gold Tier</h3>
                    <Badge className="bg-amber-100 text-amber-700">Mid Level</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Base Commission Rate</label>
                      <Input defaultValue="9%" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Revenue/Month</label>
                      <Input defaultValue="Rp 200jt" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Jamaah/Month</label>
                      <Input defaultValue="15" className="h-[40px]" />
                    </div>
                  </div>
                  <div className="flex items-start gap-8 p-12 bg-amber-100 rounded-lg border border-amber-300">
                    <TrendingUp className="h-[16px] w-[16px] text-amber-700 mt-2 flex-shrink-0" />
                    <p className="text-sm text-amber-900">
                      <strong>Tier Bonus:</strong> +1% additional commission on all sales
                    </p>
                  </div>
                </div>

                {/* Platinum Tier */}
                <div className="p-16 border-2 border-purple-300 rounded-lg bg-purple-50/30">
                  <div className="flex items-center gap-12 mb-16">
                    <Crown className="h-[24px] w-[24px] text-purple-600" />
                    <h3 className="text-lg font-bold text-slate-900">Platinum Tier</h3>
                    <Badge className="bg-purple-100 text-purple-700">Top Level</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Base Commission Rate</label>
                      <Input defaultValue="10%" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Revenue/Month</label>
                      <Input defaultValue="Rp 350jt" className="h-[40px]" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-8 block">Min Jamaah/Month</label>
                      <Input defaultValue="25" className="h-[40px]" />
                    </div>
                  </div>
                  <div className="flex items-start gap-8 p-12 bg-purple-100 rounded-lg border border-purple-300">
                    <TrendingUp className="h-[16px] w-[16px] text-purple-700 mt-2 flex-shrink-0" />
                    <p className="text-sm text-purple-900">
                      <strong>Tier Bonus:</strong> +2% additional commission + priority support + quarterly bonus
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-24">
                <h4 className="font-semibold text-slate-900 mb-12">Performance Bonus Rules</h4>
                <div className="space-y-12 p-16 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-12">
                    <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Conversion Rate Bonus</p>
                      <p className="text-sm text-green-700">+1% commission jika conversion rate ≥ 65%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-12">
                    <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Monthly Target Bonus</p>
                      <p className="text-sm text-green-700">Rp 2jt cash bonus jika mencapai 150% dari target bulanan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-12">
                    <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Quarterly Excellence Award</p>
                      <p className="text-sm text-green-700">Top 3 agent mendapat bonus Rp 5jt - 10jt per kuartal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-24">
                <Button onClick={handleSaveCommission} className="h-[40px]">
                  <Save className="h-[16px] w-[16px] mr-8" />
                  Simpan Struktur Komisi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Subscription Tab */}
        <TabsContent value="billing" className="space-y-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-12">
                <CreditCard className="h-[20px] w-[20px]" />
                Current Plan & Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-24">
              {/* Current Plan */}
              <div className="p-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                <div className="flex items-start justify-between mb-16">
                  <div>
                    <Badge className="bg-white text-blue-600 mb-12">Current Plan</Badge>
                    <h3 className="text-2xl font-bold mb-8">Professional Plan</h3>
                    <p className="text-blue-100">For growing travel agencies</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">Rp 2.5jt</p>
                    <p className="text-blue-100">per bulan</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-16 pt-16 border-t border-blue-400">
                  <div>
                    <p className="text-sm text-blue-100 mb-4">Next Billing</p>
                    <p className="font-semibold">1 Januari 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-4">Payment Method</p>
                    <p className="font-semibold">Transfer Bank BCA</p>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-16">Usage This Month</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <Card>
                    <CardContent className="pt-16">
                      <p className="text-sm text-slate-600 mb-8">Active Agents</p>
                      <div className="flex items-baseline gap-8 mb-12">
                        <p className="text-2xl font-bold text-slate-900">18</p>
                        <p className="text-sm text-slate-500">/ 25 agents</p>
                      </div>
                      <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-16">
                      <p className="text-sm text-slate-600 mb-8">Active Jamaah</p>
                      <div className="flex items-baseline gap-8 mb-12">
                        <p className="text-2xl font-bold text-slate-900">247</p>
                        <p className="text-sm text-slate-500">/ 500 jamaah</p>
                      </div>
                      <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '49.4%' }} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-16">
                      <p className="text-sm text-slate-600 mb-8">WhatsApp Messages</p>
                      <div className="flex items-baseline gap-8 mb-12">
                        <p className="text-2xl font-bold text-slate-900">3.2k</p>
                        <p className="text-sm text-slate-500">/ 5k messages</p>
                      </div>
                      <div className="h-[6px] bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '64%' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Available Plans */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-16">Available Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {/* Starter */}
                  <Card className="border-2 border-slate-200">
                    <CardContent className="pt-24">
                      <p className="text-sm font-medium text-slate-600 mb-8">Starter</p>
                      <p className="text-3xl font-bold text-slate-900 mb-16">Rp 1jt</p>
                      <div className="space-y-8 mb-24">
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Max 10 agents</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Max 200 jamaah</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">2k WhatsApp/month</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full h-[40px]" disabled>
                        Current Plan: Professional
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Professional - Current */}
                  <Card className="border-2 border-blue-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-12 py-4">
                      CURRENT
                    </div>
                    <CardContent className="pt-24">
                      <p className="text-sm font-medium text-blue-600 mb-8">Professional</p>
                      <p className="text-3xl font-bold text-slate-900 mb-16">Rp 2.5jt</p>
                      <div className="space-y-8 mb-24">
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-900 font-medium">Max 25 agents</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-900 font-medium">Max 500 jamaah</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-900 font-medium">5k WhatsApp/month</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-900 font-medium">Priority support</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full h-[40px]" disabled>
                        Active Plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Enterprise */}
                  <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="pt-24">
                      <p className="text-sm font-medium text-purple-600 mb-8">Enterprise</p>
                      <p className="text-3xl font-bold text-slate-900 mb-16">Rp 5jt</p>
                      <div className="space-y-8 mb-24">
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Unlimited agents</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Unlimited jamaah</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">15k WhatsApp/month</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Dedicated support</span>
                        </div>
                        <div className="flex items-start gap-8 text-sm">
                          <CheckCircle2 className="h-[16px] w-[16px] text-green-600 mt-2 flex-shrink-0" />
                          <span className="text-slate-600">Custom integrations</span>
                        </div>
                      </div>
                      <Button onClick={handleUpgradePlan} className="w-full h-[40px] bg-purple-600 hover:bg-purple-700">
                        <TrendingUp className="h-[14px] w-[14px] mr-8" />
                        Upgrade to Enterprise
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-24">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-12">
                  <Users className="h-[20px] w-[20px]" />
                  Team Members
                </CardTitle>
                <Button onClick={handleInviteUser} className="h-[32px]">
                  <UserPlus className="h-[14px] w-[14px] mr-8" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Haji Abdullah Rahman</TableCell>
                    <TableCell>abdullah@alkaromah.travel</TableCell>
                    <TableCell>
                      <Badge>Owner</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </TableCell>
                    <TableCell>Jan 2015</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Siti Khadijah</TableCell>
                    <TableCell>siti@alkaromah.travel</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Admin</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </TableCell>
                    <TableCell>Mar 2020</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-[28px]">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Muhammad Farid</TableCell>
                    <TableCell>farid@alkaromah.travel</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Admin</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </TableCell>
                    <TableCell>Jun 2021</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-[28px]">Edit</Button>
                    </TableCell>
                  </TableRow>
                  {[
                    'Ahmad Zaki', 'Siti Aminah', 'Muhammad Yusuf', 'Fatimah Zahra', 'Umar Faruq'
                  ].map((name, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{name.toLowerCase().replace(' ', '.')}@alkaromah.travel</TableCell>
                      <TableCell>
                        <Badge variant="outline">Agent</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </TableCell>
                      <TableCell>2022-2023</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-[28px]">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Role Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-16">
              <div className="p-16 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-12 mb-8">
                  <Crown className="h-[16px] w-[16px] text-purple-600" />
                  <h4 className="font-semibold text-slate-900">Owner</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Full access ke semua fitur, settings, dan data. Dapat mengelola billing dan subscription.
                </p>
              </div>
              <div className="p-16 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-12 mb-8">
                  <Users className="h-[16px] w-[16px] text-blue-600" />
                  <h4 className="font-semibold text-slate-900">Admin</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Dapat mengelola agents, jamaah, packages, dan reports. Tidak bisa mengubah billing dan team settings.
                </p>
              </div>
              <div className="p-16 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-12 mb-8">
                  <Users className="h-[16px] w-[16px] text-slate-600" />
                  <h4 className="font-semibold text-slate-900">Agent</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Akses terbatas ke jamaah yang ditugaskan, leads, komisi, dan dokumen. Tidak bisa melihat data agent lain.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
