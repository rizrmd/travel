export interface WhatsAppTemplate {
  id: string
  category: 'dokumen' | 'cicilan' | 'update'
  title: string
  preview: string
  content: string
}

export const whatsappTemplates: WhatsAppTemplate[] = [
  // Dokumen Templates
  {
    id: 'doc-ktp-reminder',
    category: 'dokumen',
    title: 'Reminder Upload KTP',
    preview: 'Pengingat untuk mengupload foto KTP...',
    content: `Assalamualaikum {nama},

Ini pengingat untuk mengupload foto KTP Anda untuk proses pendaftaran {paket}.

Mohon segera upload foto KTP yang jelas melalui sistem kami agar proses pendaftaran dapat segera dilanjutkan.

Terima kasih,
Tim Travel Umroh`,
  },
  {
    id: 'doc-passport-reminder',
    category: 'dokumen',
    title: 'Reminder Upload Paspor',
    preview: 'Pengingat untuk mengupload foto paspor...',
    content: `Assalamualaikum {nama},

Kami mohon Anda untuk segera mengupload foto halaman identitas paspor untuk keperluan pengurusan visa umroh {paket}.

Pastikan foto jelas dan terbaca dengan baik.

Jazakallahu khairan,
Tim Travel Umroh`,
  },
  {
    id: 'doc-complete',
    category: 'dokumen',
    title: 'Dokumen Lengkap',
    preview: 'Konfirmasi kelengkapan dokumen...',
    content: `Assalamualaikum {nama},

Alhamdulillah, dokumen Anda untuk {paket} sudah lengkap dan telah kami terima dengan baik.

Kami akan segera memproses pendaftaran Anda. Terima kasih atas kerjasamanya.

Barakallahu fiikum,
Tim Travel Umroh`,
  },

  // Cicilan Templates
  {
    id: 'payment-reminder',
    category: 'cicilan',
    title: 'Reminder Pembayaran',
    preview: 'Pengingat cicilan yang akan jatuh tempo...',
    content: `Assalamualaikum {nama},

Ini pengingat bahwa cicilan Anda untuk {paket} sebesar Rp {jumlah} akan jatuh tempo pada tanggal {tanggal}.

Mohon segera melakukan pembayaran agar tidak terkena denda keterlambatan.

Terima kasih,
Tim Travel Umroh`,
  },
  {
    id: 'payment-confirmed',
    category: 'cicilan',
    title: 'Konfirmasi Pembayaran Diterima',
    preview: 'Konfirmasi penerimaan pembayaran...',
    content: `Assalamualaikum {nama},

Alhamdulillah, pembayaran Anda untuk {paket} sebesar Rp {jumlah} telah kami terima dengan baik pada tanggal {tanggal}.

Terima kasih atas pembayaran tepat waktunya.

Barakallahu fiikum,
Tim Travel Umroh`,
  },
  {
    id: 'payment-due-soon',
    category: 'cicilan',
    title: 'Cicilan Mendekati Jatuh Tempo',
    preview: 'Cicilan akan jatuh tempo dalam 7 hari...',
    content: `Assalamualaikum {nama},

Cicilan Anda untuk {paket} sebesar Rp {jumlah} akan jatuh tempo pada tanggal {tanggal} (7 hari lagi).

Mohon dipersiapkan pembayarannya ya.

Jazakallahu khairan,
Tim Travel Umroh`,
  },

  // Update Lapangan Templates
  {
    id: 'update-departure',
    category: 'update',
    title: 'Update Keberangkatan',
    preview: 'Informasi jadwal keberangkatan...',
    content: `Assalamualaikum {nama},

Update jadwal keberangkatan {paket}:
Tanggal: {tanggal}
Lokasi: Bandara Soekarno-Hatta Terminal 3
Waktu kumpul: 05.00 WIB

Mohon datang tepat waktu. Jangan lupa bawa paspor dan dokumen lengkap.

Taqabbalallahu minna wa minkum,
Tim Travel Umroh`,
  },
  {
    id: 'update-hotel',
    category: 'update',
    title: 'Update Hotel',
    preview: 'Informasi hotel di Makkah dan Madinah...',
    content: `Assalamualaikum {nama},

Info akomodasi {paket}:

🕋 Makkah: Anjum Hotel (200m dari Masjidil Haram)
🕌 Madinah: Al Aqeeq Hotel (100m dari Masjid Nabawi)

Semua hotel sudah termasuk breakfast dan dinner.

Alhamdulillah,
Tim Travel Umroh`,
  },
  {
    id: 'update-schedule',
    category: 'update',
    title: 'Update Jadwal',
    preview: 'Perubahan jadwal kegiatan...',
    content: `Assalamualaikum {nama},

Ada update jadwal untuk {paket}:

Tanggal: {tanggal}

Mohon catat perubahan ini dan konfirmasi penerimaan pesan ini.

Jazakallahu khairan,
Tim Travel Umroh`,
  },
]

export const templateCategories = [
  { id: 'dokumen', label: 'Dokumen' },
  { id: 'cicilan', label: 'Cicilan' },
  { id: 'update', label: 'Update Lapangan' },
] as const

export function getTemplatesByCategory(category: 'dokumen' | 'cicilan' | 'update') {
  return whatsappTemplates.filter((t) => t.category === category)
}
