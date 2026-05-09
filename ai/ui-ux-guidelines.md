# UI/UX & Styling Rules

## Styling
- **Engine**: Tailwind CSS.
- **Icons**: RemixIcon.
- **Components**: 
  - Loading: React Loading Skeleton.
  - Charts: ApexCharts.
  - Toast/Alerts: React Hot Toast.
  - Dinamis: Gunakan CSS Variables (`--color-primary`) untuk tema.

## Theme Engine (Anti-FOUC)
- Simpan HEX color dan preferensi bahasa di `localStorage`.
- Script pembaca `localStorage` harus berada di `layout.tsx` dalam tag `<script>` di dalam `<head>`.
- Sinkronisasi warna harus menggunakan `useEffect` untuk menghindari hidrasi error.

## Strict Rule
- DILARANG menggunakan library UI tambahan (seperti Shadcn, MUI, atau AntD) tanpa instruksi spesifik. Gunakan Tailwind murni.

## Toast Styling (Feedback)
- Pastikan toast menggunakan font yang sama dengan aplikasi.
- Gunakan variabel CSS untuk background/border toast jika memungkinkan agar mengikuti tema HEX yang disimpan di `localStorage`.
- Gunakan RemixIcon di dalam toast jika diperlukan ikon kustom.