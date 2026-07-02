'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import Button from '@/components/Common/Button';
import FilterCard from '@/components/Common/FilterCard';
import Table from '@/components/Common/Table';
import StatCard from '@/components/Common/StatCard';
import Pagination from '@/components/Common/Pagination';
import { wilayahService, DistribusiWilayahData, DistribusiWilayahParams } from '@/services/wilayah.service';
import { handleApiError } from '@/lib/api-error';

export default function DistribusiWilayahPage() {
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [data, setData] = useState<DistribusiWilayahData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: DistribusiWilayahParams = {
        page: currentPage,
        search: search || undefined,
        id_kecamatan: kecamatan !== 'all' ? Number(kecamatan) : undefined,
        sort_by: sortBy,
        periode_bulan: periode ? Number(periode) : undefined,
        start_date: formatToDDMMYYYY(startDate),
        end_date: formatToDDMMYYYY(endDate),
      };

      const res = await wilayahService.getDistribusiWilayah(params);
      if (res.status && res.data) {
        setData(res.data);
        if (res.data.daftar_ajuan?.meta) {
          setTotalItems(res.data.daftar_ajuan.meta.total);
          setTotalPages(res.data.daftar_ajuan.meta.total_page);
          setPerPage(res.data.daftar_ajuan.meta.per_page);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);

    setTimeout(() => {
      fetchData();
    }, 0);
  };

  const handleFilter = () => {
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
  };

  const mappedData = data?.daftar_ajuan?.list?.map((item) => ({
    desa: item.desa,
    kecamatan: item.kecamatan,
    totalAjuan: item.total_ajuan,
    ktpel: item['ktp-el'],
    kia: item.kia,
    aktaKelahiran: item.akta_kelahiran,
    aktaKematian: item.akta_kematian,
    perpindahan: item.perpindahan,
    kedatangan: item.kedatangan,
    updateData: item.update_data,
    rekamJemputBola: item.rekam_jemput_bola,
  })) || [];

  const columns = [
    { key: 'no', header: 'No', align: 'center' as const, render: (row: any, idx: number) => <span className="font-medium text-text-primary">{String((currentPage - 1) * perPage + idx + 1).padStart(2, '0')}</span> },
    { key: 'desaKec', header: 'Desa/Kecamatan', render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-bold text-text-primary text-xs">{row.desa}</span>
        <span className="text-[10px] font-semibold text-text-secondary">{row.kecamatan}</span>
      </div>
    ) },
    { key: 'totalAjuan', header: 'Total Ajuan', align: 'center' as const, render: (row: any) => <span className="font-bold text-text-primary text-xs">{row.totalAjuan}</span> },
    { key: 'ktpel', header: 'KTP-el', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.ktpel}</span> },
    { key: 'kia', header: 'KIA', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.kia}</span> },
    { key: 'aktaKelahiran', header: 'Akta Kelahiran', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.aktaKelahiran}</span> },
    { key: 'aktaKematian', header: 'Akta Kematian', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.aktaKematian}</span> },
    { key: 'perpindahan', header: 'Perpindahan', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.perpindahan}</span> },
    { key: 'kedatangan', header: 'Kedatangan', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.kedatangan}</span> },
    { key: 'updateData', header: 'Update Data', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.updateData}</span> },
    { key: 'rekamJemputBola', header: 'Rekam Jemput Bola', align: 'center' as const, render: (row: any) => <span className="text-text-primary font-medium text-xs">{row.rekamJemputBola}</span> }
  ];

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
      </FilterCard>

      {/* 2. Metric Cards (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="TOTAL KECAMATAN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{data?.total_kecamatan || 0}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">Kecamatan</span>
            </>
          }
        />
        <StatCard 
          title="TOTAL AJUAN DOKUMEN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{data?.total_ajuan_dokumen?.toLocaleString('id-ID') || 0}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">Dokumen</span>
            </>
          }
        />
        <StatCard 
          title="RATA-RATA AJUAN"
          value={
            <>
              <span className="text-4xl font-bold font-manrope text-text-primary">{data?.rata_rata_ajuan || 0}</span>
              <span className="text-sm font-semibold text-text-secondary mb-1 ml-1">per Wilayah</span>
            </>
          }
        />
      </div>

      {/* 3. Data Table (Bottom) */}
      <div className={`card shadow-sm border border-border flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 flex justify-between items-center border-b border-border">
          <h3 className="text-base font-bold text-text-primary">Daftar Ajuan per Desa/Kecamatan</h3>
          <Button variant="primary" className="flex items-center justify-center gap-2 text-xs px-4 py-2 h-9">
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
          />
        </div>
      </div>
    </div>
  );
}