import React, { useState, useMemo } from 'react';
import Button from '@/components/Common/Button';
import Input from '@/components/Forms/Input';
import Table from '@/components/Common/Table';
import Badge from '@/components/Common/Badge';
import Pagination from '@/components/Common/Pagination';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { slaService, SampleSlaParams } from '@/services/sla.service';

interface SampleSlaModalProps {
  isOpen: boolean;
  onClose: () => void;
  layananName?: string;
  initialFilters: Partial<SampleSlaParams>;
}

export default function SampleSlaModal({ isOpen, onClose, layananName, initialFilters }: SampleSlaModalProps) {
  const [kategori, setKategori] = useState('tercepat');
  const [search, setSearch] = useState('');
  const [ajuanId, setAjuanId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Debounced search terms could be added here, but direct state is fine for explicit "Terapkan" or auto fetch
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedAjuanId, setAppliedAjuanId] = useState('');

  const params: SampleSlaParams = useMemo(() => {
    return {
      ...initialFilters,
      kategori: kategori !== 'manual' ? kategori : undefined,
      search: appliedSearch || undefined,
      ajuan_id: appliedAjuanId ? Number(appliedAjuanId) : undefined,
      page: currentPage,
      per_page: perPage,
    };
  }, [initialFilters, kategori, appliedSearch, appliedAjuanId, currentPage, perPage]);

  const { data, isLoading } = useQuery({
    queryKey: ['sampleSla', params],
    queryFn: () => slaService.getSampleSla(params),
    enabled: isOpen,
    placeholderData: keepPreviousData,
  });

  const samples = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = data?.meta?.total_page || 1;

  const handleApplySearch = () => {
    setAppliedSearch(search);
    setAppliedAjuanId(ajuanId);
    setCurrentPage(1);
  };

  const handleKategoriChange = (newKat: string) => {
    setKategori(newKat);
    setCurrentPage(1);
    if (newKat !== 'manual') {
      setSearch('');
      setAjuanId('');
      setAppliedSearch('');
      setAppliedAjuanId('');
    }
  };

  const columns = useMemo(() => [
    { key: 'noReg', header: 'NO REG / LAYANAN', render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-bold text-text-primary text-xs">{row.no_reg}</span>
        <span className="text-[10px] text-text-secondary uppercase">{row.jenis_layanan}</span>
      </div>
    )},
    { key: 'pelapor', header: 'PELAPOR', render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary text-xs truncate max-w-[150px]" title={row.pelapor_nama}>{row.pelapor_nama}</span>
        <span className="text-[10px] text-text-secondary">{row.pelapor_channel}</span>
      </div>
    )},
    { key: 'waktu', header: 'WAKTU PROSES', render: (row: any) => (
      <div className="flex flex-col">
        <div className="flex justify-between items-center text-[10px] gap-2">
          <span className="text-text-secondary w-10">Mulai</span>
          <span className="font-medium">{row.waktu_mulai_proses || row.tanggal_diterima}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] gap-2">
          <span className="text-text-secondary w-10">Selesai</span>
          <span className="font-medium">{row.waktu_selesai}</span>
        </div>
      </div>
    )},
    { key: 'durasi', header: 'DURASI', render: (row: any) => (
      <span className="text-xs font-bold text-text-primary">{row.durasi_penyelesaian_text}</span>
    )},
    { key: 'status', header: 'TARGET & STATUS', render: (row: any) => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-[10px] text-text-secondary">Target: <strong className="text-text-primary">{row.target_sla_text}</strong></span>
        <Badge variant={row.is_tepat_waktu ? 'success' : 'danger'} className="!text-[10px] !py-0.5">
          {row.status_sla}
        </Badge>
      </div>
    )}
  ], []);

  if (!isOpen) return null;

  const tabs = [
    { id: 'tercepat', label: 'Tercepat' },
    { id: 'terlambat', label: 'Terlambat' },
    { id: 'terbaru', label: 'Terbaru' },
    { id: '30_hari', label: '30 Hari' },
    { id: 'manual', label: 'Manual' },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-surface rounded-2xl w-full max-w-[900px] shadow-xl flex flex-col max-h-[95vh] relative z-10 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-5 lg:p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
              <i className="ri-flask-line text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950 font-manrope">
                Audit Sample SLA {layananName ? `- ${layananName}` : ''}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">Lihat sample data ajuan untuk memverifikasi kalkulasi SLA</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-text-secondary transition-colors cursor-pointer">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Filters */}
        <div className="p-5 lg:p-6 pb-0 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleKategoriChange(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  kategori === tab.id
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {kategori === 'manual' && (
            <div className="flex items-end gap-3 bg-gray-50 p-4 rounded-xl border border-border animate-in fade-in duration-300 mt-2">
              <div className="flex-1">
                <Input
                  label="Pencarian Bebas"
                  placeholder="No Regis atau NIK..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="ID Ajuan Spesifik"
                  placeholder="Contoh: 8786"
                  type="number"
                  value={ajuanId}
                  onChange={(e) => setAjuanId(e.target.value)}
                />
              </div>
              <Button variant="primary" className="!h-[46px]" onClick={handleApplySearch}>
                Cari
              </Button>
            </div>
          )}
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 min-h-[350px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <i className="ri-loader-4-line text-4xl animate-spin text-primary mb-4"></i>
              <p className="text-sm font-bold text-text-secondary">Mengambil sample data...</p>
            </div>
          ) : samples.length > 0 ? (
            <div className="border border-border rounded-xl overflow-hidden">
              <Table columns={columns} data={samples} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 border border-dashed border-border rounded-xl bg-gray-50/50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <i className="ri-inbox-line text-3xl"></i>
              </div>
              <p className="text-sm font-bold text-text-secondary">Tidak ada data sample ditemukan</p>
              <p className="text-xs text-text-secondary mt-1">Ubah kategori atau parameter pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-5 lg:p-6 pt-4 border-t border-border bg-gray-50/50 rounded-b-2xl">
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
