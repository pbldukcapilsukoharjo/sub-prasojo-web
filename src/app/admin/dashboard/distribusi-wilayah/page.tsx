'use client';

import React from 'react';
import Link from 'next/link';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';

export default function DistribusiWilayahPage() {
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/admin/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <i className="ri-arrow-left-line text-gray-600"></i>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Distribusi Wilayah</h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL KECAMATAN</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">14</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">Kecamatan</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL AJUAN DOKUMEN</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">267</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">Dokumen</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">RATA-RATA AJUAN</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold font-manrope text-gray-900">200</span>
            <span className="text-sm font-semibold text-gray-500 mb-1">per Wilayah</span>
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
          <h3 className="text-base font-bold text-gray-900">Daftar Ajuan per Desa/Kecamatan</h3>
          <Button variant="primary" className="bg-[#8B0000] hover:bg-[#6b0000] text-white flex items-center justify-center gap-2 text-xs px-4 py-2 h-9 rounded-full">
            <i className="ri-upload-2-line"></i>
            EKSPOR EXCEL
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-500 bg-gray-200 border-b border-gray-100 font-bold uppercase">
              <tr>
                <th className="px-6 py-4 text-center">No</th>
                <th className="px-6 py-4">Desa/Kecamatan</th>
                <th className="px-6 py-4 text-center">Total Ajuan</th>
                <th className="px-6 py-4 text-center">KTP-el</th>
                <th className="px-6 py-4 text-center">KIA</th>
                <th className="px-6 py-4 text-center">Akta Kelahiran</th>
                <th className="px-6 py-4 text-center">Akta Kematian</th>
                <th className="px-6 py-4 text-center">Perpindahan</th>
                <th className="px-6 py-4 text-center">Kedatangan</th>
                <th className="px-6 py-4 text-center">Update Data</th>
                <th className="px-6 py-4 text-center">Rekam Jemput Bola</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-xs">{row.desa}</span>
                      <span className="text-[10px] font-semibold text-gray-500">{row.kecamatan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">{row.totalAjuan}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.ktpel}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.kia}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.aktaKelahiran}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.aktaKematian}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.perpindahan}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.kedatangan}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.updateData}</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium text-xs">{row.rekamJemputBola}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}