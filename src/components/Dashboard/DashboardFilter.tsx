'use client';

import React, { useState, useEffect } from 'react';
import FilterCard from '@/components/Common/FilterCard';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import { DashboardFilterParams } from '@/services/dashboard.service';

interface DashboardFilterProps {
  onFilterChange?: (filters: DashboardFilterParams) => void;
}

export default function DashboardFilter({ onFilterChange }: DashboardFilterProps) {
  const [jenisLayanan, setJenisLayanan] = useState<string | number>('all');
  const [kecamatan, setKecamatan] = useState<string | number>('all');
  const [periode, setPeriode] = useState<string | number>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  // Trigger default filter on initial mount
  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setJenisLayanan('all');
    setKecamatan('all');
    setPeriode('');
    setStartDate('');
    setEndDate('');
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const handleFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        serviceType: jenisLayanan !== 'all' ? String(jenisLayanan) : undefined,
        district: kecamatan !== 'all' ? String(kecamatan) : undefined,
        period: periode ? String(periode) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    }
  };

  return (
    <FilterCard onReset={handleReset} onApply={handleFilter}>
      <CustomSelect
        label="Jenis Layanan"
        value={jenisLayanan}
        onChange={setJenisLayanan}
        options={[
          { label: 'Semua Jenis Layanan', value: 'all' },
          { label: 'Kartu Keluarga', value: 'kk' },
          { label: 'KTP-el', value: 'ktp' },
          { label: 'KIA', value: 'kia' },
          { label: 'Akta Kelahiran', value: 'akta_kelahiran' },
          { label: 'Akta Kematian', value: 'akta_kematian' },
          { label: 'Perpindahan', value: 'perpindahan' },
          { label: 'Surket KTP', value: 'surket' },
        ]}
      />
      <CustomSelect
        label="Kecamatan"
        value={kecamatan}
        onChange={setKecamatan}
        options={[{ label: 'Seluruh Kecamatan', value: 'all' }]}
      />
      <CustomSelect
        label="Periode"
        value={periode}
        onChange={setPeriode}
        disabled={isPeriodeDisabled}
        placeholder="Pilih Periode"
        options={[
          { label: 'Bulan Ini', value: 'this_month' },
          { label: 'Bulan Lalu', value: 'last_month' },
          { label: 'Tahun Ini', value: 'this_year' },
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
