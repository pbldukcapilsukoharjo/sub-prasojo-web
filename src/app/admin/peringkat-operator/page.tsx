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
            <CustomSelect
              label="Urutkan Dari"
              value={sortBy}
              onChange={(val) => setSortBy(String(val))}
              options={[
                { label: 'Terbaru', value: 'newest' },
                { label: 'Terlama', value: 'oldest' },
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
            <div className="card shadow-sm border border-gray-100 p-6 flex flex-col justify-center bg-white rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL LAYANAN</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold font-manrope text-gray-900 leading-none">1.234</span>
              </div>
            </div>
            <div className="card shadow-sm border border-gray-100 p-6 flex flex-col justify-center bg-white rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">RATA-RATA DURASI</span>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-bold font-manrope text-gray-900 leading-none">14,5</span>
                <span className="text-xs font-semibold text-gray-500 pb-0.5">menit</span>
              </div>
            </div>
            <div className="card shadow-sm border border-gray-100 p-6 flex flex-col justify-center bg-white rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">TOTAL LAYANAN</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold font-manrope text-gray-900 leading-none">98,2%</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Table Card */}
          <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden bg-white rounded-xl">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Peringkat Operator Berdasarkan Jumlah Ajuan</h3>
              <Button variant="primary" icon="ri-download-2-line" iconPosition="left" size="sm" className="h-9 px-4 rounded-[30px]">
                EKSPOR EXCEL
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-gray-500 bg-gray-100 border-b border-gray-100 font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4 text-center w-24">Peringkat</th>
                    <th className="px-6 py-4 text-center">Nama Operator</th>
                    <th className="px-6 py-4 text-center">Desa/Kecamatan</th>
                    <th className="px-6 py-4 text-center">Jumlah Ajuan</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingsData.map((row, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedOperator(row)}
                      className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                      }`}
                    >
                      <td className="px-6 py-4.5 text-center font-bold text-gray-400">{row.rank}</td>
                      <td className="px-6 py-4.5 text-center font-bold text-gray-900 text-xs">{row.name}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-gray-900 text-xs">{row.desa}</span>
                          <span className="text-[10px] font-semibold text-gray-500">{row.kecamatan}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-center text-gray-900 font-semibold text-xs">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <div className="card shadow-sm border border-gray-100 flex flex-col p-6 gap-6 bg-white rounded-xl">
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
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-center bg-white">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">TOTAL AJUAN</span>
                <span className="text-3xl font-bold font-manrope text-gray-900 leading-none">124</span>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-center bg-white">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">TOTAL SELESAI</span>
                <span className="text-3xl font-bold font-manrope text-gray-900 leading-none">98</span>
              </div>
              <div className="border border-gray-100 rounded-xl p-5 flex flex-col justify-center bg-white">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">TINGKAT SELESAI</span>
                <span className="text-3xl font-bold font-manrope text-gray-900 leading-none">79%</span>
              </div>
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

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-gray-500 bg-gray-100 border-b border-gray-100 font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4 text-center w-16">No</th>
                      <th className="px-6 py-4 text-center">No.Regis</th>
                      <th className="px-6 py-4 text-center">Pemohon</th>
                      <th className="px-6 py-4 text-center">Kode Ajuan</th>
                      <th className="px-6 py-4 text-center">Desa/Kec</th>
                      <th className="px-6 py-4 text-center">Tanggal & Waktu</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((row, idx) => {
                        let badgeVariant: 'primary' | 'default' | 'success' | 'danger' = 'default';
                        if (row.status === 'DIVERIFIKASI') badgeVariant = 'primary';
                        else if (row.status === 'DIPROSES') badgeVariant = 'default';
                        else if (row.status === 'DISETUJUI') badgeVariant = 'success';
                        else if (row.status === 'DITOLAK') badgeVariant = 'danger';

                        return (
                          <tr
                            key={idx}
                            className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                            }`}
                          >
                            <td className="px-6 py-4 text-center font-bold text-gray-400">{row.no}</td>
                            <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">{row.regis}</td>
                            <td className="px-6 py-4 text-center text-gray-800 text-xs font-semibold">{row.pemohon}</td>
                            <td className="px-6 py-4 text-center text-gray-500 font-bold text-xs">{row.kode}</td>
                            <td className="px-6 py-4 text-center text-gray-600 font-semibold text-xs">{row.desaKec}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-800 text-xs">{row.tanggal}</span>
                                <span className="text-[9px] font-bold text-gray-400">{row.waktu}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant={badgeVariant}>{row.status}</Badge>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-400 font-semibold text-xs">
                          Tidak ada data riwayat untuk jenis layanan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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