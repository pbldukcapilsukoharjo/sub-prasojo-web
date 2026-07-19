import React from 'react';
import Link from 'next/link';
import DashboardFilter from '@/components/Dashboard/DashboardFilter';
import { dashboardServiceServer, DashboardFilterParams, KpiData, ChartTrendItem, TopWilayahItem } from '@/services/dashboard.service';
import DashboardChartClient from '@/components/Dashboard/DashboardChartClient';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Dashboard({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  const filters: DashboardFilterParams = {
    id_layanan: resolvedSearchParams.id_layanan ? String(resolvedSearchParams.id_layanan) : undefined,
    id_kecamatan: resolvedSearchParams.id_kecamatan ? String(resolvedSearchParams.id_kecamatan) : undefined,
    periode_bulan: resolvedSearchParams.periode_bulan ? Number(resolvedSearchParams.periode_bulan) : undefined,
    start_date: resolvedSearchParams.start_date as string | undefined,
    end_date: resolvedSearchParams.end_date as string | undefined,
  };

  let kpiData: KpiData | null = null;
  let chartData: ChartTrendItem[] = [];
  let topWilayahData: TopWilayahItem[] = [];

  try {
    const [kpiRes, chartRes, wilayahRes] = await Promise.all([
      dashboardServiceServer.getDashboardKpi(filters),
      dashboardServiceServer.getDashboardChartTrend(filters),
      dashboardServiceServer.getDashboardTopWilayah(filters)
    ]);

    if (kpiRes.status) kpiData = kpiRes.data;
    if (chartRes.status) chartData = chartRes.data;
    if (wilayahRes.status) topWilayahData = wilayahRes.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
  }

  // Aggregate chartData by month for the current year
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const aggregatedData = months.map(month => ({
    tanggal: month,
    total_ajuan: 0,
    belum_diverifikasi: 0,
    diverifikasi: 0,
    ditolak: 0,
    diproses: 0,
    selesai: 0,
    disetujui: 0,
  }));

  chartData.forEach(item => {
    if (!item.tanggal) return;
    const date = new Date(item.tanggal);
    if (date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        aggregatedData[monthIndex].total_ajuan += Number(item.total_ajuan) || 0;
        aggregatedData[monthIndex].belum_diverifikasi += Number(item.belum_diverifikasi) || 0;
        aggregatedData[monthIndex].diverifikasi += Number(item.diverifikasi) || 0;
        aggregatedData[monthIndex].ditolak += Number(item.ditolak) || 0;
        aggregatedData[monthIndex].diproses += Number(item.diproses) || 0;
        aggregatedData[monthIndex].selesai += Number(item.selesai) || 0;
        aggregatedData[monthIndex].disetujui += Number(item.disetujui) || 0;
      }
    }
  });

  const categories = aggregatedData.map(item => item.tanggal);
  const totalAjuanSeries = aggregatedData.map(item => item.total_ajuan);
  const belumDiverifikasiSeries = aggregatedData.map(item => item.belum_diverifikasi);
  const diverifikasiSeries = aggregatedData.map(item => item.diverifikasi);
  const ditolakSeries = aggregatedData.map(item => item.ditolak);
  const diprosesSeries = aggregatedData.map(item => item.diproses);
  const selesaiSeries = aggregatedData.map(item => item.selesai);
  const disetujuiSeries = aggregatedData.map(item => item.disetujui);

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
      title: 'Rata-rata SLA',
      value: kpiData?.rata_rata_sla_text || '0 Menit',
      icon: 'ri-time-line',
      iconBg: '#fffbeb',
      iconColor: 'text-amber-400',
      sub: 'Waktu pelayanan',
      valueClass: 'text-2xl',
    },
  ];

  const totalPengajuan = kpiData?.total_pengajuan || 1;
  const distributionData = topWilayahData.map((item, index) => {
    const pct = Math.round((item.total / totalPengajuan) * 100);
    return {
      rank: index + 1,
      name: item.nama_kecamatan,
      total: item.total,
      pct: pct > 100 ? 100 : pct
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="card shadow-sm border border-border p-5 flex flex-col gap-4 bg-surface justify-between"
          >
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

            <div>
              <p className={`${stat.valueClass || 'text-3xl'} font-bold font-manrope text-text-primary leading-none`}>
                {stat.value}
              </p>
              <p className="text-[11px] text-text-secondary font-medium mt-1.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="card bg-surface shadow-sm border border-border lg:col-span-8 flex flex-col p-0 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Total per Status Ajuan</h3>
              <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                Pergerakan data berdasarkan tanggal pengajuan
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className="ri-line-chart-line text-sm"></i>
            </div>
          </div>
          <DashboardChartClient options={chartOptions} series={chartSeries} />
        </div>

        <div className="card bg-surface shadow-sm border border-border lg:col-span-4 flex flex-col p-0 overflow-hidden min-h-[415px]">
          <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Distribusi Wilayah</h3>
              <p className="text-[11px] text-text-secondary font-medium mt-0.5">
                Top wilayah pengajuan terbanyak
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i className="ri-map-pin-line text-sm"></i>
            </div>
          </div>

          <div className="flex flex-col gap-1 px-4 py-3">
            {distributionData.length > 0 ? distributionData.map((item, idx) => (
              <div key={item.rank} className="p-3 rounded-2xl hover:bg-gray-50/80 transition-colors flex flex-col gap-3 group cursor-default">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${idx < 3 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary group-hover:bg-gray-200'}`}>
                      {String(item.rank).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-text-primary line-clamp-1">{item.name}</span>
                      <span className="text-[11px] font-medium text-text-secondary mt-0.5">
                        {item.total.toLocaleString('id-ID')} Pengajuan
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">
                      {item.pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="py-10 flex flex-col items-center justify-center text-text-secondary text-sm font-medium gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  <i className="ri-map-pin-line text-xl text-gray-400"></i>
                </div>
                Belum ada data distribusi wilayah
              </div>
            )}
          </div>

          {distributionData.length > 0 && (
            <div className="px-6 pb-6 pt-2 mt-auto">
              <Link
                href="/admin/distribusi-wilayah"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-50 text-text-primary text-xs font-bold transition-all duration-200 hover:bg-primary hover:text-white group"
              >
                Lihat Selengkapnya
                <i className="ri-arrow-right-line text-sm transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
