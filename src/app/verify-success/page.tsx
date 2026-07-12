"use client";

import Image from "next/image";
import Link from "next/link";

export default function VerifySuccessPage() {
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

      {/* Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm w-full max-w-[440px] p-8 sm:p-10 text-center">
        {/* Icon Badge Success */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <i className="ri-checkbox-circle-fill text-[38px] text-emerald-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
          Verifikasi Email Berhasil!
        </h2>
        <p className="mt-3 text-[14px] text-text-secondary font-medium leading-relaxed">
          Selamat! Alamat email Anda telah berhasil diverifikasi. Akun Anda kini telah aktif dan siap digunakan.
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <Link
            href="/login"
            className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <span>SILAKAN MASUK (LOGIN)</span>
            <i className="ri-arrow-right-line text-base" />
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-text-secondary font-medium text-center">
        © 2026 Sistem Monitoring PRASOJO
      </p>
    </main>
  );
}
