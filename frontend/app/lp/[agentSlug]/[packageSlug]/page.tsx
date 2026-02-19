/**
 * PUBLIC Landing Page
 *
 * Route: /lp/[agentSlug]/[packageSlug]
 * Example: /lp/ibu-siti/umroh-reguler-9-hari
 *
 * Purpose:
 * - Public-facing landing page created by agents
 * - Shows package details with RETAIL pricing only (no wholesale)
 * - Includes lead submission form
 * - No authentication required
 *
 * Key Features:
 * - SEO optimized for organic traffic
 * - Mobile responsive
 * - WhatsApp integration
 * - Lead capture form
 * - Agent branding
 */

import { notFound } from 'next/navigation'
import { CheckCircle2, XCircle, MapPin, Calendar, Users, Star, Phone, Mail, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LeadSubmissionForm } from '@/components/leads/lead-submission-form'
import { mockAgents } from '@/lib/data/mock-agents'
import { mockPackages } from '@/lib/data/mock-packages'
import { mockLandingPages } from '@/lib/data/mock-landing-pages'
import { formatCurrency } from '@/lib/data/mock-dashboard'
import { getAssignedPackages } from '@/lib/data/mock-package-assignments'

interface PublicLandingPageProps {
  params: {
    agentSlug: string
    packageSlug: string
  }
}

