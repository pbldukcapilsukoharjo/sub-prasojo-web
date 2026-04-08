<div align="center">
  <img src="./public/dukcapil-skh.png" alt="dukcapil-skh" height="200" />
  <h1>Sub-Prasojo Web</h1>
  <p><strong>Dashboard Pelayanan Adminduk secara Online Masyarakat Sukoharjo</strong></p>
  
  <p>
    Sistem web sub-dashboard interaktif untuk mengelola dan memantau pelayanan administrasi kependudukan (Adminduk) secara online bagi masyarakat di wilayah Sukoharjo.
  </p>

  <div>
    <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/react%20query-%23FF4154.svg?style=for-the-badge&logo=react%20query&logoColor=white" alt="React Query" />
    <img src="https://img.shields.io/badge/axios-%235A29E4.svg?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
    <img src="https://img.shields.io/badge/react%20hook%20form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
    <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
    <img src="https://img.shields.io/badge/Biome-%23FBEB96.svg?style=for-the-badge&logo=biome&logoColor=black" alt="Biome" />
    <img src="https://img.shields.io/badge/cloudinary-%233448C5.svg?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </div>
</div>

---

## ⚡ Tech Stack

Aplikasi ini dibangun dengan mengutamakan performa, arsitektur modular, dan *developer experience* yang baik. 

### 🏗️ Arsitektur & Framework
- **Framework:** Next.js (App Router)
- **Bahasa Utama:** TypeScript
- **Arsitektur Utama:** Server-Side Rendering (SSR), Component-Based Architecture & Repository Pattern

### 🎨 Antarmuka & Styling
- **Styling:** Tailwind CSS
- **Ikonografi:** RemixIcon
- **Grafik & Chart:** ApexCharts
- **Loading State:** React Loading Skeleton

### 🛠️ Manajemen Data, API, & Form
- **Data Fetching:** Axios
- **State Management & Sinkronisasi Data:** TanStack Query (React Query)
- **Manajemen Form:** React Hook Form
- **Skema Validasi Form:** TypeBox
- **Manajemen Media / Aset:** Cloudinary

### ⚙️ Manajemen Package & Toolchain
- **Package Manager:** Bun
- **Linting & Formatting:** Biome

---

## 🚀 Memulai Proyek (Getting Started)

### Prasyarat Instalasi
Pastikan Anda sudah menginstal **[Bun](https://bun.sh/)** di perangkat Anda sebelum menjalankan perintah di bawah ini.

### 1. Instalasi Dependensi
Jalankan perintah ini di dalam *root directory* proyek untuk mengunduh semua package:
```bash
bun install
```

### 2. Jalankan Dev Server
```bash
bun dev
```

### 3. Lihat Hasil
Buka browser dan akses **[http://localhost:3000](http://localhost:3000)**. 
Perubahan pada kode Anda (misalnya di `src/app/page.tsx`) akan secara otomatis tertampil pada browser.

---

## 👨‍💻 Linting & Formatting

Kami menggunakan [Biome](https://biomejs.dev/) untuk memastikan seluruh format kode seragam serta mencegah *error* bawaan.

Untuk mengecek *linter*:
```bash
bun run lint
```

Untuk melakukan format otomatis:
```bash
bun run format
```
