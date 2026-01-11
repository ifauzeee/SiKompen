<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:008C9D,100:007A8A&height=220&section=header&text=SiKompen&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Sistem%20Kompensasi%20Digital%20PNJ&descAlignY=55&descSize=20" alt="SiKompen Banner" width="100%"/>

  <br />

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Prisma-5.17.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
    <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  </p>

  <h3>Platform Digital Transparan & Terintegrasi untuk Manajemen Kompensasi Mahasiswa</h3>

  <!-- Action Buttons -->
  <p>
    <a href="https://ifauzeee.vercel.app/projects/sikompen/preview">
      <img src="https://img.shields.io/badge/🎥_Live_Preview_&_Screenshots-008C9D?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Preview"/>
    </a>
    <a href="https://github.com/ifauzeee/SiKompen">
      <img src="https://img.shields.io/badge/📂_Source_Code_(GitHub)-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"/>
    </a>
  </p>
</div>

---

## 📋 Daftar Isi

- [💡 Tentang Project](#-tentang-project)
- [✨ Fitur Unggulan](#-fitur-unggulan)
- [🛠️ Teknologi](#️-teknologi)
- [🚀 Quick Start](#-quick-start)
- [📸 Galeri & Preview](#-galeri--preview)
- [📂 Struktur & Database](#-struktur--database)
- [🔌 API & Integrasi](#-api--integrasi)
- [🤝 Kontribusi](#-kontribusi)

---

## 💡 Tentang Project

**SiKompen (Sistem Kompensasi)** hadir sebagai solusi modern untuk digitalisasi proses kompensasi mahasiswa di **Politeknik Negeri Jakarta (PNJ)**. 

### 🚨 Masalah
Sebelumnya, proses kompensasi dilakukan secara manual, menyebabkan:
- Pencatatan yang berantakan dan sulit dilacak.
- Kurangnya transparansi informasi lowongan kompensasi.
- Kesulitan monitoring progress bagi dosen/supervisor.

### ✅ Solusi Kami
**SiKompen** mentransformasi proses tersebut menjadi ekosistem digital yang mulus:
- **Centralized Management**: Satu platform untuk semua kebutuhan kompensasi.
- **Real-time Tracking**: Monitor status lamaran dan pengerjaan tugas secara langsung.
- **Transparent System**: Perhitungan jam dan validasi yang jelas & akurat.

---

## ✨ Fitur Unggulan

Aplikasi ini membagi akses menjadi 3 role utama dengan fitur spesifik:

### 🎓 Mahasiswa
| Fitur | Deskripsi |
|-------|-----------|
| **Smart Dashboard** | Ringkasan sisa jam, status akademik, dan notifikasi terbaru. |
| **Job Discovery** | Cari pekerjaan kompensasi dengan filter canggih (Kategori, Kuota, dll). |
| **Instant Apply** | Lamar pekerjaan dengan satu klik & upload bukti pengerjaan mudah. |
| **Live Status** | Pantau status lamaran dari *Pending* hingga *Approved* real-time. |

### 👨‍🏫 Dosen / Supervisor
| Fitur | Deskripsi |
|-------|-----------|
| **Job Management** | Buat lowongan pekerjaan baru, atur kuota, dan deskripsi tugas. |
| **Approval System** | Review pelamar, setujui atau tolak dengan alasan yang jelas. |
| **Proof Validation** | Verifikasi bukti foto mahasiswa sebelum memberikan jam kompensasi. |

### 🛡️ Admin
| Fitur | Deskripsi |
|-------|-----------|
| **User Control** | Manajemen penuh data mahasiswa, dosen, dan staf. |
| **System Config** | Pengaturan global (rate konversi, batas waktu, dll). |
| **Analytics** | Laporan statistik komprehensif & export data (PDF/Excel). |

---

## 🛠️ Teknologi

Dibangun dengan stack modern untuk performa dan skalabilitas maksimal:

### Core Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: GSAP & Framer Motion like effects

### Backend & Data
- **Database**: SQLite (Dev) / PostgreSQL (Prod) via [Prisma ORM](https://www.prisma.io/)
- **Auth**: JWT Custom Implementation (Jose) + Bfrypt
- **Validation**: Zod Schemas

---

## 🚀 Quick Start

Ingin mencoba menjalankan di lokal? Ikuti langkah mudah ini.

### Prasyarat
- Node.js `v18+`
- pnpm (Recommended)

### Instalasi

```bash
# 1. Clone Repository
git clone https://github.com/ifauzeee/SiKompen.git
cd SiKompen

# 2. Install Dependencies
pnpm install

# 3. Setup Environment
cp .env.example .env
# Edit .env sesuaikan kebutuhan (database url, dll)

# 4. Inisialisasi Database
pnpm prisma migrate dev --name init
pnpm prisma db seed

# 5. Jalankan Server
pnpm dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

### 🔑 Akun Demo (Default Seed)
| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

---

## 📸 Galeri & Preview

> **⚠️ Note:** Untuk menjaga dokumen ini tetap ringkas, kami tidak menampilkan screenshot di sini.

Silakan kunjungi link berikut untuk melihat **Galeri UI Lengkap** dan **Live Demo**:

<div align="center">
  <br/>
  <a href="https://ifauzeee.vercel.app/projects/sikompen/preview">
    <img src="https://img.shields.io/badge/👉_LIHAT_SEMUA_SCREENSHOTS_DI_SINI-008C9D?style=for-the-badge&logo=vercel&logoColor=white" height="50" alt="Screenshots Link"/>
  </a>
  <br/><br/>
  <p>Preview mencakup: Landing Page, Dashboard Mahasiswa/Admin, Halaman Lowongan, & Flow Aplikasi.</p>
</div>

---

## 📂 Struktur & Database

### Struktur Folder
```
SiKompen/
├── 📁 app/                 # Next.js App Router (Pages & API)
├── 📁 components/          # Reusable UI Components
├── 📁 lib/                 # Utilities (Prisma, Auth, Email)
├── 📁 prisma/              # Database Schema & Seeds
└── public/                 # Static Assets
```

### Skema Database (Simpel)
- **User**: Menyimpan data login & profil.
- **Job**: Lowongan yang tersedia.
- **JobApplication**: Relasi User melamar Job.
- **ActivityLog**: Mencatat setiap aksi penting.

---

## 🔌 API & Integrasi

Backend menggunakan **Server Actions** Next.js yang aman dan terintegrasi langsung.

- **Auth**: `login`, `logout`, `getSession`
- **Jobs**: `createJob`, `applyJob`, `approveJob`
- **Users**: CRUD User management

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi!
1. Fork repo ini
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Add fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ifauzeee">Ifauzeee</a> for Politeknik Negeri Jakarta
</p>
