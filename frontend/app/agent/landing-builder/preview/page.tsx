"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DevicePreview, DeviceType } from "@/components/landing-builder/preview/device-preview"
import { LandingPreview } from "@/components/landing-builder/preview/landing-preview"
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react"
import { toast } from "@/lib/utils/toast"
import { PageLoading } from "@/components/feedback/loading-states"

// Mock data - in real app, this would come from the editor or be fetched
const mockLandingData = {
  colors: {
    primary: "#2563eb",
    secondary: "#3b82f6",
    accent: "#10b981",
  },
  hero: {
    title: "Umroh Terpercaya & Amanah",
    subtitle: "Wujudkan impian ibadah umroh Anda bersama kami dengan pelayanan terbaik dan berpengalaman",
    ctaText: "Daftar Sekarang",
  },
  packages: [
    {
      id: "1",
      name: "Paket Ekonomi",
      price: 15000000,
      duration: "9 hari",
      features: [
        "Hotel bintang 4 dekat Masjidil Haram",
        "Makan 3x sehari",
        "Tour guide berpengalaman",
        "Visa umroh",
      ],
      isPopular: false,
    },
    {
      id: "2",
      name: "Paket Standard",
      price: 22000000,
      duration: "12 hari",
      features: [
        "Hotel bintang 5 dekat Masjidil Haram",
        "Makan 3x sehari buffet",
        "Tour guide berpengalaman",
        "Visa umroh",
        "City tour Makkah & Madinah",
      ],
      isPopular: true,
    },
  ],
  contact: {
    phone: "+62 812-3456-7890",
    email: "info@umroh.com",
    address: "Jakarta, Indonesia",
  },
}

function PreviewContent() {
  const router = useRouter()
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceType>("desktop")

  const handleShare = () => {
    // Copy preview URL to clipboard
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Link preview disalin ke clipboard")
  }

  const handleOpenInNewTab = () => {
    // Open in new tab without header/controls
    window.open("/agent/landing-builder/preview?fullscreen=true", "_blank")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-16 md:px-24 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-16 w-16 mr-8" />
                Kembali ke Editor
              </Button>
              <div className="hidden md:block">
                <h1 className="font-display font-semibold text-slate-900">
                  Preview Landing Page
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-16 w-16 mr-8" />
                Bagikan
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-16 w-16 mr-8" />
                Buka di Tab Baru
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="container mx-auto px-16 md:px-24 py-32">
        <DevicePreview
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        >
          <LandingPreview data={mockLandingData} />
        </DevicePreview>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<PageLoading message="Memuat preview..." />}>
      <PreviewContent />
    </Suspense>
  )
}
