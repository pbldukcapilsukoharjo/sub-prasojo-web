'use client';

import React, { useState } from 'react';
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
import DetailModal from '@/components/Common/DetailModal';
import AjuanCharts from '@/components/Dashboard/AjuanCharts';
import dummyDB from '../../../../dummy-data/database-dummy.json';
import ajuanData from '../../../../dummy-data/ajuan.json';

export default function Ajuan() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [pelapor, setPelapor] = useState('all');
  const [kecamatan, setKecamatan] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const handleReset = () => {
    setSearch('');
    setPelapor('all');
    setKecamatan('all');
    setStartDate('');
    setEndDate('');
    setPeriode('');
    setSortBy('newest');
    setFilterStatus('all');
  };

  const handleFilter = () => {
    console.log({ search, pelapor, kecamatan, startDate, endDate, periode, sortBy, filterStatus });
  };

  const tabs = [
    { id: 'semua', label: 'SEMUA' },
    { id: 'kk', label: 'KARTU KELUARGA' },
    { id: 'ktp', label: 'KTP-EL' },
    { id: 'kia', label: 'KIA' },
    { id: 'akta_kelahiran', label: 'AKTA KELAHIRAN' },
    { id: 'akta_kematian', label: 'AKTA KEMATIAN' },
    { id: 'perpindahan', label: 'PERPINDAHAN' },
    { id: 'surket', label: 'SURKET KTP' },
  ];

  const tableColumns = [
    { key: 'no', header: 'No' },
    { key: 'noRegis', header: 'NO.REGIS' },
    { key: 'kodeProduk', header: 'KODE PRODUK' },
    { key: 'kodeAjuan', header: 'KODE AJUAN' },
    { key: 'jalur', header: 'JALUR' },
    { key: 'pelapor', header: 'PELAPOR' },
    { key: 'kecamatan', header: 'KECAMATAN' },
    { 
      key: 'tanggal', 
      header: 'TANGGAL & WAKTU',
      render: (row: any) => (
        <div className="flex flex-col">
          <span>{row.tanggal}</span>
          <span className="text-[10px] text-gray-500 font-bold">{row.waktu}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'STATUS',
      render: (row: any) => {
        let variant: 'primary' | 'default' | 'success' | 'danger' = 'default';
        if (row.status === 'DIVERIFIKASI') variant = 'primary';
        else if (row.status === 'DIPROSES') variant = 'default';
        else if (row.status === 'DISETUJUI') variant = 'success';
        else if (row.status === 'DITOLAK') variant = 'danger';

        return (
          <Badge variant={variant as any}>
            {row.status}
          </Badge>
        );
      }
    },
  ];

  const filteredAjuan = ajuanData.ajuan.filter((ajuan) => {
    const validStatuses = ['DIVERIFIKASI', 'DIPROSES', 'DISETUJUI', 'DITOLAK'];
    if (!validStatuses.includes(ajuan.ajuan_status)) return false;

    if (filterStatus !== 'all' && ajuan.ajuan_status !== filterStatus) return false;

    // Tab filtering mapping
    if (activeTab !== 'semua') {
      const kode = ajuan.ajuan_layanan_kode.toLowerCase();
      if (activeTab === 'kk' && !kode.includes('kk')) return false;
      if (activeTab === 'ktp' && !kode.includes('kt')) return false;
      if (activeTab === 'kia' && !kode.includes('ki')) return false;
      if (activeTab === 'akta_kelahiran' && !kode.includes('ak')) return false;
      if (activeTab === 'akta_kematian' && !kode.includes('ka')) return false;
      if (activeTab === 'perpindahan' && !kode.includes('pd')) return false;
      if (activeTab === 'surket' && !kode.includes('sk')) return false;
    }

    return true;
  });

  const mappedData = filteredAjuan.map((ajuan, index) => {
    const pelapor = dummyDB.user.find((u) => u.id === ajuan.ajuan_pelapor_id);
    const dateObj = new Date(ajuan.ajuan_create_datetime);
    const tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    return {
      id: ajuan.ajuan_id,
      no: String(index + 1).padStart(2, '0'),
      noRegis: ajuan.ajuan_no_reg,
      kodeProduk: ajuan.ajuan_layanan_kode,
      kodeAjuan: ajuan.ajuan_layanan_kode + '-NEW',
      jalur: ajuan.ajuan_is_online ? 'Online' : 'Offline',
      pelapor: pelapor?.fullname || 'PADUKA',
      kecamatan: ajuan.ajuan_kecamatan_name,
      tanggal,
      waktu,
      status: ajuan.ajuan_status
    };
  });

  const handleRowClick = (row: any) => {
    const timeline = [
      { label: 'Ajuan Dibuat', date: row.tanggal, time: row.waktu.replace(' WIB', ''), status: 'completed', colorClass: 'gray' },
    ];
    if (row.status !== 'BELUM DIVERIFIKASI') {
      timeline.push({ label: 'Diverifikasi', date: row.tanggal, time: row.waktu.replace(' WIB', ''), status: 'completed', colorClass: 'blue' });
    }
    if (row.status === 'DISETUJUI' || row.status === 'SELESAI') {
      timeline.push({ label: 'Disetujui', date: row.tanggal, time: row.waktu.replace(' WIB', ''), status: 'completed', colorClass: 'green' });
    }
    if (row.status === 'DIPROSES' || row.status === 'DISETUJUI' || row.status === 'SELESAI') {
      timeline.push({ label: 'Diproses', date: row.tanggal, time: row.waktu.replace(' WIB', ''), status: 'completed', colorClass: 'gray' });
    }

    setSelectedData({
      noRegis: row.noRegis,
      namaLengkap: row.pelapor,
      nik: '33140202020202',
      jenisLayanan: row.kodeAjuan.replace('-NEW', ''),
      kecamatan: row.kecamatan,
      timeline,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <FilterCard onReset={handleReset} onApply={handleFilter}>
        <Input
          label="Pencarian Cepat"
          placeholder="No. Regis"
          icon="ri-search-line"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          label="Pelapor"
          value={pelapor}
          onChange={(val) => setPelapor(String(val))}
          options={[
            { label: 'Semua Pelapor', value: 'all' },
            { label: 'PADUKA', value: 'paduka' },
          ]}
        />
        <CustomSelect
          label="Kecamatan"
          value={kecamatan}
          onChange={(val) => setKecamatan(String(val))}
          options={[
            { label: 'Seluruh Kecamatan', value: 'all' },
            { label: 'Laweyan', value: 'laweyan' },
            { label: 'Banjarsari', value: 'banjarsari' },
            { label: 'Serengan', value: 'serengan' },
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
          label="Periode"
          value={periode}
          onChange={(val) => setPeriode(String(val))}
          disabled={isPeriodeDisabled}
          placeholder="Pilih Periode"
          options={[
            { label: 'Bulan Ini', value: 'this_month' },
            { label: 'Bulan Lalu', value: 'last_month' },
            { label: 'Tahun Ini', value: 'this_year' },
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
        <CustomSelect
          label="Status Ajuan"
          value={filterStatus}
          onChange={(val) => setFilterStatus(String(val))}
          options={[
            { label: 'Semua Status', value: 'all' },
            { label: 'Diverifikasi', value: 'DIVERIFIKASI' },
            { label: 'Diproses', value: 'DIPROSES' },
            { label: 'Disetujui', value: 'DISETUJUI' },
            { label: 'Ditolak', value: 'DITOLAK' },
          ]}
        />
      </FilterCard>

      <AjuanCharts />

      {/* Table Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tabel Ajuan</h3>
          <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm">
            EXPORT PDF
          </Button>
        </div>

        <div className="px-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="w-full mt-2">
          <Table 
            columns={tableColumns} 
            data={mappedData} 
            onRowClick={handleRowClick}
          />
        </div>

        <div className="p-6 border-t border-gray-100">
          <Pagination 
            currentPage={currentPage}
            totalPages={1}
            totalItems={mappedData.length}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <DetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
      />
    </div>
  );
}
