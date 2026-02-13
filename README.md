<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:008C9D,100:007A8A&height=220&section=header&text=SiKompen&fontSize=80&fontColor=fff&animation=fadeIn&fontAlignY=35&desc=Sistem%20Kompensasi%20Digital%20Terintegrasi&descAlignY=55&descSize=20" alt="SiKompen Banner" width="100%"/>

  <br />

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go"/>
    <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/GORM-SQLite-2D3748?style=for-the-badge&logo=sqlite&logoColor=white" alt="GORM"/>
  </p>

  <h3>Sistem Manajemen Kompensasi Mahasiswa yang Cerdas, Transparan, dan Efisien</h3>

  <!-- Action Buttons -->
  <p>
    <a href="https://github.com/ifauzeee/SiKompen">
      <img src="https://img.shields.io/badge/📂_Source_Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"/>
    </a>
    <a href="#-quick-start">
      <img src="https://img.shields.io/badge/🚀_Quick_Start-008C9D?style=for-the-badge" alt="Quick Start"/>
    </a>
  </p>
</div>

---

## 📋 Daftar Isi

- [💡 Tentang SiKompen](#-tentang-sikompen)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [✨ Fitur Berdasarkan Role](#-fitur-berdasarkan-role)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start (Docker)](#-quick-start-docker)
- [📂 Struktur Folder](#-struktur-folder)
- [🤝 Kontribusi](#-kontribusi)

---

## 💡 Tentang SiKompen

**SiKompen** adalah platform digital modern yang dirancang khusus untuk mengelola proses kompensasi mahasiswa secara transparan. Dibangun dengan fokus pada **User Experience (UX)** yang mulus dan performa tinggi, sistem ini mempertemukan mahasiswa yang memiliki tanggungan jam kompensasi dengan supervisor yang membutuhkan bantuan pekerjaan teknis maupun administrasi.

---

## 🏗️ Arsitektur Sistem

Projek ini menggunakan pendekatan **High-Performance Micro-services** (de-coupled):

- **Backend (Go)**: Menggunakan framework Gin/Gorilla untuk manajemen API yang super cepat, aman, dan efisien.
- **Frontend (Next.js 15)**: Memanfaatkan *Standalone Mode* untuk optimasi Docker image dan performa *Server-Side Rendering*.
- **Database**: SQLite yang dioptimalkan dengan GORM untuk integritas data yang solid.

---

## ✨ Fitur Berdasarkan Role

Aplikasi ini mendukung 4 Role utama dengan ekosistem yang saling terintegrasi:

### 🎓 Mahasiswa
| Fitur | Manfaat |
|-------|---------|
| **Dashboard Dinamis** | Pantau sisa jam, status lamaran, dan histori aktivitas. |
| **Explorasi Pekerjaan** | Temukan lowongan kompensasi sesuai minat dan keahlian. |
| **Submission Manager** | Upload bukti pengerjaan (foto/dokumen) secara langsung. |

### 👨‍🏫 Dosen / Supervisor
| Fitur | Manfaat |
|-------|---------|
| **Job Creator** | Publikasi tugas baru dengan manajemen kuota yang cerdas. |
| **Validation Flow** | Review bukti pengerjaan dan berikan persetujuan dalam satu klik. |

### 💰 Staf Keuangan
| Fitur | Manfaat |
|-------|---------|
| **Payment Verification** | Validasi bukti bayar mahasiswa untuk pengurangan jam langsung. |
| **Financial Analytics** | Laporan statistik keuangan terkait kompensasi. |

### 🛡️ Admin
| Fitur | Manfaat |
|-------|---------|
| **Master Data Control** | Kelola data User, Prodi, Kelas, dan Role sistem. |
| **System Audit** | Pantau log aktivitas global dan konfigurasi sistem. |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **Tailwind CSS v4** (Modern JIT Engine)
- **Lucide Icons** & **GSAP** (Smooth Animations)

### Backend
- **Go 1.24** (Gin Framework)
- **GORM** (SQLite Driver)
- **JWT Auth** (Secure Session Management)

### DevOps
- **Docker & Docker Compose**
- **Standalone Build Optimization**

---

## 🚀 Quick Start (Docker)

Cara termudah untuk menjalankan **SiKompen** adalah menggunakan Docker.

### 1. Persiapan
Pastikan Anda sudah menginstal **Docker Desktop** dan **Docker Compose**.

### 2. Jalankan Aplikasi
Clone repositori dan jalankan perintah berikut:

```bash
# 1. Clone
git clone https://github.com/ifauzeee/SiKompen.git
cd SiKompen

# 2. Setup Env
cp .env.example .env

# 3. Build & Run
docker compose up -d --build
```

### 3. Akses
Aplikasi akan tersedia pada URL berikut:
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

### 🔑 Akun Demo (Default)
| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |

---

## 📂 Struktur Folder

```text
SiKompen/
├── 📁 app/                 # Next.js App Router (Frontend)
├── 📁 cmd/api/             # Entry point Go Backend
├── 📁 internal/            # Core Backend Logic (Handlers, Models, Repo)
├── 📁 components/          # React Components (UI/UX)
├── 📁 lib/                 # Frontend Shared Utilities
├── 📄 Dockerfile           # Next.js Docker Config
├── 📄 Dockerfile.backend   # Go Docker Config
└── 📄 docker-compose.yml   # Multi-container Orchestration
```

---

<div align="center">
  <p>Dikembangkan dengan ❤️ untuk <b>Politeknik Negeri Jakarta</b></p>
  <p>© 2026 - SiKompen Team</p>
</div>