export default function PublicLandingPage({ params }: PublicLandingPageProps) {
  const { agentSlug, packageSlug } = params

  // Construct full slug from params
  const fullSlug = `${agentSlug}-${packageSlug}`

  // Find the landing page by slug
  const landingPage = mockLandingPages.find(lp => lp.slug === fullSlug)

  // DEBUG: If landing page not found, show available landing pages
  if (!landingPage) {
    return (
      <div className="p-48">
        <h1 className="text-2xl font-bold mb-16">DEBUG: Landing Page Not Found</h1>
        <p className="mb-16">Looking for slug: <strong>{fullSlug}</strong></p>
        <h2 className="text-xl font-bold mb-12">Available Landing Pages:</h2>
        <ul className="space-y-8">
          {mockLandingPages.map(lp => (
            <li key={lp.id}>
              <strong>{lp.slug}</strong> (active: {lp.isActive ? 'YES' : 'NO'}) - Package ID: {lp.packageId}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!landingPage.isActive) {
    notFound()
  }

  // Get agent details
  const agent = mockAgents.find(a => a.id === landingPage.agentId)
  if (!agent) {
    notFound()
  }

  // Get package details
  const packageData = mockPackages.find(p => p.id === landingPage.packageId)
  if (!packageData || packageData.status !== 'active') {
    notFound()
  }

  // Verify agent has access to this package
  const assignedPackages = getAssignedPackages(agent.id)
  if (!assignedPackages.includes(packageData.id)) {
    notFound()
  }

  // Format phone for WhatsApp
  const getWhatsAppLink = () => {
    const cleanPhone = agent.phone.replace(/\s|-/g, '')
    const whatsappNumber = cleanPhone.startsWith('0')
      ? `62${cleanPhone.substring(1)}`
      : cleanPhone.startsWith('+')
      ? cleanPhone.substring(1)
      : cleanPhone

    const message = encodeURIComponent(
      `Halo ${agent.name}, saya tertarik dengan paket "${packageData.name}". Mohon informasi lebih lanjut.`
    )

    return `https://wa.me/${whatsappNumber}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-48 px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-12 mb-16">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {packageData.duration}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              ✨ Paket Resmi
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-16 leading-tight">
            {packageData.name}
          </h1>

          <p className="text-xl md:text-2xl text-emerald-50 mb-32 leading-relaxed">
            {packageData.description}
          </p>

          {/* Price Section - RETAIL ONLY */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-24 inline-block">
            <p className="text-emerald-100 text-sm mb-8">Harga Paket</p>
            <div className="flex items-baseline gap-12">
              <p className="text-5xl font-bold">
                {formatCurrency(packageData.priceRetail)}
              </p>
              <p className="text-emerald-100">/ orang</p>
            </div>
            <p className="text-emerald-100 text-sm mt-12">
              💡 Harga sudah termasuk tiket, hotel, & makan
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-16 py-48">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-32">
            {/* Package Highlights */}
            <section>
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-16">
                Kenapa Pilih Paket Ini?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <Card>
                  <CardContent className="pt-16">
                    <div className="flex items-start gap-12">
                      <div className="h-40 w-40 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-20 w-20 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Hotel Berkualitas</h3>
                        <p className="text-sm text-slate-600">
                          Hotel bintang 4-5 dekat Masjidil Haram & Masjid Nabawi
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-16">
                    <div className="flex items-start gap-12">
                      <div className="h-40 w-40 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-20 w-20 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Pembimbing Berpengalaman</h3>
                        <p className="text-sm text-slate-600">
                          Ustadz/Ustadzah yang akan membimbing selama perjalanan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-16">
                    <div className="flex items-start gap-12">
                      <div className="h-40 w-40 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-20 w-20 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Ziarah Lengkap</h3>
                        <p className="text-sm text-slate-600">
                          Mengunjungi tempat-tempat bersejarah di Makkah & Madinah
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-16">
                    <div className="flex items-start gap-12">
                      <div className="h-40 w-40 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-20 w-20 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Jadwal Fleksibel</h3>
                        <p className="text-sm text-slate-600">
                          Tersedia berbagai pilihan tanggal keberangkatan
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Itinerary Section */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-16">
                  Itinerary Perjalanan
                </h2>
                <div className="space-y-12">
                  {packageData.itinerary.map((day) => (
                    <Card key={day.day}>
                      <CardHeader className="pb-12">
                        <div className="flex items-center gap-12">
                          <div className="h-48 w-48 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">{day.day}</span>
                          </div>
                          <CardTitle className="text-lg">{day.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-8">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-8 text-slate-700">
                              <CheckCircle2 className="h-16 w-16 text-emerald-600 mt-2 flex-shrink-0" />
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Inclusions */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-8 text-green-900">
                    <CheckCircle2 className="h-20 w-20" />
                    Sudah Termasuk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-8">
                    {packageData.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-8 text-sm text-green-900">
                        <CheckCircle2 className="h-16 w-16 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Exclusions */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-8 text-red-900">
                    <XCircle className="h-20 w-20" />
                    Tidak Termasuk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-8">
                    {packageData.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-8 text-sm text-red-900">
                        <XCircle className="h-16 w-16 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-24">
            {/* Agent Info Card */}
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-lg">Travel Agent Anda</CardTitle>
              </CardHeader>
              <CardContent className="pt-16 space-y-16">
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-4">{agent.name}</p>
                  <Badge variant="outline" className="mb-12">
                    {agent.tier} Agent
                  </Badge>
                  <p className="text-sm text-slate-600">
                    Melayani {agent.jamaahCount}+ jamaah dengan profesional
                  </p>
                </div>

                <Separator />

                <div className="space-y-12">
                  <div className="flex items-center gap-12 text-sm text-slate-700">
                    <Phone className="h-16 w-16 text-slate-400" />
                    <span>{agent.phone}</span>
                  </div>
                  {agent.email && (
                    <div className="flex items-center gap-12 text-sm text-slate-700">
                      <Mail className="h-16 w-16 text-slate-400" />
                      <span>{agent.email}</span>
                    </div>
                  )}
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50"
                >
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-16 w-16 mr-8" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Lead Submission Form */}
            <LeadSubmissionForm
              agentId={agent.id}
              packageId={packageData.id}
              landingPageId={landingPage.id}
              packageName={packageData.name}
              agentName={agent.name}
              agentPhone={agent.phone}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-24 px-16 mt-48">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2024 {agent.name} - Licensed Travel Agent
          </p>
          <p className="text-slate-500 text-xs mt-8">
            Harga dan ketersediaan dapat berubah sewaktu-waktu
          </p>
        </div>
      </footer>
    </div>
  )
}
