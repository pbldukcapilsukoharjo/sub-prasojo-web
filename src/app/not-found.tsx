"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="space-y-6">
        {/* Menggunakan style angka Manrope dari CSS Anda */}
        <h1 className="num-xl text-primary animate-pulse">404</h1>

        <div className="space-y-2">
          {/* Menggunakan utility typography Inter dari CSS Anda */}
          <h2 className="h3 text-primary">Halaman Tidak Ditemukan</h2>
          <p className="paragraph text-secondary max-w-md mx-auto">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. 
            Mungkin tautannya salah atau halaman telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/" className="btn btn-primary no-underline flex items-center justify-center min-w-[140px]">
            Kembali ke Beranda
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline flex items-center justify-center min-w-[140px]"
          >
            Kembali Sebelumnya
          </button>
        </div>
      </div>

      {/* Dekorasi halus menggunakan variabel stroke Anda */}
      <div className="absolute bottom-10 opacity-20">
        <span className="overline">Error Code: Page_Not_Found</span>
      </div>
    </main>
  );
}