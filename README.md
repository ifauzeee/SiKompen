# SiKompen (Sistem Kompensasi)

SiKompen adalah aplikasi berbasis web yang dirancang untuk mempermudah pengelolaan jam kompensasi mahasiswa di lingkungan **Politeknik Negeri Jakarta (PNJ)**. Aplikasi ini mendigitalisasi proses pencatatan, pengajuan tugas kompensasi, dan pemantauan sisa jam kompensasi mahasiswa secara *real-time*.

![SiKompen Dashboard](https://via.placeholder.com/800x400?text=SiKompen+Preview) 
*(Ganti link gambar di atas dengan screenshot aplikasi jika sudah tersedia)*

## 🚀 Fitur Utama

### 👨‍🎓 Mahasiswa
*   **Dashboard Personal**: Melihat sisa jam kompensasi, status akademik, dan riwayat aktivitas.
*   **Pencarian Pekerjaan**: Mencari pekerjaan/tugas kompensasi yang tersedia berdasarkan kategori.
*   **Pengajuan Lamaran**: Melamar pekerjaan kompensasi secara langsung melalui sistem.
*   **Tracking Status**: Memantau status lamaran (Pending, Diterima, Ditolak) secara *real-time*.
*   **Notifikasi Email**: Menerima notifikasi otomatis saat lamaran disetujui atau ditolak.

### 👨‍🏫 Dosen / Supervisor / Admin
*   **Manajemen Pekerjaan**: Membuat, mengedit, dan menghapus lowongan pekerjaan kompensasi.
*   **Persetujuan Lamaran**: Meninjau dan menyetujui/menolak pengajuan kompensasi dari mahasiswa.
*   **Pemantauan Mahasiswa**: Melihat daftar mahasiswa yang memiliki tanggungan jam kompensasi.
*   **Laporan & Statistik**: (Coming Soon) Melihat rekapitulasi data kompensasi.

## 🛠️ Teknologi yang Digunakan

Project ini dibangun dengan **Modern Web Stack** untuk performa dan pengalaman pengguna terbaik:

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database**: [SQLite](https://www.sqlite.org/) (Local Dev)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Animations**: [GSAP](https://greensock.com/gsap/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Email**: [Nodemailer](https://nodemailer.com/)

## 📦 Persyaratan Sistem

*   Node.js (versi 18.17.0 atau lebih baru)
*   npm atau pnpm (disarankan)

## 🏁 Cara Install & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan project di komputer lokal anda:

### 1. Clone Repository
```bash
git clone https://github.com/ifauzeee/SiKompen
cd sikompen
```

### 2. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Secara default, konfigurasi di atas sudah cukup untuk menjalankan aplikasi dengan data lokal.
*Opsional:* Jika ingin fitur email berfungsi, edit `.env` dan isi bagian konfigurasi SMTP Email.

### 4. Setup Database
Jalankan migrasi Prisma untuk membuat tabel database SQLite lokal:
```bash
npx prisma migrate dev --name init
```

**(Opsional) Seed Data Dummy:**
Jika ingin mengisi database dengan data contoh (Mahasiswa, Admin, dll):
```bash
npx prisma db seed
```

### 5. Jalankan Server Development
```bash
npm run dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser anda.

## 📂 Struktur Project

```
sikompen/
├── app/                  # Source code utama (Next.js App Router)
│   ├── dashboard/        # Halaman dashboard (Student & Supervisor)
│   ├── jobs/             # Halaman daftar pekerjaan
│   ├── actions/          # Server Actions (Backend Logic)
│   └── ...
├── components/           # Komponen UI Reusable
├── prisma/               # Konfigurasi Database & Schema
├── public/               # File statis (Gambar, Icon)
├── lib/                  # Utility functions (Email, DB Client)
└── ...
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat *Issue* untuk melaporkan bug atau *Pull Request* untuk fitur baru.

1.  Fork Project ini
2.  Buat Feature Branch (`git checkout -b fitur-keren`)
3.  Commit perubahan (`git commit -m 'Menambah fitur keren'`)
4.  Push ke Branch (`git push origin fitur-keren`)
5.  Buka a Pull Request

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
