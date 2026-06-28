"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authService, ResetPasswordPayload } from "@/services/auth.service";
import { handleApiError } from "@/lib/api-error";

interface ResetForm extends ResetPasswordPayload {
  confirm_password?: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<ResetForm>({
    defaultValues: {
      token: token,
      email: emailParam,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetForm) => {
    setIsSubmitting(true);
    try {
      const payload: ResetPasswordPayload = {
        email: data.email,
        token: data.token,
        password: data.password,
        password_confirmation: data.confirm_password,
      };

      const response = await authService.resetPassword(payload);
      if (response.status === true || response.code === 200) {
        toast.success(response.message || "Password berhasil diubah.");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(response.message || "Gagal mengembalikan kata sandi.");
      }
    } catch (error: any) {
      handleApiError(error, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[420px] p-8 sm:p-10">
      {/* Icon Badge */}
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#8B0000]/8 flex items-center justify-center">
          <i className="ri-[#8B0000] ri-key-2-line text-[26px] text-[#8B0000]" />
        </div>
      </div>

      {/* Card Header */}
      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-bold text-gray-950 leading-tight">
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-2 text-[13px] text-gray-500 font-medium leading-relaxed">
          Masukkan kata sandi baru untuk akun Anda.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Hidden or Editable if missing */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
            Alamat Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email wajib diisi" })}
            placeholder="nama@email.com"
            className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        {/* Token Hidden or Editable */}
        {!token && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
              Token Reset
            </label>
            <input
              type="text"
              {...register("token", { required: "Token wajib diisi" })}
              placeholder="Masukkan token dari email"
              className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all"
            />
            {errors.token && <span className="text-red-500 text-xs mt-1">{errors.token.message}</span>}
          </div>
        )}

        {/* Kata Sandi Baru */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Kata sandi baru wajib diisi",
                minLength: { value: 8, message: "Minimal 8 karakter" },
              })}
              placeholder="Minimal 8 karakter"
              className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 pl-4 pr-11 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className={showPassword ? "ri-eye-off-line text-[17px]" : "ri-eye-line text-[17px]"} />
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirm_password", {
                required: "Konfirmasi kata sandi wajib diisi",
                validate: (value) => value === password || "Kata sandi tidak cocok",
              })}
              placeholder="Ulangi kata sandi baru"
              className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 pl-4 pr-11 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className={showConfirmPassword ? "ri-eye-off-line text-[17px]" : "ri-eye-line text-[17px]"} />
            </button>
          </div>
          {errors.confirm_password && <span className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] active:scale-[0.99] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? "MEMPROSES..." : "SIMPAN KATA SANDI BARU"}
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
  );
}

export default function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-gray-400 font-medium text-center">
        © 2026 Sistem Monitoring PRASOJO
      </p>
    </main>
  );
}
