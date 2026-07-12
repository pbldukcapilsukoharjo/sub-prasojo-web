'use client';

import React, { useState, useEffect } from 'react';
import FilterCard from '@/components/Common/FilterCard';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import { DashboardFilterParams } from '@/services/dashboard.service';
import { useLayananOptions, useKecamatanOptions } from '@/hooks/useFilterOptions';

import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jenisLayanan, setJenisLayanan] = useState<string | number>(searchParams.get('id_layanan') || 'all');
  const [kecamatan, setKecamatan] = useState<string | number>(searchParams.get('id_kecamatan') || 'all');
  const [periode, setPeriode] = useState<string | number>(searchParams.get('periode_bulan') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const { data: layananOptions = [] } = useLayananOptions({ addAllOption: true, allOptionLabel: 'Semua Jenis Layanan' });
  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });

  const handleReset = () => {
    setJenisLayanan('all');
    setKecamatan('all');
    setPeriode('');
    setStartDate('');
    setEndDate('');
    
    router.push('/admin/dashboard');
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    const formatToDDMMYYYY = (dateStr: string) => {
      if (!dateStr) return undefined;
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };

    if (jenisLayanan !== 'all') params.set('id_layanan', String(jenisLayanan));
    if (kecamatan !== 'all') params.set('id_kecamatan', String(kecamatan));
    if (periode) params.set('periode_bulan', String(periode));
    
    const start = formatToDDMMYYYY(startDate);
    const end = formatToDDMMYYYY(endDate);
    if (start) params.set('start_date', start);
    if (end) params.set('end_date', end);

    router.push(`/admin/dashboard?${params.toString()}`);
  };

  return (
    <FilterCard onReset={handleReset} onApply={handleFilter}>
      <CustomSelect
        label="Jenis Layanan"
        value={jenisLayanan}
        onChange={setJenisLayanan}
        options={layananOptions}
      />
      <CustomSelect
        label="Kecamatan"
        value={kecamatan}
        onChange={setKecamatan}
        options={kecamatanOptions}
      />
      <CustomSelect
        label="Periode"
        value={periode}
        onChange={setPeriode}
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
  );
}
