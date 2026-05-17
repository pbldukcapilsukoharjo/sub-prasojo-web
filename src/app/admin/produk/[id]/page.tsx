'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Common/Button';
import dummyDB from '../../../../../dummy-data/database-dummy.json';
import ajuanData from '../../../../../dummy-data/ajuan.json';
import produkData from '../../../../../dummy-data/produk.json';

export default function DetailProduk() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const produk = produkData.produk.find((p) => p.prod_id.toString() === id);
  const ajuan = ajuanData.ajuan.find((a) => a.ajuan_id === produk?.prod_ajuan_id);
  const pelapor = dummyDB.user.find((u) => u.id === produk?.prod_pelapor_id);
  const jenisAjuan = dummyDB.jenis_ajuan.find((j) => j.ja_id === ajuan?.ajuan_jenis_ajuan_id);

  if (!produk || !ajuan) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => router.back()} className="self-start text-gray-500 hover:text-gray-900 !p-0 gap-2">
          <i className="ri-arrow-left-line text-xl"></i>
          <span className="font-bold text-lg">Kembali</span>
        </Button>
        <div className="card text-center py-12">
          Data produk tidak ditemukan.
        </div>
      </div>
    );
  }

  // Parse name from ajuan if possible
  let namaIdentitas = pelapor?.fullname || '-';
  try {
    if (ajuan.ajuan_data_ajuan) {
      const parsed = JSON.parse(ajuan.ajuan_data_ajuan);
      if (parsed.nama_bayi) namaIdentitas = parsed.nama_bayi;
      else if (parsed.nama_jenazah) namaIdentitas = parsed.nama_jenazah;
    }
  } catch (e) {}

  const ajuanDateObj = new Date(ajuan.ajuan_create_datetime);
  const formattedDate = ajuanDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = ajuanDateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.');

  let currentIndex = 0;
  if (ajuan.ajuan_status === 'BELUM DIVERIFIKASI') currentIndex = 0;
  else if (ajuan.ajuan_status === 'DIVERIFIKASI') currentIndex = 1;
  else if (ajuan.ajuan_status === 'DIPROSES') currentIndex = 2;
  else if (ajuan.ajuan_status === 'DISETUJUI' || ajuan.ajuan_status === 'DITOLAK') currentIndex = 3;
  
  if (ajuan.ajuan_status === 'SELESAI' || produk.prod_status === 'SIAP DIDOWNLOAD') currentIndex = 4;

  const timelineSteps = [
    { label: 'Belum Diverifikasi', desc: 'Menunggu Verifikasi dari Admin' },
    { label: 'Diverifikasi', desc: 'Telah Diverifikasi Oleh Admin' },
    { label: 'Diproses', desc: 'Pengajuan Sedang Diproses' },
    { label: ajuan.ajuan_status === 'DITOLAK' ? 'Ditolak' : 'Disetujui', desc: ajuan.ajuan_status === 'DITOLAK' ? 'Pengajuan Telah Ditolak' : 'Pengajuan Telah Disetujui' },
    { label: 'Selesai', desc: 'Pengajuan Berhasil Diselesaikan' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="self-start text-gray-700 hover:text-gray-900 !p-0 gap-3">
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
          <i className="ri-arrow-left-line text-lg"></i>
        </div>
        <span className="font-bold text-xl">Detail Ajuan</span>
      </Button>

      {/* Main Card */}
      <div className="card shadow-sm border border-gray-100 p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        
        {/* Top Section: Header & Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 md:pb-8 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
              <i className="ri-user-line text-xl md:text-2xl text-gray-500"></i>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs font-bold text-gray-600 tracking-wider mb-1 truncate">{ajuan.ajuan_no_reg}</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                Detail Pemohon : {ajuan.ajuan_no_reg}
              </h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full md:w-auto">
            <Button variant="primary" className="px-6 md:px-8 rounded-[20px] font-bold w-full sm:w-auto text-xs md:text-sm">
              DIPROSES
            </Button>
          </div>
        </div>

        {/* Content Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column: Data & Timeline */}
          <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            
            {/* User Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Nama Lengkap</p>
                <p className="text-base md:text-lg font-bold text-gray-900">{namaIdentitas}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">NIK</p>
                <p className="text-base md:text-lg font-bold text-gray-900">{ajuan.ajuan_pelapor_kk || produk.prod_nomor || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Jenis Layanan</p>
                <p className="text-base md:text-lg font-bold text-gray-900">{jenisAjuan?.ja_judul || 'Umum'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1 uppercase">Kecamatan</p>
                <p className="text-base md:text-lg font-bold text-gray-900">{ajuan.ajuan_kecamatan_name || '-'}</p>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="bg-[#F3F4F6] rounded-[20px] p-4 md:p-6 mt-0 md:mt-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Timeline Status : Diajukan Pada Tanggal {formattedDate}, {formattedTime}
                </h4>
              </div>

              <div className="flex flex-col">
                {timelineSteps.map((step, idx) => {
                  if (idx > currentIndex) return null;

                  let colorClass = 'text-[#D97706]';
                  let dotColorClass = 'bg-[#D97706]';
                  
                  if (step.label === 'Ditolak') {
                    colorClass = 'text-red-500';
                    dotColorClass = 'bg-red-500';
                  } else if (step.label === 'Disetujui') {
                    colorClass = 'text-green-500';
                    dotColorClass = 'bg-green-500';
                  } else if (step.label === 'Diverifikasi') {
                    colorClass = 'text-blue-500';
                    dotColorClass = 'bg-blue-500';
                  } else if (step.label === 'Diproses') {
                    colorClass = 'text-gray-500';
                    dotColorClass = 'bg-gray-500';
                  } else if (step.label === 'Selesai') {
                    colorClass = 'text-purple-500';
                    dotColorClass = 'bg-purple-500';
                  }

                  return (
                    <div key={idx} className={`relative pl-6 ${idx !== currentIndex ? 'border-l-2 border-gray-200' : ''} ml-2 ${idx !== currentIndex ? 'pb-6' : 'pb-2'}`}>
                      <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 ${dotColorClass}`}></div>
                      <div className="flex gap-4 items-start">
                        <div className={`text-sm font-bold mt-0.5 ${colorClass}`}>{formattedTime}</div>
                        <div className="flex flex-col">
                          <p className={`text-sm font-bold ${colorClass}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                          <p className="text-xs font-bold text-gray-500 mt-1">{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FILE PRODUK SECTION */}
            <div className="bg-[#F3F4F6] rounded-[20px] p-4 md:p-6 mt-0 md:mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    FILE PRODUK
                  </h4>
                </div>
                <Button variant="primary" className="text-xs px-4 py-2">
                  TAMBAH PRODUK
                </Button>
              </div>

              <div className="bg-white rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
                <div className="flex items-start sm:items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-[12px] bg-green-50 flex items-center justify-center flex-shrink-0">
                    <i className="ri-file-check-line text-xl text-green-600"></i>
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5 truncate">{produk.prod_nama}</h4>
                    <p className="text-xs text-gray-500 mb-1 truncate">Nomor: {produk.prod_nomor || '-'}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-600 uppercase whitespace-nowrap">{produk.prod_status}</span>
                      <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">{formattedDate} - {formattedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={produk.prod_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 p-2 rounded-lg" title="Lihat/Unduh File">
                    <i className="ri-download-2-line text-lg"></i>
                  </a>
                  <Button variant="primary" className="text-xs px-4 py-2 whitespace-nowrap">
                    UPDATE SIAK
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: DOKUMEN PENDUKUNG */}
          <div className="bg-[#F3F4F6] rounded-[20px] p-4 md:p-6 flex flex-col h-fit">
            <h4 className="text-xs font-bold text-gray-900 text-center tracking-wider mb-6">DOKUMEN PENDUKUNG</h4>
            
            <div className="flex flex-col gap-4">
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

            <Button variant="primary" icon="ri-printer-line" className="w-full mt-6 rounded-[20px] font-bold">
              CETAK BERKAS AJUAN
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
