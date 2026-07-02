'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import DashboardFilter from '@/components/Dashboard/DashboardFilter';
import { dashboardService, DashboardFilterParams, KpiData, ChartTrendItem, TopWilayahItem } from '@/services/dashboard.service';
import toast from 'react-hot-toast';
import { handleApiError } from '@/lib/api-error';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<DashboardFilterParams>({});
  
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [chartData, setChartData] = useState<ChartTrendItem[]>([]);
  const [topWilayahData, setTopWilayahData] = useState<TopWilayahItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch if mounted to ensure we don't double fetch on SSR
    if (mounted) {
      fetchDashboardData(filters);
    }
  }, [filters, mounted]);

  const fetchDashboardData = async (currentFilters: DashboardFilterParams) => {
    setIsLoading(true);
    try {
      const [kpiRes, chartRes, wilayahRes] = await Promise.all([
        dashboardService.getDashboardKpi(currentFilters),
        dashboardService.getDashboardChartTrend(currentFilters),
        dashboardService.getDashboardTopWilayah(currentFilters)
      ]);

      if (kpiRes.status) setKpiData(kpiRes.data);
      if (chartRes.status) setChartData(chartRes.data);
      if (wilayahRes.status) setTopWilayahData(wilayahRes.data);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: DashboardFilterParams) => {
    setFilters(newFilters);
  };

  // Prepare Chart Options
  const categories = chartData.map(item => item.tanggal);
  const totalAjuanSeries = chartData.map(item => item.total_ajuan || 0);
  const belumDiverifikasiSeries = chartData.map(item => item.belum_diverifikasi || 0);
  const diverifikasiSeries = chartData.map(item => item.diverifikasi || 0);
  const ditolakSeries = chartData.map(item => item.ditolak || 0);
  const diprosesSeries = chartData.map(item => item.diproses || 0);
  const selesaiSeries = chartData.map(item => item.selesai || 0);
  const disetujuiSeries = chartData.map(item => item.disetujui || 0);

  const chartOptions: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      width: [3, 2, 2, 2, 2, 2, 2],
      curve: 'smooth',
    },
    colors: ['#4B5563', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#10B981', '#059669'],
    xaxis: {
      categories: categories,
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
    { name: 'Total Ajuan', data: totalAjuanSeries },
    { name: 'Belum Diverifikasi', data: belumDiverifikasiSeries },
    { name: 'Diverifikasi', data: diverifikasiSeries },
    { name: 'Ditolak', data: ditolakSeries },
    { name: 'Diproses', data: diprosesSeries },
    { name: 'Selesai', data: selesaiSeries },
    { name: 'Disetujui', data: disetujuiSeries },
  ];

  const statCards = [
    {
      title: 'Total Pengajuan',
      value: kpiData?.total_pengajuan.toLocaleString('id-ID') || '0',
      icon: 'ri-file-list-3-line',
      iconBg: '#fdf2f2',
      iconColor: 'text-primary',
      sub: 'Seluruh jenis layanan',
    },
    {
      title: 'Total Selesai',
      value: kpiData?.total_selesai.toLocaleString('id-ID') || '0',
      icon: 'ri-checkbox-circle-line',
      iconBg: '#ecfdf5',
      iconColor: 'text-emerald-600',
      sub: 'Dokumen berhasil diterbitkan',
    },
    {
      title: 'Total Ditolak',
      value: kpiData?.total_ditolak.toLocaleString('id-ID') || '0',
      icon: 'ri-close-circle-line',
      iconBg: '#fef2f2',
      iconColor: 'text-red-500',
      sub: 'Perlu tindak lanjut',
    },
    {
      title: 'Rata-rata Kepuasan',
      value: kpiData?.rata_rata_kepuasan ? kpiData.rata_rata_kepuasan.toFixed(1) : '0',
      icon: 'ri-star-fill',
      iconBg: '#fffbeb',
      iconColor: 'text-amber-400',
      sub: 'Skala Indeks Kepuasan',
    },
  ];

  // Map distribution data with pct calculation
  const totalPengajuan = kpiData?.total_pengajuan || 1; // avoid division by zero
  const distributionData = topWilayahData.map((item, index) => {
    const pct = Math.round((item.total / totalPengajuan) * 100);
    return {
      rank: index + 1,
      name: item.nama_kecamatan,
      total: item.total,
      pct: pct > 100 ? 100 : pct // Cap at 100 just in case
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <DashboardFilter onFilterChange={handleFilterChange} />

      {/* Loading Overlay State for Content */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="card shadow-sm border border-border p-5 flex flex-col gap-4 bg-surface"
            >
              {/* Top: label + icon */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold text-text-secondary tracking-wider uppercase leading-snug pt-0.5">
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
                <p className="text-3xl font-bold font-manrope text-text-primary leading-none">
                  {stat.value}
                </p>
                <p className="text-[11px] text-text-secondary font-medium mt-1.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Row: Chart + Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Line Chart Card */}
          <div className="card bg-surface shadow-sm border border-border lg:col-span-8 flex flex-col">
            {/* Card Header */}
            <div className="px-6 pt-5 pb-2">
              <h3 className="text-sm font-bold text-text-primary">Total per Status Ajuan</h3>
              <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                Pergerakan data berdasarkan tanggal pengajuan
              </p>
            </div>
            {/* Chart */}
            <div className="w-full relative" style={{ height: 340 }}>
              {mounted && chartData.length > 0 ? (
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height={340}
                  width="100%"
                />
              ) : mounted ? (
                <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm font-medium">
                  Belum ada data tersedia
                </div>
              ) : null}
            </div>
          </div>

          {/* Distribution Card */}
          <div className="card bg-surface shadow-sm border border-border lg:col-span-4 flex flex-col p-0 overflow-hidden min-h-[415px]">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary">Distribusi Wilayah</h3>
              <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                Top wilayah dengan pengajuan terbanyak
              </p>
            </div>

            {/* List */}
            <div className="flex flex-col divide-y divide-gray-50 px-5 py-2">
              {distributionData.length > 0 ? distributionData.map((item) => (
                <div key={item.rank} className="py-3.5 flex flex-col gap-2">
                  {/* Row: rank + name + count + pct badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-text-secondary flex-shrink-0">
                        {String(item.rank).padStart(2, '0')}
                      </span>
                      <span className="text-[13px] font-semibold text-text-primary line-clamp-1">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-semibold text-text-secondary">
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
              )) : (
                <div className="py-10 text-center text-text-secondary text-sm font-medium">
                  Belum ada data distribusi wilayah
                </div>
              )}
            </div>

            {/* Footer: Selengkapnya */}
            {distributionData.length > 0 && (
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
