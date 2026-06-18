'use client';

import React from 'react';
import Link from 'next/link';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';

export default function DetailUlasanPage() {
  const reviews = [
    {
      id: 1,
      name: 'Anonim',
      date: '12 Okt 2023, 09:45 WIB',
      content: 'Pelayanan sangat cepat dan membantu. Petugas ramah dalam menjelaskan alur permohonan. Sangat puas dengan kecepatan prosesnya.',
      rating: 5,
      type: 'TAMAT',
    },
    {
      id: 2,
      name: 'Anonim',
      date: '11 Okt 2023, 14:20 WIB',
      content: 'Proses akta kelahiran cukup mudah diakses lewat web. Hanya saja notifikasi email agak terlambat masuk.',
      rating: 4,
      type: 'AKTA',
    },
    {
      id: 3,
      name: 'Anonim',
      date: '11 Okt 2023, 10:15 WIB',
      content: 'Puas sekali. KTP langsung jadi dalam sehari setelah verifikasi. Mantap PRASOJO!',
      rating: 5,
      type: 'KTP-EL',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <i className="ri-arrow-left-line text-gray-600"></i>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Ulasan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar - Rating Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
          <span className="text-6xl font-bold font-manrope text-gray-900 mb-2">4.8</span>
          <div className="flex gap-1 text-[#F59E0B] text-2xl mb-4">
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-fill"></i>
            <i className="ri-star-half-fill"></i>
          </div>
          <span className="text-sm font-semibold text-gray-500 mb-8">Berdasarkan 1,240 Ulasan</span>

          <div className="w-full flex flex-col gap-4">
            {[
              { stars: 5, width: '80%', count: 800 },
              { stars: 4, width: '30%', count: 300 },
              { stars: 3, width: '10%', count: 90 },
              { stars: 2, width: '5%', count: 40 },
              { stars: 1, width: '2%', count: 10 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 w-12 text-right">{item.stars} Bintang</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: item.width }}></div>
                </div>
                <span className="text-xs font-bold text-gray-700 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                label="Pencarian Cepat" 
                placeholder="Search..."
              />
              <Select 
                label="Urutkan Dari" 
                options={[{ label: 'Terbaru', value: 'newest' }]} 
              />
              <Input 
                type="date"
                label="Rentang Tanggal" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Select 
                label="Rating" 
                options={[{ label: 'Semua Rating', value: 'all' }]} 
              />
              <Select 
                label="Jenis Layanan" 
                options={[{ label: 'Semua Jenis Layanan', value: 'all' }]} 
              />
              <Button variant="primary" className="h-[44px] w-full bg-[#8B0000] hover:bg-[#6b0000] text-white">
                TERAPKAN FILTER
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
             <Button variant="primary" className="bg-[#8B0000] hover:bg-[#6b0000] text-white flex items-center justify-center gap-2 text-xs px-4 py-2 h-9 rounded-full">
              <i className="ri-upload-2-line"></i>
              EKSPOR EXCEL
            </Button>
          </div>

          {/* Reviews List */}
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-3-line text-gray-500 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                      <span className="text-xs font-semibold text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5 text-[#F59E0B] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < review.rating ? "ri-star-fill" : "ri-star-line text-gray-300"}></i>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {review.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {review.content}
                </p>
                <div className="flex justify-end items-center gap-4 border-t border-gray-50 pt-4 mt-2">
                  <button className="text-xs font-bold text-[#8B0000] hover:underline">Lihat Detail</button>
                  <button className="text-xs font-semibold text-gray-500 hover:text-gray-700">Laporkan</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination mock */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Menampilkan 1 - 10 dari 1,240 Ulasan</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8B0000] text-white font-semibold text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}