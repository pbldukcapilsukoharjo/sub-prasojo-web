<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Details for Agents

## Context
Aplikasi ini adalah sub dari dashboard Pelayanan Adminduk secara Online Masyarakat Sukoharjo. 

## Technology Stack Constraints
Anda HARUS mengikuti tech stack dan batasan berikut saat menulis atau menganalisis kode untuk repository ini:

- **Framework**: Next.js (App Router) dengan TypeScript.
- **Arsitektur**: Server-Side Rendering (SSR), Component-Based Architecture, & Data Access Layer (DAL).
- **Styling**: Tailwind CSS dan RemixIcon. TIDAK BOLEH menggunakan library UI/Styling tambahan tanpa izin.
- **Data & State**: Gunakan Axios untuk request jaringan, TanStack Query (React Query) untuk state management/data fetching, dan Cloudinary untuk manajemen aset/gambar.
- **UI Components**: Gunakan React Loading Skeleton untuk loading skeleton dan ApexCharts untuk library grafik.
- **Forms**: WAJIB menggunakan React Hook Form (RHF) yang divalidasi dengan resolver TypeBox.
- **Tooling**: Gunakan Bun (`bun add`, `bun run`) sebagai package manager. Proyek ini menggunakan Biome untuk linting dan formatting.
