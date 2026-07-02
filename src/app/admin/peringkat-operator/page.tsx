'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Badge from '@/components/Common/Badge';
import Tabs from '@/components/Common/Tabs';
import Pagination from '@/components/Common/Pagination';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';
import { operatorService, KpiGlobalData, OperatorItem, OperatorKpiData, RiwayatItem } from '@/services/operator.service';
import { handleApiError } from '@/lib/api-error';

// Dynamically import ApexCharts to avoid SSR hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PeringkatOperatorPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorItem | null>(null);

  // Listing page filter states
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('all');

  // List View Data States
  const [kpiGlobal, setKpiGlobal] = useState<KpiGlobalData | null>(null);
  const [rankingsData, setRankingsData] = useState<OperatorItem[]>([]);
  const [listCurrentPage, setListCurrentPage] = useState(1);
  const [listTotalPages, setListTotalPages] = useState(1);
  const [listTotalItems, setListTotalItems] = useState(0);
  const [isListLoading, setIsListLoading] = useState(false);
  const listPerPage = 10;

  // Detail page states
  const [activeTab, setActiveTab] = useState('semua');
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const [operatorKpi, setOperatorKpi] = useState<OperatorKpiData | null>(null);
  const [historyData, setHistoryData] = useState<RiwayatItem[]>([]);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailTotalItems, setDetailTotalItems] = useState(0);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const detailPerPage = 5;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect for List View
  useEffect(() => {
    if (!selectedOperator) {
      fetchListView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOperator, listCurrentPage]);

  // Effect for Detail View
  useEffect(() => {
    if (selectedOperator) {
      fetchDetailView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOperator, activeTab, detailCurrentPage]);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const fetchListView = async () => {
    setIsListLoading(true);
    try {
      const params = {
        search: search || undefined,
        id_kecamatan: kecamatan !== 'all' ? Number(kecamatan) : undefined,
        periode_bulan: periode ? Number(periode) : undefined,
        sort: sortBy,
        start_date: formatToDDMMYYYY(startDate),
        end_date: formatToDDMMYYYY(endDate),
        id_operator: operatorFilter !== 'all' ? Number(operatorFilter) : undefined,
      };

      // Fetch KPI Global
      const kpiRes = await operatorService.getKpiGlobal({
        id_kecamatan: params.id_kecamatan,
        periode_bulan: params.periode_bulan,
        start_date: params.start_date,
        end_date: params.end_date,
        id_operator: params.id_operator
      });
      if (kpiRes.status && kpiRes.data) {
        setKpiGlobal(kpiRes.data);
      }

      // Fetch Peringkat List
      const listRes = await operatorService.getPeringkatOperator({
        ...params,
        page: listCurrentPage,
        limit: listPerPage
      });
      if (listRes.status && listRes.data) {
        setRankingsData(listRes.data.list || []);
        if (listRes.data.meta) {
          setListTotalItems(listRes.data.meta.total);
          setListTotalPages(listRes.data.meta.total_page);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchDetailView = async () => {
    if (!selectedOperator) return;
    setIsDetailLoading(true);
    try {
      const id = selectedOperator.id;
      
      // We map activeTab to an integer if we know it, otherwise just send the string.
      // Usually, 'kk' might be 1, 'ktp' is 2, etc. If backend accepts string, we pass string.
      let id_layanan: string | undefined = undefined;
      if (activeTab !== 'semua') {
        id_layanan = activeTab;
      }

      // Fetch Operator KPI Detail
      const kpiRes = await operatorService.getOperatorKpi(id, {
        tahun: currentYear,
        periode_bulan: periode ? Number(periode) : undefined,
        id_layanan: id_layanan
      });
      if (kpiRes.status && kpiRes.data) {
        setOperatorKpi(kpiRes.data);
      }

      // Fetch Operator Riwayat
      const riwayatRes = await operatorService.getOperatorRiwayat(id, {
        tahun: currentYear,
        periode_bulan: periode ? Number(periode) : undefined,
        id_layanan: id_layanan,
        page: detailCurrentPage,
        limit: detailPerPage,
      });
      if (riwayatRes.status && riwayatRes.data) {
        setHistoryData(riwayatRes.data.list || []);
        if (riwayatRes.data.meta) {
          setDetailTotalItems(riwayatRes.data.meta.total);
          setDetailTotalPages(riwayatRes.data.meta.total_page);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setOperatorFilter('all');
    setListCurrentPage(1);

    setTimeout(() => {
      fetchListView();
    }, 0);
  };

  const handleFilter = () => {
    if (listCurrentPage === 1) {
      fetchListView();
    } else {
      setListCurrentPage(1);
    }
  };

  const leaderboardColumns = [
    { key: 'rank', header: 'Peringkat', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-secondary">{String(row.peringkat).padStart(2, '0')}</span> },
    { key: 'name', header: 'Nama Operator', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-primary text-xs">{row.operator}</span> },
    { key: 'desaKec', header: 'Desa/Kecamatan', render: (row: any) => (
      <div className="flex flex-col items-center">
        <span className="font-bold text-text-primary text-xs">{row.desa}</span>
        <span className="text-[10px] font-semibold text-text-secondary">{row.kecamatan}</span>
      </div>
    ) },
    { key: 'count', header: 'Jumlah Ajuan', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-semibold text-xs">{row.jumlah_ajuan}</span> },
    { key: 'aksi', header: 'Aksi', align: 'center' as const, render: (row: any) => (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setSelectedOperator(row);
          setDetailCurrentPage(1);
          setActiveTab('semua');
        }}
        className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-bold text-[10px] px-4 py-1.5 rounded-full cursor-pointer"
      >
        Detail
      </button>
    ) }
  ];

  // Map detail chart data
  const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  let chartDataValues = new Array(12).fill(0);
  if (operatorKpi?.layanan_perbulan) {
    chartDataValues = monthKeys.map(m => operatorKpi.layanan_perbulan[m] || 0);
  }

  const barOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: monthKeys,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          colors: '#9CA3AF',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          colors: '#9CA3AF',
        },
        formatter: (val: number) => Math.round(val)
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: { left: 16, right: 16, top: 0, bottom: 0 },
    },
    colors: ['#800000'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.9,
        opacityTo: 0.75,
        stops: [0, 100],
      },
    },
    legend: { show: false },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      y: {
        formatter: function (val: number) {
          return val + ' layanan';
        },
      },
    },
  };

  const barSeries = [
    {
      name: 'Jumlah Layanan',
      data: chartDataValues,
    },
  ];

  const detailTabs = [
    { id: 'semua', label: 'SEMUA' },
    { id: 'kk', label: 'KK' },
    { id: 'ktp', label: 'KTP-EL' },
    { id: 'kia', label: 'KIA' },
    { id: 'akta-kel', label: 'AKTA-KEL' },
    { id: 'akta-kem', label: 'AKTA-KEM' },
    { id: 'perpindahan', label: 'PERPINDAHAN' },
    { id: 'surket', label: 'SURKET KTP' },
  ];

  const historyColumns = [
    { key: 'no', header: 'No', align: 'center' as const, render: (row: any, idx: number) => <span className="font-bold text-text-secondary">{String((detailCurrentPage - 1) * detailPerPage + idx + 1).padStart(2, '0')}</span> },
    { key: 'regis', header: 'No.Regis', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-primary text-xs">{row.no_regis}</span> },
    { key: 'pemohon', header: 'Pemohon', align: 'center' as const, render: (row: any) => <span className="text-text-primary text-xs font-semibold">{row.pemohon}</span> },
    { key: 'kode', header: 'Kode Ajuan', align: 'center' as const, render: (row: any) => <span className="text-text-secondary font-bold text-xs">{row.kode_ajuan}</span> },
    { key: 'desaKec', header: 'Desa', align: 'center' as const, render: (row: any) => <span className="text-text-secondary font-semibold text-xs">{row.desa}</span> },
    { key: 'tanggalWaktu', header: 'Tanggal & Waktu', align: 'center' as const, render: (row: any) => (
      <div className="flex flex-col items-center">
        <span className="font-semibold text-text-primary text-xs">{row.tanggal}</span>
        <span className="text-[9px] font-bold text-text-secondary">{row.waktu}</span>
      </div>
    ) },
    { key: 'status', header: 'Status', align: 'center' as const, render: (row: any) => {
      let badgeVariant: 'primary' | 'default' | 'success' | 'danger' = 'default';
      const statusUpper = row.status?.toUpperCase() || '';
      if (statusUpper === 'DIVERIFIKASI') badgeVariant = 'primary';
      else if (statusUpper === 'DIPROSES') badgeVariant = 'default';
      else if (statusUpper === 'DISETUJUI' || statusUpper === 'SELESAI') badgeVariant = 'success';
      else if (statusUpper === 'DITOLAK') badgeVariant = 'danger';

      return <Badge variant={badgeVariant}>{row.status}</Badge>;
    } }
  ];

  return (
    <div className="flex flex-col gap-6">
      {!selectedOperator ? (
        // ================= LIST VIEW =================
        <>
          {/* Filters Card */}
          <FilterCard onReset={handleReset} onApply={handleFilter}>
            <Input
              label="Pencarian Cepat"
              placeholder="Cari Operator/NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CustomSelect
              label="Kecamatan"
              value={kecamatan}
              onChange={(val) => setKecamatan(String(val))}
              options={[
                { label: 'Seluruh Kecamatan', value: 'all' },
                { label: 'Baki', value: '1' },
                { label: 'Grogol', value: '2' },
                { label: 'Kartasura', value: '3' },
              ]}
            />
            <CustomSelect
              label="Periode"
              value={periode}
              onChange={(val) => setPeriode(String(val))}
              disabled={isPeriodeDisabled}
              placeholder="Pilih Periode"
              options={[
                { label: 'Januari', value: 1 },
                { label: 'Februari', value: 2 },
                { label: 'Maret', value: 3 },
                { label: 'April', value: 4 },
                { label: 'Mei', value: 5 },
                { label: 'Juni', value: 6 },
                { label: 'Juli', value: 7 },
                { label: 'Agustus', value: 8 },
                { label: 'September', value: 9 },
                { label: 'Oktober', value: 10 },
                { label: 'November', value: 11 },
                { label: 'Desember', value: 12 },
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
            <CustomSelect
              label="Operator"
              value={operatorFilter}
              onChange={(val) => setOperatorFilter(String(val))}
              options={[
                { label: 'Semua Operator', value: 'all' },
                { label: 'Operator 1', value: '1' },
                { label: 'Operator 2', value: '2' },
              ]}
            />
          </FilterCard>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="TOTAL AJUAN"
              value={kpiGlobal?.total_ajuan?.toLocaleString('id-ID') || '0'}
              icon="ri-file-list-3-line"
              iconBg="#fdf2f2"
              iconColor="text-primary"
            />
            <StatCard 
              title="RATA-RATA DURASI"
              value={
                <>
                  <span className="text-4xl font-bold font-manrope text-text-primary leading-none">{kpiGlobal?.rata_rata_durasi || '0'}</span>
                  <span className="text-xs font-semibold text-text-secondary pb-0.5">menit</span>
                </>
              }
              icon="ri-time-line"
              iconBg="#eff6ff"
              iconColor="text-blue-500"
            />
            <StatCard 
              title="TINGKAT SELESAI"
              value={`${kpiGlobal?.tingkat_selesai || 0}%`}
              icon="ri-checkbox-circle-line"
              iconBg="#ecfdf5"
              iconColor="text-emerald-500"
            />
          </div>

          {/* Leaderboard Table Card */}
          <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isListLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            <div className="p-6 flex justify-between items-center border-b border-border">
              <h3 className="text-base font-bold text-text-primary">Peringkat Operator Berdasarkan Jumlah Ajuan</h3>
            </div>
            <div className="w-full min-h-[300px]">
              {rankingsData.length > 0 ? (
                <Table 
                  columns={leaderboardColumns} 
                  data={rankingsData} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-text-secondary py-12">
                  Tidak ada data peringkat ditemukan
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border">
              <Pagination
                currentPage={listCurrentPage}
                totalPages={listTotalPages}
                totalItems={listTotalItems}
                itemsPerPage={listPerPage}
                onPageChange={setListCurrentPage}
              />
            </div>
          </div>
        </>
      ) : (
        // ================= DETAIL VIEW =================
        <>
          {/* Back Navigation Button */}
          <div className="flex items-center gap-3 select-none">
            <button
              onClick={() => setSelectedOperator(null)}
              className="w-9 h-9 rounded-full border border-neutral flex items-center justify-center bg-surface text-text-secondary hover:bg-background active:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </button>
            <h2 className="text-base font-bold text-text-primary">Detail Peringkat Operator</h2>
          </div>

          {/* Main Detail Panel */}
          <div className={`card shadow-sm border border-border flex flex-col p-6 gap-6 transition-opacity duration-300 ${isDetailLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            {/* Header: Profile Card */}
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-text-secondary">
                  <i className="ri-user-3-line text-2xl"></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-text-primary">{operatorKpi?.nama || selectedOperator.operator}</span>
                    <span className="bg-[#800000] text-white flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <i className="ri-trophy-fill text-[10px]"></i> #{selectedOperator.peringkat}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-text-secondary mt-0.5">
                    {selectedOperator.desa} - {selectedOperator.kecamatan.replace('KEC : ', 'Kec. ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: operator metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="TOTAL AJUAN"
                value={operatorKpi?.total_ajuan?.toLocaleString('id-ID') || '0'}
              />
              <StatCard 
                title="TOTAL SELESAI"
                value={operatorKpi?.total_selesai?.toLocaleString('id-ID') || '0'}
              />
              <StatCard 
                title="TINGKAT SELESAI"
                value={`${operatorKpi?.tingkat_selesai || 0}%`}
              />
            </div>

            {/* Monthly Service Bar Chart */}
            <div className="border border-border rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-text-primary tracking-wide uppercase">Chart Jumlah Layanan per Bulan</h4>
              </div>
              <div className="w-full h-[280px]">
                {mounted && (
                  <Chart options={barOptions} series={barSeries} type="bar" width="100%" height={260} />
                )}
              </div>
              {/* Custom Legend */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                <span className="text-[10px] font-bold text-text-secondary">{currentYear}</span>
              </div>
            </div>

            {/* Service History Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-text-primary">Daftar Riwayat Layanan</h4>
              
              <Tabs tabs={detailTabs} activeTab={activeTab} onChange={(val) => {
                setActiveTab(val);
                setDetailCurrentPage(1);
              }} className="mb-2" />

              <div className="w-full border border-border rounded-xl overflow-hidden min-h-[200px]">
                {historyData.length > 0 ? (
                  <Table 
                    columns={historyColumns} 
                    data={historyData} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-text-secondary py-10">
                    Tidak ada riwayat ditemukan
                  </div>
                )}
              </div>

              <div className="mt-2">
                <Pagination
                  currentPage={detailCurrentPage}
                  totalPages={detailTotalPages}
                  totalItems={detailTotalItems}
                  itemsPerPage={detailPerPage}
                  onPageChange={setDetailCurrentPage}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}