'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';
import Pagination from '@/components/Common/Pagination';
import { useKecamatanOptions } from '@/hooks/useFilterOptions';
import { wilayahService, DistribusiWilayahResponse, DistribusiWilayahParams } from '@/services/wilayah.service';
import { handleApiError } from '@/lib/api-error';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

export default function DistribusiWilayahPage() {
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState<string | number>('');
  const [sortBy, setSortBy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });

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

  const params: DistribusiWilayahParams = {
    page: currentPage,
    search: search || undefined,
    id_kecamatan: kecamatan !== 'all' ? Number(kecamatan) : undefined,
    sort_by: sortBy || undefined,
    periode_bulan: periode ? Number(periode) : undefined,
    start_date: formatToDDMMYYYY(startDate) || undefined,
    end_date: formatToDDMMYYYY(endDate) || undefined,
  };

  const queryClient = useQueryClient();

  const handlePageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ['wilayah', { ...params, page }],
      queryFn: () => wilayahService.getDistribusiWilayah({ ...params, page }),
    });
  };

  const { data: wilayahRes, isLoading: isQueryLoading, isFetching } = useQuery({
    queryKey: ['wilayah', params],
    queryFn: () => wilayahService.getDistribusiWilayah(params),
    placeholderData: keepPreviousData,
  });

  const data = wilayahRes || null;
  const totalItems = wilayahRes?.meta?.total || 0;
  const totalPages = wilayahRes?.meta?.total_page || 1;
  const perPage = wilayahRes?.meta?.per_page || 10;
  const isLoading = isQueryLoading;

  const handleReset = useCallback(() => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      await wilayahService.getExportDistribusiWilayah(params);
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Berhasil memulai export data');
      });
    } catch (error) {
      handleApiError(error);
    }
  }, [params]);

  const handleFilter = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const mappedData = useMemo(() => data?.data?.map((item) => ({
    kecamatan: item.nama_kecamatan,
    id_kecamatan: item.id_kecamatan,
    totalAjuan: item.total_ajuan,
    rataWaktu: item.rata_rata_waktu,
    rasioSelesai: item.rasio_selesai_persen,
  })) || [], [data]);

  const columns = useMemo(() => [
    { key: 'no', header: 'No', align: 'center' as const, render: (row: any, idx: number) => <span className="font-medium text-text-primary">{String((currentPage - 1) * perPage + idx + 1).padStart(2, '0')}</span> },
    { key: 'kecamatan', header: 'Kecamatan', render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-bold text-text-primary text-xs">{row.kecamatan}</span>
        <span className="text-[10px] font-semibold text-text-secondary">{row.id_kecamatan}</span>
      </div>
    ) },
    { key: 'totalAjuan', header: 'Total Ajuan', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-primary text-xs">{row.totalAjuan}</span> },
    { key: 'rataWaktu', header: 'Rata-Rata Waktu', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.rataWaktu}</span> },
    { key: 'rasioSelesai', header: 'Rasio Selesai', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.rasioSelesai}%</span> }
  ], [currentPage, perPage]);

  const pageTotalAjuan = mappedData.reduce((acc, curr) => acc + curr.totalAjuan, 0);
  const pageRataAjuan = mappedData.length > 0 ? (pageTotalAjuan / mappedData.length).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Filters (Top) */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="Nama Kecamatan/Desa"
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

      {/* 2. Metric Cards (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="TOTAL KECAMATAN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{totalItems}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">Kecamatan</span>
            </>
          }
        />
        <StatCard 
          title="TOTAL AJUAN (HALAMAN INI)"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{pageTotalAjuan.toLocaleString('id-ID')}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">Dokumen</span>
            </>
          }
        />
        <StatCard 
          title="RATA-RATA AJUAN (HALAMAN INI)"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{pageRataAjuan}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">per Wilayah</span>
            </>
          }
        />
      </div>

      {/* 3. Data Table (Bottom) */}
      <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h3 className="text-base font-bold text-text-primary">Daftar Ajuan per Wilayah/Kecamatan</h3>
          <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9" onClick={handleExport} disabled={isLoading}>
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