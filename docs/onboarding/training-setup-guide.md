# Panduan Setup Materi Training

## Ringkasan
Panduan ini menjelaskan cara membuat dan mengelola materi training untuk tim Anda.

## Kategori Materi Training

### 1. Video Tutorial
Materi dalam bentuk video tutorial interaktif.

**Platform yang Didukung:**
- YouTube (Recommended)
- Vimeo

**Cara Menambahkan:**
1. Upload video ke YouTube/Vimeo
2. Copy URL video
3. Buat materi baru di sistem
4. Pilih kategori "Video Tutorial"
5. Pilih tipe konten "YouTube" atau "Vimeo"
6. Paste URL video
7. Atur durasi (dalam menit)

**Contoh URL YouTube:**
- https://www.youtube.com/watch?v=VIDEO_ID
- https://youtu.be/VIDEO_ID

### 2. Panduan PDF
Dokumentasi dalam format PDF.

**Spesifikasi:**
- Format: PDF
- Ukuran maksimal: 50MB
- Dapat di-host di cloud storage

**Cara Menambahkan:**
1. Upload PDF ke cloud storage (Google Drive, Dropbox, dll)
2. Dapatkan public link
3. Buat materi baru
4. Pilih kategori "PDF Guide"
5. Pilih tipe konten "PDF"
6. Paste URL PDF

### 3. FAQ
Pertanyaan dan jawaban umum.

**Best Practices:**
- Gunakan format artikel/link
- Kelompokkan berdasarkan topik
- Update secara berkala

### 4. Artikel
Artikel tutorial atau dokumentasi tertulis.

**Format:**
- Dapat berupa halaman web
- Gunakan platform seperti Notion, Google Docs (public)
- Link ke halaman dokumentasi internal

## Membuat Materi Training

### Langkah-langkah:

1. **Login sebagai Admin/Owner**

2. **Buka Menu Training**
   - Navigasi: Dashboard > Onboarding > Materi Training

3. **Klik "Tambah Materi"**

4. **Isi Form:**

   **Informasi Dasar:**
   - Judul: Nama materi (contoh: "Cara Membuat Jamaah Baru")
   - Deskripsi: Penjelasan singkat tentang materi
   - Kategori: Pilih Video Tutorial/PDF Guide/FAQ/Artikel

   **Konten:**
   - Tipe Konten: YouTube/Vimeo/PDF/Link
   - URL Konten: Link ke materi
   - Durasi: Estimasi waktu (menit)

   **Pengaturan:**
   - Urutan Tampilan: Nomor urut (0-999)
   - Wajib: Centang jika materi wajib diselesaikan
   - Status: Published/Draft

   **Metadata (Opsional):**
   - Tags: Kata kunci untuk pencarian
   - Tingkat Kesulitan: Beginner/Intermediate/Advanced
   - Prerequisites: Materi yang harus diselesaikan terlebih dahulu

5. **Simpan Materi**

## Struktur Pembelajaran yang Direkomendasikan

### Level Beginner (Onboarding Awal)

1. **Pengenalan Platform** (Video, 10 menit) - WAJIB
   - Overview fitur utama
   - Navigasi dasar
   - Tour aplikasi

2. **Membuat Jamaah Pertama** (Video, 5 menit) - WAJIB
   - Form input jamaah
   - Upload dokumen
   - Tracking status

3. **Manajemen Pembayaran** (Video, 8 menit) - WAJIB
   - Cara input pembayaran
   - Generate invoice
   - Tracking cicilan

4. **FAQ Umum** (Artikel) - WAJIB
   - Pertanyaan umum
   - Troubleshooting dasar

### Level Intermediate

5. **Manajemen Dokumen** (Video, 7 menit)
   - Upload batch
   - Verifikasi dokumen
   - Template dokumen

6. **Laporan dan Analitik** (Video, 12 menit)
   - Dashboard overview
   - Generate laporan
   - Export data

7. **Tips & Tricks** (Artikel)
   - Keyboard shortcuts
   - Workflow optimization

### Level Advanced

8. **Import Data CSV** (Video, 10 menit)
   - Cara import massal
   - Handling errors
   - Best practices

9. **Integrasi WhatsApp** (Video, 8 menit)
   - Setup WhatsApp Business
   - Template pesan
   - Broadcast management

10. **Advanced Analytics** (PDF Guide)
    - Custom reports
    - Data analysis
    - Forecasting

## Mengelola Training Path

### Mandatory vs Optional

**Materi Wajib:**
- Harus diselesaikan oleh semua user
- Progress tracked
- Certificate issued setelah selesai

**Materi Opsional:**
- Untuk pembelajaran lanjutan
- Tidak memblokir akses fitur
- Direkomendasikan berdasarkan role

### Prerequisites (Materi Prasyarat)

Atur urutan pembelajaran dengan menggunakan prerequisites:

```json
{
  "prerequisites": ["material-id-1", "material-id-2"]
}
```

User harus menyelesaikan prasyarat sebelum mengakses materi lanjutan.

## Tracking Progress

### Metrik yang Dilacak:

1. **Per User:**
   - Materi yang diselesaikan
   - Progress percentage
   - Waktu belajar total
   - Quiz scores (jika ada)

2. **Per Materi:**
   - Completion rate
   - Average time spent
   - Feedback rating

3. **Overall:**
   - Team completion rate
   - Active learners
   - Training effectiveness

## Best Practices

### 1. Konten Video

**Durasi Ideal:**
- Tutorial singkat: 3-5 menit
- Tutorial menengah: 7-10 menit
- Deep dive: 12-15 menit
- Maksimal: 20 menit (bagi jadi beberapa video)

**Kualitas:**
- Resolusi minimal: 720p
- Audio jernih
- Subtitle bahasa Indonesia
- Thumbnail menarik

### 2. Dokumentasi PDF

**Format:**
- Font size minimal 12pt
- Gunakan screenshot
- Step-by-step dengan numbering
- Table of contents untuk dokumen panjang

### 3. Organisasi Konten

**Naming Convention:**
```
[Level] [Nomor] - [Judul]
Contoh: [Beginner] 01 - Pengenalan Platform
```

**Tagging:**
- Gunakan tags konsisten
- Maksimal 5 tags per materi
- Contoh: "jamaah", "payment", "dashboard", "beginner"

### 4. Update Berkala

- Review materi setiap 3 bulan
- Update jika ada perubahan fitur
- Archive materi yang outdated
- Notifikasi user tentang materi baru

## Gamification (Coming Soon)

### Sistem Poin:
- Selesaikan materi: 10 poin
- Selesaikan quiz: 15 poin
- Perfect score quiz: +5 poin bonus

### Badges:
- "Quick Learner" - Selesaikan 5 materi dalam 1 hari
- "Expert" - Selesaikan semua materi advanced
- "Helper" - Rating materi yang tinggi

### Leaderboard:
- Top learners per bulan
- Fastest completion
- Highest quiz scores

## Analytics Dashboard

### Metrics yang Tersedia:

1. **Completion Rate**
   - % user yang menyelesaikan mandatory training
   - Trend completion over time

2. **Engagement**
   - Average time per material
   - Most viewed materials
   - Drop-off points

3. **Effectiveness**
   - Correlation training completion vs feature usage
   - User performance after training
   - Support tickets reduction

## Support & Resources

**Admin Resources:**
- Video hosting: YouTube, Vimeo
- PDF hosting: Google Drive, Dropbox
- Image editing: Canva
- Video editing: Camtasia, OBS Studio

**Need Help?**
- Email: training@travelumroh.com
- WhatsApp: 0812-3456-7890
- Documentation: https://docs.travelumroh.com/training
