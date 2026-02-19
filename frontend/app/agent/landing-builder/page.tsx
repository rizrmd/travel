"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { TemplateGallery } from "@/components/landing-builder/template-gallery"
import { Template } from "@/components/landing-builder/template-card"
import { mockTemplates } from "@/lib/data/mock-templates"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { toast } from "@/lib/utils/toast"
import { useRouter } from "next/navigation"

export default function LandingBuilderPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    toast.success(`Template "${template.name}" dipilih`)
  }

  const handlePreviewTemplate = (template: Template) => {
    toast.info(`Membuka preview untuk "${template.name}"`)
    // In a real implementation, this would open a modal or new page
  }

  const handleContinue = () => {
    if (!selectedTemplate) {
      toast.error("Pilih template terlebih dahulu")
      return
    }

    if (selectedTemplate.isPremium) {
      toast.warning("Template premium memerlukan upgrade akun")
      return
    }

    toast.success("Melanjutkan ke editor...")
    // router.push(`/agent/landing-builder/editor?template=${selectedTemplate.id}`)
  }

  return (
    <AppLayout
      userName="Agent Travel"
      userRole="Travel Agent"
      notificationCount={3}
      breadcrumbs={[
        { label: "Dashboard", href: "/agent" },
        { label: "Landing Page Builder", isCurrentPage: true },
      ]}
    >
      <div className="space-y-32">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
          <div>
            <div className="flex items-center gap-8 mb-8">
              <Sparkles className="h-24 w-24 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                Landing Page Builder
              </h1>
            </div>
            <p className="text-slate-600">
              Buat landing page profesional untuk mempromosikan paket umroh Anda
            </p>
          </div>

          {selectedTemplate && (
            <Button size="lg" onClick={handleContinue}>
              Lanjutkan dengan {selectedTemplate.name}
              <ArrowRight className="ml-8 h-20 w-20" />
            </Button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-16">
          <h3 className="font-medium text-blue-900 mb-8">
            Pilih Template untuk Memulai
          </h3>
          <p className="text-body-sm text-blue-700">
            Pilih salah satu template di bawah ini sebagai dasar landing page Anda.
            Anda dapat menyesuaikan warna, teks, gambar, dan konten setelah memilih template.
          </p>
        </div>

        {/* Template Gallery */}
        <TemplateGallery
          templates={mockTemplates}
          selectedTemplateId={selectedTemplate?.id}
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
          isLoading={isLoading}
        />

        {/* Bottom CTA */}
        {selectedTemplate && (
          <div className="flex justify-center pt-24 border-t">
            <Button size="lg" onClick={handleContinue}>
              Lanjutkan dengan {selectedTemplate.name}
              <ArrowRight className="ml-8 h-20 w-20" />
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
