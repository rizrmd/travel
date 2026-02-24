'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Heart,
  FileText,
  Lock,
  Camera,
  Edit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { mockJamaahProfile } from '@/lib/data/mock-jamaah-profile'
import { useToast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const profile = mockJamaahProfile
  const [editDialog, setEditDialog] = useState(false)
  const [editSection, setEditSection] = useState<string>('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { toast } = useToast()

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const calculatePassportValidity = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365)
    return Math.floor(diffYears)
  }

  const handleEdit = (section: string) => {
    setEditSection(section)
    setEditDialog(true)
  }

  const handleSave = () => {
    setEditDialog(false)
    toast({
      title: 'Perubahan Disimpan',
      description: `Data ${editSection} berhasil diperbarui`,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    setPasswordStrength(strength)
  }

  return (
    <AppLayout
    >
      {/* Profile Photo */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <p className="text-muted-foreground mb-2">NIK: {profile.nik}</p>
              <Badge variant="outline">{profile.package.name}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="personal">Profil</TabsTrigger>
          <TabsTrigger value="emergency">Kontak Darurat</TabsTrigger>
          <TabsTrigger value="medical">Info Medis</TabsTrigger>
          <TabsTrigger value="passport">Paspor</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informasi Pribadi</CardTitle>
              <Button variant="outline" onClick={() => handleEdit('Profil Pribadi')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nama Lengkap</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.name}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">NIK</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.nik}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Tempat, Tanggal Lahir</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">
                        {profile.birthPlace}, {new Date(profile.birthDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} ({calculateAge(profile.birthDate)} tahun)
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Jenis Kelamin</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Alamat</Label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="font-semibold">{profile.address}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">No. HP</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.phone}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kontak Darurat</CardTitle>
              <Button variant="outline" onClick={() => handleEdit('Kontak Darurat')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Kontak
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nama</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.emergencyContact.name}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Hubungan</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.emergencyContact.relation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">No. HP</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.emergencyContact.phone}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Alamat</Label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="font-semibold">{profile.emergencyContact.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Info Tab */}
        <TabsContent value="medical">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informasi Medis</CardTitle>
              <Button variant="outline" onClick={() => handleEdit('Info Medis')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Info Medis
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Golongan Darah</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Heart className="h-4 w-4 text-red-600" />
                      <p className="font-semibold">{profile.medicalInfo.bloodType}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Alergi</Label>
                    <p className="font-semibold mt-1">{profile.medicalInfo.allergies}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Penyakit Kronis</Label>
                    <p className="font-semibold mt-1">{profile.medicalInfo.chronicDiseases}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Obat Rutin</Label>
                    <p className="font-semibold mt-1">{profile.medicalInfo.regularMedications}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Riwayat Penyakit</Label>
                    <p className="font-semibold mt-1">{profile.medicalInfo.medicalHistory}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Penting</p>
                    <p className="text-sm text-blue-800">
                      Pastikan informasi medis Anda akurat dan lengkap untuk keselamatan selama perjalanan umroh.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passport Info Tab */}
        <TabsContent value="passport">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informasi Paspor</CardTitle>
              <Button variant="outline" onClick={() => handleEdit('Info Paspor')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Info Paspor
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nomor Paspor</Label>
                    <p className="font-semibold text-lg mt-1">{profile.passportInfo.number}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Tanggal Terbit</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">
                        {new Date(profile.passportInfo.issueDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Tanggal Expired</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {new Date(profile.passportInfo.expiryDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <Badge variant="default" className="mt-1">
                          Masa berlaku {calculatePassportValidity(profile.passportInfo.expiryDate)} tahun lagi
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Tempat Terbit</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{profile.passportInfo.issuePlace}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 block">Foto Paspor</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Halaman biodata paspor</p>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Foto
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div>
                  <Label htmlFor="current-password">Password Lama</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Masukkan password lama"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Masukkan password baru"
                    className="mt-1"
                    onChange={handlePasswordChange}
                  />
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Kekuatan Password</span>
                      <span className="font-semibold">
                        {passwordStrength === 0 && 'Lemah'}
                        {passwordStrength > 0 && passwordStrength <= 50 && 'Sedang'}
                        {passwordStrength > 50 && passwordStrength < 100 && 'Kuat'}
                        {passwordStrength === 100 && 'Sangat Kuat'}
                      </span>
                    </div>
                    <Progress value={passwordStrength} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Ketik ulang password baru"
                    className="mt-1"
                  />
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    toast({
                      title: 'Password Diubah',
                      description: 'Password Anda berhasil diperbarui',
                    })
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Ubah Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {editSection}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Formulir edit untuk {editSection.toLowerCase()} akan ditampilkan di sini.
            </p>
            {/* Add actual form fields based on editSection */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
