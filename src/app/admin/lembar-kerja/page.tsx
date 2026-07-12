'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Tabs from '@/components/Common/Tabs';
import Table from '@/components/Common/Table';
import Badge from '@/components/Common/Badge';
import Pagination from '@/components/Common/Pagination';
import dynamic from 'next/dynamic';

const DetailModal = dynamic(() => import('@/components/Common/DetailModal'), { ssr: false });
import { usePelaporOptions, useKecamatanOptions } from '@/hooks/useFilterOptions';
import { pengajuanService, LembarKerjaItem, PengajuanLembarKerjaParams } from '@/services/pengajuan.service';
import { handleApiError } from '@/lib/api-error';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

export default function LembarKerja() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [pelapor, setPelapor] = useState('all');
  const [kecamatan, setKecamatan] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { data: pelaporOptions = [] } = usePelaporOptions({ addAllOption: true, allOptionLabel: 'Semua Pelapor' });
  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;
  const perPage = 10;

  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const params: PengajuanLembarKerjaParams = {
    search: search || undefined,
    kecamatan: kecamatan !== 'all' ? kecamatan : undefined,
    pelapor: pelapor !== 'all' ? pelapor : undefined,
    start_date: formatToDDMMYYYY(startDate),
    end_date: formatToDDMMYYYY(endDate),
    periode: periode ? Number(periode) : undefined,
    layanan: activeTab !== 'semua' ? activeTab : undefined,
    sort: sortBy,
    page: currentPage,
    per_page: perPage,
  };

  const queryClient = useQueryClient();

  const handlePageHover = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ['lembarKerja', { ...params, page }],
      queryFn: () => pengajuanService.getLembarKerja({ ...params, page }),
    });
  };

  const { data: lembarKerjaRes, isLoading: isQueryLoading, isFetching } = useQuery({
    queryKey: ['lembarKerja', params],
    queryFn: () => pengajuanService.getLembarKerja(params),
    placeholderData: keepPreviousData,
  });

  const data = lembarKerjaRes?.data || [];
  const totalItems = lembarKerjaRes?.meta?.total || 0;
  const totalPages = lembarKerjaRes?.meta?.total_page || 1;
  const isLoading = isQueryLoading;

  const handleReset = useCallback(() => {
    setSearch('');
    setPelapor('all');
    setKecamatan('all');
    setStartDate('');
    setEndDate('');
    setPeriode('');
    setSortBy('newest');
    setCurrentPage(1);
  }, []);

  const handleFilter = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const tabs = useMemo(() => [
    { id: 'semua', label: 'SEMUA' },
    { id: 'kk', label: 'KARTU KELUARGA' },
    { id: 'ktp', label: 'KTP-EL' },
    { id: 'kia', label: 'KIA' },
    { id: 'akta_kelahiran', label: 'AKTA KELAHIRAN' },
    { id: 'akta_kematian', label: 'AKTA KEMATIAN' },
    { id: 'perpindahan', label: 'PERPINDAHAN' },
    { id: 'surket', label: 'SURKET KTP' },
  ], []);

  const tableColumns = useMemo(() => [
    { key: 'no', header: 'No' },
    { key: 'noRegis', header: 'NO. REG' },
    { key: 'kodeAjuan', header: 'KODE AJUAN' },
    { key: 'kodeProduk', header: 'KODE PRODUK' },
    { key: 'jalur', header: 'JALUR ONLINE / OFFLINE' },
    { key: 'pelapor', header: 'PELAPOR' },
    { 
      key: 'status', 
      header: 'STATUS',
      render: (row: any) => (
        <Badge variant={row.status === 'BELUM DIVERIFIKASI' ? 'warning' : 'default'}>
          {row.status}
        </Badge>
      )
    },
    { 
      key: 'tanggal', 
      header: 'TANGGAL',
      render: (row: any) => (
        <div className="flex flex-col">
          <span>{row.tanggal}</span>
          <span className="text-[10px] text-text-secondary font-bold">{row.waktu}</span>
        </div>
      )
    },
    { key: 'kecamatan', header: 'KECAMATAN' },
  ], []);

  const mappedData = useMemo(() => data.map((ajuan, index) => {
    let tanggal = '-';
    let waktu = '-';
    if (ajuan.tanggal) {
       // Support cross-browser parsing for 'YYYY-MM-DD HH:mm:ss'
       const dateStr = ajuan.tanggal.includes(' ') 
         ? ajuan.tanggal.replace(' ', 'T') 
         : ajuan.tanggal;
       const dateObj = new Date(dateStr);
       tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
       waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    }

    return {
      id: ajuan.id,
      no: String((currentPage - 1) * perPage + index + 1).padStart(2, '0'),
      noRegis: ajuan.no_reg || '-',
      kodeAjuan: ajuan.kode_ajuan || '-',
      kodeProduk: ajuan.kode_produk || '-',
      layanan: ajuan.layanan || '-',
      jalur: ajuan.jalur || '-',
      pelapor: ajuan.pelapor || '-',
      nik: '-',
      kecamatan: ajuan.kecamatan || '-',
      tanggal,
      waktu,
      status: ajuan.status || 'BELUM DIVERIFIKASI',
      originalData: ajuan,
    };
  }), [data, currentPage, perPage]);

  const handleRowClick = (row: any) => {
    setSelectedData({
      id: row.id,
      noRegis: row.noRegis,
      namaLengkap: row.pelapor,
      nik: row.nik,
      jenisLayanan: row.layanan || row.kodeAjuan,
      kecamatan: row.kecamatan,
      status: row.status,
      tanggal: row.tanggal,
      waktu: row.waktu,
    });
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      await pengajuanService.exportPengajuan('lembar_kerja');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="No. Regis, NIK, dll"
          icon="ri-search-line"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          label="Pelapor"
          value={pelapor}
          onChange={(val) => setPelapor(String(val))}
          options={pelaporOptions}
        />
        <CustomSelect
          label="Kecamatan"
          value={kecamatan}
          onChange={(val) => setKecamatan(String(val))}
          options={kecamatanOptions}
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

      {/* Table Card */}
      <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Tabel Lembar Kerja</h3>
          <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm" onClick={handleExport}>
            EXPORT EXCEL
          </Button>
        </div>

        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="w-full mt-2 min-h-[300px]">
          {mappedData.length > 0 ? (
            <Table 
              columns={tableColumns} 
              data={mappedData} 
              onRowClick={handleRowClick}
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

      {isModalOpen && (
        <DetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedData}
        />
      )}
    </div>
  );
}
