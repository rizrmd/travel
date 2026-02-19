"use client"

import * as React from "react"
import {
  HeroSection,
  PackagesSection,
  ContactSection,
  CTASection,
} from "@/components/landing-builder/template-sections"
import { PackageData } from "@/components/landing-builder/editor/package-editor"

interface LandingPreviewProps {
  data: {
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
  }
}

export function LandingPreview({ data }: LandingPreviewProps) {
  // Apply theme colors via CSS variables
  React.useEffect(() => {
    document.documentElement.style.setProperty("--preview-primary", data.colors.primary)
    document.documentElement.style.setProperty("--preview-secondary", data.colors.secondary)
    document.documentElement.style.setProperty("--preview-accent", data.colors.accent)

    return () => {
      document.documentElement.style.removeProperty("--preview-primary")
      document.documentElement.style.removeProperty("--preview-secondary")
      document.documentElement.style.removeProperty("--preview-accent")
    }
  }, [data.colors])

  return (
    <div className="landing-preview">
      {/* Inject custom CSS for theme colors */}
      <style jsx global>{`
        .landing-preview {
          --primary: ${data.colors.primary};
          --secondary: ${data.colors.secondary};
          --accent: ${data.colors.accent};
        }
        .landing-preview .bg-gradient-to-br {
          background: linear-gradient(to bottom right, ${data.colors.primary}, ${data.colors.secondary});
        }
        .landing-preview .bg-gradient-to-r {
          background: linear-gradient(to right, ${data.colors.primary}, ${data.colors.secondary});
        }
        .landing-preview .text-blue-600 {
          color: ${data.colors.primary};
        }
        .landing-preview .bg-blue-600 {
          background-color: ${data.colors.primary};
        }
        .landing-preview .border-primary,
        .landing-preview .ring-primary {
          border-color: ${data.colors.primary};
          --tw-ring-color: ${data.colors.primary};
        }
      `}</style>

      {/* Hero Section */}
      <HeroSection
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        ctaText={data.hero.ctaText}
        backgroundImage={data.hero.backgroundImage}
      />

      {/* Packages Section */}
      {data.packages.length > 0 && (
        <PackagesSection
          packages={data.packages.map((pkg) => ({
            ...pkg,
            price: pkg.price || 0,
          }))}
        />
      )}

      {/* CTA Section */}
      <CTASection
        title="Siap Berangkat Umroh?"
        description="Hubungi kami sekarang dan dapatkan penawaran terbaik untuk paket umroh impian Anda"
        ctaText="Hubungi Kami"
      />

      {/* Contact Section */}
      <ContactSection
        phone={data.contact.phone}
        email={data.contact.email}
        address={data.contact.address}
      />
    </div>
  )
}
