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
    { title: 'RATA RATA KEPUASAN', value: '90%', icon: 'ri-star-fill', iconColor: 'text-yellow-500' },
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
              {stat.badge && (
                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{stat.badge}</span>
              )}
              {stat.icon && (
                <i className={`${stat.icon} ${stat.iconColor} text-xl`}></i>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-8 h-[400px] flex flex-col">
          <div className="flex-1 min-h-0">
            {mounted && (
               <Chart options={chartOptions} series={chartSeries} type="line" height="100%" width="100%" />
            )}
          </div>
        </div>

        {/* Region Distribution */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-4 p-6 flex flex-col gap-4">
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

      </div>
    </div>
  );
}
