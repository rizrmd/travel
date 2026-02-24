"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Link2,
  Share2,
  QrCode,
  TrendingUp,
  Eye,
  MousePointerClick,
  UserCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { agentProfile } from "@/lib/data/mock-agent-jamaah"
import { mockPackages } from "@/lib/data/mock-packages"
import { getAssignedPackages } from "@/lib/data/mock-package-assignments"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4

// Mock current agent ID (in real app, get from auth)
const CURRENT_AGENT_ID = 'agent-1' // Ibu Siti

export default function CreateLandingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState<Step>(1)

  // Get only assigned packages
  const assignedPackageIds = getAssignedPackages(CURRENT_AGENT_ID)
  const availablePackages = mockPackages.filter(pkg =>
    assignedPackageIds.includes(pkg.id) && pkg.status === 'active'
  )

  // Form data
  const [selectedPackageId, setSelectedPackageId] = React.useState("")
  const [agentName, setAgentName] = React.useState(agentProfile.name)
  const [agentPhone, setAgentPhone] = React.useState(agentProfile.phone)
  const [agentWhatsApp, setAgentWhatsApp] = React.useState(agentProfile.phone)
  const [customMessage, setCustomMessage] = React.useState("")
  const [agentPhoto, setAgentPhoto] = React.useState<File | null>(null)

  // Generated landing page data
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedSlug, setGeneratedSlug] = React.useState("")
  const [generatedUrl, setGeneratedUrl] = React.useState("")

  const selectedPackage = mockPackages.find(p => p.id === selectedPackageId)

  const handleNext = () => {
    if (currentStep === 1 && !selectedPackageId) {
      toast({
        title: "Pilih Paket",
        description: "Silakan pilih paket terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate slug and URL
    const slug = `ibu-siti-${selectedPackage?.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const url = `https://agent-ibu-siti.travelumroh.com/promo/${slug}`

    setGeneratedSlug(slug)
    setGeneratedUrl(url)
    setIsGenerating(false)
    setCurrentStep(4)

    toast({
      title: "Landing Page Berhasil Dibuat!",
      description: "Landing page Anda sudah siap untuk dibagikan",
    })
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl)
    toast({
      title: "Link Disalin!",
      description: "Link landing page telah disalin ke clipboard",
    })
  }

  const handleShareWhatsApp = () => {
    const message = `Assalamualaikum! Check out paket ${selectedPackage?.name} saya:\n${generatedUrl}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedUrl)}`, '_blank')
  }

  const mockAnalytics = {
    views: 127,
    clicks: 45,
    conversions: 3,
    conversionRate: 6.7,
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Landing Builder', href: '/agent/landing-builder' },
        { label: 'Buat Landing Page', href: '/agent/landing-builder/create' },
      ]}
      maxWidth="6xl"
    >
      {/* Header */}
      <div className="mb-32">
        <Button
          variant="ghost"
          onClick={() => router.push('/agent/landing-builder')}
          className="mb-16 h-40 gap-8"
        >
          <ArrowLeft className="h-20 w-20" />
          Kembali
        </Button>
        <h1 className="text-h2 font-display font-bold text-slate-900 mb-8">
          Buat Landing Page Baru
        </h1>
        <p className="text-body text-slate-600">
          Buat landing page profesional untuk mempromosikan paket umroh Anda
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-40 gap-16">
        {[1, 2, 3, 4].map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-40 h-40 rounded-full font-semibold text-body-sm",
                currentStep >= step ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
              )}>
                {step}
              </div>
              <span className={cn("ml-8 text-body-sm hidden sm:inline", currentStep >= step ? "text-slate-900" : "text-slate-500")}>
                {step === 1 && "Pilih Paket"}
                {step === 2 && "Branding"}
                {step === 3 && "Preview"}
                {step === 4 && "Generate"}
              </span>
            </div>
            {idx < 3 && (
              <div className={cn("h-2 w-60", currentStep > step ? "bg-primary" : "bg-slate-200")} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
        {/* Left: Form */}
        <div>
          {/* Step 1: Package Selection */}
          {currentStep === 1 && (
            <Card className="p-32">
              <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
                Pilih Paket Umroh
              </h2>
              <div className="space-y-16">
                <div>
                  <Label htmlFor="package-select">Paket</Label>
                  <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                    <SelectTrigger id="package-select" className="h-48 mt-8">
                      <SelectValue placeholder="Pilih paket..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availablePackages.length === 0 && (
                    <p className="text-sm text-amber-600 mt-8">
                      Belum ada paket yang tersedia untuk Anda. Hubungi admin untuk mendapatkan akses paket.
                    </p>
                  )}
                </div>

                {selectedPackage && (
                  <div className="p-16 bg-slate-50 rounded-lg border">
                    <h3 className="text-body font-semibold text-slate-900 mb-8">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-body-sm text-slate-600 mb-12">
                      {selectedPackage.description}
                    </p>
                    <div className="flex items-center gap-16">
                      <Badge>{selectedPackage.duration}</Badge>
                      <span className="text-body font-bold text-primary">
                        Rp {selectedPackage.priceRetail.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 2: Agent Branding */}
          {currentStep === 2 && (
            <Card className="p-32">
              <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
                Informasi Agent
              </h2>
              <div className="space-y-20">
                <div>
                  <Label htmlFor="agent-name">Nama Agent</Label>
                  <Input
                    id="agent-name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="h-48 mt-8"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-phone">Nomor Telepon</Label>
                  <Input
                    id="agent-phone"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="h-48 mt-8"
                  />
                </div>

                <div>
                  <Label htmlFor="agent-whatsapp">WhatsApp</Label>
                  <Input
                    id="agent-whatsapp"
                    value={agentWhatsApp}
                    onChange={(e) => setAgentWhatsApp(e.target.value)}
                    className="h-48 mt-8"
                  />
                </div>

                <div>
                  <Label htmlFor="custom-message">Pesan Kustom / Bio</Label>
                  <Textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Contoh: Assalamualaikum! Saya Ibu Siti, agent umroh berpengalaman 5 tahun. Alhamdulillah sudah memberangkatkan 200+ jamaah..."
                    className="h-120 mt-8"
                  />
                  <p className="text-body-sm text-slate-500 mt-8">
                    {customMessage.length}/500 karakter
                  </p>
                </div>

                <div>
                  <Label htmlFor="agent-photo">Foto Agent (Opsional)</Label>
                  <div className="mt-8 border-2 border-dashed rounded-lg p-24 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="agent-photo"
                      accept="image/*"
                      onChange={(e) => setAgentPhoto(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="agent-photo" className="cursor-pointer">
                      <Upload className="h-32 w-32 mx-auto mb-12 text-slate-400" />
                      <p className="text-body-sm text-slate-600">
                        {agentPhoto ? agentPhoto.name : "Click untuk upload foto"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <Card className="p-32">
              <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
                Preview Landing Page
              </h2>
              <div className="space-y-16">
                <div className="p-16 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-body-sm text-amber-900">
                    Ini adalah preview dari landing page Anda. Klik &quot;Generate Landing Page&quot; untuk membuat halaman yang bisa dibagikan.
                  </p>
                </div>
                <div className="text-body-sm text-slate-600 space-y-8">
                  <p><strong>Paket:</strong> {selectedPackage?.name}</p>
                  <p><strong>Agent:</strong> {agentName}</p>
                  <p><strong>WhatsApp:</strong> {agentWhatsApp}</p>
                  {customMessage && (
                    <div>
                      <strong>Pesan:</strong>
                      <p className="mt-4 p-12 bg-slate-50 rounded">{customMessage}</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-48"
                >
                  {isGenerating ? "Membuat Landing Page..." : "Generate Landing Page"}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Generated */}
          {currentStep === 4 && (
            <Card className="p-32">
              <h2 className="text-h4 font-display font-bold text-slate-900 mb-24">
                Landing Page Berhasil Dibuat!
              </h2>
              <div className="space-y-24">
                {/* Shareable Link */}
                <div>
                  <Label>Link Landing Page</Label>
                  <div className="flex gap-8 mt-8">
                    <Input
                      value={generatedUrl}
                      readOnly
                      className="h-48"
                    />
                    <Button
                      onClick={handleCopyUrl}
                      variant="outline"
                      className="h-48"
                    >
                      <Link2 className="h-20 w-20" />
                    </Button>
                  </div>
                </div>

                {/* Social Share */}
                <div>
                  <Label className="mb-12 block">Bagikan ke Social Media</Label>
                  <div className="grid grid-cols-2 gap-12">
                    <Button
                      onClick={handleShareWhatsApp}
                      className="h-48 gap-8 bg-whatsapp hover:bg-whatsapp/90"
                    >
                      <Share2 className="h-20 w-20" />
                      WhatsApp Status
                    </Button>
                    <Button
                      onClick={handleShareFacebook}
                      variant="outline"
                      className="h-48 gap-8"
                    >
                      <Share2 className="h-20 w-20" />
                      Facebook
                    </Button>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <Label className="mb-12 block">QR Code</Label>
                  <div className="border rounded-lg p-24 text-center bg-white">
                    <QrCode className="h-120 w-120 mx-auto text-slate-400" />
                    <p className="text-body-sm text-slate-500 mt-12">
                      QR Code untuk sharing mudah
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-24">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="h-48"
              >
                <ArrowLeft className="h-20 w-20 mr-8" />
                Kembali
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedPackageId}
                className="h-48"
              >
                Lanjut
                <ArrowRight className="h-20 w-20 ml-8" />
              </Button>
            </div>
          )}
        </div>

        {/* Right: Live Preview or Analytics */}
        <div>
          {currentStep < 4 ? (
            <Card className="p-32 sticky top-24">
              <h3 className="text-body font-display font-bold text-slate-900 mb-16">
                Live Preview
              </h3>
              <div className="border-2 rounded-lg p-24 bg-slate-50 min-h-[500px]">
                {/* Mock Landing Page Preview */}
                <div className="bg-white rounded-lg shadow-sm p-24 space-y-16">
                  {selectedPackage && (
                    <>
                      <div className="aspect-video bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <p className="text-white font-bold text-h4">
                          {selectedPackage.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-h4 font-bold text-slate-900 mb-8">
                          {selectedPackage.name}
                        </h3>
                        <p className="text-body-sm text-slate-600 mb-12">
                          {selectedPackage.description}
                        </p>
                        <Badge className="mb-16">{selectedPackage.duration}</Badge>
                        <div className="text-h3 font-bold text-primary mb-16">
                          Rp {selectedPackage.priceRetail.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </>
                  )}

                  {agentName && (
                    <div className="border-t pt-16">
                      <p className="text-body-sm font-semibold text-slate-900 mb-8">
                        Agent: {agentName}
                      </p>
                      {customMessage && (
                        <p className="text-body-sm text-slate-600 mb-12 italic">
                          &quot;{customMessage.slice(0, 100)}{customMessage.length > 100 ? '...' : ''}&quot;
                        </p>
                      )}
                      <Button className="w-full h-48 bg-whatsapp hover:bg-whatsapp/90">
                        Hubungi via WhatsApp
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-32 sticky top-24">
              <h3 className="text-body font-display font-bold text-slate-900 mb-24">
                Analytics Preview
              </h3>
              <div className="space-y-16">
                <div className="grid grid-cols-2 gap-16">
                  <div className="p-16 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-8 mb-8">
                      <Eye className="h-16 w-16 text-blue-600" />
                      <p className="text-body-sm text-blue-900">Views</p>
                    </div>
                    <p className="text-h3 font-bold text-blue-600">
                      {mockAnalytics.views}
                    </p>
                  </div>
                  <div className="p-16 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-8 mb-8">
                      <MousePointerClick className="h-16 w-16 text-green-600" />
                      <p className="text-body-sm text-green-900">Clicks</p>
                    </div>
                    <p className="text-h3 font-bold text-green-600">
                      {mockAnalytics.clicks}
                    </p>
                  </div>
                  <div className="p-16 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-8 mb-8">
                      <UserCheck className="h-16 w-16 text-purple-600" />
                      <p className="text-body-sm text-purple-900">Conversions</p>
                    </div>
                    <p className="text-h3 font-bold text-purple-600">
                      {mockAnalytics.conversions}
                    </p>
                  </div>
                  <div className="p-16 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-8 mb-8">
                      <TrendingUp className="h-16 w-16 text-amber-600" />
                      <p className="text-body-sm text-amber-900">Conv. Rate</p>
                    </div>
                    <p className="text-h3 font-bold text-amber-600">
                      {mockAnalytics.conversionRate}%
                    </p>
                  </div>
                </div>
                <p className="text-body-sm text-slate-500 italic text-center pt-16">
                  Analytics akan terupdate secara real-time
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
