'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';
import Badge from '@/components/Common/Badge';
import Pagination from '@/components/Common/Pagination';
import { slaService, SlaData, SlaKpiData, SlaParams, SlaKpiParams } from '@/services/sla.service';
import { handleApiError } from '@/lib/api-error';
import { useLayananOptions, useKecamatanOptions } from '@/hooks/useFilterOptions';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

export default function SlaMonitoringPage() {
  const [search, setSearch] = useState('');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Custom API states
  const [kecamatan, setKecamatan] = useState('all');
  const [layanan, setLayanan] = useState('all');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    periode: '',
    sortBy: 'newest',
    startDate: '',
    endDate: '',
    kecamatan: 'all',
    layanan: 'all',
  });

  const { data: layananOptions = [] } = useLayananOptions({ addAllOption: true, allOptionLabel: 'Semua Layanan' });
  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Semua Kecamatan' });

  const [currentPage, setCurrentPage] = useState(1);

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

  const formattedStartDate = formatToDDMMYYYY(appliedFilters.startDate);
  const formattedEndDate = formatToDDMMYYYY(appliedFilters.endDate);

  const listParams: SlaParams = {
    page: currentPage,
    search: appliedFilters.search || undefined,
    id_kecamatan: appliedFilters.kecamatan !== 'all' ? Number(appliedFilters.kecamatan) : undefined,
    sort_by: appliedFilters.sortBy,
    id_layanan: appliedFilters.layanan !== 'all' ? String(appliedFilters.layanan) : undefined,
    periode_bulan: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
  };

  const kpiParams: SlaKpiParams = {
    id_kecamatan: appliedFilters.kecamatan !== 'all' ? Number(appliedFilters.kecamatan) : undefined,
    id_layanan: appliedFilters.layanan !== 'all' ? String(appliedFilters.layanan) : undefined,
    periode_bulan: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
  };

  const queryClient = useQueryClient();

  const handlePageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ['slaList', { ...listParams, page }],
      queryFn: () => slaService.getSla({ ...listParams, page }),
    });
  };

  const { data: kpiRes, isLoading: isKpiLoading } = useQuery({
    queryKey: ['slaKpi', kpiParams],
    queryFn: () => slaService.getSlaKpi(kpiParams),
    placeholderData: keepPreviousData,
  });

  const { data: listRes, isLoading: isListLoading, isFetching: isListFetching } = useQuery({
    queryKey: ['slaList', listParams],
    queryFn: () => slaService.getSla(listParams),
    placeholderData: keepPreviousData,
  });

  const kpiData = kpiRes?.data || null;
  const listData = listRes?.data || null;
  const totalItems = listData?.daftar_rincian?.meta?.total || 0;
  const totalPages = listData?.daftar_rincian?.meta?.total_page || 1;
  const isLoading = isKpiLoading || isListLoading;
  const perPage = listData?.daftar_rincian?.meta?.per_page || 10;

  const handleReset = useCallback(() => {
    setSearch('');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setKecamatan('all');
    setLayanan('all');
    setAppliedFilters({
      search: '',
      periode: '',
      sortBy: 'newest',
      startDate: '',
      endDate: '',
      kecamatan: 'all',
      layanan: 'all',
    });
    setCurrentPage(1);
  }, []);

  const handleFilter = useCallback(() => {
    setAppliedFilters({
      search,
      periode,
      sortBy,
      startDate,
      endDate,
      kecamatan,
      layanan
    });
    setCurrentPage(1);
  }, [search, periode, sortBy, startDate, endDate, kecamatan, layanan]);

  const handleExport = useCallback(async () => {
    try {
      await slaService.exportSla();
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  // Determine SLA status dynamically based on target_sla
  const getStatus = (rata_rata_waktu: number, target: number) => {
    if (rata_rata_waktu < target) return 'ON TIME';
    if (rata_rata_waktu === target) return 'WARNING';
    return 'OVER SLA';
  };

  const mappedData = useMemo(() => listData?.daftar_rincian?.list?.map((item, idx) => {
    return {
      rank: String((currentPage - 1) * perPage + idx + 1).padStart(2, '0'),
      service: item.jenis_layanan,
      count: item.jumlah_ajuan,
      avgTime: `${item.rata_rata_waktu} jam`
    };
  }) || [], [listData, currentPage, perPage]);

  const columns = useMemo(() => [
    { key: 'rank', header: 'Peringkat', align: 'center' as const, render: (row: any) => <span className="font-medium text-text-primary">{row.rank}</span> },
    { key: 'service', header: 'Jenis Layanan', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-primary text-xs uppercase">{row.service}</span> },
    { key: 'count', header: 'Jumlah Ajuan', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.count}</span> },
    { key: 'avgTime', header: 'Rata Rata Waktu', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.avgTime}</span> }
  ], []);


  return (
    <div className="flex flex-col gap-6">
      {/* 1. Filters (Top) */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="Nama Layanan..."
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
          label="Layanan"
          value={layanan}
          onChange={(val) => setLayanan(String(val))}
          options={layananOptions}
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
      </FilterCard>

      {/* 2. Metric Cards (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="RATA - RATA WAKTU PROSES"
          value={
            <>
              <span className="text-3xl lg:text-4xl font-bold font-manrope text-text-primary leading-tight">
                {kpiData?.rata_rata_global_text || listData?.rata_rata_waktu_proses || '0'}
              </span>
              {typeof (kpiData?.rata_rata_global_text || listData?.rata_rata_waktu_proses) === 'number' && (
                <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">Jam</span>
              )}
            </>
          }
        />
        <StatCard 
          title="PENCAPAIAN SLA"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{kpiData?.capaian_sla_persen || listData?.pencapaian_sla || 0}%</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">(Persen)</span>
            </>
          }
        />
        <StatCard 
          title="TARGET SLA"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">&lt; {kpiData?.target_sla || listData?.target_sla || 0}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">jam</span>
            </>
          }
          subtitle={
            <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
              <i className="ri-time-line"></i>
              <span>Standar Layanan Nasional</span>
            </div>
          }
        />
      </div>

      {/* 3. Data Table (Bottom) */}
      <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h3 className="text-base font-bold text-text-primary">Daftar Rincian Per Jenis Layanan</h3>
          <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9" onClick={handleExport}>
            <i className="ri-upload-2-line"></i>
            EKSPOR EXCEL
          </Button>
        </div>
        <div className="w-full min-h-[300px]">
          {mappedData.length > 0 ? (
            <Table 
              columns={columns} 
              data={mappedData} 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-text-secondary py-12">
              Tidak ada data ditemukan
            </div>
          )}
        </div>
        <div className="p-6 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={perPage}
            onPageChange={setCurrentPage}
            onPageHover={handlePageHover}
          />
        </div>
      </div>
    </div>
  );
}