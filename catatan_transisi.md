# 📋 CATATAN TRANSISI & DOKUMENTASI SISTEM (ULTAH INTERAKTIF 3D)

Dokumen ini berisi rangkuman lengkap arsitektur aplikasi, progress pengembangan, daftar kredensial, integrasi sistem, serta panduan operasional produksi & deployment.

---

## 1. 🌐 Informasi Umum Proyek & URL Produksi

- **Nama Proyek**: Aplikasi Web Ucapan Ulang Tahun & Kado Interaktif 3D
- **Domain Produksi**: [https://harizal.vercel.app/](https://harizal.vercel.app/)
- **Repository GitHub**: `git@github.com:harizalideas/harizal.git`
- **Branch Utama**: `main`
- **Tech Stack**:
  - **Framework**: Next.js 16 (App Router, Turbopack, React 19)
  - **Styling**: Vanilla CSS, Glassmorphism, Responsive Mobile-First Container
  - **3D Graphic & Motion**: Three.js, React Three Fiber, React Three Drei (3D Lanyard Card & Coucou Mochi)
  - **Audio Engine**: Web Audio API Chiptune Synthesizer (`AudioSynth.js`)
  - **Database & Auth**: Supabase PostgreSQL + Supabase Auth
  - **Cloud Storage**: Supabase Storage (Bucket: `kado-gifts`)
  - **Email Service**: Resend API (Domain: `harizal@official.id`)
  - **Hosting Platform**: Vercel Serverless Platform

---

## 2. 🔑 Kredensial & Environment Variables

Konfigurasi ini berada pada file `.env.local` di root direktori lokal, dan **WAJIB** dipasang pada Dashboard Vercel (*Project Settings -> Environment Variables*):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xymznvulpheibgtiyzwx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bXpudnVscGhlaWJndGl5end4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NzAxMTcsImV4cCI6MjA3NDM0NjExN30.CTVkbgrFsAl3-ngUBRUp2Y5DPJNRlZ-YgpEJWOf88is
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bXpudnVscGhlaWJndGl5end4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc3MDExNywiZXhwIjoyMDc0MzQ2MTE3fQ.G285wH_JJ4CnfUem75DhtWevcUzIaLyRhXHndUqa2cU

# Email Service (Resend)
# Nilai asli tersimpan di .env.local & Vercel Dashboard
# Nilai Base64: cmVfSnh6eXRXOFFfM3pXeWVOYWF3bWZBNDdzdnZWVVBobWgy
RESEND_API_KEY=cmVfSnh6eXRXOFFfM3pXeWVOYWF3bWZBNDdzdnZWVVBobWgy
RESEND_FROM=harizal@official.id
```

> **Catatan Keamanan**: 
> - `NEXT_PUBLIC_SUPABASE_ANON_KEY` aman untuk publik/browser.
> - `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server (`src/lib/supabaseAdmin.js` dan API routes) untuk bypass RLS secara aman tanpa ekspos ke client.

---

## 3. 🔗 Integrasi & Arsitektur Layanan (Terhubung Kemana Saja)

```mermaid
graph TD
    User([Pengunjung / Pengguna]) --> Vercel[Vercel Serverless Hosting]
    Vercel --> NextApp[Next.js App Router]
    NextApp --> SupaAuth[Supabase Auth - User Login/Register]
    NextApp --> SupaDB[(Supabase PostgreSQL - greetings)]
    NextApp --> SupaStorage[Supabase Storage - kado-gifts]
    NextApp --> Resend[Resend API - Email Transactional]
    Resend --> UserEmail([Email Inbox Pengguna])
    GitHub[GitHub Repo: harizalideas/harizal] -->|Auto-Deploy on Push| Vercel
```

### A. Vercel Hosting
- Menghandle SSR, dynamic route `/[slug]`, dan API route `api/greeting/create` serta `api/greeting/edit`.
- Terhubung langsung dengan GitHub repository: setiap `git push origin main` otomatis memicu pipeline build dan live deploy.

### B. Supabase Cloud (`xymznvulpheibgtiyzwx`)
1. **Database PostgreSQL** (`public.greetings`):
   - `id`: UUID (Primary Key)
   - `slug`: Text (Unique, cth: `luthfan-arzani-ramadhan-cs18`, `nurlaila`)
   - `recipient_name`: Nama penerima kado/ucapan
   - `sender_name`: Nama pengirim ucapan
   - `photo_url`: URL foto kartu lanyard 3D di Supabase Storage
   - `email`: Email pemilik akun/pembuat kartu
   - `password`: Password akun pembuat
   - `relationship`: Kode relasi (A s/d L)
   - `message`: Catatan ucapan pengantar
   - `created_at` & `updated_at`: Timestamp
2. **Supabase Auth**:
   - Menyimpan akun terdaftar (email & password terenkripsi) untuk otentikasi saat edit kartu.
3. **Supabase Storage** (`kado-gifts`):
   - Path: `gifts/<filename>`
   - Policy: Publik untuk dibaca (`SELECT`), digunakan oleh Three.js Canvas untuk tekstur kartu ID lanyard 3D.

### C. Resend Email Platform
- Mengirimkan email ucapan selamat & detail link kartu secara otomatis kepada pengguna saat kartu baru berhasil dibuat.
- Menggunakan alamat pengirim terverifikasi: `harizal@official.id`.

---

## 4. 🚀 Progress & Fitur yang Telah Diselesaikan

1. **12 Kategori Hubungan Dinamis (A s/d L)**:
   - Terintegrasi di [src/lib/relationships.js](file:///Users/kabayangroup/Library/CloudStorage/OneDrive-Personal/Kabayangroup/ultah/src/lib/relationships.js).
   - Menghasilkan surat ucapan mendalam, doa-doa tematik, dan panggilan kasih sayang yang disesuaikan secara otomatis:
     - A. Orang Tua ke Anak (`parent_to_child`)
     - B. Anak ke Orang Tua (`child_to_parent`)
     - C. Pacar Pria ke Pacar Wanita (`boyfriend_to_girlfriend`)
     - D. Pacar Wanita ke Pacar Pria (`girlfriend_to_boyfriend`)
     - E. Suami ke Istri (`husband_to_wife`)
     - F. Istri ke Suami (`wife_to_husband`)
     - G. Sahabat ke Sahabat (`bestfriend_to_bestfriend`)
     - H. Teman ke Teman (`friend_to_friend`)
     - I. Teman Kerja ke Teman Kerja (`coworker_to_coworker`)
     - J. Siswa kepada Guru (`student_to_teacher`)
     - K. Yang Muda kepada yang Lebih Tua (`younger_to_elder`)
     - L. Yang Lebih Tua kepada yang Lebih Muda (`elder_to_younger`)
2. **Pemberian Kode Unik 4 Digit pada Slug**:
   - Setiap kartu baru yang dibuat akan otomatis diberi imbuhan 4 digit acak (cth: `budi-santoso-7412`) untuk memastikan tidak terjadi benturan URL/slug bila ada nama penerima yang sama.
3. **Multi-Card Management untuk 1 Akun**:
   - Jika satu akun email (misal: `harizalbanget@gmail.com`) membuat lebih dari 1 kartu ucapan, saat login di form "Edit Kartu", sistem akan memunculkan **Card Selector Modal** sehingga pengguna bisa memilih kartu ucapan mana yang ingin disunting.
4. **Nama Penerima Dinamis pada WishBoard**:
   - Judul section *"Sampaikan Harapan & Doa untuk [Nama Penerima]"* dan *"Kumpulan Doa & Harapan untuk [Nama Penerima]"* kini 100% dinamis mengikuti data yang dipilih.
5. **Migrasi Penyimpanan Foto ke Cloud Permanen**:
   - Foto statis lokal telah dimigrasikan ke Supabase Storage (`kado-gifts/gifts/nurlaila.jpeg`).
   - Folder lokal `/kado` telah dihapus sehingga repo bersih dari file media yang membebani git.
6. **Integrasi Resend Email Otomatis**:
   - Fallback dan API key Resend telah dikonfigurasi dan diverifikasi aktif terkirim ke inbox email penerima.

---

## 5. 👥 Data Akun & Kartu yang Sedang Aktif

| Email Akun | Password | Slug Kartu | Penerima | Relasi | Status Foto |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `harizalbanget@gmail.com` | `Berdikari2026` | `luthfan-arzani-ramadhan-cs18` | Luthfan Arzani Ramadhan | Orang Tua ke Anak | Supabase Storage (`.png`) |
| `harizalideas@gmail.com` | `Berdikari2026` | `nurlaila` | Nurlaila | Sahabat ke Sahabat | Supabase Storage (`.jpeg`) |
| `arifbw31.baru@gmail.com` | `Berdikari2026` | `fajar` | Fajar | Teman Kerja | Supabase Storage (`.jpeg`) |

---

## 6. 🛠️ Panduan Operasional & Deployment Produksi

### Menjalankan di Komputer Lokal (Development)
```bash
# Masuk ke direktori
cd /Users/kabayangroup/Library/CloudStorage/OneDrive-Personal/Kabayangroup/ultah

# Jalankan server lokal Next.js
npm run dev
# Buka browser di http://localhost:3000
```

### Melakukan Build Test
```bash
npm run build
```

### Melakukan Deploy ke Produksi (Vercel)
Semua perubahan cukup di-commit dan di-push ke GitHub:
```bash
git add .
git commit -m "feat/fix: deskripsi perubahan"
git push origin main
```
Vercel akan otomatis mendeteksi commit baru di branch `main` dan memperbarui web live di `https://harizal.vercel.app/` dalam waktu ~1 menit.

---
*Dokumen ini dibuat dan diperbarui otomatis pada 21 Oktober 2026.*
