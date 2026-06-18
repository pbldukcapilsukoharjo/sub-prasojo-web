'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';
import Link from 'next/link';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart Options
  const chartOptions: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      width: 2,
      curve: 'straight',
    },
    colors: ['#F59E0B', '#3B82F6', '#6B7280', '#10B981', '#DC2626', '#8B5CF6'],
    xaxis: {
      categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: false,
    },
  };

  const chartSeries = [
    { name: 'Belum diverifikasi', data: [150, 450, 550, 250, 100, 680, 200, 420, 350, 250, 400, 200] },
    { name: 'Diverifikasi', data: [250, 500, 600, 100, 200, 550, 680, 300, 800, 650, 620, 500] },
    { name: 'Diproses', data: [350, 650, 200, 300, 150, 380, 350, 450, 400, 280, 220, 500] },
    { name: 'Disetujui', data: [500, 800, 100, 250, 300, 200, 150, 300, 150, 50, 250, 500] },
    { name: 'Ditolak', data: [800, 750, 800, 700, 400, 350, 150, 350, 650, 50, 300, 480] },
    { name: 'Selesai', data: [200, 500, 600, 350, 450, 700, 400, 500, 300, 450, 300, 550] },
  ];

  const statCards = [
    { title: 'TOTAL PENGAJUAN', value: '12,900', badge: '+12%' },
    { title: 'TOTAL SELESAI', value: '12,900', badge: '+12%' },
    { title: 'TOTAL DITOLAK', value: '12,900', badge: '+12%' },
    { title: 'LABEL TAMAT', value: '12,900', badge: '+12%' },
  ];

  const operatorLeaderboard = [
    { name: 'Muhammad Reza', stats: '515/BLN' },
    { name: 'Muhammad Reza', stats: '515/BLN' },
    { name: 'Muhammad Reza', stats: '515/BLN' },
  ];

  const distribution = [
    { name: 'Kecamatan Laweyan', percentage: '34%', color: 'bg-blue-600' },
    { name: 'Kecamatan Banjarsari', percentage: '28%', color: 'bg-blue-600' },
    { name: 'Kecamatan Serengan', percentage: '15%', color: 'bg-blue-600' },
  ];

  const productTotals = [
    { label: 'DIAJUKAN TTE', value: '85', color: 'border-[#00BCD4]', textColor: 'text-[#00BCD4]' },
    { label: 'TIDAK DIPROSES', value: '17', color: 'border-[#212121]', textColor: 'text-[#212121]' },
    { label: 'SIAP DIDOWNLOAD', value: '3.873', color: 'border-[#4CAF50]', textColor: 'text-[#4CAF50]' },
    { label: 'SIAP DICETAK', value: '319', color: 'border-[#2196F3]', textColor: 'text-[#2196F3]' },
    { label: 'SUDAH DICETAK', value: '50', color: 'border-[#3F51B5]', textColor: 'text-[#3F51B5]' },
    { label: 'SIAP DIAMBIL', value: '178', color: 'border-[#CDDC39]', textColor: 'text-[#CDDC39]' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select 
            label="Jenis Layanan" 
            options={[
              { label: 'Semua Jenis Layanan', value: 'all' },
              { label: 'Kartu Keluarga', value: 'kk' },
              { label: 'KTP-el', value: 'ktp' },
              { label: 'KIA', value: 'kia' },
              { label: 'Akta Kelahiran', value: 'akta_kelahiran' },
              { label: 'Akta Kematian', value: 'akta_kematian' },
              { label: 'Perpindahan', value: 'perpindahan' },
              { label: 'Surket KTP', value: 'surket' },
            ]} 
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
          <Button variant="primary" className="h-[44px] w-[180px] lg:w-full">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="card shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-gray-700 tracking-wider uppercase mb-2">{stat.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold font-manrope">{stat.value}</span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{stat.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Total per Status Ajuan</h3>
          <div className="flex-1 min-h-0">
            {mounted && (
               <Chart options={chartOptions} series={chartSeries} type="line" height="100%" width="100%" />
            )}
          </div>
        </div>

        {/* Operator Leaderboard */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-3 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-900">Peringkat Operator</h3>
            <Link href="/admin/dashboard/peringkat-operator" className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <span>Selengkapnya</span>
              <i className="ri-arrow-right-s-line text-xs"></i>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {operatorLeaderboard.map((op, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <img src={`https://ui-avatars.com/api/?name=MR&background=114856&color=fff`} className="w-10 h-10 rounded-full" alt="avatar" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{op.name}</span>
                  <span className="text-xs font-semibold text-gray-500">{op.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region Distribution */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-3 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-gray-900">Distribusi Wilayah</h3>
            <Link href="/admin/dashboard/distribusi-wilayah" className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <span>Selengkapnya</span>
              <i className="ri-arrow-right-s-line text-xs"></i>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {distribution.map((dist, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                  <span>{dist.name}</span>
                  <span>{dist.percentage}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${dist.color}`} style={{ width: dist.percentage }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews and SLA Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reviews */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-9 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">Ulasan Pengguna</h3>
            <Link href="/admin/dashboard/ulasan" className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <span>Selengkapnya</span>
              <i className="ri-arrow-right-s-line text-xs"></i>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-50 rounded-[20px] p-6 flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL RATA-RATA</span>
              <span className="text-6xl font-bold font-manrope text-gray-900 mb-2">4.8</span>
              <div className="flex gap-1 text-[#F59E0B] text-xl mb-3">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-fill"></i>
              </div>
              <span className="text-xs font-semibold text-gray-500">Berdasarkan 1,240 Ulasan</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {/* Review 1 */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-gray-900 mr-2">4.8/5.0</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Jenis: TAMAT</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 text-right">12 Okt 2023, 09:45<br/>WIB</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Pelayanan sangat cepat dan membantu.</p>
                <p className="text-xs text-gray-500 font-semibold">Oleh: Anonim</p>
              </div>
              {/* Review 2 */}
              <div className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-gray-900 mr-2">5.0/5.0</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Jenis: AKTA</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 text-right">12 Okt 2023, 08:20<br/>WIB</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Sistem mudah digunakan bagi pemula.</p>
                <p className="text-xs text-gray-500 font-semibold">Oleh: Anonim</p>
              </div>
            </div>
          </div>
        </div>

        {/* SLA */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-3 p-6 flex flex-col items-center">
          <div className="flex justify-between items-center mb-6 w-full">
            <h3 className="text-sm font-bold text-gray-900">Kepatuhan SLA</h3>
            <Link href="/admin/dashboard/sla" className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <span>Selengkapnya</span>
              <i className="ri-arrow-right-s-line text-xs"></i>
            </Link>
          </div>
          <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[12px] border-blue-600 mb-6">
            <span className="text-3xl font-bold font-manrope text-gray-900">92%</span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">TARGET TERPENUHI</span>
        </div>
      </div>

      {/* Product Totals */}
      <div className="card shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-8">Total Produk per 20 Apr, 2026</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {productTotals.map((prod, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className={`w-[120px] h-[120px] rounded-full border-[10px] flex items-center justify-center ${prod.color}`}>
                <span className={`text-2xl font-bold font-manrope ${prod.textColor}`}>{prod.value}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-700 tracking-wider uppercase text-center">{prod.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rata-rata Proses Selesai */}
        <div className="card shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Rata rata Proses Selesai</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-semibold">Kartu Keluarga</span>
              <span className="text-sm font-bold text-gray-900">4.5 Jam</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-600 font-semibold">KTP-EL</span>
              <span className="text-sm font-bold text-gray-900">8.5 Jam</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600 font-semibold">Akta Kelahiran</span>
              <span className="text-sm font-bold text-gray-900">12.0 Jam</span>
            </div>
          </div>
        </div>

        {/* Ringkasan Hari Ini */}
        <div className="card shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Ringkasan Hari Ini</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">AJUAN MASUK</span>
              <span className="text-2xl font-bold font-manrope text-gray-900">128</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">SLA</span>
              <span className="text-2xl font-bold font-manrope text-gray-900">92%</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center col-span-2">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">RATA-RATA MENIT</span>
              <span className="text-2xl font-bold font-manrope text-gray-900">15.3</span>
            </div>
          </div>
        </div>

        {/* Pemantauan Status Proses */}
        <div className="card shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Pemantauan Status Proses</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <i className="ri-checkbox-circle-line text-gray-500 text-lg"></i>
                <span className="text-sm text-gray-600 font-semibold">Diproses</span>
              </div>
              <span className="text-sm font-bold text-gray-900">30</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <i className="ri-checkbox-blank-circle-line text-gray-500 text-lg"></i>
                <span className="text-sm text-gray-600 font-semibold">Belum Diverifikasi</span>
              </div>
              <span className="text-sm font-bold text-gray-900">30</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <i className="ri-hourglass-line text-gray-500 text-lg"></i>
                <span className="text-sm text-gray-600 font-semibold">Menunggu Konfirmasi</span>
              </div>
              <span className="text-sm font-bold text-gray-900">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
