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

const DetailProdukModal = dynamic(() => import('@/components/Common/DetailProdukModal'), { ssr: false });
import { useKecamatanOptions, useLayananOptions } from '@/hooks/useFilterOptions';
import { pengajuanService, ProdukItem, PengajuanProdukParams } from '@/services/pengajuan.service';
import { handleApiError } from '@/lib/api-error';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

export default function Produk() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [namaIdentitas, setNamaIdentitas] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState<string | number>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    namaIdentitas: '',
    kecamatan: 'all',
    periode: '' as string | number,
    startDate: '',
    endDate: '',
    sortBy: 'newest'
  });

  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });
  const { data: layananOptions = [] } = useLayananOptions();

  useEffect(() => {
    if (layananOptions.length > 0 && !activeTab) {
      setActiveTab(String(layananOptions[0].value));
    }
  }, [layananOptions, activeTab]);

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

  const params: PengajuanProdukParams = {
    search: appliedFilters.search || undefined,
    kecamatan: appliedFilters.kecamatan !== 'all' ? appliedFilters.kecamatan : undefined,
    nama_identitas_produk: appliedFilters.namaIdentitas || undefined,
    start_date: formatToDDMMYYYY(appliedFilters.startDate),
    end_date: formatToDDMMYYYY(appliedFilters.endDate),
    periode: appliedFilters.periode ? Number(appliedFilters.periode) : undefined,
    layanan: activeTab || undefined,
    sort: appliedFilters.sortBy,
    page: currentPage,
    per_page: perPage,
  };

  const queryClient = useQueryClient();

  const handlePageHover = (page: number) => {
    if (!activeTab) return;
    queryClient.prefetchQuery({
      queryKey: ['produk', { ...params, page }],
      queryFn: () => pengajuanService.getProduk({ ...params, page }),
    });
  };

  const { data: produkRes, isLoading: isQueryLoading, isFetching } = useQuery({
    queryKey: ['produk', params],
    queryFn: () => pengajuanService.getProduk(params),
    placeholderData: keepPreviousData,
    enabled: !!activeTab,
  });

  const data = produkRes?.data || [];
  const totalItems = produkRes?.meta?.total || 0;
  const totalPages = produkRes?.meta?.total_page || 1;
  const isLoading = isQueryLoading;

  const handleReset = useCallback(() => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setNamaIdentitas('');
    setAppliedFilters({
      search: '',
      namaIdentitas: '',
      kecamatan: 'all',
      periode: '' as string | number,
      startDate: '',
      endDate: '',
      sortBy: 'newest'
    });
    setCurrentPage(1);
  }, []);

  const handleFilter = useCallback(() => {
    setAppliedFilters({
      search,
      namaIdentitas,
      kecamatan,
      periode,
      startDate,
      endDate,
      sortBy
    });
    setCurrentPage(1);
  }, [search, namaIdentitas, kecamatan, periode, startDate, endDate, sortBy]);

  const tabs = useMemo(() => layananOptions.map((option: any) => ({
    id: String(option.value),
    label: String(option.label).toUpperCase()
  })), [layananOptions]);

  const activeTabLabel = useMemo(() => {
    const option = layananOptions.find((opt: any) => String(opt.value) === activeTab);
    return option ? String(option.label).toUpperCase() : '';
  }, [layananOptions, activeTab]);

  const dynamicNomorHeader = useMemo(() => {
    if (!activeTabLabel) return 'NOMOR (KK, KTP-EL, KIA, DLL)';
    return `NOMOR ${activeTabLabel}`;
  }, [activeTabLabel]);

  const tableColumns = useMemo(() => [
    { key: 'no', header: 'No' },
    { key: 'noRegis', header: 'NO. REG' },
    { key: 'kodeAjuan', header: 'KODE AJUAN' },
    { key: 'nomor', header: dynamicNomorHeader },
    { key: 'namaIdentitas', header: 'NAMA IDENTITAS PRODUK' },
    { 
      key: 'status', 
      header: 'STATUS',
      render: (row: any) => (
        <Badge variant="purple" className="whitespace-nowrap">
          {row.status}
        </Badge>
      )
    },
    { 
      key: 'tanggal', 
      header: 'TANGGAL',
      render: (row: any) => (
        <div className="flex flex-col items-center">
          <span>{row.tanggal}</span>
          <span className="text-[10px] text-text-secondary font-bold">{row.waktu}</span>
        </div>
      )
    },
    { key: 'kecamatan', header: 'KECAMATAN' },
  ], [dynamicNomorHeader]);

  const mappedData = useMemo(() => data.map((ajuan, index) => {
    let tanggal = '-';
    let waktu = '-';
    if (ajuan.created_at) {
       const dateStr = ajuan.created_at.includes(' ') 
         ? ajuan.created_at.replace(' ', 'T') 
         : ajuan.created_at;
       const dateObj = new Date(dateStr);
       tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
       waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    }

    return {
      id: ajuan.id,
      no: String((currentPage - 1) * perPage + index + 1).padStart(2, '0'),
      noRegis: ajuan.no_reg || '-',
      kodeAjuan: ajuan.layanan || '-',
      nomor: ajuan.nomor || '-',
      namaIdentitas: ajuan.nama_identitas_produk || '-',
      kecamatan: ajuan.kecamatan || '-',
      tanggal,
      waktu,
      status: ajuan.status || 'SELESAI',
      originalData: ajuan,
    };
  }), [data, currentPage, perPage]);

  const handleRowClick = (row: any) => {
    setSelectedData({
      id: row.id,
      noRegis: row.noRegis,
      namaLengkap: row.namaIdentitas,
      nik: '-', // Not available in produk response currently
      jenisLayanan: row.kodeAjuan,
      kecamatan: row.kecamatan,
      status: row.status,
      tanggal: row.tanggal,
      waktu: row.waktu,
    });
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      await pengajuanService.exportPengajuan('produk');
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
          placeholder="No. Reg/Layanan"
          icon="ri-search-line"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          label="Nama Identitas Produk"
          placeholder="Nama Terkait"
          icon="ri-user-line"
          value={namaIdentitas}
          onChange={(e) => setNamaIdentitas(e.target.value)}
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
          <h3 className="text-lg font-bold text-text-primary">Tabel Produk</h3>
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

      {isModalOpen && <DetailProdukModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedData} />}
    </div>
  );
}
