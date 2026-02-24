"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { mockJamaah } from "@/lib/data/mock-jamaah"
import { toast } from "sonner"

export default function EditJamaahPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const id = params.id

    // Local state for the form
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        package: '',
        status: 'ready' as 'urgent' | 'soon' | 'ready'
    })
    const [isSaving, setIsSaving] = useState(false)

    // Initialize data on mount
    useEffect(() => {
        const existingJamaah = mockJamaah.find((j) => j.id === id)
        if (existingJamaah) {
            setFormData({
                name: existingJamaah.name,
                nik: existingJamaah.nik,
                package: existingJamaah.package,
                status: existingJamaah.status
            })
        }
    }, [id])

    // Look up again just to handle "Not Found" case explicitly before render
    const jamaah = mockJamaah.find((j) => j.id === id)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate API call to replace data
        setTimeout(() => {
            // In a real app we'd dispatch an update to the store or backend
            // Because we're using mock data locally that isn't really mutating state
            // globally across navigation, we'll just show the success message
            // and redirect.
            setIsSaving(false)
            toast.success('Data jamaah berhasil diperbarui')
            router.push(`/jamaah/${id}`)
        }, 800)
    }

    return (
        <AppLayout
            notificationCount={3}
            breadcrumbs={[
                { label: "Jamaah", href: "/jamaah" },
                { label: jamaah ? jamaah.name : "Not Found", href: `/jamaah/${id}` },
                { label: "Edit", href: `/jamaah/${id}/edit`, isCurrentPage: true },
            ]}
        >
            <div className="space-y-24 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-16">
                        <Link href={`/jamaah/${id}`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-[16px] w-[16px] mr-8" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                                Edit Jamaah
                            </h1>
                            <p className="mt-4 text-slate-600">
                                Ubah informasi profil jamaah
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                {jamaah ? (
                    <form onSubmit={handleSave}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Profil</CardTitle>
                                <CardDescription>Pembaruan data diri dan paket jamaah</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-16">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {/* Nama Lengkap */}
                                    <div className="space-y-8">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Masukkan nama lengkap jamaah"
                                            required
                                        />
                                    </div>

                                    {/* NIK */}
                                    <div className="space-y-8">
                                        <Label htmlFor="nik">NIK</Label>
                                        <Input
                                            id="nik"
                                            value={formData.nik}
                                            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                            placeholder="Masukkan 16 digit NIK"
                                            maxLength={16}
                                            required
                                        />
                                    </div>

                                    {/* Paket */}
                                    <div className="space-y-8">
                                        <Label htmlFor="package">Paket</Label>
                                        <Input
                                            id="package"
                                            value={formData.package}
                                            onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                            placeholder="Misal: Umroh Reguler 9 Hari"
                                            required
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-8">
                                        <Label htmlFor="status">Status Pemrosesan</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val: 'urgent' | 'soon' | 'ready') => setFormData({ ...formData, status: val })}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="urgent">Mendesak</SelectItem>
                                                <SelectItem value="soon">Segera</SelectItem>
                                                <SelectItem value="ready">Siap</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-16 border-t border-slate-100 flex justify-end gap-12 mt-24">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push(`/jamaah/${id}`)}
                                        disabled={isSaving}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        <Save className="h-[16px] w-[16px] mr-8" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                ) : (
                    <div className="text-center py-32 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-600">Jamaah tidak ditemukan</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
