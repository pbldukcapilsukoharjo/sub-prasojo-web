# Agent Command Center - Adminduk Sukoharjo Dashboard

## 🚨 IMPORTANT: CORE PROTOCOL
Aplikasi ini adalah bagian dari ekosistem Pelayanan Adminduk Online Masyarakat Sukoharjo. 
**Semua instruksi di bawah ini dan di dalam direktori `/ai` bersifat MANDATORY.**

---

## 📂 Instruction Index
Untuk detail teknis, Anda HARUS merujuk pada file spesifik di direktori `./ai/`:

1. **[System Rules](./ai/system-rules.md)**: Framework (Next.js App Router), Package Manager (Bun), dan Linting (Biome).
2. **[Tech Stack](./ai/tech-stack.md)**: Konfigurasi Axios, TanStack Query, TypeBox, dan React Hot Toast.
3. **[UI/UX Guidelines](./ai/ui-ux-guidelines.md)**: Tailwind CSS, RemixIcon, Theme Management (Local Storage), dan ApexCharts.

---

## 🛠️ Dev Workflow Essentials
Setiap kali menulis kode, pastikan:
- **Linting**: Gunakan perintah Biome, bukan ESLint/Prettier.
- **Dependencies**: Gunakan `bun add` untuk instalasi library.
- **Data Access Layer (DAL)**: Pisahkan logic fetcher di `src/lib/` atau `src/services/`.
- **Form Handling**: Gunakan `react-hook-form` dengan `typebox` resolver.
- **Feedback**: Gunakan `react-hot-toast` untuk semua response feedback user (Success/Error).

---

## 🎨 Design System & Theme
- **Color Injection**: HEX color diambil dari `localStorage` dan diinjeksi ke CSS Variables (`--color-primary`).
- **Anti-FOUC**: Eksekusi pembacaan tema harus dilakukan di `<head>` pada `layout.tsx`.
- **Icons**: Hanya gunakan `RemixIcon`.

---

## 📋 Definition of Done
1. Kode lulus linting Biome.
2. Tipe data terdefinisi dengan TypeBox (bukan `any`).
3. Respons API ditangani dengan TanStack Query hooks.
4. UI responsif dengan Tailwind dan mendukung loading state (Skeleton).