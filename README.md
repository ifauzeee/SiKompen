<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:008C9D,100:007A8A&height=200&section=header&text=SiKompen&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Sistem%20Kompensasi%20Digital&descAlignY=55&descSize=20" alt="SiKompen Banner"/>
</p>

<p align="center">
  <a href="https://ifauzeee.vercel.app/projects/sikompen/preview">
    <img src="https://img.shields.io/badge/🔴%20Live%20Preview-Click%20Here-008C9D?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Preview"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1.0-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-5.17.0-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

<p align="center">
  <strong>Platform digital Politeknik Negeri Jakarta untuk manajemen jam kompensasi mahasiswa yang transparan dan terintegrasi.</strong>
</p>

---

## 📋 Daftar Isi

- [🌐 Preview Langsung](#-preview-langsung)
- [🎯 Tentang Project](#-tentang-project)
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Teknologi yang Digunakan](#️-teknologi-yang-digunakan)
- [📦 Persyaratan Sistem](#-persyaratan-sistem)
- [🚀 Instalasi & Menjalankan](#-instalasi--menjalankan)
- [📂 Struktur Project](#-struktur-project)
- [🔐 Autentikasi & Role](#-autentikasi--role)
- [💾 Database Schema](#-database-schema)
- [📧 Konfigurasi Email](#-konfigurasi-email)
- [📊 API Endpoints](#-api-endpoints)
- [🎨 Screenshots](#-screenshots)
- [🧪 Testing](#-testing)
- [☁️ Deployment](#️-deployment)
- [🤝 Kontribusi](#-kontribusi)
- [📝 Changelog](#-changelog)
- [❓ FAQ](#-faq)
- [📄 Lisensi](#-lisensi)

---

## 🌐 Preview Langsung

<p align="center">
  <a href="https://ifauzeee.vercel.app/projects/sikompen/preview">
    <img src="https://img.shields.io/badge/🚀%20KLIK%20UNTUK%20MELIHAT%20DEMO-008C9D?style=for-the-badge&logoColor=white" alt="Demo"/>
  </a>
</p>

**➡️ [https://ifauzeee.vercel.app/projects/sikompen/preview](https://ifauzeee.vercel.app/projects/sikompen/preview)**

**Akun Demo:**

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

---

## 🎯 Tentang Project

**SiKompen (Sistem Kompensasi)** adalah aplikasi web modern yang dirancang khusus untuk mempermudah pengelolaan jam kompensasi mahasiswa di lingkungan **Politeknik Negeri Jakarta (PNJ)**. 

### Latar Belakang

Di PNJ, mahasiswa yang memiliki tanggungan akademik (seperti ketidakhadiran atau pelanggaran) wajib mengganti dengan jam kompensasi melalui berbagai tugas/pekerjaan. Proses manual selama ini memiliki beberapa kendala:

- ❌ Pencatatan jam kompensasi tidak terorganisir
- ❌ Mahasiswa kesulitan mencari tugas kompensasi yang tersedia
- ❌ Supervisor kesulitan memantau progress mahasiswa
- ❌ Tidak ada transparansi dalam perhitungan jam

### Solusi SiKompen

SiKompen mendigitalisasi seluruh proses ini dengan menyediakan:

- ✅ Platform terpusat untuk manajemen jam kompensasi
- ✅ Sistem lamaran pekerjaan yang transparan
- ✅ Dashboard real-time untuk monitoring progress
- ✅ Notifikasi otomatis via email
- ✅ Laporan dan statistik terintegrasi

---

## ✨ Fitur Utama

### 👨‍🎓 Portal Mahasiswa

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard Personal** | Melihat sisa jam kompensasi, status akademik, dan riwayat aktivitas secara real-time |
| **Pencarian Pekerjaan** | Mencari dan memfilter pekerjaan kompensasi berdasarkan kategori (Teknis, Non-Teknis, dll) |
| **Pengajuan Lamaran** | Melamar pekerjaan kompensasi dengan satu klik melalui sistem online |
| **Upload Bukti Kerja** | Mengunggah foto bukti penyelesaian tugas sebagai verifikasi |
| **Tracking Status** | Memantau status lamaran (Pending, Diterima, Ditolak, Selesai) secara real-time |
| **Profil Lengkap** | Mengelola informasi personal, NIM, program studi, dan kelas |
| **Notifikasi Email** | Menerima notifikasi otomatis saat lamaran disetujui atau ditolak |

### 👨‍🏫 Portal Supervisor/Dosen

| Fitur | Deskripsi |
|-------|-----------|
| **Manajemen Pekerjaan** | Membuat, mengedit, dan menghapus lowongan pekerjaan kompensasi |
| **My Jobs Dashboard** | Melihat daftar pekerjaan yang dibuat dan status pendaftarnya |
| **Persetujuan Lamaran** | Meninjau dan approve/reject pengajuan kompensasi dari mahasiswa |
| **Verifikasi Bukti** | Memverifikasi bukti foto yang diupload oleh mahasiswa |
| **Pemantauan Progress** | Melihat progress mahasiswa dalam menyelesaikan tugas |

### 🔧 Portal Admin

| Fitur | Deskripsi |
|-------|-----------|
| **User Management** | CRUD lengkap untuk mengelola akun mahasiswa, dosen, dan supervisor |
| **Semua Pekerjaan** | Melihat dan mengelola semua pekerjaan dari seluruh supervisor |
| **Semua Lamaran** | Melihat dan mengelola semua lamaran dari seluruh mahasiswa |
| **Import/Export Data** | Import data mahasiswa via CSV dan export laporan ke Excel/PDF |
| **Activity Log** | Melihat riwayat aktivitas seluruh pengguna dalam sistem |
| **Pengaturan Sistem** | Konfigurasi sistem seperti rate konversi jam, batas kuota, dll |
| **Finance/Pembayaran** | Mengelola pembayaran dan konversi uang ke jam kompensasi |
| **Laporan Statistik** | Melihat rekapitulasi data dan statistik kompensasi |
| **Clearance Management** | Mengelola status bebas tanggungan mahasiswa |

### 🎨 Fitur Tambahan

- **Dark/Light Mode** - Tema gelap dan terang untuk kenyamanan pengguna
- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **GSAP Animations** - Animasi halus dan modern pada UI
- **Real-time Charts** - Visualisasi data dengan Recharts
- **PDF Export** - Export sertifikat dan laporan ke format PDF

---

## 🛠️ Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| [Next.js](https://nextjs.org/) | 15.1.0 | React Framework dengan App Router |
| [React](https://reactjs.org/) | 19.0.0 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS Framework |
| [GSAP](https://greensock.com/gsap/) | 3.14.2 | Animation Library |
| [Lucide React](https://lucide.dev/) | 0.562.0 | Icon Library |
| [Recharts](https://recharts.org/) | 3.6.0 | Charting Library |

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) | - | Server Actions & API |
| [Prisma](https://www.prisma.io/) | 5.17.0 | ORM (Object-Relational Mapping) |
| [SQLite](https://www.sqlite.org/) | - | Database (Development) |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | 3.0.3 | Password Hashing |
| [jose](https://www.npmjs.com/package/jose) | 6.1.3 | JWT Authentication |
| [Nodemailer](https://nodemailer.com/) | 7.0.12 | Email Service |
| [Zod](https://zod.dev/) | 3.24.1 | Schema Validation |

### Development Tools
| Tool | Deskripsi |
|------|-----------|
| pnpm | Package Manager |
| ESLint | Linting |
| PostCSS | CSS Processing |
| tsx | TypeScript Execution |

---

## 📦 Persyaratan Sistem

Sebelum memulai, pastikan komputer Anda telah terinstall:

| Requirement | Versi Minimum | Rekomendasi |
|-------------|---------------|-------------|
| **Node.js** | 18.17.0 | 20.x LTS |
| **npm / pnpm** | npm 9.x / pnpm 8.x | pnpm (lebih cepat) |
| **Git** | 2.x | Latest |

### Cek Versi

```bash
node -v    # Output: v20.x.x
pnpm -v    # Output: 8.x.x
git --version
```

---

## 🚀 Instalasi & Menjalankan

### Metode 1: Quick Start (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/ifauzeee/SiKompen.git
cd SiKompen

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env

# 4. Setup database
pnpm prisma migrate dev --name init
pnpm prisma db seed

# 5. Jalankan development server
pnpm dev
```

### Metode 2: Step-by-Step (Detailed)

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/ifauzeee/SiKompen.git
cd SiKompen
```

#### 2️⃣ Install Dependencies

```bash
# Menggunakan pnpm (Recommended)
pnpm install

# atau npm
npm install

# atau yarn
yarn install
```

#### 3️⃣ Konfigurasi Environment Variables

Buat file `.env` dari template:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell) / Linux / macOS
cp .env.example .env
```

Edit file `.env` sesuai kebutuhan:

```env
# Database (Wajib)
DATABASE_URL="file:./dev.db"

# Email Configuration (Opsional - untuk fitur notifikasi email)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@sikompen.com"

# Security (Wajib)
SESSION_SECRET="your-very-secure-random-string-minimum-32-characters"
```

#### 4️⃣ Setup Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Jalankan migrasi database
pnpm prisma migrate dev --name init

# (Opsional) Seed data awal
pnpm prisma db seed
```

#### 5️⃣ Jalankan Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di **[http://localhost:3000](http://localhost:3000)**

### 🔑 Default Login Credentials

Setelah menjalankan `prisma db seed`:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

---

## 📂 Struktur Project

```
SiKompen/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 actions/                  # Server Actions (Backend Logic)
│   │   ├── admin.ts                 # Admin-related actions
│   │   ├── applications.ts          # Job application actions
│   │   ├── auth.ts                  # Authentication actions
│   │   ├── jobs.ts                  # Job CRUD actions
│   │   ├── payment.ts               # Payment processing actions
│   │   └── users.ts                 # User management actions
│   │
│   ├── 📁 clearance/                # Clearance/bebas tanggungan pages
│   ├── 📁 dashboard/                # Dashboard pages
│   │   ├── AdminDashboard.tsx       # Admin dashboard component
│   │   ├── DashboardClient.tsx      # Client-side dashboard logic
│   │   ├── SupervisorDashboard.tsx  # Supervisor dashboard component
│   │   ├── 📁 activity/             # Activity log pages
│   │   ├── 📁 export/               # Data export pages
│   │   ├── 📁 finance/              # Finance/payment pages
│   │   ├── 📁 help/                 # Help & documentation
│   │   ├── 📁 import/               # Data import pages
│   │   ├── 📁 my-jobs/              # Supervisor's job management
│   │   ├── 📁 report/               # Reports & analytics
│   │   ├── 📁 settings/             # System settings
│   │   └── 📁 users/                # User management pages
│   │
│   ├── 📁 jobs/                     # Job listing & detail pages
│   ├── 📁 login/                    # Login page
│   ├── 📁 my-applications/          # Student's application tracking
│   ├── 📁 profile/                  # User profile pages
│   │
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
│
├── 📁 components/                   # Reusable UI Components
│   ├── DeleteModal.tsx              # Confirmation modal
│   ├── EditHoursModal.tsx           # Hours editing modal
│   ├── GlobalDialog.tsx             # Global dialog component
│   ├── MainLayout.tsx               # Main layout wrapper
│   ├── Navbar.tsx                   # Navigation bar
│   ├── Sidebar.tsx                  # Sidebar navigation
│   ├── SmoothWrapper.tsx            # GSAP smooth scroll wrapper
│   └── ThemeToggle.tsx              # Dark/Light mode toggle
│
├── 📁 contexts/                     # React Contexts
│   └── ThemeContext.tsx             # Theme state management
│
├── 📁 lib/                          # Utility Functions
│   ├── email.ts                     # Email sending utilities
│   ├── password.ts                  # Password hashing utilities
│   ├── prisma.ts                    # Prisma client instance
│   └── session.ts                   # Session/JWT utilities
│
├── 📁 prisma/                       # Database Configuration
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Database seeder
│   └── dev.db                       # SQLite database file
│
├── 📁 public/                       # Static Files
│
├── 📁 scripts/                      # Utility Scripts
│
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # pnpm lockfile
├── postcss.config.mjs               # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

---

## 🔐 Autentikasi & Role

SiKompen menggunakan sistem autentikasi berbasis **JWT (JSON Web Token)** dengan 3 role utama:

### Role Hierarchy

```
┌─────────────────────────────────────────┐
│                 ADMIN                    │  Full access
├─────────────────────────────────────────┤
│              SUPERVISOR                  │  Job & application management
├─────────────────────────────────────────┤
│              MAHASISWA                   │  Basic user access
└─────────────────────────────────────────┘
```

### Permissions Matrix

| Feature | ADMIN | SUPERVISOR | MAHASISWA |
|---------|:-----:|:----------:|:---------:|
| View Dashboard | ✅ | ✅ | ✅ |
| Browse Jobs | ✅ | ✅ | ✅ |
| Apply for Jobs | ❌ | ❌ | ✅ |
| Create Jobs | ✅ | ✅ | ❌ |
| Manage Own Jobs | ✅ | ✅ | ❌ |
| Approve Applications | ✅ | ✅ | ❌ |
| Manage All Jobs | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Activity Log | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Import/Export Data | ✅ | ❌ | ❌ |
| Finance Management | ✅ | ❌ | ❌ |

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │       Job       │     │  JobApplication │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │────<│ id              │────<│ id              │
│ username        │     │ title           │     │ userId          │
│ name            │     │ description     │     │ jobId           │
│ nim             │     │ quota           │     │ status          │
│ prodi           │     │ hours           │     │ proofImage1     │
│ kelas           │     │ category        │     │ proofImage2     │
│ role            │     │ status          │     │ submissionNote  │
│ totalHours      │     │ createdById     │     │ appliedAt       │
│ password        │     │ createdAt       │     │ updatedAt       │
│ isLibraryClear  │     │ updatedAt       │     └─────────────────┘
│ isAdminClear    │     └─────────────────┘
│ createdAt       │
│ updatedAt       │     ┌─────────────────┐     ┌─────────────────┐
└─────────────────┘     │ClearanceRequest │     │    Payment      │
         │              ├─────────────────┤     ├─────────────────┤
         │              │ id              │     │ id              │
         ├─────────────>│ userId          │     │ userId          │
         │              │ status          │     │ amount          │
         │              │ requestedAt     │     │ hoursEquivalent │
         │              │ approvedAt      │     │ proofUrl        │
         │              └─────────────────┘     │ status          │
         │                                      │ note            │
         └─────────────────────────────────────>│ createdAt       │
                                                │ updatedAt       │
┌─────────────────┐                             └─────────────────┘
│  ActivityLog    │
├─────────────────┤     ┌─────────────────┐
│ id              │     │ SystemSettings  │
│ userId          │     ├─────────────────┤
│ action          │     │ id              │
│ targetType      │     │ key             │
│ targetId        │     │ value           │
│ details         │     │ description     │
│ createdAt       │     │ updatedAt       │
└─────────────────┘     └─────────────────┘
```

### Model Details

#### User
Menyimpan data pengguna (mahasiswa, supervisor, admin)

| Field | Type | Description |
|-------|------|-------------|
| role | String | `ADMIN`, `SUPERVISOR`, `MAHASISWA` |
| totalHours | Int | Total jam kompensasi yang terkumpul |
| isLibraryClear | Boolean | Status bebas tanggungan perpustakaan |
| isAdminClear | Boolean | Status bebas tanggungan administrasi |

#### Job
Menyimpan data pekerjaan kompensasi

| Field | Type | Description |
|-------|------|-------------|
| category | String | `TEKNIS`, `NON_TEKNIS`, `ADMINISTRATIF` |
| status | String | `OPEN`, `CLOSED`, `FILLED` |
| hours | Int | Jumlah jam kompensasi yang diberikan |

#### JobApplication
Menyimpan data lamaran pekerjaan

| Field | Type | Description |
|-------|------|-------------|
| status | String | `PENDING`, `APPROVED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED` |
| proofImage1/2 | String? | URL bukti foto penyelesaian |

---

## 📧 Konfigurasi Email

SiKompen menggunakan **Nodemailer** untuk mengirim notifikasi email. Berikut konfigurasi untuk berbagai provider:

### Gmail

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-char-app-password"
EMAIL_FROM="SiKompen <noreply@sikompen.com>"
```

> ⚠️ **Catatan Gmail**: Anda perlu membuat [App Password](https://support.google.com/accounts/answer/185833) karena 2FA wajib aktif.

### Outlook/Office 365

```env
EMAIL_HOST="smtp.office365.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@outlook.com"
EMAIL_PASS="your-password"
EMAIL_FROM="SiKompen <your-email@outlook.com>"
```

### Custom SMTP

```env
EMAIL_HOST="mail.yourdomain.com"
EMAIL_PORT="587"
EMAIL_USER="user@yourdomain.com"
EMAIL_PASS="your-password"
EMAIL_FROM="SiKompen <noreply@yourdomain.com>"
```

---

## 📊 API Endpoints

SiKompen menggunakan **Next.js Server Actions** untuk komunikasi client-server. Berikut adalah action yang tersedia:

### Authentication (`app/actions/auth.ts`)

| Action | Description |
|--------|-------------|
| `login(formData)` | Autentikasi user |
| `logout()` | Logout & hapus session |
| `getSession()` | Get current session |

### Jobs (`app/actions/jobs.ts`)

| Action | Description |
|--------|-------------|
| `getJobs()` | Get all open jobs |
| `getJobById(id)` | Get job detail |
| `createJob(data)` | Create new job |
| `updateJob(id, data)` | Update job |
| `deleteJob(id)` | Delete job |

### Applications (`app/actions/applications.ts`)

| Action | Description |
|--------|-------------|
| `applyForJob(jobId)` | Apply to a job |
| `getMyApplications()` | Get user's applications |
| `approveApplication(id)` | Approve application |
| `rejectApplication(id)` | Reject application |
| `submitProof(id, proofData)` | Submit work proof |

### Users (`app/actions/users.ts`)

| Action | Description |
|--------|-------------|
| `getUsers()` | Get all users |
| `createUser(data)` | Create new user |
| `updateUser(id, data)` | Update user |
| `deleteUser(id)` | Delete user |

### Admin (`app/actions/admin.ts`)

| Action | Description |
|--------|-------------|
| `getDashboardStats()` | Get dashboard statistics |
| `getActivityLog()` | Get activity history |
| `updateSystemSettings(settings)` | Update system config |

---

## 🎨 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page)

### Login Page
![Login](https://via.placeholder.com/800x400?text=Login+Page)

### Dashboard Mahasiswa
![Dashboard](https://via.placeholder.com/800x400?text=Student+Dashboard)

### Dashboard Admin
![Admin](https://via.placeholder.com/800x400?text=Admin+Dashboard)

### Job Listing
![Jobs](https://via.placeholder.com/800x400?text=Job+Listing)

> 📸 *Lihat aplikasi langsung di [Live Preview](https://ifauzeee.vercel.app/projects/sikompen/preview)*

---

## 🧪 Testing

### Menjalankan Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm tsc --noEmit
```

### Database Testing

```bash
# Reset database & re-seed
pnpm prisma migrate reset

# View database dengan Prisma Studio
pnpm prisma studio
```

---

## ☁️ Deployment

### Deploy ke Vercel (Recommended)

1. **Push ke GitHub**
   ```bash
   git push origin main
   ```

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Import repository GitHub
   - Konfigurasi environment variables

3. **Environment Variables di Vercel**
   ```
   DATABASE_URL=your-production-database-url
   SESSION_SECRET=your-secure-session-secret
   EMAIL_HOST=...
   EMAIL_PORT=...
   EMAIL_USER=...
   EMAIL_PASS=...
   EMAIL_FROM=...
   ```

### Deploy Manual

```bash
# Build production
pnpm build

# Start production server
pnpm start
```

### Database Production

Untuk production, disarankan menggunakan database yang lebih robust:

- **PostgreSQL** (Recommended): Supabase, Railway, Neon
- **MySQL**: PlanetScale
- **MongoDB**: MongoDB Atlas

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // atau "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah-langkah berikut:

### Cara Berkontribusi

1. **Fork** repository ini
2. **Clone** fork Anda
   ```bash
   git clone https://github.com/YOUR_USERNAME/SiKompen.git
   ```
3. **Buat branch** untuk fitur/fix Anda
   ```bash
   git checkout -b feature/fitur-keren
   ```
4. **Commit** perubahan Anda
   ```bash
   git commit -m "feat: menambah fitur keren"
   ```
5. **Push** ke branch Anda
   ```bash
   git push origin feature/fitur-keren
   ```
6. **Buat Pull Request**

### Commit Convention

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `docs:` | Dokumentasi |
| `style:` | Formatting (tidak mengubah logic) |
| `refactor:` | Refactoring code |
| `test:` | Menambah/memperbaiki test |
| `chore:` | Maintenance |

---

## 📝 Changelog

### v0.1.0 (2025-01-11)

- 🎉 Initial release
- ✨ Multi-role authentication (Admin, Supervisor, Mahasiswa)
- ✨ Job management system
- ✨ Application & approval workflow
- ✨ Dashboard dengan statistik real-time
- ✨ Email notification system
- ✨ Dark/Light mode
- ✨ Responsive design
- ✨ Activity logging
- ✨ Import/Export data
- ✨ Payment/Finance module

---

## ❓ FAQ

<details>
<summary><strong>Q: Bagaimana cara reset password admin?</strong></summary>

Jalankan kembali database seed:
```bash
pnpm prisma db seed
```
Ini akan reset password admin ke `admin123`.

</details>

<details>
<summary><strong>Q: Kenapa email tidak terkirim?</strong></summary>

1. Pastikan konfigurasi SMTP sudah benar
2. Untuk Gmail, gunakan App Password bukan password biasa
3. Cek firewall tidak memblokir port SMTP (587)

</details>

<details>
<summary><strong>Q: Bagaimana migrasi ke PostgreSQL untuk production?</strong></summary>

1. Update `schema.prisma` mengubah provider ke `postgresql`
2. Update `DATABASE_URL` di `.env` dengan connection string PostgreSQL
3. Jalankan `pnpm prisma migrate dev`

</details>

<details>
<summary><strong>Q: Apakah bisa dijalankan di Windows?</strong></summary>

Ya! SiKompen fully compatible dengan Windows. Gunakan PowerShell atau Command Prompt untuk menjalankan commands.

</details>

---

## 📄 Lisensi

Didistribusikan di bawah **MIT License**.

```
MIT License

Copyright (c) 2025 SiKompen Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:008C9D,100:007A8A&height=100&section=footer" alt="Footer"/>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/ifauzeee">SiKompen Team</a>
</p>

<p align="center">
  <a href="https://ifauzeee.vercel.app/projects/sikompen/preview">
    <img src="https://img.shields.io/badge/🌐%20Live%20Preview-008C9D?style=for-the-badge" alt="Preview"/>
  </a>
</p>
