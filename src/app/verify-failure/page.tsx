"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyFailureContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message") || "Tautan verifikasi tidak valid atau telah kadaluarsa.";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[440px] p-8 sm:p-10 text-center">
      {/* Icon Badge Failure */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <i className="ri-close-circle-fill text-[38px] text-red-600" />
        </div>
      </div>

      {/* Header */}
      <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
        Verifikasi Email Gagal
      </h2>
      <p className="mt-3 text-[14px] text-red-600 font-medium leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100">
        {errorMessage}
      </p>
      <p className="mt-4 text-[13px] text-gray-500 font-medium leading-relaxed">
        Silakan lakukan pendaftaran ulang akun Anda untuk mendapatkan tautan verifikasi baru.
      </p>

      {/* Action Button */}
      <div className="mt-8">
        <Link
          href="/register"
          className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
        >
          <i className="ri-user-add-line text-base" />
          <span>DAFTAR ULANG AKUN</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyFailurePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb] px-5 py-10 sm:px-8">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/dukcapil-skh.png"
          alt="Dukcapil Sukoharjo"
          width={80}
          height={48}
          className="object-contain"
          priority
        />
        <p className="text-[10px] font-bold text-[#8B0000] tracking-[0.15em] uppercase">
          Sistem Monitoring Prasojo
        </p>
      </div>

      <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
        <VerifyFailureContent />
      </Suspense>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-gray-400 font-medium text-center">
        © 2026 Sistem Monitoring PRASOJO
      </p>
    </main>
  );
}
