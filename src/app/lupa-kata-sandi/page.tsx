"use client";

import Image from "next/image";
import Link from "next/link";

export default function LupaKataSandiPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb] px-5 py-10 sm:px-8">

      {/* Logo (mobile visible, desktop also) */}
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[420px] p-8 sm:p-10">

        {/* Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/8 flex items-center justify-center">
            <i className="ri-lock-password-line text-[26px] text-[#8B0000]" />
          </div>
        </div>

        {/* Card Header */}
        <div className="mb-2 text-center">
          <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
            Lupa Kata Sandi?
          </h2>
          <p className="mt-2 text-[13px] text-gray-500 font-medium leading-relaxed">
            Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-6" />

        <form className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-mail-line text-gray-400 text-[16px]" />
              </div>
              <input
                id="forgot-email"
                type="email"
                placeholder="nama@email.com"
                className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 pl-11 pr-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="forgot-submit"
            type="submit"
            className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm cursor-pointer"
          >
            KIRIM TAUTAN RESET
          </button>
        </form>

        {/* Back to login */}
        <div className="border-t border-gray-100 mt-7 pt-5 flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8B0000] hover:underline transition-all"
          >
            <i className="ri-arrow-left-s-line text-base" />
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-gray-400 font-medium text-center">
        © 2026 Sistem Monitoring PRASOJO
      </p>
    </main>
  );
}
