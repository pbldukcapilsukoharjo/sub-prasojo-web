'use client';

import React, { useState, useEffect } from 'react';
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

// Dynamically import ApexCharts to avoid SSR hydration issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PeringkatOperatorPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);

  // Listing page filter states
  const [search, setSearch] = useState('');
  const [kecamatan, setKecamatan] = useState('all');
  const [periode, setPeriode] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('all');

  // Detail page states
  const [activeTab, setActiveTab] = useState('semua');
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const [listCurrentPage, setListCurrentPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;

  const handleReset = () => {
    setSearch('');
    setKecamatan('all');
    setPeriode('');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setOperatorFilter('all');
  };

  const handleFilter = () => {
    console.log({ search, kecamatan, periode, sortBy, startDate, endDate, operatorFilter });
  };

  // Mock table data for rankings list
  const rankingsData = [
    { rank: '01', name: 'Muhammad Reza', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '02', name: 'Eslam Samir', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '03', name: 'Mahendra Adi Kusuma', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
    { rank: '04', name: 'Tegar Bagus Saputra', desa: 'Gentan', kecamatan: 'KEC : BAKI', count: 124 },
  ];

  const leaderboardColumns = [
    { key: 'rank', header: 'Peringkat', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-400">{row.rank}</span> },
    { key: 'name', header: 'Nama Operator', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-900 text-xs">{row.name}</span> },
    { key: 'desaKec', header: 'Desa/Kecamatan', render: (row: any) => (
      <div className="flex flex-col items-center">
        <span className="font-bold text-gray-900 text-xs">{row.desa}</span>
        <span className="text-[10px] font-semibold text-gray-500">{row.kecamatan}</span>
      </div>
    ) },
    { key: 'count', header: 'Jumlah Ajuan', align: 'center' as const, render: (row: any) => <span className="text-gray-900 font-semibold text-xs">{row.count}</span> },
    { key: 'aksi', header: 'Aksi', align: 'center' as const, render: (row: any) => (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setSelectedOperator(row);
        }}
        className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-bold text-[10px] px-4 py-1.5 rounded-full cursor-pointer"
      >
        Detail
      </button>
    ) }
  ];

  // Mock monthly service data for detail chart
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
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
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          colors: '#9CA3AF',
        },
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: { left: 16, right: 16, top: 0, bottom: 0 },
    },
    colors: ['#800000'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.9,
        opacityTo: 0.75,
        stops: [0, 100],
      },
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
      data: [60, 20, 30, 22, 45, 10, 0, 0, 0, 0, 0, 0],
    },
  ];

  // Mock historical data for selected operator detail
  const historyData = [
    { no: '01', regis: 'REG-2023-0891', pemohon: 'Muhammad Reza', kode: 'KK-NEW', desaKec: 'Baki', tanggal: '12 Okt 2025', waktu: '09:15 WIB', status: 'DIVERIFIKASI' },
    { no: '02', regis: 'REG-2023-0892', pemohon: 'Eslam Samir', kode: 'KK-NEW', desaKec: 'Baki', tanggal: '12 Okt 2025', waktu: '09:15 WIB', status: 'DIPROSES' },
    { no: '03', regis: 'REG-2023-0893', pemohon: 'Mahendra Adi Kusuma', kode: 'KK-NEW', desaKec: 'Baki', tanggal: '12 Okt 2025', waktu: '09:15 WIB', status: 'DISETUJUI' },
    { no: '04', regis: 'REG-2023-0894', pemohon: 'Tegar Bagus Saputra', kode: 'KK-NEW', desaKec: 'Baki', tanggal: '12 Okt 2025', waktu: '09:15 WIB', status: 'DITOLAK' },
    { no: '05', regis: 'REG-2023-0895', pemohon: 'Tegar Bagus Saputra', kode: 'KK-NEW', desaKec: 'Baki', tanggal: '12 Okt 2025', waktu: '09:15 WIB', status: 'DITOLAK' },
  ];

  const detailTabs = [
    { id: 'semua', label: 'SEMUA' },
    { id: 'kk', label: 'KK' },
    { id: 'ktp', label: 'KTP-EL' },
    { id: 'kia', label: 'KIA' },
    { id: 'akta-kel', label: 'AKTA-KEL' },
    { id: 'akta-kem', label: 'AKTA-KEM' },
    { id: 'perpindahan', label: 'PERPINDAHAN' },
    { id: 'surket', label: 'SURKET KTP' },
  ];

  // Simple tab filtering
  const filteredHistory = historyData.filter((item) => {
    if (activeTab === 'semua') return true;
    if (activeTab === 'kk') return item.kode.includes('KK');
    if (activeTab === 'ktp') return item.kode.includes('KTP');
    if (activeTab === 'kia') return item.kode.includes('KIA');
    if (activeTab === 'akta-kel') return item.kode.includes('AKTA-KEL') || item.kode.includes('AK-NEW');
    if (activeTab === 'akta-kem') return item.kode.includes('AKTA-KEM') || item.kode.includes('KM-NEW');
    if (activeTab === 'perpindahan') return item.kode.includes('PERPINDAHAN') || item.kode.includes('PD-NEW');
    if (activeTab === 'surket') return item.kode.includes('SURKET') || item.kode.includes('SK-NEW');
    return true;
  });

  const historyColumns = [
    { key: 'no', header: 'No', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-400">{row.no}</span> },
    { key: 'regis', header: 'No.Regis', align: 'center' as const, render: (row: any) => <span className="font-bold text-gray-900 text-xs">{row.regis}</span> },
    { key: 'pemohon', header: 'Pemohon', align: 'center' as const, render: (row: any) => <span className="text-gray-800 text-xs font-semibold">{row.pemohon}</span> },
    { key: 'kode', header: 'Kode Ajuan', align: 'center' as const, render: (row: any) => <span className="text-gray-500 font-bold text-xs">{row.kode}</span> },
    { key: 'desaKec', header: 'Desa/Kec', align: 'center' as const, render: (row: any) => <span className="text-gray-600 font-semibold text-xs">{row.desaKec}</span> },
    { key: 'tanggalWaktu', header: 'Tanggal & Waktu', align: 'center' as const, render: (row: any) => (
      <div className="flex flex-col items-center">
        <span className="font-semibold text-gray-800 text-xs">{row.tanggal}</span>
        <span className="text-[9px] font-bold text-gray-400">{row.waktu}</span>
      </div>
    ) },
    { key: 'status', header: 'Status', align: 'center' as const, render: (row: any) => {
      let badgeVariant: 'primary' | 'default' | 'success' | 'danger' = 'default';
      if (row.status === 'DIVERIFIKASI') badgeVariant = 'primary';
      else if (row.status === 'DIPROSES') badgeVariant = 'default';
      else if (row.status === 'DISETUJUI') badgeVariant = 'success';
      else if (row.status === 'DITOLAK') badgeVariant = 'danger';

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
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CustomSelect
              label="Kecamatan"
              value={kecamatan}
              onChange={(val) => setKecamatan(String(val))}
              options={[
                { label: 'Seluruh Kecamatan', value: 'all' },
                { label: 'Baki', value: 'baki' },
                { label: 'Grogol', value: 'grogol' },
                { label: 'Kartasura', value: 'kartasura' },
              ]}
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
            <CustomSelect
              label="Operator"
              value={operatorFilter}
              onChange={(val) => setOperatorFilter(String(val))}
              options={[
                { label: 'Semua Operator', value: 'all' },
                { label: 'Muhammad Reza', value: 'reza' },
                { label: 'Eslam Samir', value: 'eslam' },
                { label: 'Mahendra Adi Kusuma', value: 'mahendra' },
                { label: 'Tegar Bagus Saputra', value: 'tegar' },
              ]}
            />
          </FilterCard>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="TOTAL LAYANAN"
              value="1.234"
              icon="ri-file-list-3-line"
              iconBg="#fdf2f2"
              iconColor="text-primary"
            />
            <StatCard 
              title="RATA-RATA DURASI"
              value={
                <>
                  <span className="text-4xl font-bold font-manrope text-gray-900 leading-none">14,5</span>
                  <span className="text-xs font-semibold text-gray-500 pb-0.5">menit</span>
                </>
              }
              icon="ri-time-line"
              iconBg="#eff6ff"
              iconColor="text-blue-500"
            />
            <StatCard 
              title="TINGKAT SELESAI"
              value="98,2%"
              icon="ri-checkbox-circle-line"
              iconBg="#ecfdf5"
              iconColor="text-emerald-500"
            />
          </div>

          {/* Leaderboard Table Card */}
          <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Peringkat Operator Berdasarkan Jumlah Ajuan</h3>
              <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm" className="h-9 px-4 rounded-[30px]">
                EKSPOR EXCEL
              </Button>
            </div>
            <div className="w-full">
              <Table 
                columns={leaderboardColumns} 
                data={rankingsData} 
                onRowClick={(row) => setSelectedOperator(row)}
              />
            </div>
            <div className="p-6 border-t border-gray-100">
              <Pagination
                currentPage={listCurrentPage}
                totalPages={3}
                totalItems={24}
                itemsPerPage={4}
                onPageChange={setListCurrentPage}
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
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </button>
            <h2 className="text-base font-bold text-gray-900">Detail Peringkat Operator</h2>
          </div>

          {/* Main Detail Panel */}
          <div className="card shadow-sm border border-gray-100 flex flex-col p-6 gap-6">
            {/* Header: Profile Card */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                  <i className="ri-user-3-line text-2xl"></i>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{selectedOperator.name}</span>
                    <span className="bg-[#800000] text-white flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <i className="ri-trophy-fill text-[10px]"></i> #{selectedOperator.rank}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 mt-0.5">
                    {selectedOperator.desa} - {selectedOperator.kecamatan.replace('KEC : ', 'Kec. ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOperator(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Middle: operator metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="TOTAL AJUAN"
                value="124"
              />
              <StatCard 
                title="TOTAL SELESAI"
                value="98"
              />
              <StatCard 
                title="TINGKAT SELESAI"
                value="79%"
              />
            </div>

            {/* Monthly Service Bar Chart */}
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-800 tracking-wide uppercase">Chart Jumlah Layanan per Bulan</h4>
              </div>
              <div className="w-full h-[280px]">
                {mounted && (
                  <Chart options={barOptions} series={barSeries} type="bar" width="100%" height={260} />
                )}
              </div>
              {/* Custom Legend */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                <span className="text-[10px] font-bold text-gray-500">2026</span>
              </div>
            </div>

            {/* Service History Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-gray-900">Daftar Riwayat Layanan</h4>
              
              <Tabs tabs={detailTabs} activeTab={activeTab} onChange={setActiveTab} className="mb-2" />

              <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
                <Table 
                  columns={historyColumns} 
                  data={filteredHistory} 
                />
              </div>

              <div className="mt-2">
                <Pagination
                  currentPage={detailCurrentPage}
                  totalPages={3}
                  totalItems={24}
                  itemsPerPage={5}
                  onPageChange={setDetailCurrentPage}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}