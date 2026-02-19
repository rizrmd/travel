"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { DensityToggle } from "@/components/density/density-toggle"
import { DensityCard, DensityStatCard } from "@/components/density/density-card"
import { DensityList, DensityListItem, DensityGrid, DensitySection } from "@/components/density/density-list"
import {
  DensityTable,
  DensityTableHeader,
  DensityTableBody,
  DensityTableRow,
  DensityTableHead,
  DensityTableCell,
} from "@/components/density/density-table"
import { useDensity } from "@/lib/hooks/use-density"
import { DollarSign, Users, TrendingUp, Package } from "lucide-react"

export default function TestDensityPage() {
  const { density } = useDensity()

  return (
    <AppLayout
      userName="Test User"
      userRole="Tester"
      breadcrumbs={[{ label: "Test Density Mode", isCurrentPage: true }]}
    >
      <div className="space-y-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              Test Adaptive Density
            </h1>
            <p className="text-slate-600 mt-4">
              Mode saat ini: <span className="font-medium capitalize">{density}</span>
            </p>
          </div>
          <DensityToggle variant="labeled" />
        </div>

        {/* Stat Cards */}
        <DensitySection title="Kartu Statistik">
          <DensityGrid cols={4}>
            <DensityStatCard
              title="Total Pendapatan"
              value="Rp 85jt"
              icon={DollarSign}
              change={12.5}
            />
            <DensityStatCard
              title="Total Jamaah"
              value="55"
              icon={Users}
              change={5.2}
            />
            <DensityStatCard
              title="Tingkat Konversi"
              value="76%"
              icon={TrendingUp}
              change={3.2}
            />
            <DensityStatCard
              title="Total Paket"
              value="12"
              icon={Package}
              change={-2}
            />
          </DensityGrid>
        </DensitySection>

        {/* Cards */}
        <DensitySection title="Kartu Informasi">
          <DensityGrid cols={2}>
            <DensityCard
              title="Informasi Jamaah"
              description="Data jamaah yang terdaftar"
            >
              <p className="text-slate-700">
                Total 55 jamaah telah terdaftar untuk keberangkatan bulan depan.
                Semua dokumen sudah lengkap dan siap berangkat.
              </p>
            </DensityCard>
            <DensityCard
              title="Paket Terpopuler"
              description="Paket yang paling banyak diminati"
            >
              <p className="text-slate-700">
                Paket Standard 12 hari menjadi pilihan favorit dengan 42 jamaah
                terdaftar. Harga kompetitif dan fasilitas lengkap.
              </p>
            </DensityCard>
          </DensityGrid>
        </DensitySection>

        {/* List */}
        <DensitySection title="Daftar Item">
          <DensityList>
            <DensityListItem>
              <div className="flex-1">
                <p className="font-medium">Ahmad Fauzi</p>
                <p className="text-body-sm text-slate-600">ahmad.fauzi@example.com</p>
              </div>
              <span className="text-body-sm text-slate-500">2 hari yang lalu</span>
            </DensityListItem>
            <DensityListItem>
              <div className="flex-1">
                <p className="font-medium">Siti Nurhaliza</p>
                <p className="text-body-sm text-slate-600">siti.nurhaliza@example.com</p>
              </div>
              <span className="text-body-sm text-slate-500">5 hari yang lalu</span>
            </DensityListItem>
            <DensityListItem>
              <div className="flex-1">
                <p className="font-medium">Budi Santoso</p>
                <p className="text-body-sm text-slate-600">budi.santoso@example.com</p>
              </div>
              <span className="text-body-sm text-slate-500">1 minggu yang lalu</span>
            </DensityListItem>
          </DensityList>
        </DensitySection>

        {/* Table */}
        <DensitySection title="Tabel Data">
          <DensityTable>
            <DensityTableHeader>
              <DensityTableRow>
                <DensityTableHead>Nama</DensityTableHead>
                <DensityTableHead>Email</DensityTableHead>
                <DensityTableHead>Paket</DensityTableHead>
                <DensityTableHead>Status</DensityTableHead>
              </DensityTableRow>
            </DensityTableHeader>
            <DensityTableBody>
              <DensityTableRow>
                <DensityTableCell>Ahmad Fauzi</DensityTableCell>
                <DensityTableCell>ahmad.fauzi@example.com</DensityTableCell>
                <DensityTableCell>Standard 12 hari</DensityTableCell>
                <DensityTableCell>
                  <span className="text-green-600">Aktif</span>
                </DensityTableCell>
              </DensityTableRow>
              <DensityTableRow>
                <DensityTableCell>Siti Nurhaliza</DensityTableCell>
                <DensityTableCell>siti.nurhaliza@example.com</DensityTableCell>
                <DensityTableCell>VIP 14 hari</DensityTableCell>
                <DensityTableCell>
                  <span className="text-green-600">Aktif</span>
                </DensityTableCell>
              </DensityTableRow>
              <DensityTableRow>
                <DensityTableCell>Budi Santoso</DensityTableCell>
                <DensityTableCell>budi.santoso@example.com</DensityTableCell>
                <DensityTableCell>Ekonomi 9 hari</DensityTableCell>
                <DensityTableCell>
                  <span className="text-amber-600">Pending</span>
                </DensityTableCell>
              </DensityTableRow>
            </DensityTableBody>
          </DensityTable>
        </DensitySection>
      </div>
    </AppLayout>
  )
}
