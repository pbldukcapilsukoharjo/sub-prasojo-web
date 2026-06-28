'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from '@/components/Forms/Select';
import LogoutModal from '@/components/Common/LogoutModal';
import { useAuth } from '@/providers/auth-provider';
import { authService } from '@/services/auth.service';
import { handleApiError } from '@/lib/api-error';

interface UpdateProfileForm {
  email: string;
  password?: string;
}

export default function ProfilePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, logout } = useAuth();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<UpdateProfileForm>({
    defaultValues: {
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    setIsSubmitting(true);
    try {
      const payload: { email?: string; password?: string } = {};
      if (data.email && data.email !== user?.email) payload.email = data.email;
      if (data.password) payload.password = data.password;

      if (Object.keys(payload).length === 0) {
        toast.error("Tidak ada perubahan data.");
        setIsSubmitting(false);
        return;
      }

      const response = await authService.updateProfile(payload);
      if (response.status === true || response.code === 200) {
        toast.success(response.message || "Profil berhasil diperbarui");
        // Optionally reload page or re-fetch user profile data in context
        // to reflect the new email.
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.message || "Gagal memperbarui profil");
      }
    } catch (error: any) {
      handleApiError(error, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Profile Header Card */}
      <div className="card shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col items-center justify-center text-center">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || "Operator")}&background=8B0000&color=fff&size=200&bold=true`}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {user?.fullname || "Nama Lengkap"}
        </h1>
        <p className="text-sm text-gray-500 font-semibold mb-3">
          {user?.email || "email@domain.com"}
        </p>
        <span className="bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
          Operator Sistem
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Profile Form */}
        <div className="card shadow-sm border border-gray-100 p-6 hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#8B0000] rounded-full"></div>
            <h3 className="text-base font-bold text-gray-900">Perbarui Profil</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
                Alamat Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" }
                })}
                placeholder="nama@email.com"
                className="w-full bg-gray-50 text-gray-900 text-sm font-medium rounded-xl border border-gray-200 h-11 px-4 focus:ring-2 focus:ring-[#8B0000]/25 focus:border-[#8B0000] focus:outline-none transition-all"
              />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-[0.12em] uppercase">
                Kata Sandi Baru (Opsional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    minLength: { value: 8, message: "Minimal 8 karakter" }
                  })}
                  placeholder="Kosongkan jika tidak ingin mengubah"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-bold text-[13px] tracking-[0.08em] text-white bg-[#8B0000] hover:bg-[#700000] active:bg-[#5a0000] transition-all mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </form>
        </div>

        {/* Right Column - Konfigurasi & Keamanan */}
        <div className="card shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#8B0000] rounded-full"></div>
            <h3 className="text-base font-bold text-gray-900">Pengaturan Sistem</h3>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            {/* Tema Dashboard */}
            <div>
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-3">TEMA DASHBOARD</span>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#8B0000] bg-red-50 text-[#8B0000] font-bold text-sm transition-colors">
                  <i className="ri-sun-line text-base"></i>
                  Light
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                  <i className="ri-moon-line text-base"></i>
                  Dark
                </button>
              </div>
            </div>

            {/* Bahasa Sistem */}
            <div>
              <Select
                label="Bahasa Sistem"
                options={[
                  { label: 'Bahasa Indonesia (ID)', value: 'id' },
                  { label: 'English (EN)', value: 'en' },
                ]}
              />
            </div>

            <div className="flex-1"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[#8B0000] bg-[#8B0000] text-white font-bold text-sm hover:bg-[#6b0000] transition-colors cursor-pointer"
              >
                <i className="ri-logout-box-r-line text-base"></i>
                KELUAR DARI SISTEM
              </button>
            </div>
          </div>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          setIsLogoutModalOpen(false);
          await logout();
        }}
      />
    </div>
  );
}
