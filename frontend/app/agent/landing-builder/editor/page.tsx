"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeColorsEditor } from "@/components/landing-builder/editor/color-picker"
import { HeroContentEditor } from "@/components/landing-builder/editor/content-editor"
import { PackageEditor, PackageData } from "@/components/landing-builder/editor/package-editor"
import { PublishDialog } from "@/components/landing-builder/publish/publish-dialog"
import { DeploymentStatus } from "@/components/landing-builder/publish/deployment-status"
import { SEOEditor, SEOData } from "@/components/landing-builder/seo/seo-editor"
import { SocialSharing } from "@/components/landing-builder/seo/social-sharing"
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react"
import { toast } from "@/lib/utils/toast"
import { cn } from "@/lib/utils"
import { PageLoading } from "@/components/feedback/loading-states"

interface LandingPageData {
  templateId: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  hero: {
    title: string
    subtitle: string
    ctaText: string
    backgroundImage?: string
  }
  packages: PackageData[]
  contact: {
    phone: string
    email: string
    address: string
  }
  seo: SEOData
}

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = searchParams.get("template") || "modern-blue"

  const [landingData, setLandingData] = React.useState<LandingPageData>({
    templateId,
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
          "Perlengkapan umroh",
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
          "Perlengkapan umroh lengkap",
          "City tour Makkah & Madinah",
        ],
        isPopular: true,
      },
      {
        id: "3",
        name: "Paket VIP",
        price: 35000000,
        duration: "14 hari",
        features: [
          "Hotel bintang 5 view Masjidil Haram",
          "Makan 3x sehari premium buffet",
          "Tour guide pribadi",
          "Visa umroh",
          "Perlengkapan umroh premium",
          "City tour lengkap",
          "Ziarah tambahan",
          "Airport lounge access",
        ],
        isPopular: false,
      },
    ],
    contact: {
      phone: "+62 812-3456-7890",
      email: "info@umroh.com",
      address: "Jakarta, Indonesia",
    },
    seo: {
      title: "Umroh Terpercaya & Amanah | Travel Umroh",
      description: "Wujudkan impian ibadah umroh Anda bersama kami. Paket lengkap, harga terjangkau, pelayanan terbaik. Daftar sekarang!",
      keywords: ["umroh", "paket umroh", "travel umroh", "haji umroh"],
    },
  })

  const [isSaving, setIsSaving] = React.useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showPublishDialog, setShowPublishDialog] = React.useState(false)
  const [deployment, setDeployment] = React.useState<any>(null)

  // Track unsaved changes
  React.useEffect(() => {
    setHasUnsavedChanges(true)
  }, [landingData])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasUnsavedChanges(false)
    toast.success("Landing page berhasil disimpan")
  }

  const handlePreview = () => {
    toast.info("Membuka preview...")
    // In real implementation, open preview in new tab
  }

  const handlePublish = async (domain: string) => {
    // Simulate publish API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const url = `https://${domain}.umroh.id`
    setDeployment({
      id: "1",
      url,
      status: "active",
      publishedAt: new Date(),
      views: 0,
      leads: 0,
    })

    return { success: true, url }
  }

  const handleOpenPublishDialog = () => {
    if (hasUnsavedChanges) {
      toast.warning("Simpan perubahan terlebih dahulu sebelum mempublikasi")
      return
    }
    setShowPublishDialog(true)
  }

  return (
    <AppLayout
      userName="Agent Travel"
      userRole="Travel Agent"
      notificationCount={3}
      breadcrumbs={[
        { label: "Dashboard", href: "/agent" },
        { label: "Landing Page Builder", href: "/agent/landing-builder" },
        { label: "Editor", isCurrentPage: true },
      ]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex items-center justify-between gap-16">
          <div className="flex items-center gap-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-16 w-16 mr-8" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">
                Edit Landing Page
              </h1>
              {hasUnsavedChanges && (
                <p className="text-body-sm text-amber-600">
                  Ada perubahan yang belum disimpan
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-12">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-16 w-16 mr-8" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-16 w-16 mr-8" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button onClick={handleOpenPublishDialog} disabled={hasUnsavedChanges}>
              <Share2 className="h-16 w-16 mr-8" />
              Publikasi
            </Button>
          </div>
        </div>

        {/* Deployment Status */}
        <DeploymentStatus
          deployment={deployment}
          onPublish={handleOpenPublishDialog}
        />

        {/* Editor Tabs */}
        <Tabs defaultValue="design" className="space-y-24">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="design">Desain</TabsTrigger>
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger value="packages">Paket</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-24">
            <ThemeColorsEditor
              colors={landingData.colors}
              onChange={(colors) =>
                setLandingData({ ...landingData, colors })
              }
            />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-24">
            <HeroContentEditor
              content={landingData.hero}
              onChange={(hero) =>
                setLandingData({ ...landingData, hero })
              }
            />
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-24">
            <PackageEditor
              packages={landingData.packages}
              onChange={(packages) =>
                setLandingData({ ...landingData, packages })
              }
            />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-24">
            <SEOEditor
              value={landingData.seo}
              onChange={(seo) =>
                setLandingData({ ...landingData, seo })
              }
            />

            {deployment && (
              <SocialSharing
                url={deployment.url}
                title={landingData.seo.title}
                description={landingData.seo.description}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-12 pt-24 border-t">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-16 w-16 mr-8" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-16 w-16 mr-8" />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        {/* Publish Dialog */}
        <PublishDialog
          open={showPublishDialog}
          onOpenChange={setShowPublishDialog}
          onPublish={handlePublish}
          currentUrl={deployment?.url}
        />
      </div>
    </AppLayout>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<PageLoading message="Memuat editor..." />}>
      <EditorContent />
    </Suspense>
  )
}
