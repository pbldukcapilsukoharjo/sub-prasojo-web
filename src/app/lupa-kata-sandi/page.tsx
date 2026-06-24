"use client";

import Link from "next/link";

export default function LupaKataSandiPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 py-12">
      <div
        className="bg-white rounded-2xl w-full max-w-md"
        style={{
          padding: "48px 40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full"
            style={{ backgroundColor: "#fff0f0" }}
          >
            <i className="ri-lock-password-line text-3xl" style={{ color: "#8B0000" }} />
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-center font-bold text-[var(--text-primary)] mb-3"
          style={{ fontSize: "22px" }}
        >
          Lupa Kata Sandi?
        </h2>

        {/* Description */}
        <p className="text-center text-sm text-gray-500 leading-relaxed mb-7 px-2">
          Masukkan alamat email Anda dan kami akan
          <br />
          mengirimkan instruksi untuk mengatur ulang kata
          <br />
          sandi Anda.
        </p>

        <form className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-mail-line text-gray-400 text-lg" />
              </div>
              <input
                type="email"
                placeholder="Nama@gmail.com"
                className="w-full bg-[#f3f4f6] text-gray-900 text-sm rounded-full border border-[#E5E7EB] h-[44px] pl-11 pr-5 focus:ring-2 focus:ring-[#8B0000] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-1 h-[46px] rounded-full font-bold text-sm tracking-wider text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#8B0000", letterSpacing: "0.08em" }}
          >
            KIRIM
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-7 pt-5">
          <div className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "#8B0000" }}
            >
              <i className="ri-arrow-left-s-line text-base" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
