'use client';

import React from 'react';
import Link from 'next/link';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';

export default function WaktuRataRataPage() {
  const tableData = [
    { rank: '01', service: 'TOTAL AJUAN', count: 124, avgTime: '3 jam', status: 'ON TIME' },
    { rank: '02', service: 'KTP-EL', count: 124, avgTime: '5 jam', status: 'WARNING' },
    { rank: '03', service: 'KIA', count: 124, avgTime: '7 jam', status: 'OVER SLA' },
    { rank: '04', service: 'AKTA KELAHIRAN', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
    { rank: '05', service: 'AKTA KEMATIAN', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
    { rank: '06', service: 'PERPINDAHAN', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
    { rank: '07', service: 'KEDATANGAN', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
    { rank: '08', service: 'UPDATE DATA', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
    { rank: '09', service: 'REKAM JEMPUT BOLA', count: 124, avgTime: '4,5 jam', status: 'ON TIME' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ON TIME':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500 text-blue-600 bg-blue-50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            ON TIME
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-yellow-500 text-yellow-600 bg-yellow-50">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            WARNING
          </span>
        );
      case 'OVER SLA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500 text-red-600 bg-red-50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            OVER SLA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <i className="ri-arrow-left-line text-gray-600"></i>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Waktu Rata - Rata</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">RATA - RATA WAKTU PROSES</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">8,5</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">Jam</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">PENCAPAIAN SLA</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">92%</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">(Persen)</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TARGET SLA</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">&lt; 6</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">jam</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <i className="ri-time-line"></i>
            <span>Standar Layanan Nasional</span>
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
            label="Periode" 
            options={[{ label: 'Bulan Ini', value: 'this_month' }]} 
          />
          <Select 
            label="Urutkan Dari" 
            options={[{ label: 'Terbaru', value: 'newest' }]} 
          />
          <Input 
            type="date"
            label="Rentang Tanggal" 
          />
          <Button variant="primary" className="h-[44px] w-full bg-[#8B0000] hover:bg-[#6b0000] text-white">
            TERAPKAN FILTER
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Daftar Rincian Per Jenis Layanan</h3>
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
                <th className="px-6 py-4 text-center">Jenis Layanan</th>
                <th className="px-6 py-4 text-center">Jumlah Ajuan</th>
                <th className="px-6 py-4 text-center">Rata Rata Waktu</th>
                <th className="px-6 py-4 text-center">Status SLA</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{row.rank}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">{row.service}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.count}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.avgTime}</td>
                  <td className="px-6 py-4 flex justify-center">
                    {getStatusBadge(row.status)}
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