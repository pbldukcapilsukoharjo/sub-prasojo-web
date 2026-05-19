"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Memulai transisi fade out setelah 1.5 detik
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Menghapus elemen loading dari DOM setelah transisi selesai (0.8 detik kemudian)
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden">
      {/* Intro Animation Overlay */}
      {loading && (
        <div 
          className={`absolute inset-0 z-50 flex items-center justify-center bg-[var(--surface)] transition-all duration-700 ease-in-out px-4 ${
            fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-center flex flex-col items-center animate-pulse duration-1000">
             <span className="body-medium text-secondary mb-2 tracking-widest uppercase text-xs sm:text-sm md:text-base">Welcome to</span>
             <h1 className="h1 text-primary text-4xl sm:text-5xl md:text-[60px] leading-tight">Sub Prasojo</h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className={`flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-xl transition-all duration-1000 delay-300 ease-out transform ${
          loading ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="card w-full flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--surface-secondary)] rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <i className="ri-building-4-line text-xl sm:text-2xl text-primary"></i>
            </div>
            
            <h1 className="h2 text-primary mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-[48px] leading-tight">Sub Prasojo</h1>
            <p className="paragraph text-secondary mb-6 sm:mb-8 text-sm sm:text-base px-2">
              Sistem informasi manajemen admin. Kelola pengajuan, produk, dan lembar kerja dengan mudah dan efisien.
            </p>
            
            <Link href="/admin/dashboard" className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 border-0 rounded-[30px] text-sm sm:text-base">
              <i className="ri-dashboard-line mr-2"></i>
              Menuju Dashboard Admin
            </Link>
        </div>
      </div>
    </main>
  );
}
