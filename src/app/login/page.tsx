"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel - Branding */}
      <div className="flex flex-col items-center justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-16 lg:py-0">
        <div className="flex flex-col items-center lg:items-start max-w-md w-full">
          {/* Logo */}
          <div className="mb-8 lg:mb-12">
            <Image
              src="/dukcapil-skh.png"
              alt="Dukcapil SKH Logo"
              width={200}
              height={120}
              className="object-contain"
              priority
            />
          </div>

          {/* Headline */}
          <div className="text-center lg:text-left">
            <h1
              className="font-black uppercase leading-none mb-4 text-[var(--text-primary)]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05 }}
            >
              SISTEM
              <br />
              MONITORING
              <br />
              PRASOJO
            </h1>
            <p className="font-bold text-sm sm:text-base" style={{ color: "#8B0000" }}>
              Selamat Datang Sistem Monitoring Layanan
              <br />
              Disdukcapil Sukoharjo Berbasis PRASOJO
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col items-center justify-center bg-[#f5f5f5] px-6 py-12 lg:w-1/2 lg:px-12">
        <div
          className="bg-white rounded-2xl w-full max-w-md"
          style={{
            padding: "40px 36px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <h2
            className="text-center font-bold text-[var(--text-primary)] mb-6"
            style={{ fontSize: "22px" }}
          >
            Masuk ke Akun Anda
          </h2>

          <form className="flex flex-col gap-4">
            {/* NIK */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                type="text"
                placeholder="Masukkan NIK"
                maxLength={16}
                className="w-full bg-[#f3f4f6] text-gray-900 text-sm rounded-full border border-[#E5E7EB] h-[44px] px-5 focus:ring-2 focus:ring-[#8B0000] focus:outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-[#f3f4f6] text-gray-900 text-sm rounded-full border border-[#E5E7EB] h-[44px] pl-5 pr-12 focus:ring-2 focus:ring-[#8B0000] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <i className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} />
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#8B0000]"
                />
                Ingat saya
              </label>
              <Link
                href="/lupa-kata-sandi"
                className="text-sm text-gray-600 hover:text-[#8B0000] transition-colors"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-1 h-[46px] rounded-full font-bold text-sm tracking-wider text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#8B0000", letterSpacing: "0.08em" }}
            >
              MASUK KE SISTEM
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-gray-600 mt-1">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold hover:underline transition-all"
                style={{ color: "#8B0000" }}
              >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
