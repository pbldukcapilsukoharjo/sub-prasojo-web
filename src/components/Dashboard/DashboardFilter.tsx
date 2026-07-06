'use client';

import React, { useState, useEffect } from 'react';
import FilterCard from '@/components/Common/FilterCard';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import CustomDateRangePicker from '@/components/Forms/CustomDateRangePicker';
import { DashboardFilterParams } from '@/services/dashboard.service';
import { useLayananOptions, useKecamatanOptions } from '@/hooks/useFilterOptions';

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

  const { data: layananOptions = [] } = useLayananOptions({ addAllOption: true, allOptionLabel: 'Semua Jenis Layanan' });
  const { data: kecamatanOptions = [] } = useKecamatanOptions({ addAllOption: true, allOptionLabel: 'Seluruh Kecamatan' });

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
      const formatToDDMMYYYY = (dateStr: string) => {
        if (!dateStr) return undefined;
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const parts = dateStr.split('-');
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      onFilterChange({
        id_layanan: jenisLayanan !== 'all' ? Number(jenisLayanan) : undefined,
        id_kecamatan: kecamatan !== 'all' ? Number(kecamatan) : undefined,
        periode_bulan: periode ? Number(periode) : undefined,
        start_date: formatToDDMMYYYY(startDate),
        end_date: formatToDDMMYYYY(endDate),
      });
    }
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
