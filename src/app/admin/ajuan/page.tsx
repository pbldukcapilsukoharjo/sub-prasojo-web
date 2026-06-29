'use client';

import React, { useState, useEffect } from 'react';
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
import { pengajuanService, AjuanItem, PengajuanAjuanParams } from '@/services/pengajuan.service';
import { handleApiError } from '@/lib/api-error';

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

  const [data, setData] = useState<AjuanItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const isRentangTanggalDisabled = !!periode;
  const isPeriodeDisabled = !!startDate || !!endDate;
  const perPage = 10;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const formatToDDMMYYYY = (dateStr: string) => {
        if (!dateStr) return undefined;
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const parts = dateStr.split('-');
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      const params: PengajuanAjuanParams = {
        search: search || undefined,
        kecamatan: kecamatan !== 'all' ? kecamatan : undefined,
        pelapor: pelapor !== 'all' ? pelapor : undefined,
        start_date: formatToDDMMYYYY(startDate),
        end_date: formatToDDMMYYYY(endDate),
        periode: periode ? Number(periode) : undefined,
        layanan: activeTab !== 'semua' ? activeTab : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        sort: sortBy,
        page: currentPage,
        per_page: perPage,
      };

      const response = await pengajuanService.getAjuan(params);
      if (response.status) {
        setData(response.data || []);
        if (response.meta) {
          setTotalItems(response.meta.total);
          setTotalPages(response.meta.total_page);
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
    setPelapor('all');
    setKecamatan('all');
    setStartDate('');
    setEndDate('');
    setPeriode('');
    setSortBy('newest');
    setFilterStatus('all');
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

  const mappedData = data.map((ajuan, index) => {
    let tanggal = '-';
    let waktu = '-';
    if (ajuan.ajuan_create_datetime) {
       const dateStr = ajuan.ajuan_create_datetime.includes(' ') 
         ? ajuan.ajuan_create_datetime.replace(' ', 'T') 
         : ajuan.ajuan_create_datetime;
       const dateObj = new Date(dateStr);
       tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
       waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    }

    return {
      id: ajuan.ajuan_id,
      no: String((currentPage - 1) * perPage + index + 1).padStart(2, '0'),
      noRegis: ajuan.ajuan_no_reg || '-',
      kodeProduk: ajuan.layanan?.layanan_name || '-',
      kodeAjuan: (ajuan.layanan?.layanan_name || '') + '-NEW',
      jalur: ajuan.ajuan_pelapor_role_name || (ajuan.ajuan_is_online ? 'Online' : 'Offline'),
      pelapor: ajuan.pelapor?.user_nama_lengkap || 'PADUKA',
      nik: ajuan.pelapor?.user_nik || '-',
      kecamatan: ajuan.kecamatan?.kecamatan_name || '-',
      tanggal,
      waktu,
      status: ajuan.ajuan_status || 'MENUNGGU'
    };
  });

  const handleRowClick = (row: any) => {
    setSelectedData({
      id: row.id,
      noRegis: row.noRegis,
      namaLengkap: row.pelapor,
      nik: row.nik,
      jenisLayanan: row.kodeProduk,
      kecamatan: row.kecamatan,
      status: row.status,
      tanggal: row.tanggal,
      waktu: row.waktu,
    });
    setIsModalOpen(true);
  };

  const handleExport = async () => {
    try {
      await pengajuanService.exportPengajuan('all');
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
      <div className={`card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden transition-opacity duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tabel Ajuan</h3>
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
            <div className="flex items-center justify-center h-full text-sm text-gray-400 py-12">
              Tidak ada data ditemukan
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={perPage}
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
