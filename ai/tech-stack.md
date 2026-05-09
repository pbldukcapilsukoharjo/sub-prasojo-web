# Tech Stack Constraints

## Data Fetching & State
- **HTTP Client**: Axios.
- **State Management**: TanStack Query (React Query) v5+.
- **Pattern**: Buat custom hooks untuk setiap API call di folder `hooks/queries/`.

## Forms & Validation
- **Library**: React Hook Form (RHF).
- **Validation**: WAJIB menggunakan TypeBox (`@sinclair/typebox`).
- **Resolver**: `@hookform/resolvers/typebox`.
- **Constraint**: Pastikan inference tipe data dari TypeBox digunakan untuk tipe props form.

## Asset Management
- Gunakan Cloudinary untuk semua gambar.
- Gunakan `next/image` yang dikonfigurasi dengan domain Cloudinary.