/**
 * Mock landing page templates for agents
 */

import { Template } from "@/components/landing-builder/template-card"

export const mockTemplates: Template[] = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Template modern dengan warna biru yang profesional dan menarik",
    category: "modern",
    thumbnail: "/templates/modern-blue.jpg",
    isPremium: false,
    features: [
      "Hero section dengan call-to-action",
      "Galeri paket umroh",
      "Testimoni jamaah",
      "Form pendaftaran online",
      "Kontak dan lokasi kantor",
    ],
  },
  {
    id: "classic-gold",
    name: "Classic Gold",
    description: "Desain klasik dengan aksen emas yang elegan dan mewah",
    category: "classic",
    thumbnail: "/templates/classic-gold.jpg",
    isPremium: true,
    features: [
      "Header dengan logo dan navigasi",
      "Video profil perusahaan",
      "Daftar paket dengan harga",
      "FAQ section",
      "WhatsApp floating button",
    ],
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    description: "Template minimalis dengan fokus pada konten dan kemudahan navigasi",
    category: "minimal",
    thumbnail: "/templates/minimal-white.jpg",
    isPremium: false,
    features: [
      "Clean layout minimalis",
      "Paket umroh grid view",
      "Statistik kepercayaan",
      "Partner dan lisensi",
      "Social media links",
    ],
  },
  {
    id: "premium-gradient",
    name: "Premium Gradient",
    description: "Template premium dengan gradient modern dan animasi halus",
    category: "premium",
    thumbnail: "/templates/premium-gradient.jpg",
    isPremium: true,
    features: [
      "Animated hero section",
      "Interactive package cards",
      "Timeline keberangkatan",
      "Live chat integration",
      "Multi-language support",
      "SEO optimized",
    ],
  },
  {
    id: "modern-green",
    name: "Modern Green",
    description: "Template dengan tema hijau yang menyejukkan dan islami",
    category: "modern",
    thumbnail: "/templates/modern-green.jpg",
    isPremium: false,
    features: [
      "Islamic themed design",
      "Package comparison table",
      "Jadwal sholat widget",
      "Blog artikel umroh",
      "Instagram feed",
    ],
  },
  {
    id: "classic-maroon",
    name: "Classic Maroon",
    description: "Desain klasik dengan warna maroon yang berkelas",
    category: "classic",
    thumbnail: "/templates/classic-maroon.jpg",
    isPremium: false,
    features: [
      "Traditional layout",
      "Galeri foto dokumentasi",
      "Testimonial slider",
      "Download brosur PDF",
      "Google Maps embed",
    ],
  },
]

export const templateCategories = [
  {
    value: "modern" as const,
    label: "Modern",
    description: "Desain kontemporer dengan elemen visual modern",
  },
  {
    value: "classic" as const,
    label: "Classic",
    description: "Tampilan klasik yang timeless dan profesional",
  },
  {
    value: "minimal" as const,
    label: "Minimal",
    description: "Fokus pada kesederhanaan dan kemudahan navigasi",
  },
  {
    value: "premium" as const,
    label: "Premium",
    description: "Fitur lengkap dengan animasi dan interaksi canggih",
  },
]
