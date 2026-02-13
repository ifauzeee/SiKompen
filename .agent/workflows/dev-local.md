---
description: Cara menjalankan project secara instan untuk pengembangan lokal
---

# Local Development Workflow

Gunakan cara ini untuk menghindari proses build Docker yang lama.

## Persiapan
1. Pastikan **Go** dan **Node.js/pnpm** terpasang di system Anda.
2. Salin `.env.example` menjadi `.env` jika belum ada.
3. Pastikan `DATABASE_URL_GO` dan `REDIS_URL` di `.env` mengarah ke `localhost` (bukan nama service docker).

## Langkah-langkah

### 1. Pastikan Port Bebas (Stop Docker Services)
Jika Anda sebelumnya menjalankan full Docker, matikan service backend dan frontend agar port 8080 dan 3000 tidak bentrok:
```bash
docker compose stop backend frontend
```

### 2. Jalankan Database & Redis
Jalankan infrastruktur saja:
```bash
docker compose up -d db redis
```

### 2. Jalankan Backend
Buka terminal baru:
```bash
go run cmd/api/main.go
```

### 3. Jalankan Frontend
Buka terminal baru lainnya:
```bash
pnpm dev
```

## Keuntungan
- **Hot Reload**: Perubahan kode di frontend langsung muncul di browser.
- **Fast Restart**: Restart backend hanya butuh ~1 detik.
- **Debugger**: Anda bisa menggunakan debugger VS Code/IDE secara langsung.
