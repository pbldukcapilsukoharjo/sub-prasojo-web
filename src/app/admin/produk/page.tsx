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
import ajuanData from '../../../../dummy-data/ajuan.json';
import produkData from '../../../../dummy-data/produk.json';

export default function Produk() {
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
    { key: 'kodeAjuan', header: 'KODE AJUAN' },
    { key: 'noKk', header: 'NO. KARTU KELUARGA' },
    { key: 'namaIdentitas', header: 'NAMA IDENTITAS PRODUK' },
    { key: 'kecamatan', header: 'KECAMATAN' },
    { 
      key: 'tanggal', 
      header: 'TANGGAL & WAKTU',
      render: (row: any) => (
        <div className="flex flex-col items-center">
          <span>{row.tanggal}</span>
          <span className="text-[10px] text-gray-500 font-bold">{row.waktu}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'STATUS',
      render: (row: any) => (
        <Badge variant="purple" className="whitespace-nowrap">
          {row.status}
        </Badge>
      )
    },
  ];

  const filteredProduk = produkData.produk.filter((prod) => {
    // Tab filtering mapping
    if (activeTab !== 'semua') {
      const kode = prod.prod_layanan_kode.toLowerCase();
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

  const mappedData = filteredProduk.map((prod, index) => {
    const ajuan = ajuanData.ajuan.find((a) => a.ajuan_id === prod.prod_ajuan_id);
    const pelapor = dummyDB.user.find((u) => u.id === prod.prod_pelapor_id);
    const dateObj = new Date(prod.prod_create_datetime);
    
    const tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
    const waktu = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    let namaIdentitas = pelapor?.fullname || '-';
    try {
      if (ajuan?.ajuan_data_ajuan) {
        const parsed = JSON.parse(ajuan.ajuan_data_ajuan);
        if (parsed.nama_bayi) namaIdentitas = parsed.nama_bayi;
        else if (parsed.nama_jenazah) namaIdentitas = parsed.nama_jenazah;
      }
    } catch (e) {}

    return {
      id: prod.prod_id,
      no: String(index + 1).padStart(2, '0'),
      noRegis: prod.prod_ajuan_no_reg,
      kodeAjuan: prod.prod_layanan_kode + '-NEW',
      noKk: ajuan?.ajuan_pelapor_kk || prod.prod_nomor || '-',
      namaIdentitas: namaIdentitas,
      kecamatan: ajuan?.ajuan_kecamatan_name || '-',
      tanggal,
      waktu,
      status: prod.prod_status
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Input 
            label="Pencarian Cepat" 
            placeholder="No. Reg/No KK/Nama" 
            icon="ri-search-line" 
          />
          <Input 
            type="date"
            label="Rentang Tanggal" 
          />
          <Select 
            label="Kecamatan" 
            options={[{ label: 'Seluruh Kecamatan', value: 'all' }]} 
          />
          <Select 
            label="Periode" 
            options={[{ label: 'Bulan Ini', value: 'this_month' }]} 
          />
          <Select 
            label="Urutkan Dari" 
            options={[{ label: 'Terbaru', value: 'newest' }]} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select 
            label="Nama Identitas Produk" 
            options={[{ label: 'Semua Nama', value: 'all' }]} 
          />
          <Button variant="primary" className="h-[44px] w-[180px]">
            TERAPKAN FILTER
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Tabel Produk</h3>
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
            onRowClick={(row) => router.push(`/admin/produk/${row.id}`)}
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
