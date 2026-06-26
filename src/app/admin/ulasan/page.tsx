'use client';

import React, { useState } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import DetailUlasanModal from '@/components/Common/DetailUlasanModal';

export default function DetailUlasanPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [rating, setRating] = useState('all');
  const [jenisLayanan, setJenisLayanan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const handleReset = () => {
    setSearch('');
    setSortBy('newest');
    setRating('all');
    setJenisLayanan('all');
    setPeriode('');
    setStartDate('');
    setEndDate('');
  };

  const handleFilter = () => {
    console.log({ search, sortBy, rating, jenisLayanan, periode, startDate, endDate });
  };

  const reviews = [
    {
      id: 1,
      name: 'Anonim',
      date: '12 Okt 2023, 09.45 WIB',
      content: 'Pelayanan sangat cepat dan membantu. Petugas ramah dalam menjelaskan alur permohonan. Sangat puas dengan kecepatan prosesnya.',
      rating: 5,
      type: 'TAMAT',
      jenisLayanan: 'Umum',
      kecamatan: '-',
    },
    {
      id: 2,
      name: 'Anonim',
      date: '11 Okt 2023, 14.20 WIB',
      content: 'Proses akta kelahiran cukup mudah diakses lewat web. Hanya saja notifikasi email agak terlambat masuk.',
      rating: 4,
      type: 'AKTA',
      jenisLayanan: 'Akta Kelahiran',
      kecamatan: 'Sukoharjo',
    },
    {
      id: 3,
      name: 'Anonim',
      date: '11 Okt 2023, 10:15 WIB',
      content: 'Puas sekali. KTP langsung jadi dalam sehari setelah verifikasi. Mantap PRASOJO!',
      rating: 5,
      type: 'KTP-EL',
      jenisLayanan: 'KTP-el',
      kecamatan: 'Kartasura',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Filters (Top) */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          label="Rating"
          value={rating}
          onChange={(val) => setRating(String(val))}
          options={[
            { label: 'Semua Rating', value: 'all' },
            { label: '5 Bintang', value: '5' },
            { label: '4 Bintang', value: '4' },
            { label: '3 Bintang', value: '3' },
            { label: '2 Bintang', value: '2' },
            { label: '1 Bintang', value: '1' },
          ]}
        />
        <CustomSelect
          label="Jenis Layanan"
          value={jenisLayanan}
          onChange={(val) => setJenisLayanan(String(val))}
          options={[
            { label: 'Semua Jenis Layanan', value: 'all' },
            { label: 'Kartu Keluarga', value: 'kk' },
            { label: 'KTP-el', value: 'ktp' },
            { label: 'KIA', value: 'kia' },
            { label: 'Akta Kelahiran', value: 'akta_kelahiran' },
            { label: 'Akta Kematian', value: 'akta_kematian' },
          ]}
        />
        <CustomSelect
          label="Periode"
          value={periode}
          onChange={(val) => setPeriode(String(val))}
          disabled={isPeriodeDisabled}
          placeholder="Pilih Periode"
          options={[
            { label: 'Bulan Ini', value: 'this_month' },
            { label: 'Bulan Lalu', value: 'last_month' },
            { label: 'Tahun Ini', value: 'this_year' },
          ]}
        />
        <CustomDateRangePicker
          label="Rentang Tanggal"
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
          disabled={isRentangTanggalDisabled}
          placeholder="Pilih Rentang Tanggal"
        />
        <CustomSelect
          label="Urutkan Dari"
          value={sortBy}
          onChange={(val) => setSortBy(String(val))}
          options={[
            { label: 'Terbaru', value: 'newest' },
            { label: 'Terlama', value: 'oldest' },
          ]}
        />
      </FilterCard>

      {/* 2. Below Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Rating Breakdown (Summary Card) */}
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
                  <div className="h-full bg-primary rounded-full" style={{ width: item.width }}></div>
                </div>
                <span className="text-xs font-bold text-gray-700 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-end hidden">
             <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9">
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
                  <button 
                    onClick={() => {
                      setSelectedReview(review);
                      setIsModalOpen(true);
                    }}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Lihat Detail
                  </button>
                  <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer">Laporkan</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination mock */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Menampilkan 1 - 10 dari 1,240 Ulasan</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-semibold text-xs cursor-pointer">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 cursor-pointer">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 cursor-pointer">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
      
      <DetailUlasanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
}