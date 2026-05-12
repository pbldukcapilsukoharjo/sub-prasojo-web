'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Button from '@/components/Common/Button';
import Tabs from '@/components/Common/Tabs';
import Table from '@/components/Common/Table';
import Badge from '@/components/Common/Badge';
import Pagination from '@/components/Common/Pagination';
import dummyDB from '../../../../dummy-data/database-dummy.json';

export default function LembarKerja() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);

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
      render: (row: any) => (
        <Badge variant={row.status === 'BELUM DIVERIFIKASI' ? 'warning' : 'default'}>
          {row.status}
        </Badge>
      )
    },
  ];

  const mappedData = dummyDB.ajuan
    .filter((ajuan) => ajuan.ajuan_status === 'PENGAJUAN' || ajuan.ajuan_status === 'DIPROSES')
    .map((ajuan, index) => {
    const pelapor = dummyDB.user.find((u) => u.id === ajuan.ajuan_pelapor_id);
    const dateObj = new Date(ajuan.ajuan_create_datetime);
    const tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const status = ajuan.ajuan_status === 'PENGAJUAN' || ajuan.ajuan_status === 'DIPROSES' ? 'BELUM DIVERIFIKASI' : ajuan.ajuan_status;

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
      status
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Input 
            label="Pencarian Cepat" 
            placeholder="No. Regis" 
            icon="ri-search-line" 
          />
          <Select 
            label="Pelapor" 
            options={[{ label: 'PADUKA', value: 'paduka' }]} 
          />
          <Select 
            label="Kecamatan" 
            options={[{ label: 'Seluruh Kecamatan', value: 'all' }]} 
          />
          <Input 
            type="date"
            label="Rentang Tanggal" 
          />
          <Select 
            label="Periode" 
            options={[{ label: 'Bulan Ini', value: 'this_month' }]} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select 
            label="Urutkan Dari" 
            options={[{ label: 'Terbaru', value: 'newest' }]} 
          />
          <Button variant="primary" className="h-[44px] w-[180px]">
            TERAPKAN FILTER
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tabel Lembar Kerja</h3>
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
            onRowClick={(row) => router.push(`/admin/lembar-kerja/${row.id}`)}
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
    </div>
  );
}
