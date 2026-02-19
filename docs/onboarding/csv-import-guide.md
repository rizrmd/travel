# Panduan Import CSV

## Ringkasan
Fitur import CSV memungkinkan Anda untuk mengimpor data jamaah, pembayaran, dan paket secara massal dari file CSV.

## Format CSV yang Didukung

### Encoding
- UTF-8 (direkomendasikan)
- UTF-8 with BOM
- ISO-8859-1 (Latin-1)

### Delimiter
- Koma (,) - default
- Titik koma (;) - untuk Excel Indonesia
- Tab (\t)

### Batasan File
- Ukuran maksimal: 10MB
- Jumlah baris maksimal: 10,000

## Template Import

### 1. Import Jamaah

**Kolom Wajib:**
- `nama` - Nama lengkap jamaah
- `paket_id` - UUID paket yang sudah ada

**Kolom Opsional:**
- `email` - Format: user@domain.com
- `telepon` - Format: 081234567890 (10-15 digit)
- `alamat` - Alamat lengkap
- `ktp` - Nomor KTP (16 digit)
- `tanggal_lahir` - Format: YYYY-MM-DD (contoh: 1990-05-15)
- `jenis_kelamin` - L atau P
- `status` - lead, interested, registered, dll
- `catatan` - Catatan tambahan

**Contoh:**
```csv
nama,email,telepon,alamat,ktp,tanggal_lahir,jenis_kelamin,paket_id,status,catatan
Ahmad Rizki,ahmad@email.com,081234567890,"Jl. Merdeka No. 123",3175011234567890,1990-05-15,L,uuid-paket-1,lead,Calon potensial
```

### 2. Import Pembayaran

**Kolom Wajib:**
- `jamaah_id` - UUID jamaah yang sudah ada
- `jumlah` - Nominal pembayaran (angka tanpa titik/koma)
- `tanggal_bayar` - Format: YYYY-MM-DD
- `metode_pembayaran` - transfer_bank, cash, dll

**Kolom Opsional:**
- `nomor_referensi` - Nomor referensi transaksi
- `catatan` - Keterangan pembayaran

**Contoh:**
```csv
jamaah_id,jumlah,tanggal_bayar,metode_pembayaran,nomor_referensi,catatan
uuid-jamaah-1,5000000,2025-01-15,transfer_bank,TRX001,DP 50%
```

### 3. Import Paket

**Kolom Wajib:**
- `nama` - Nama paket (minimal 3 karakter)
- `durasi_hari` - Jumlah hari (angka)
- `harga_retail` - Harga retail (angka)
- `harga_wholesale` - Harga wholesale (angka)
- `tanggal_keberangkatan` - Format: YYYY-MM-DD
- `kapasitas` - Kapasitas jamaah (angka)

**Kolom Opsional:**
- `deskripsi` - Deskripsi paket
- `status` - draft, published, archived

**Contoh:**
```csv
nama,deskripsi,durasi_hari,harga_retail,harga_wholesale,tanggal_keberangkatan,kapasitas,status
Paket Umroh Ramadan 2025,Paket ekonomis,12,25000000,22000000,2025-03-15,40,published
```

## Alur Import

### 1. Upload File
- Pilih file CSV dari komputer Anda
- Pilih tipe import (Jamaah/Pembayaran/Paket)
- Sistem akan menampilkan preview 10 baris pertama

### 2. Validasi
- Klik "Validasi" untuk memeriksa semua baris
- Sistem akan menampilkan:
  - Jumlah baris valid
  - Jumlah baris dengan error
  - Daftar error per baris

### 3. Perbaikan Error (jika ada)
- Download laporan error dalam format CSV
- Perbaiki baris yang error
- Upload ulang file yang sudah diperbaiki

### 4. Mulai Import
- Klik "Mulai Import"
- Progress akan ditampilkan secara real-time
- Notifikasi akan dikirim saat selesai

## Jenis Error Validasi

### Missing Required (Field Wajib Kosong)
```
Error: Field 'nama' wajib diisi
Solusi: Isi semua field yang wajib
```

### Invalid Format (Format Tidak Valid)
```
Error: Format email tidak valid: 'ahmad@email'
Solusi: Gunakan format email yang benar (user@domain.com)

Error: Format tanggal tidak valid (gunakan YYYY-MM-DD): '15-05-1990'
Solusi: Ubah ke format YYYY-MM-DD (1990-05-15)

Error: Nomor telepon tidak valid
Solusi: Gunakan 10-15 digit angka (contoh: 081234567890)
```

### Duplicate (Data Duplikat)
```
Error: Email sudah ada di sistem
Solusi: Gunakan email yang berbeda atau skip baris ini

Error: Nilai 'email' sudah ada di baris sebelumnya
Solusi: Periksa duplikasi dalam file CSV Anda
```

### Constraint Violation (Pelanggaran Constraint)
```
Error: Paket dengan ID 'xxx' tidak ditemukan
Solusi: Pastikan paket_id yang digunakan sudah ada di sistem
```

## Tips untuk Import Sukses

### 1. Persiapan Data
- Bersihkan data dari karakter khusus
- Pastikan encoding UTF-8
- Gunakan format tanggal YYYY-MM-DD
- Nomor telepon tanpa spasi atau tanda hubung

### 2. Testing
- Test dengan 5-10 baris terlebih dahulu
- Validasi sebelum import penuh
- Backup data sebelum import besar

### 3. Handling Error
- Download template resmi dari sistem
- Copy-paste data ke template
- Validasi terlebih dahulu sebelum import
- Perbaiki error secara bertahap

### 4. Performance
- Import maksimal 10,000 baris per file
- Untuk data lebih besar, bagi menjadi beberapa file
- Import di luar jam sibuk untuk kecepatan optimal

## Troubleshooting

### File Tidak Bisa Diupload
**Masalah:** Error "Ukuran file terlalu besar"
**Solusi:** Pastikan file maksimal 10MB dan 10,000 baris

### Karakter Aneh/Encoding Error
**Masalah:** Nama muncul dengan karakter aneh (�)
**Solusi:**
1. Buka CSV di Notepad++
2. Pilih Encoding > Convert to UTF-8
3. Save dan upload ulang

### Excel CSV dengan Delimiter Titik Koma
**Masalah:** Data tidak terbaca dengan benar
**Solusi:** Sistem otomatis mendeteksi delimiter, pastikan konsisten di seluruh file

### Import Lambat
**Masalah:** Progress import sangat lambat
**Solusi:**
1. Kurangi jumlah baris per file
2. Import di luar jam sibuk
3. Pastikan koneksi internet stabil

## Rollback Import

Jika terjadi kesalahan, Anda dapat melakukan rollback:

1. Buka halaman Riwayat Import
2. Pilih job import yang ingin di-rollback
3. Klik "Rollback"
4. Konfirmasi rollback

**Catatan:** Rollback hanya tersedia untuk import yang sudah selesai dalam 24 jam terakhir.

## Support

Jika mengalami kesulitan:
- Hubungi Support: support@travelumroh.com
- WhatsApp: 0812-3456-7890
- Dokumentasi lengkap: https://docs.travelumroh.com
