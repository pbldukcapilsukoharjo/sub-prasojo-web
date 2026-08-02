'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useKecamatanOptions, useLayananOptions, useOperatorOptions } from '@/hooks/useFilterOptions';
import { operatorService, KpiGlobalData, OperatorItem, OperatorKpiData, RiwayatItem } from '@/services/operator.service';
import { handleApiError } from '@/lib/api-error';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

// Dynamically import ApexCharts to avoid SSR hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PeringkatOperatorPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorItem | null>(null);

  // Listing page filter states
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState<string | number>('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    kecamatan: 'all',
    periode: '' as string | number,
    sortBy: 'newest',
    startDate: '',
    endDate: '',
    operatorFilter: 'all',
  });

  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });
  const { data: layananOptions = [] } = useLayananOptions({ addAllOption: true, allOptionLabel: 'SEMUA', allOptionValue: 'semua' });
  const { data: operatorOptions = [] } = useOperatorOptions({ addAllOption: true, allOptionLabel: 'Semua Operator' });

  // List View Data States
  const [listCurrentPage, setListCurrentPage] = useState(1);
  const listPerPage = 10;

  const [activeTab, setActiveTab] = useState('semua');
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const detailPerPage = 5;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // --- List View Queries ---
  const listParams = {
    search: appliedFilters.search || undefined,
    id_kecamatan: appliedFilters.kecamatan !== 'all' ? appliedFilters.kecamatan : undefined,
    periode_bulan: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    sort: appliedFilters.sortBy,
    start_date: formatToDDMMYYYY(appliedFilters.startDate),
    end_date: formatToDDMMYYYY(appliedFilters.endDate),
    id_operator: appliedFilters.operatorFilter !== 'all' ? Number(appliedFilters.operatorFilter) : undefined,
  };

  const queryClient = useQueryClient();

  const handleListPageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ['peringkatOperatorList', { ...listParams, page, limit: listPerPage }],
      queryFn: () => operatorService.getPeringkatOperator({ ...listParams, page, limit: listPerPage })
    });
  };

  const { data: kpiGlobalRes, isLoading: isKpiGlobalLoading } = useQuery({
    queryKey: ['kpiGlobal', listParams],
    queryFn: () => operatorService.getKpiGlobal({
      id_kecamatan: listParams.id_kecamatan,
      periode_bulan: listParams.periode_bulan,
      start_date: listParams.start_date,
      end_date: listParams.end_date,
      id_operator: listParams.id_operator
    }),
    enabled: !selectedOperator,
    placeholderData: keepPreviousData,
  });

  const { data: listRes, isLoading: isListQueryLoading, isFetching: isListFetching } = useQuery({
    queryKey: ['peringkatOperatorList', { ...listParams, page: listCurrentPage, limit: listPerPage }],
    queryFn: () => operatorService.getPeringkatOperator({
      ...listParams,
      page: listCurrentPage,
      limit: listPerPage
    }),
    enabled: !selectedOperator,
    placeholderData: keepPreviousData,
  });

  const kpiGlobal = kpiGlobalRes?.data || null;
  const rankingsData = listRes?.data?.list || [];
  const listTotalItems = listRes?.data?.meta?.total || 0;
  const listTotalPages = listRes?.data?.meta?.total_page || 1;
  const isListLoading = isListQueryLoading || isKpiGlobalLoading;

  // --- Detail View Queries ---
  let id_layanan: string | undefined = undefined;
  if (activeTab !== 'semua') {
    id_layanan = activeTab;
  }

  const handleDetailPageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ['operatorRiwayat', selectedOperator?.id, currentYear, periode, id_layanan, page, detailPerPage],
      queryFn: () => operatorService.getOperatorRiwayat(selectedOperator!.id, {
        tahun: currentYear,
        periode_bulan: periode ? Number(periode) : undefined,
        id_layanan: id_layanan,
        page,
        limit: detailPerPage,
      }),
    });
  };

  const { data: kpiRes, isLoading: isDetailKpiLoading } = useQuery({
    queryKey: ['operatorKpi', selectedOperator?.id, currentYear, periode, id_layanan],
    queryFn: () => operatorService.getOperatorKpi(selectedOperator!.id, {
      tahun: currentYear,
      periode_bulan: periode ? Number(periode) : undefined,
      id_layanan: id_layanan,
    }),
    enabled: !!selectedOperator,
    placeholderData: keepPreviousData,
  });

  const { data: riwayatRes, isLoading: isDetailRiwayatLoading, isFetching: isDetailRiwayatFetching } = useQuery({
    queryKey: ['operatorRiwayat', selectedOperator?.id, currentYear, periode, id_layanan, detailCurrentPage, detailPerPage],
    queryFn: () => operatorService.getOperatorRiwayat(selectedOperator!.id, {
      tahun: currentYear,
      periode_bulan: periode ? Number(periode) : undefined,
      id_layanan: id_layanan,
      page: detailCurrentPage,
      limit: detailPerPage,
    }),
    enabled: !!selectedOperator,
    placeholderData: keepPreviousData,
  });

  const operatorKpi = kpiRes?.data || null;
  const riwayatData = riwayatRes?.data?.list || [];
  const detailTotalItems = riwayatRes?.data?.meta?.total || 0;
  const detailTotalPages = riwayatRes?.data?.meta?.total_page || 1;
  const isDetailLoading = isDetailKpiLoading || isDetailRiwayatLoading;

  const handleReset = useCallback(() => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setOperatorFilter('all');
    setAppliedFilters({
      search: '',
      kecamatan: 'all',
      periode: '' as string | number,
      sortBy: 'newest',
      startDate: '',
      endDate: '',
      operatorFilter: 'all'
    });
    setListCurrentPage(1);
  }, []);

  const handleFilter = useCallback(() => {
    setAppliedFilters({
      search,
      kecamatan,
      periode,
      sortBy,
      startDate,
      endDate,
      operatorFilter
    });
    setListCurrentPage(1);
  }, [search, kecamatan, periode, sortBy, startDate, endDate, operatorFilter]);

  const handleExport = useCallback(async () => {
    try {
      const exportParams = {
        search: appliedFilters.search || undefined,
        id_kecamatan: appliedFilters.kecamatan !== 'all' ? appliedFilters.kecamatan : undefined,
        periode_bulan: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
        sort: appliedFilters.sortBy,
        start_date: formatToDDMMYYYY(appliedFilters.startDate),
        end_date: formatToDDMMYYYY(appliedFilters.endDate),
        id_operator: appliedFilters.operatorFilter !== 'all' ? Number(appliedFilters.operatorFilter) : undefined,
      };
      await operatorService.getExportPeringkat(exportParams);
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Berhasil memulai export data');
      });
    } catch (error) {
      handleApiError(error);
    }
  }, [search, kecamatan, periode, sortBy, startDate, endDate, operatorFilter]);

  const leaderboardColumns = useMemo(() => [
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
  ], []);

  // Map detail chart data
  const monthKeys = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const chartDataValues = useMemo(() => {
    let values = new Array(12).fill(0);
    if (operatorKpi?.layanan_perbulan) {
      values = monthKeys.map(m => operatorKpi.layanan_perbulan[m] || 0);
    }
    return values;
  }, [operatorKpi]);

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
    colors: ['var(--color-primary)'],
    fill: {
      type: 'solid',
      opacity: 1,
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

  const detailTabs = useMemo(() => layananOptions.map((option: any) => ({
    id: String(option.value),
    label: String(option.label).toUpperCase()
  })), [layananOptions]);

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
              options={kecamatanOptions}
            />
            <CustomSelect
              label="Periode"
              value={periode}
              onChange={(val) => setPeriode(val)}
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
          </FilterCard>

          {/* Metric Summary Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isListLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            <StatCard 
              title="TOTAL AJUAN"
              value={<span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary">{kpiGlobal?.total_ajuan?.toLocaleString('id-ID') || '0'}</span>}
              icon="ri-file-list-3-line"
              iconBg="#fdf2f2"
              iconColor="text-primary"
              subtitle="Keseluruhan dokumen"
              className="hover:border-primary/20 hover:shadow-md transition-all duration-300"
            />
            <StatCard 
              title="RATA-RATA DURASI"
              value={
                <>
                  <span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary leading-none">{kpiGlobal?.rata_rata_durasi || '0'}</span>
                  <span className="text-xs font-semibold text-text-secondary pb-0.5">menit</span>
                </>
              }
              icon="ri-time-line"
              iconBg="#eff6ff"
              iconColor="text-blue-500"
              subtitle="Waktu pelayanan"
              className="hover:border-blue-200 hover:shadow-md transition-all duration-300"
            />
            <StatCard 
              title="TINGKAT SELESAI"
              value={<span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary">{`${kpiGlobal?.tingkat_selesai || 0}%`}</span>}
              icon="ri-checkbox-circle-line"
              iconBg="#ecfdf5"
              iconColor="text-emerald-500"
              subtitle="Rasio penyelesaian"
              className="hover:border-emerald-200 hover:shadow-md transition-all duration-300"
            />
          </div>

          {/* Leaderboard Table Card */}
          <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isListLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            <div className="p-6 flex justify-between items-center border-b border-border">
              <h3 className="text-base font-bold text-text-primary">Peringkat Operator Berdasarkan Jumlah Ajuan</h3>
              <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm" onClick={handleExport} disabled={isListLoading}>
                EXPORT EXCEL
              </Button>
            </div>
            <div className="w-full min-h-[300px]">
              {isListLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-sm py-12">
                  <i className="ri-loader-4-line text-3xl animate-spin mb-3 text-primary"></i>
                  <span className="font-bold text-text-secondary animate-pulse">Sedang memuat data...</span>
                </div>
              ) : rankingsData.length > 0 ? (
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
                onPageHover={handleListPageHover}
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
              className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
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
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <i className="ri-user-3-line text-2xl"></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-text-primary">{operatorKpi?.nama || selectedOperator.operator}</span>
                    <span className="bg-primary text-white flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
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
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${isDetailLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
              <StatCard 
                title="TOTAL AJUAN"
                value={<span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary">{operatorKpi?.total_ajuan?.toLocaleString('id-ID') || '0'}</span>}
                icon="ri-file-list-3-line"
                iconBg="#fdf2f2"
                iconColor="text-primary"
                subtitle="Ajuan operator"
                className="hover:border-primary/20 hover:shadow-md transition-all duration-300"
              />
              <StatCard 
                title="TOTAL SELESAI"
                value={<span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary">{operatorKpi?.total_selesai?.toLocaleString('id-ID') || '0'}</span>}
                icon="ri-check-double-line"
                iconBg="#eff6ff"
                iconColor="text-blue-500"
                subtitle="Dokumen selesai"
                className="hover:border-blue-200 hover:shadow-md transition-all duration-300"
              />
              <StatCard 
                title="TINGKAT SELESAI"
                value={<span className="text-2xl lg:text-3xl font-bold font-manrope text-text-primary">{`${operatorKpi?.tingkat_selesai || 0}%`}</span>}
                icon="ri-checkbox-circle-line"
                iconBg="#ecfdf5"
                iconColor="text-emerald-500"
                subtitle="Persentase selesai"
                className="hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              />
            </div>

            {/* Monthly Service Bar Chart */}
            <div className="border border-border rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-text-primary tracking-wide uppercase">Chart Jumlah Layanan per Bulan</h4>
              </div>
              <div className="w-full h-[280px]">
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-sm">
                    <i className="ri-loader-4-line text-3xl animate-spin mb-3 text-primary"></i>
                    <span className="font-bold text-text-secondary animate-pulse">Memuat Grafik...</span>
                  </div>
                ) : mounted && (
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
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-sm py-10">
                    <i className="ri-loader-4-line text-3xl animate-spin mb-3 text-primary"></i>
                    <span className="font-bold text-text-secondary animate-pulse">Sedang memuat data...</span>
                  </div>
                ) : riwayatData.length > 0 ? (
                  <Table 
                    columns={historyColumns} 
                    data={riwayatData} 
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
                  onPageHover={handleDetailPageHover}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}