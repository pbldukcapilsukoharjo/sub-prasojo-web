'use client';

import React from 'react';
import Link from 'next/link';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';

export default function PeringkatOperatorPage() {
  const tableData = [
    { rank: '01', name: 'Muhammad Reza', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '02', name: 'Eslam Samir', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '03', name: 'Mahendra Adi Kusuma', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '04', name: 'Tegar Bagus Saputra', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <i className="ri-arrow-left-line text-gray-600"></i>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Peringkat Operator</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL LAYANAN</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">1,234</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">RATA-RATA DURASI</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">14,5</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">menit</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL LAYANAN</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">98,2%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Input 
            label="Pencarian Cepat" 
            placeholder="Search..."
          />
          <Select 
            label="Kecamatan" 
            options={[{ label: 'Seluruh Kecamatan', value: 'all' }]} 
          />
          <Select 
            label="Periode" 
            options={[{ label: 'Bulan Ini', value: 'this_month' }]} 
          />
          <Select 
            label="Urutkan Dari" 
            options={[{ label: 'Terbaru', value: 'newest' }]} 
          />
          <Button variant="primary" className="h-[44px] w-full bg-[#8B0000] hover:bg-[#6b0000] text-white">
            TERAPKAN FILTER
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Input 
            type="date"
            label="Rentang Tanggal" 
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Peringkat Operator Berdasarkan Jumlah Ajuan</h3>
          <Button variant="primary" className="bg-[#8B0000] hover:bg-[#6b0000] text-white flex items-center justify-center gap-2 text-xs px-4 py-2 h-9 rounded-full">
            <i className="ri-upload-2-line"></i>
            EKSPOR EXCEL
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-500 bg-gray-200 border-b border-gray-100 font-bold uppercase">
              <tr>
                <th className="px-6 py-4 text-center">Peringkat</th>
                <th className="px-6 py-4 text-center">Nama Operator</th>
                <th className="px-6 py-4 text-center">Desa/Kecamatan</th>
                <th className="px-6 py-4 text-center">Jumlah Ajuan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{row.rank}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">{row.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-xs">{row.desa}</span>
                      <span className="text-[10px] font-semibold text-gray-500">{row.kecamatan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.count}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <button className="bg-[#8B0000] hover:bg-[#6b0000] text-white text-[10px] font-semibold px-4 py-1.5 rounded-full transition-colors">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination mock */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Menampilkan 1-4 dari 24 operator</span>
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
  );
}