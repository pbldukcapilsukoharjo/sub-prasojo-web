"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel ─ Branding ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[46%] lg:h-screen lg:sticky lg:top-0 flex-col items-start justify-between overflow-hidden p-12 xl:p-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b0000] via-[#8B0000] to-[#3d0000]" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/dukcapil-skh.png"
            alt="Dukcapil Sukoharjo"
            width={140}
            height={84}
            className="object-contain brightness-0 invert opacity-90"
            priority
          />
        </div>

        {/* Tagline */}
        <div className="relative z-10 flex flex-col gap-5">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">
              Portal Operator
            </p>
            <h1 className="font-black text-white leading-[1.05] text-[clamp(2.5rem,4vw,3.5rem)]">
              Sistem Monitoring PRASOJO
            </h1>
            <p className="mt-4 text-[15px] font-medium text-white/70 leading-relaxed max-w-xs">
              Portal khusus operator untuk memonitoring layanan Disdukcapil Kabupaten Sukoharjo
            </p>
          </div>

          {/* Stats / Feature Pills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["Akta Kelahiran", "KTP-el", "Kartu Keluarga", "PRASOJO"].map((item) => (
              <span
                key={item}
                className="text-[11px] font-bold text-white/80 bg-white/10 border border-white/20 rounded-full px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[11px] text-white/35 font-medium">
          © 2026 Sistem Monitoring PRASOJO
        </p>
      </div>

      {/* ── Right Panel ─ Form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fb] px-5 py-10 sm:px-8">

        {/* Mobile Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <Image
            src="/dukcapil-skh.png"
            alt="Dukcapil Sukoharjo"
            width={96}
            height={56}
            className="object-contain"
            priority
          />
          <p className="text-xs font-bold text-[#8B0000] tracking-wide uppercase text-center">
            Sistem Monitoring Prasojo
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[420px] p-8 sm:p-10">

          {/* Card Header */}
          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
              Masuk ke Akun Anda
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-medium">
              Gunakan NIK dan kata sandi yang terdaftar
            </p>
          </div>

          <form className="flex flex-col gap-5">
            {/* NIK */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                id="login-nik"
                type="text"
                placeholder="Masukkan 16 digit NIK"
                maxLength={16}
                className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 pl-4 pr-11 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label="Tampilkan/sembunyikan kata sandi"
                >
                  <i className={showPassword ? "ri-eye-off-line text-[17px]" : "ri-eye-line text-[17px]"} />
                </button>
              </div>
            </div>

            {/* Remember Me + Lupa Kata Sandi */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-gray-600 font-medium">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#8B0000]"
                />
                Ingat saya
              </label>
              <Link
                href="/lupa-kata-sandi"
                className="text-[13px] font-semibold text-[#8B0000] hover:underline transition-all"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm mt-1 cursor-pointer"
            >
              MASUK KE SISTEM
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-[13px] text-gray-500 font-medium">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-bold text-[#8B0000] hover:underline transition-all"
              >
                Daftar sekarang
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
