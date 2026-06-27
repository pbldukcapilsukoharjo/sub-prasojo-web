'use client';

import React, { useState } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';

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

  const columns = [
    { key: 'rank', header: 'Peringkat', align: 'center' as const, render: (row: any) => <span className="font-medium text-gray-900">{row.rank}</span> },
    { key: 'service', header: 'Jenis Layanan', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-900 text-xs">{row.service}</span> },
    { key: 'count', header: 'Jumlah Ajuan', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.count}</span> },
    { key: 'avgTime', header: 'Rata Rata Waktu', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.avgTime}</span> }
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

      {/* 2. Metric Cards (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="RATA - RATA WAKTU PROSES"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">8,5</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">Jam</span>
            </>
          }
        />
        <StatCard 
          title="PENCAPAIAN SLA"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">92%</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">(Persen)</span>
            </>
          }
        />
        <StatCard 
          title="TARGET SLA"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">&lt; 6</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">jam</span>
            </>
          }
          subtitle={
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mt-1">
              <i className="ri-time-line"></i>
              <span>Standar Layanan Nasional</span>
            </div>
          }
        />
      </div>

      {/* 3. Data Table (Bottom) */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Daftar Rincian Per Jenis Layanan</h3>
          <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9">
            <i className="ri-upload-2-line"></i>
            EKSPOR EXCEL
          </Button>
        </div>
        <div className="w-full">
          <Table 
            columns={columns} 
            data={tableData} 
          />
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