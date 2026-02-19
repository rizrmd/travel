"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Check, MessageCircle, Phone, Mail, User } from "lucide-react"

interface LeadSubmissionFormProps {
  agentId: string
  packageId: string
  landingPageId: string
  packageName: string
  agentName: string
  agentPhone: string
  onSuccess?: () => void
}

interface FormData {
  name: string
  phone: string
  email: string
  notes: string
}

export function LeadSubmissionForm({
  agentId,
  packageId,
  landingPageId,
  packageName,
  agentName,
  agentPhone,
  onSuccess,
}: LeadSubmissionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Nomor WhatsApp harus diisi')
      return
    }

    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ''))) {
      toast.error('Format nomor WhatsApp tidak valid')
      return
    }

    // Email validation (optional)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Format email tidak valid')
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Call API to submit lead
      const response = await fetch('/api/public/leads/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          notes: formData.notes || undefined,
          agentId,
          packageId,
          landingPageId,
          packageInterest: packageName,
          source: window.location.pathname,
          sourceType: 'landing_page',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit lead')
      }

      const result = await response.json()

      // Success state
      setIsSuccess(true)
      toast.success('Terima kasih! Kami akan segera menghubungi Anda.')

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Lead submission error:', error)
      toast.error('Gagal mengirim data. Silakan coba lagi atau hubungi langsung via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // Format phone for WhatsApp link
  const getWhatsAppLink = () => {
    const cleanPhone = agentPhone.replace(/\s|-/g, '')
    const whatsappNumber = cleanPhone.startsWith('0')
      ? `62${cleanPhone.substring(1)}`
      : cleanPhone.startsWith('+')
      ? cleanPhone.substring(1)
      : cleanPhone

    const message = encodeURIComponent(
      `Halo ${agentName}, saya tertarik dengan paket "${packageName}". Mohon informasi lebih lanjut.`
    )

    return `https://wa.me/${whatsappNumber}?text=${message}`
  }

  // Success state view
  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-12 mb-12">
            <div className="h-48 w-48 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="h-24 w-24 text-white" />
            </div>
            <CardTitle className="text-green-900">Data Terkirim!</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Terima kasih atas minat Anda pada paket <strong>{packageName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-16">
          <div className="p-16 bg-white rounded-lg border border-green-200">
            <p className="text-sm text-slate-700 mb-12">
              {agentName} akan menghubungi Anda segera. Anda juga bisa langsung menghubungi via WhatsApp:
            </p>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-20 w-20 mr-8" />
                Chat via WhatsApp
              </a>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Pesan sudah diterima oleh {agentName}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Form view
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Sekarang</CardTitle>
        <CardDescription>
          Isi form di bawah ini dan kami akan segera menghubungi Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Name */}
          <div className="space-y-8">
            <Label htmlFor="name">
              Nama Lengkap <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-12 top-1/2 -translate-y-1/2 h-16 w-16 text-slate-400" />
              <Input
                id="name"
                type="text"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pl-36"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-8">
            <Label htmlFor="phone">
              Nomor WhatsApp <span className="text-red-600">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-12 top-1/2 -translate-y-1/2 h-16 w-16 text-slate-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="08123456789 atau +628123456789"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="pl-36"
                required
              />
            </div>
            <p className="text-xs text-slate-500">
              Format: 08xxx atau +628xxx
            </p>
          </div>

          {/* Email */}
          <div className="space-y-8">
            <Label htmlFor="email">Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-12 top-1/2 -translate-y-1/2 h-16 w-16 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-36"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-8">
            <Label htmlFor="notes">Catatan / Pertanyaan (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Contoh: Mau tanya detail itinerary, fasilitas hotel, dll."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-[48px]"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim & Hubungi Saya'}
          </Button>

          {/* Alternative: Direct WhatsApp */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-8">Atau hubungi langsung via</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              asChild
            >
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-16 w-16 mr-8 text-green-600" />
                WhatsApp {agentName}
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
