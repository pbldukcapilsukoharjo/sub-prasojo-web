"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService, RegisterPayload } from "@/services/auth.service";
import { handleApiError } from "@/lib/api-error";

interface RegisterForm extends RegisterPayload {
  confirm_password?: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const payload: RegisterPayload = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirm_password,
      };

      const response = await authService.register(payload);

      if (response.code === 201 || response.code === 200 || response.status === true) {
        toast.success(response.message || "Registrasi berhasil! Silakan verifikasi email Anda.");
        setTimeout(() => router.push("/email/verify"), 1200);
      } else {
        toast.error(response.message || "Registrasi gagal");
      }
    } catch (error: any) {
      handleApiError(error, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel ─ Branding ─────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[46%] lg:h-screen lg:sticky lg:top-0 flex-col items-start justify-between overflow-hidden p-12 xl:p-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b0000] via-[#8B0000] to-[#3d0000]" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-surface/5" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-surface/5" />
        <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-surface/5" />

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
              Daftarkan akun operator Anda untuk mengakses sistem monitoring
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["Akta Kelahiran", "KTP-el", "Kartu Keluarga", "PRASOJO"].map((item) => (
              <span
                key={item}
                className="text-[11px] font-bold text-white/80 bg-surface/10 border border-white/20 rounded-full px-3 py-1"
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
        <div className="bg-surface rounded-2xl border border-border shadow-sm w-full max-w-[420px] p-8 sm:p-10">

          {/* Card Header */}
          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
              Daftar Akun Baru
            </h2>
            <p className="mt-1.5 text-[13px] text-text-secondary font-medium">
              Isi data diri Anda untuk membuat akun
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary tracking-[0.12em] uppercase">
                Nama Lengkap
              </label>
              <input
                id="register-fullname"
                type="text"
                {...register("fullname", { required: "Nama lengkap wajib diisi" })}
                placeholder="Masukkan nama lengkap"
                className="w-full bg-background text-text-primary text-sm font-medium rounded-xl border border-neutral h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-text-secondary"
              />
              {errors.fullname && <span className="text-red-500 text-xs mt-1">{errors.fullname.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary tracking-[0.12em] uppercase">
                Alamat Email
              </label>
              <input
                id="register-email"
                type="email"
                {...register("email", { 
                  required: "Email wajib diisi",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" }
                })}
                placeholder="nama@email.com"
                className="w-full bg-background text-text-primary text-sm font-medium rounded-xl border border-neutral h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-text-secondary"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary tracking-[0.12em] uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Kata sandi wajib diisi",
                    minLength: { value: 8, message: "Minimal 8 karakter" }
                  })}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-background text-text-primary text-sm font-medium rounded-xl border border-neutral h-11 pl-4 pr-11 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-text-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-text-secondary transition-colors cursor-pointer"
                  aria-label="Tampilkan/sembunyikan kata sandi"
                >
                  <i className={showPassword ? "ri-eye-off-line text-[17px]" : "ri-eye-line text-[17px]"} />
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-secondary tracking-[0.12em] uppercase">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password", {
                    required: "Konfirmasi kata sandi wajib diisi",
                    validate: (value) => value === password || "Kata sandi tidak cocok"
                  })}
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-background text-text-primary text-sm font-medium rounded-xl border border-neutral h-11 pl-4 pr-11 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-text-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-text-secondary transition-colors cursor-pointer"
                  aria-label="Tampilkan/sembunyikan konfirmasi kata sandi"
                >
                  <i className={showConfirmPassword ? "ri-eye-off-line text-[17px]" : "ri-eye-line text-[17px]"} />
                </button>
              </div>
              {errors.confirm_password && <span className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</span>}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "MEMPROSES..." : "BUAT AKUN"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-text-secondary font-medium">atau</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Login link */}
            <p className="text-center text-[13px] text-text-secondary font-medium">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-bold text-[#8B0000] hover:underline transition-all"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
