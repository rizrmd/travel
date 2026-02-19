"use client"

import { useState } from "react"
import { KPICard, KPIStatus } from "@/components/domain/dashboard/kpi-card"

export default function TestKPIPage() {
  const [activeStatus, setActiveStatus] = useState<KPIStatus | null>(null)

  const handleKPIClick = (status: KPIStatus) => {
    console.log(`Clicked KPI: ${status}`)
    setActiveStatus(activeStatus === status ? null : status)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-24">
      <div className="max-w-7xl mx-auto space-y-32">
        <div>
          <h1 className="text-3xl font-display font-bold mb-8">
            KPI Card Component Test
          </h1>
          <p className="text-slate-600">
            Test the responsive KPI card component with click interactions
          </p>
        </div>

        {/* Desktop 3-Column Grid */}
        <section className="space-y-16">
          <h2 className="text-2xl font-display font-semibold">
            Desktop Layout (3 Columns ≥1024px)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <KPICard
              title="Mendesak"
              value={5}
              status="urgent"
              onClick={() => handleKPIClick('urgent')}
              isActive={activeStatus === 'urgent'}
            />
            <KPICard
              title="Segera"
              value={8}
              status="soon"
              onClick={() => handleKPIClick('soon')}
              isActive={activeStatus === 'soon'}
            />
            <KPICard
              title="Siap"
              value={42}
              status="ready"
              onClick={() => handleKPIClick('ready')}
              isActive={activeStatus === 'ready'}
            />
          </div>
        </section>

        {/* Active Filter Display */}
        {activeStatus && (
          <section className="space-y-16">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-16">
              <p className="text-blue-900 font-medium">
                Active Filter: <span className="capitalize">{activeStatus}</span>
              </p>
              <button
                onClick={() => setActiveStatus(null)}
                className="mt-8 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Clear filter
              </button>
            </div>
          </section>
        )}

        {/* Non-clickable Examples */}
        <section className="space-y-16">
          <h2 className="text-2xl font-display font-semibold">
            Non-clickable Variants (No onClick)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            <KPICard
              title="Total Jamaah"
              value={55}
              status="ready"
            />
            <KPICard
              title="Needs Action"
              value={13}
              status="urgent"
            />
            <KPICard
              title="In Progress"
              value={8}
              status="soon"
            />
          </div>
        </section>

        {/* Responsive Behavior Note */}
        <section className="space-y-16">
          <h2 className="text-2xl font-display font-semibold">
            Responsive Behavior
          </h2>
          <div className="bg-white rounded-lg border p-24 space-y-8">
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-slate-400 mt-8"></div>
              <p className="text-slate-700">
                <strong>Mobile (&lt;768px):</strong> Cards stack vertically with 16px gap
              </p>
            </div>
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-slate-400 mt-8"></div>
              <p className="text-slate-700">
                <strong>Tablet (768px-1023px):</strong> 2-column grid with 16px gap
              </p>
            </div>
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-slate-400 mt-8"></div>
              <p className="text-slate-700">
                <strong>Desktop (≥1024px):</strong> 3-column grid with 24px gap
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="space-y-16">
          <h2 className="text-2xl font-display font-semibold">
            Accessibility Features
          </h2>
          <div className="bg-white rounded-lg border p-24 space-y-8">
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-8"></div>
              <p className="text-slate-700">
                Button role when clickable (onClick provided)
              </p>
            </div>
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-8"></div>
              <p className="text-slate-700">
                aria-label: &quot;{'{value}'} jamaah {'{status}'}&quot; for screen readers
              </p>
            </div>
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-8"></div>
              <p className="text-slate-700">
                Keyboard accessible: Tab to focus, Enter/Space to click
              </p>
            </div>
            <div className="flex items-start gap-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-8"></div>
              <p className="text-slate-700">
                Focus indicator: 2px ring, 4px offset
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
