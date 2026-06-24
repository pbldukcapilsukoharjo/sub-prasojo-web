'use client';

import React, { useState } from 'react';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';
import LogoutModal from '@/components/Common/LogoutModal';

export default function ProfilePage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Card */}
      <div className="card shadow-sm border border-gray-100 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0 self-center lg:self-start">
            <div className="w-[140px] h-[160px] rounded-[20px] overflow-hidden bg-gray-200">
              <img
                src="https://ui-avatars.com/api/?name=Prasetyo+Jatmiko&background=114856&color=fff&size=200&font-size=0.33"
                alt="Profile Photo"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-[-6px] right-[-6px] w-9 h-9 bg-[#8B0000] hover:bg-[#6b0000] text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
              <i className="ri-pencil-line text-sm"></i>
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="bg-[#8B0000] text-white text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                ACTIVE MEMBER
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                Bergabung sejak 12 Januari 2024
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              Prasetyo Jatmiko, S.Kom.
            </h1>
            <p className="text-sm text-gray-500 font-semibold mb-4">
              prasetyo_admin_04
            </p>

            <div className="flex flex-wrap gap-x-10 gap-y-2">
              <div>
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-0.5">STATUS AKUN</span>
                <span className="text-sm font-bold text-gray-900">Terverifikasi</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-0.5">TERAKHIR LOGIN</span>
                <span className="text-sm font-bold text-gray-900">Hari ini, 08:45 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Informasi Kontak */}
          <div className="card shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-[#8B0000] rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900">Informasi Kontak</h3>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <i className="ri-mail-line text-[#8B0000] text-lg"></i>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-0.5">
                    ALAMAT EMAIL RESMI
                  </span>
                  <span className="text-sm font-bold text-gray-900">p.jatmiko@gmail.com</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <i className="ri-smartphone-line text-[#8B0000] text-lg"></i>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-0.5">
                    NOMOR WHATSAPP / HP
                  </span>
                  <span className="text-sm font-bold text-gray-900">+62 812-3456-7890</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Konfigurasi & Keamanan */}
        <div className="card shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#8B0000] rounded-full"></div>
            <h3 className="text-base font-bold text-gray-900">Konfigurasi & Keamanan</h3>
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

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                <i className="ri-lock-line text-base"></i>
                UBAH KATA SANDI
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-[#8B0000] bg-[#8B0000] text-white font-bold text-sm hover:bg-[#6b0000] transition-colors"
              >
                <i className="ri-logout-box-r-line text-base"></i>
                KELUAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          window.location.href = '/login';
        }}
      />
    </div>
  );
}
