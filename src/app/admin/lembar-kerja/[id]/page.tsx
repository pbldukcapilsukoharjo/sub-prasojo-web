'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Common/Button';
import dummyData from '../../../../../dummy-data/database-dummy.json';

export default function DetailLembarKerja() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Temukan ajuan berdasarkan ID
  const ajuan = dummyData.ajuan.find((a) => a.ajuan_id.toString() === id);
  // Ambil data user/pelapor
  const pelapor = dummyData.user.find((u) => u.id === ajuan?.ajuan_pelapor_id);
  // Ambil jenis ajuan
  const jenisAjuan = dummyData.jenis_ajuan.find((j) => j.ja_id === ajuan?.ajuan_jenis_ajuan_id);

  if (!ajuan) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => router.back()} className="self-start text-gray-500 hover:text-gray-900 !p-0 gap-2">
          <i className="ri-arrow-left-line text-xl"></i>
          <span className="font-bold text-lg">Kembali</span>
        </Button>
        <div className="card text-center py-12">
          Data ajuan tidak ditemukan.
        </div>
      </div>
    );
  }

  // Format tanggal untuk timeline
  const ajuanDateObj = new Date(ajuan.ajuan_create_datetime);
  const formattedDate = ajuanDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = ajuanDateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  return (
    <div className="flex flex-col gap-6">
      {/* Header Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="self-start text-gray-700 hover:text-gray-900 !p-0 gap-3">
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white">
          <i className="ri-arrow-left-line text-lg"></i>
        </div>
        <span className="font-bold text-xl">Detail Ajuan</span>
      </Button>

      {/* Main Card */}
      <div className="card shadow-sm border border-gray-100 p-8 flex flex-col gap-8">
        
        {/* Top Section: Header & Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center">
              <i className="ri-user-line text-2xl text-gray-500"></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 tracking-wider mb-1">{ajuan.ajuan_no_reg}</p>
              <h3 className="text-2xl font-bold text-gray-900">
                Detail Pemohon :{ajuan.ajuan_no_reg}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="primary" className="px-8">
              VERIFIKASI
            </Button>
            <Button variant="secondary" className="px-8 text-gray-600 rounded-[20px] font-bold">
              TOLAK AJUAN
            </Button>
          </div>
        </div>

        {/* Content Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Data & Timeline */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* User Data Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Nama Lengkap</p>
                <p className="text-lg font-bold text-gray-900">{pelapor?.fullname || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">NIK</p>
                <p className="text-lg font-bold text-gray-900">{pelapor?.nik || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Jenis Layanan</p>
                <p className="text-lg font-bold text-gray-900">{jenisAjuan?.ja_judul || 'Umum'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Kecamatan</p>
                <p className="text-lg font-bold text-gray-900">{ajuan.ajuan_kecamatan_name || '-'}</p>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="bg-[#F3F4F6] rounded-[20px] p-6 mt-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Timeline Status : Diajukan Pada Tanggal {formattedDate}, {formattedTime}
                </h4>
              </div>

              {/* Timeline Item */}
              <div className="relative pl-6 border-l-2 border-gray-200 ml-2 pb-2">
                <div className="absolute w-3 h-3 bg-[#D97706] rounded-full -left-[7px] top-1"></div>
                <div className="flex gap-4 items-start">
                  <div className="text-sm font-bold text-[#D97706] mt-0.5">{formattedTime}</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-[#D97706]">
                      {ajuan.ajuan_status === 'PENGAJUAN' || ajuan.ajuan_status === 'DIPROSES' ? 'Belum Diverifikasi' : ajuan.ajuan_status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Menunggu Verifikasi dari Admin</p>
                    <p className="text-xs font-bold text-gray-500 mt-1">{formattedDate}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: DOKUMEN PENDUKUNG */}
          <div className="bg-[#F3F4F6] rounded-[20px] p-6 flex flex-col h-full">
            <h4 className="text-xs font-bold text-gray-900 text-center tracking-wider mb-6">DOKUMEN PENDUKUNG</h4>
            
            <div className="flex flex-col gap-4 flex-1">
              {/* Document List - Dummy for now as it's not structured simply in json */}
              <div className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-gray-100 flex items-center justify-center">
                    <i className="ri-image-line text-xl text-gray-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Akta_Kelahiran.jpg</p>
                    <p className="text-[10px] font-bold text-gray-500">2.4 MB</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-900 transition-colors">
                  <i className="ri-eye-line text-xl"></i>
                </button>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-gray-100 flex items-center justify-center">
                    <i className="ri-image-line text-xl text-gray-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">KTP_Ayah.jpg</p>
                    <p className="text-[10px] font-bold text-gray-500">1.8 MB</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-900 transition-colors">
                  <i className="ri-eye-line text-xl"></i>
                </button>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-gray-100 flex items-center justify-center">
                    <i className="ri-file-text-line text-xl text-gray-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Formulir_F101.pdf</p>
                    <p className="text-[10px] font-bold text-gray-500">500 KB</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-900 transition-colors">
                  <i className="ri-eye-line text-xl"></i>
                </button>
              </div>
            </div>

            <Button variant="primary" icon="ri-printer-line" className="w-full mt-6">
              CETAK BERKAS AJUAN
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
