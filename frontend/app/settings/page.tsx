"use client"

import { useState } from "react"
import { Save, Building2, Mail, Percent, FileCheck, Users } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export default function SettingsPage() {
  const [agencyName, setAgencyName] = useState("Travel Umroh Berkah")
  const [agencyEmail, setAgencyEmail] = useState("info@berkahtravel.com")
  const [agencyPhone, setAgencyPhone] = useState("021-1234567")
  const [agencyAddress, setAgencyAddress] = useState("Jl. Merdeka No. 123, Jakarta Pusat")
  const [businessLicense, setBusinessLicense] = useState("123/LICENSE/2023")

  // Commission rates
  const [silverRate, setSilverRate] = useState(4)
  const [goldRate, setGoldRate] = useState(6)
  const [platinumRate, setPlatinumRate] = useState(8)

  // Document requirements
  const [docKTP, setDocKTP] = useState(true)
  const [docKK, setDocKK] = useState(true)
  const [docPassport, setDocPassport] = useState(true)
  const [docVaksin, setDocVaksin] = useState(true)
  const [docBukuNikah, setDocBukuNikah] = useState(false)
  const [docAkta, setDocAkta] = useState(false)

  const handleNotificationClick = () => console.log('Navigate to /notifications')
  const handleProfileClick = () => console.log('Navigate to /profile')
  const handleSettingsClick = () => toast.info('Sudah di halaman Settings')
  const handleLogoutClick = () => {
    console.log('Logout user')
    toast.info('Anda telah keluar')
  }

  const handleSaveAgencyProfile = () => {
    console.log('Save agency profile:', { agencyName, agencyEmail, agencyPhone, agencyAddress, businessLicense })
    toast.success('Profil agency berhasil disimpan')
  }

  const handleSaveCommission = () => {
    console.log('Save commission rates:', { silverRate, goldRate, platinumRate })
    toast.success('Struktur komisi berhasil disimpan')
  }

  const handleSaveDocuments = () => {
    console.log('Save document requirements:', { docKTP, docKK, docPassport, docVaksin, docBukuNikah, docAkta })
    toast.success('Persyaratan dokumen berhasil disimpan')
  }

  return (
    <AppLayout
      userName="Mbak Rina"
      userRole="Admin Travel"
      notificationCount={3}
      breadcrumbs={[
        { label: "Settings", href: "/settings", isCurrentPage: true },
      ]}
      onNotificationClick={handleNotificationClick}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
      onLogoutClick={handleLogoutClick}
    >
      <div className="space-y-24">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Settings & Configuration
          </h1>
          <p className="mt-8 text-slate-600">
            Kelola pengaturan sistem dan konfigurasi bisnis
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="agency" className="space-y-24">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="agency">Agency Profile</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="commission">Komisi</TabsTrigger>
            <TabsTrigger value="documents">Dokumen</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Agency Profile Tab */}
          <TabsContent value="agency" className="space-y-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-8">
                  <Building2 className="h-[20px] w-[20px] text-blue-600" />
                  <CardTitle>Informasi Agency</CardTitle>
                </div>
                <CardDescription>
                  Kelola informasi dasar travel agency Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <Label htmlFor="agencyName">Nama Agency</Label>
                    <Input
                      id="agencyName"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="mt-8"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessLicense">Nomor Izin Usaha</Label>
                    <Input
                      id="businessLicense"
                      value={businessLicense}
                      onChange={(e) => setBusinessLicense(e.target.value)}
                      className="mt-8"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agencyEmail">Email</Label>
                    <Input
                      id="agencyEmail"
                      type="email"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      className="mt-8"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agencyPhone">Telepon</Label>
                    <Input
                      id="agencyPhone"
                      value={agencyPhone}
                      onChange={(e) => setAgencyPhone(e.target.value)}
                      className="mt-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="agencyAddress">Alamat</Label>
                  <Textarea
                    id="agencyAddress"
                    value={agencyAddress}
                    onChange={(e) => setAgencyAddress(e.target.value)}
                    rows={3}
                    className="mt-8"
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Logo Agency</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="mt-8"
                  />
                  <p className="text-xs text-slate-500 mt-4">
                    Recommended: 400x400px, max 2MB (PNG/JPG)
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAgencyProfile}>
                    <Save className="h-[16px] w-[16px] mr-8" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates Tab */}
          <TabsContent value="email" className="space-y-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-8">
                  <Mail className="h-[20px] w-[20px] text-purple-600" />
                  <CardTitle>Email Templates</CardTitle>
                </div>
                <CardDescription>
                  Kelola template email otomatis untuk jamaah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-16">
                  {['Welcome Email', 'Payment Reminder', 'Document Reminder', 'Departure Reminder'].map((template) => (
                    <div key={template} className="border rounded-lg p-16">
                      <h3 className="font-medium text-slate-900 mb-12">{template}</h3>
                      <div className="space-y-12">
                        <div>
                          <Label>Subject</Label>
                          <Input defaultValue={`${template} - Travel Umroh Berkah`} className="mt-8" />
                        </div>
                        <div>
                          <Label>Body (Merge fields: {'{nama}'}, {'{paket}'}, {'{tanggal}'}, {'{jumlah}'})</Label>
                          <Textarea
                            rows={4}
                            defaultValue={`Assalamu'alaikum {nama},\n\nTerima kasih telah memilih {paket}.\n\nSalam,\nTravel Umroh Berkah`}
                            className="mt-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button onClick={() => toast.success('Template email berhasil disimpan')}>
                      <Save className="h-[16px] w-[16px] mr-8" />
                      Simpan Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Structure Tab */}
          <TabsContent value="commission" className="space-y-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-8">
                  <Percent className="h-[20px] w-[20px] text-green-600" />
                  <CardTitle>Struktur Komisi Agent</CardTitle>
                </div>
                <CardDescription>
                  Atur persentase komisi berdasarkan tier agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <div>
                    <Label htmlFor="silverRate">Silver Tier (%)</Label>
                    <Input
                      id="silverRate"
                      type="number"
                      min={0}
                      max={100}
                      value={silverRate}
                      onChange={(e) => setSilverRate(parseInt(e.target.value))}
                      className="mt-8"
                    />
                    <p className="text-xs text-slate-500 mt-4">
                      Agent baru & pemula
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="goldRate">Gold Tier (%)</Label>
                    <Input
                      id="goldRate"
                      type="number"
                      min={0}
                      max={100}
                      value={goldRate}
                      onChange={(e) => setGoldRate(parseInt(e.target.value))}
                      className="mt-8"
                    />
                    <p className="text-xs text-slate-500 mt-4">
                      Agent menengah (15+ jamaah)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="platinumRate">Platinum Tier (%)</Label>
                    <Input
                      id="platinumRate"
                      type="number"
                      min={0}
                      max={100}
                      value={platinumRate}
                      onChange={(e) => setPlatinumRate(parseInt(e.target.value))}
                      className="mt-8"
                    />
                    <p className="text-xs text-slate-500 mt-4">
                      Agent top (25+ jamaah)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveCommission}>
                    <Save className="h-[16px] w-[16px] mr-8" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Requirements Tab */}
          <TabsContent value="documents" className="space-y-16">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-8">
                  <FileCheck className="h-[20px] w-[20px] text-orange-600" />
                  <CardTitle>Persyaratan Dokumen</CardTitle>
                </div>
                <CardDescription>
                  Tentukan dokumen yang wajib dilengkapi jamaah
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-16">
                <div className="space-y-12">
                  {[
                    { id: 'ktp', label: 'KTP', value: docKTP, setter: setDocKTP },
                    { id: 'kk', label: 'Kartu Keluarga', value: docKK, setter: setDocKK },
                    { id: 'passport', label: 'Paspor', value: docPassport, setter: setDocPassport },
                    { id: 'vaksin', label: 'Sertifikat Vaksin', value: docVaksin, setter: setDocVaksin },
                    { id: 'buku-nikah', label: 'Buku Nikah', value: docBukuNikah, setter: setDocBukuNikah },
                    { id: 'akta', label: 'Akta Kelahiran', value: docAkta, setter: setDocAkta },
                  ].map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-12 border rounded-lg">
                      <Label htmlFor={doc.id} className="cursor-pointer">{doc.label}</Label>
                      <Switch
                        id={doc.id}
                        checked={doc.value}
                        onCheckedChange={doc.setter}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveDocuments}>
                    <Save className="h-[16px] w-[16px] mr-8" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-16">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-8">
                      <Users className="h-[20px] w-[20px] text-blue-600" />
                      <CardTitle>User Management</CardTitle>
                    </div>
                    <CardDescription className="mt-8">
                      Kelola admin users yang memiliki akses ke sistem
                    </CardDescription>
                  </div>
                  <Button onClick={() => toast.info('Fitur tambah user segera hadir')}>
                    <Users className="h-[16px] w-[16px] mr-8" />
                    Tambah User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Mbak Rina</TableCell>
                        <TableCell>rina@berkahtravel.com</TableCell>
                        <TableCell>Super Admin</TableCell>
                        <TableCell>
                          <span className="text-green-700 font-medium">Active</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ahmad Supervisor</TableCell>
                        <TableCell>ahmad@berkahtravel.com</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                          <span className="text-green-700 font-medium">Active</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
