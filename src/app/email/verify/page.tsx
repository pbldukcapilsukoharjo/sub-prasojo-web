"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { handleApiError } from "@/lib/api-error";

export default function EmailVerifyPage() {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      const response = await authService.resendVerification();
      toast.success(response.message || "Email verifikasi telah dikirim ulang.");
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

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
        {/* Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#8B0000]/8 flex items-center justify-center relative">
            <i className="ri-mail-send-line text-[32px] text-[#8B0000]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B0000] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#8B0000]"></span>
            </span>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
          Verifikasi Email Anda
        </h2>
        <p className="mt-3 text-[14px] text-text-secondary font-medium leading-relaxed">
          Tautan verifikasi telah dikirimkan ke alamat email Anda. Silakan periksa kotak masuk (inbox) atau folder spam email Anda untuk mengaktifkan akun.
        </p>

        <div className="my-6 p-4 rounded-xl bg-amber-50 border border-amber-200/60 text-left flex gap-3 items-start">
          <i className="ri-error-warning-line text-amber-600 text-lg shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Anda perlu mengklik tautan dalam email tersebut sebelum dapat masuk ke sistem monitoring PRASOJO.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-3 mt-2">
          <button
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <span>MENGIRIM ULANG...</span>
            ) : cooldown > 0 ? (
              <span>KIRIM ULANG DALAM ({cooldown}s)</span>
            ) : (
              <>
                <i className="ri-[#8B0000] ri-[#8B0000] ri-refresh-line text-base text-white" />
                <span>KIRIM ULANG EMAIL VERIFIKASI</span>
              </>
            )}
          </button>

          <Link
            href="/login"
            className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-text-secondary bg-gray-100 hover:bg-gray-200 active:scale-[0.99] transition-all duration-200 flex items-center justify-center"
          >
            KEMBALI KE HALAMAN LOGIN
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
