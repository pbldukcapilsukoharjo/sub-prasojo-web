'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import DashboardFilter from '@/components/Dashboard/DashboardFilter';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chart Options — smooth curves
  const chartOptions: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      width: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
      curve: 'smooth',
    },
    colors: ['#F59E0B', '#3B82F6', '#6B7280', '#10B981', '#EF4444', '#8B5CF6'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      labels: { style: { fontSize: '11px', fontFamily: 'Inter, sans-serif', colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: '11px', fontFamily: 'Inter, sans-serif', colors: '#9CA3AF' } },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: { left: 8, right: 8 },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      markers: { width: 8, height: 8, radius: 4 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    markers: { size: 0, hover: { size: 5 } },
  };

  const chartSeries = [
    { name: 'Belum Diverifikasi', data: [150, 450, 550, 250, 100, 680, 200, 420, 350, 250, 400, 200] },
    { name: 'Diverifikasi', data: [250, 500, 600, 100, 200, 550, 680, 300, 800, 650, 620, 500] },
    { name: 'Diproses', data: [350, 650, 200, 300, 150, 380, 350, 450, 400, 280, 220, 500] },
    { name: 'Disetujui', data: [500, 800, 100, 250, 300, 200, 150, 300, 150, 50, 250, 500] },
    { name: 'Ditolak', data: [800, 750, 800, 700, 400, 350, 150, 350, 650, 50, 300, 480] },
    { name: 'Selesai', data: [200, 500, 600, 350, 450, 700, 400, 500, 300, 450, 300, 550] },
  ];

  const statCards = [
    {
      title: 'Total Pengajuan',
      value: '12.900',
      icon: 'ri-file-list-3-line',
      iconBg: '#fdf2f2',
      iconColor: 'text-primary',
      sub: 'Seluruh jenis layanan',
    },
    {
      title: 'Total Selesai',
      value: '9.421',
      icon: 'ri-checkbox-circle-line',
      iconBg: '#ecfdf5',
      iconColor: 'text-emerald-600',
      sub: 'Dokumen berhasil diterbitkan',
    },
    {
      title: 'Total Ditolak',
      value: '1.254',
      icon: 'ri-close-circle-line',
      iconBg: '#fef2f2',
      iconColor: 'text-red-500',
      sub: 'Perlu tindak lanjut',
    },
    {
      title: 'Rata-rata Kepuasan',
      value: '4.8',
      icon: 'ri-star-fill',
      iconBg: '#fffbeb',
      iconColor: 'text-amber-400',
      sub: 'Dari 5.0 skala penilaian',
    },
  ];

  const distributionData = [
    { rank: 1, name: 'Kec. Banjarsari', total: 3250, pct: 34 },
    { rank: 2, name: 'Kec. Laweyan', total: 2680, pct: 28 },
    { rank: 3, name: 'Kec. Serengan', total: 1440, pct: 15 },
    { rank: 4, name: 'Kec. Jebres', total: 1120, pct: 12 },
    { rank: 5, name: 'Kec. Pasar Kliwon', total: 980, pct: 11 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <DashboardFilter />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="card shadow-sm border border-gray-100 p-5 flex flex-col gap-4"
          >
            {/* Top: label + icon */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase leading-snug pt-0.5">
                {stat.title}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.iconBg }}
              >
                <i className={`${stat.icon} text-xl ${stat.iconColor}`}></i>
              </div>
            </div>

            {/* Value + subtitle */}
            <div>
              <p className="text-3xl font-bold font-manrope text-gray-900 leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Row: Chart + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Line Chart Card */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-8 flex flex-col">
          {/* Card Header */}
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-sm font-bold text-gray-900">Total per Status Ajuan</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Tren bulanan berdasarkan status pengajuan
            </p>
          </div>
          {/* Chart */}
          <div className="w-full" style={{ height: 340 }}>
            {mounted && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={340}
                width="100%"
              />
            )}
          </div>
        </div>

        {/* Distribution Card */}
        <div className="card shadow-sm border border-gray-100 lg:col-span-4 flex flex-col p-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Distribusi Wilayah</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              5 kecamatan dengan pengajuan terbanyak
            </p>
          </div>

          {/* List */}
          <div className="flex flex-col divide-y divide-gray-50 px-5 py-2">
            {distributionData.map((item) => (
              <div key={item.rank} className="py-3.5 flex flex-col gap-2">
                {/* Row: rank + name + count + pct badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                      {String(item.rank).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] font-semibold text-gray-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-semibold text-gray-400">
                      {item.total.toLocaleString('id-ID')}
                    </span>
                    <span
                      className="text-[10px] font-bold text-primary rounded-full px-2 py-0.5"
                      style={{ backgroundColor: 'rgba(128,0,0,0.08)' }}
                    >
                      {item.pct}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer: Selengkapnya */}
          <div className="px-5 pb-5 pt-3 mt-auto">
            <Link
              href="/admin/distribusi-wilayah"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[30px] text-primary text-xs font-bold tracking-wider uppercase transition-all duration-200 border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary"
            >
              <i className="ri-map-pin-line text-sm"></i>
              Selengkapnya
              <i className="ri-arrow-right-s-line text-sm"></i>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
