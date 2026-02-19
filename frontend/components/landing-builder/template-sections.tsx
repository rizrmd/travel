"use client"

import * as React from "react"
import Image from "next/image"
import { Phone, Mail, MapPin, Star, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Reusable landing page section components
 */

// Hero Section
interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
  className?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText = "Daftar Sekarang",
  ctaLink = "#",
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[500px] flex items-center justify-center text-center",
        "bg-gradient-to-br from-blue-600 to-blue-800 text-white",
        className
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="container mx-auto px-16 md:px-24 py-64">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-blue-50 mb-32 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-50"
          asChild
        >
          <a href={ctaLink}>
            {ctaText} <ArrowRight className="ml-8 h-20 w-20" />
          </a>
        </Button>
      </div>
    </section>
  )
}

// Features Section
interface Feature {
  icon: React.ElementType
  title: string
  description: string
}

interface FeaturesSectionProps {
  title?: string
  features: Feature[]
  className?: string
}

export function FeaturesSection({
  title = "Mengapa Memilih Kami",
  features,
  className,
}: FeaturesSectionProps) {
  return (
    <section className={cn("py-64 bg-slate-50", className)}>
      <div className="container mx-auto px-16 md:px-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-48">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-24 text-center">
                <div className="h-64 w-64 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-16">
                  <Icon className="h-32 w-32 text-blue-600" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-8">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-slate-600">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Package Cards Section
interface Package {
  id: string
  name: string
  price: number
  duration: string
  features: string[]
  isPopular?: boolean
}

interface PackagesSectionProps {
  title?: string
  packages: Package[]
  className?: string
  onSelectPackage?: (pkg: Package) => void
}

export function PackagesSection({
  title = "Paket Umroh Kami",
  packages,
  className,
  onSelectPackage,
}: PackagesSectionProps) {
  return (
    <section className={cn("py-64", className)}>
      <div className="container mx-auto px-16 md:px-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-48">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                "p-24 relative",
                pkg.isPopular && "ring-2 ring-blue-600"
              )}
            >
              {pkg.isPopular && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-16 py-4 rounded-full text-caption font-medium">
                    Paling Populer
                  </span>
                </div>
              )}
              <h3 className="font-display font-semibold text-xl mb-8">
                {pkg.name}
              </h3>
              <div className="mb-16">
                <span className="text-3xl font-display font-bold text-blue-600">
                  Rp {(pkg.price / 1000000).toFixed(1)}jt
                </span>
                <span className="text-body-sm text-slate-600">
                  {" "}
                  / {pkg.duration}
                </span>
              </div>
              <ul className="space-y-8 mb-24">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-8">
                    <Check className="h-16 w-16 text-green-600 mt-2 flex-shrink-0" />
                    <span className="text-body-sm text-slate-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={pkg.isPopular ? "default" : "outline"}
                onClick={() => onSelectPackage?.(pkg)}
              >
                Pilih Paket
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating: number
  avatar?: string
}

interface TestimonialsSectionProps {
  title?: string
  testimonials: Testimonial[]
  className?: string
}

export function TestimonialsSection({
  title = "Kata Mereka",
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section className={cn("py-64 bg-slate-50", className)}>
      <div className="container mx-auto px-16 md:px-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-48">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-24">
              <div className="flex items-center gap-4 mb-12">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-16 w-16",
                      i < testimonial.rating
                        ? "text-amber-400 fill-current"
                        : "text-slate-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-body-sm text-slate-700 mb-16 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-12">
                {testimonial.avatar ? (
                  <div className="relative h-40 w-40 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-40 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">
                    {testimonial.name}
                  </p>
                  {testimonial.role && (
                    <p className="text-caption text-slate-600">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
interface ContactSectionProps {
  title?: string
  phone?: string
  email?: string
  address?: string
  className?: string
}

export function ContactSection({
  title = "Hubungi Kami",
  phone = "+62 812-3456-7890",
  email = "info@umroh.com",
  address = "Jakarta, Indonesia",
  className,
}: ContactSectionProps) {
  return (
    <section className={cn("py-64", className)}>
      <div className="container mx-auto px-16 md:px-24">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-48">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 max-w-4xl mx-auto">
          <Card className="p-24 text-center">
            <div className="h-48 w-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-16">
              <Phone className="h-24 w-24 text-blue-600" />
            </div>
            <h3 className="font-medium mb-8">Telepon</h3>
            <a
              href={`tel:${phone}`}
              className="text-body-sm text-blue-600 hover:underline"
            >
              {phone}
            </a>
          </Card>
          <Card className="p-24 text-center">
            <div className="h-48 w-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-16">
              <Mail className="h-24 w-24 text-blue-600" />
            </div>
            <h3 className="font-medium mb-8">Email</h3>
            <a
              href={`mailto:${email}`}
              className="text-body-sm text-blue-600 hover:underline"
            >
              {email}
            </a>
          </Card>
          <Card className="p-24 text-center">
            <div className="h-48 w-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-16">
              <MapPin className="h-24 w-24 text-blue-600" />
            </div>
            <h3 className="font-medium mb-8">Alamat</h3>
            <p className="text-body-sm text-slate-600">{address}</p>
          </Card>
        </div>
      </div>
    </section>
  )
}

// CTA Section
interface CTASectionProps {
  title: string
  description?: string
  ctaText?: string
  ctaLink?: string
  className?: string
}

export function CTASection({
  title,
  description,
  ctaText = "Hubungi Kami",
  ctaLink = "#",
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "py-64 bg-gradient-to-r from-blue-600 to-blue-800 text-white",
        className
      )}
    >
      <div className="container mx-auto px-16 md:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-blue-50 mb-32 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-50"
          asChild
        >
          <a href={ctaLink}>
            {ctaText} <ArrowRight className="ml-8 h-20 w-20" />
          </a>
        </Button>
      </div>
    </section>
  )
}
