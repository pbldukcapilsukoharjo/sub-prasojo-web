'use client';

import React, { useState } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';

export default function DistribusiWilayahPage() {
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const handleReset = () => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
  };

  const handleFilter = () => {
    console.log({ search, kecamatan, periode, sortBy, startDate, endDate });
  };

  const tableData = Array(4).fill({
    desa: 'Gentan',
    kecamatan: 'KEC : BAKI',
    totalAjuan: 124,
    ktpel: 42,
    kia: 38,
    aktaKelahiran: 44,
    aktaKematian: 44,
    perpindahan: 44,
    kedatangan: 44,
    updateData: 44,
    rekamJemputBola: 44,
  });

  const columns = [
    { key: 'no', header: 'No', align: 'center' as const, render: (row: any, idx: number) => <span className="font-medium text-gray-900">{(idx + 1).toString().padStart(2, '0')}</span> },
    { key: 'desaKec', header: 'Desa/Kecamatan', render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 text-xs">{row.desa}</span>
        <span className="text-[10px] font-semibold text-gray-500">{row.kecamatan}</span>
      </div>
    ) },
    { key: 'totalAjuan', header: 'Total Ajuan', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-900 text-xs">{row.totalAjuan}</span> },
    { key: 'ktpel', header: 'KTP-el', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.ktpel}</span> },
    { key: 'kia', header: 'KIA', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.kia}</span> },
    { key: 'aktaKelahiran', header: 'Akta Kelahiran', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.aktaKelahiran}</span> },
    { key: 'aktaKematian', header: 'Akta Kematian', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.aktaKematian}</span> },
    { key: 'perpindahan', header: 'Perpindahan', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.perpindahan}</span> },
    { key: 'kedatangan', header: 'Kedatangan', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.kedatangan}</span> },
    { key: 'updateData', header: 'Update Data', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.updateData}</span> },
    { key: 'rekamJemputBola', header: 'Rekam Jemput Bola', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-medium text-xs">{row.rekamJemputBola}</span> }
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
          label="Kecamatan"
          value={kecamatan}
          onChange={(val) => setKecamatan(String(val))}
          options={[
            { label: 'Seluruh Kecamatan', value: 'all' },
            { label: 'Baki', value: 'baki' },
            { label: 'Grogol', value: 'grogol' },
            { label: 'Kartasura', value: 'kartasura' },
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

      {/* 2. Metric Cards (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="TOTAL KECAMATAN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">14</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">Kecamatan</span>
            </>
          }
        />
        <StatCard 
          title="TOTAL AJUAN DOKUMEN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">267</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">Dokumen</span>
            </>
          }
        />
        <StatCard 
          title="RATA-RATA AJUAN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-gray-900">200</span>
              <span className="text-sm font-semibold text-gray-500 mb-1">per Wilayah</span>
            </>
          }
        />
      </div>

      {/* 3. Data Table (Bottom) */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Daftar Ajuan per Desa/Kecamatan</h3>
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
      </div>
    </div>
  );
}