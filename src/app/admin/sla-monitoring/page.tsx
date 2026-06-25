'use client';

import React, { useState } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';

export default function WaktuRataRataPage() {
  const [search, setSearch] = useState('');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const handleReset = () => {
    setSearch('');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
  };

  const handleFilter = () => {
    console.log({ search, periode, sortBy, startDate, endDate });
  };

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
      {/* 1. Filters (Top) */}
      <div className="card shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Left Side: Inputs */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <Input 
              label="Pencarian Cepat" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
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
          </div>

          {/* Divider line */}
          <div className="hidden lg:block w-[1px] bg-gray-200 self-stretch my-1"></div>
          <div className="block lg:hidden h-[1px] bg-gray-200 w-full my-2"></div>

          {/* Right Side: Buttons */}
          <div className="flex flex-col justify-end gap-2.5 min-w-[180px] lg:pl-2">
            <Button 
              variant="secondary" 
              onClick={handleReset} 
              className="w-full h-[44px] uppercase tracking-wider font-bold text-xs"
            >
              RESET FILTER
            </Button>
            <Button 
              variant="primary" 
              onClick={handleFilter} 
              className="w-full h-[44px] uppercase tracking-wider font-bold text-xs"
            >
              TERAPKAN FILTER
            </Button>
          </div>

        </div>
      </div>

      {/* 2. Metric Cards (Middle) */}
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

      {/* 3. Data Table (Bottom) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Daftar Rincian Per Jenis Layanan</h3>
          <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9">
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
  );
}